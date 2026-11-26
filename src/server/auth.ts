import "dotenv/config";
import { randomBytes } from "node:crypto";
import { mkdirSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { betterAuth } from "better-auth";
import { getMigrations } from "better-auth/db/migration";
import { createClient } from "@libsql/client";
import { LibsqlDialect } from "@libsql/kysely-libsql";
import { Kysely } from "kysely";

const isProduction = process.env.NODE_ENV === "production";
const port = Number(process.env.PORT || 3000);
const configuredAppUrl = process.env.APP_URL;
const appUrl = new URL(configuredAppUrl || `http://localhost:${port}`).origin;
const databaseUrl = process.env.DATABASE_URL;
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const isLibSqlDatabase = Boolean(databaseUrl && /^(libsql|https):\/\//i.test(databaseUrl));

if (isProduction && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
  throw new Error("AUTH_SECRET must be configured with at least 32 characters in production.");
}

if (isProduction && (!configuredAppUrl || new URL(configuredAppUrl).protocol !== "https:")) {
  throw new Error("APP_URL must be the canonical HTTPS origin in production.");
}

if (isProduction && !databaseUrl) {
  throw new Error("DATABASE_URL must point to persistent storage in production.");
}

if (process.env.NETLIFY && !isLibSqlDatabase) {
  throw new Error("Netlify Functions require a persistent libSQL DATABASE_URL.");
}

if (isLibSqlDatabase && !process.env.DATABASE_AUTH_TOKEN) {
  throw new Error("DATABASE_AUTH_TOKEN is required for a remote libSQL database.");
}

const configuredDatabaseUrl = databaseUrl || "./auth.sqlite";
const databaseClient = isLibSqlDatabase
  ? createClient({
      url: configuredDatabaseUrl,
      authToken: process.env.DATABASE_AUTH_TOKEN,
    })
  : null;
const localDb = databaseClient
  ? null
  : (() => {
      const configuredDatabasePath = configuredDatabaseUrl.startsWith("file://")
        ? fileURLToPath(configuredDatabaseUrl)
        : configuredDatabaseUrl.replace(/^file:/i, "");
      const dbPath = path.resolve(process.cwd(), configuredDatabasePath);
      mkdirSync(path.dirname(dbPath), { recursive: true });
      return new DatabaseSync(dbPath);
    })();

if (localDb) {
  localDb.exec(`
    CREATE TABLE IF NOT EXISTS user (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      emailVerified INTEGER DEFAULT 0,
      image TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      lastLoginAt DATETIME
    );
    CREATE TABLE IF NOT EXISTS session (
      id TEXT PRIMARY KEY,
      expiresAt DATETIME NOT NULL,
      token TEXT NOT NULL UNIQUE,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL,
      ipAddress TEXT,
      userAgent TEXT,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS account (
      id TEXT PRIMARY KEY,
      issuer TEXT,
      accountId TEXT NOT NULL,
      providerId TEXT NOT NULL,
      userId TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
      accessToken TEXT,
      refreshToken TEXT,
      idToken TEXT,
      accessTokenExpiresAt DATETIME,
      refreshTokenExpiresAt DATETIME,
      scope TEXT,
      password TEXT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    );
    CREATE TABLE IF NOT EXISTS verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expiresAt DATETIME NOT NULL,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    );
  `);

  const userColumns = localDb.prepare("PRAGMA table_info(user)").all();
  if (!userColumns.some((column) => column.name === "lastLoginAt")) {
    localDb.exec("ALTER TABLE user ADD COLUMN lastLoginAt DATETIME");
  }

  localDb.exec(`
    CREATE UNIQUE INDEX IF NOT EXISTS account_provider_identity_unique
    ON account (providerId, accountId);
  `);
}

const database = databaseClient
  ? {
      db: new Kysely({
        dialect: new LibsqlDialect({
          url: configuredDatabaseUrl,
          authToken: process.env.DATABASE_AUTH_TOKEN,
        }),
      }),
      type: "sqlite" as const,
      casing: "camel" as const,
    }
  : localDb!;

const trustedOrigins = new Set([appUrl]);
if (!isProduction) {
  trustedOrigins.add(`http://localhost:${port}`);
  trustedOrigins.add(`http://127.0.0.1:${port}`);
}
const trustedProxyRanges = (process.env.AUTH_TRUSTED_PROXIES || "")
  .split(",")
  .map((range) => range.trim())
  .filter(Boolean);

export const googleOAuthConfigured = Boolean(googleClientId && googleClientSecret);

export const auth = betterAuth({
  database,
  baseURL: appUrl,
  secret: process.env.AUTH_SECRET || randomBytes(32).toString("base64url"),
  trustedOrigins: [...trustedOrigins],
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: googleOAuthConfigured
    ? {
        google: {
          clientId: googleClientId,
          clientSecret: googleClientSecret,
        },
      }
    : {},
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  user: {
    additionalFields: {
      lastLoginAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
    changeEmail: {
      enabled: false,
    },
  },
  databaseHooks: {
    session: {
      create: {
        after: async (session) => {
          const lastLoginAt = new Date().toISOString();
          if (databaseClient) {
            await databaseClient.execute({
              sql: "UPDATE user SET lastLoginAt = ? WHERE id = ?",
              args: [lastLoginAt, session.userId],
            });
          } else {
            localDb!.prepare("UPDATE user SET lastLoginAt = ? WHERE id = ?").run(
              lastLoginAt,
              session.userId
            );
          }
        },
      },
    },
  },
  advanced: {
    useSecureCookies: isProduction,
    ipAddress: {
      ipAddressHeaders: ["x-forwarded-for"],
      ...(trustedProxyRanges.length > 0 ? { trustedProxies: trustedProxyRanges } : {}),
    },
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
    },
  },
});

let migrations: Promise<void> | undefined;

export async function ensureAuthDatabase(): Promise<void> {
  if (!databaseClient) return;
  if (!migrations) {
    migrations = (async () => {
      const migration = await getMigrations(auth.options);
      await migration.runMigrations();
      await databaseClient!.execute(`
        CREATE UNIQUE INDEX IF NOT EXISTS account_provider_identity_unique
        ON account (providerId, accountId)
      `);
    })();
  }
  await migrations;
}

export { localDb as db };
