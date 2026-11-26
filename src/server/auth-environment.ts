const isProduction = process.env.NODE_ENV === "production";
const isServerless = Boolean(process.env.VERCEL || process.env.NETLIFY);
const databaseUrl = process.env.DATABASE_URL;
const isLibSqlDatabase = Boolean(databaseUrl && /^(libsql|https):\/\//i.test(databaseUrl));

function getConfiguredOrigin(value: string): string | null {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getVercelOrigin(value: string | undefined): string | null {
  if (!value) return null;

  try {
    const url = value.includes("://") ? value : `https://${value}`;
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export function getAuthBaseUrl(): string | null {
  const configuredUrl = process.env.APP_URL?.trim();
  const configuredOrigin = configuredUrl ? getConfiguredOrigin(configuredUrl) : null;
  const isVercelProduction = Boolean(process.env.VERCEL) && (
    process.env.VERCEL_ENV === "production" ||
    (!process.env.VERCEL_ENV && isProduction)
  );

  if (isVercelProduction) {
    const productionOrigin = getVercelOrigin(process.env.VERCEL_PROJECT_PRODUCTION_URL);
    if (productionOrigin) {
      if (configuredUrl && configuredOrigin !== productionOrigin) {
        console.warn(
          "APP_URL does not match Vercel's production origin; using the Vercel production origin for authentication."
        );
      }
      return productionOrigin;
    }

    return configuredOrigin;
  }

  if (process.env.VERCEL) {
    return configuredOrigin || getVercelOrigin(process.env.VERCEL_URL);
  }

  if (configuredUrl) {
    return configuredOrigin;
  }

  if (isProduction || isServerless) {
    return null;
  }

  return `http://localhost:${Number(process.env.PORT || 3000)}`;
}

export function getAuthConfigurationError(): string | null {
  if (isProduction && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) {
    return "AUTH_SECRET must be configured with at least 32 characters.";
  }

  const appUrl = getAuthBaseUrl();
  if (!appUrl) {
    return "APP_URL must be configured to the canonical HTTPS origin in production.";
  }

  if ((isProduction || isServerless) && new URL(appUrl).protocol !== "https:") {
    return "APP_URL must use HTTPS in production.";
  }

  if (isProduction && !databaseUrl) {
    return "DATABASE_URL must point to persistent storage.";
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
