const isProduction = process.env.NODE_ENV === "production";
const isServerless = Boolean(process.env.VERCEL || process.env.NETLIFY);
const databaseUrl = process.env.DATABASE_URL;
const isLibSqlDatabase = Boolean(databaseUrl && /^(libsql|https):\/\//i.test(databaseUrl));

export function getAuthConfigurationError(): string | null {
  if (isProduction && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
    return "AUTH_SECRET must be configured with at least 32 characters.";
  }

  if (isProduction) {
    const appUrl = process.env.APP_URL;
    try {
      if (!appUrl || new URL(appUrl).protocol !== "https:") {
        return "APP_URL must be set to the canonical HTTPS origin.";
      }
    } catch {
      return "APP_URL must be set to the canonical HTTPS origin.";
    }

    if (!databaseUrl) {
      return "DATABASE_URL must point to persistent storage.";
    }
  }

  if (isServerless && !isLibSqlDatabase) {
    return "Serverless deployments require a persistent Turso/libSQL DATABASE_URL.";
  }

  if (isLibSqlDatabase && !process.env.DATABASE_AUTH_TOKEN) {
    return "DATABASE_AUTH_TOKEN is required for the remote libSQL database.";
  }

  return null;
}

export const googleOAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
