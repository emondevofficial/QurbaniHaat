import { toNodeHandler } from "better-auth/node";
import type { IncomingMessage, ServerResponse } from "node:http";
import { getAuthConfigurationError, googleOAuthConfigured } from "../../src/server/auth-environment";

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const configurationError = getAuthConfigurationError();
    if (configurationError) {
      res.statusCode = 503;
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ error: configurationError }));
      return;
    }

    const { auth, ensureAuthDatabase } = await import("../../src/server/auth");
    await ensureAuthDatabase();

    if (req.url?.split("?")[0] === "/api/auth/config") {
      res.statusCode = 200;
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ googleEnabled: googleOAuthConfigured }));
      return;
    }

    await toNodeHandler(auth)(req, res);
  } catch (error: unknown) {
    console.error("Vercel authentication function failed:", error);
    if (res.headersSent) {
      throw error;
    }
    res.statusCode = 500;
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ error: "Authentication is temporarily unavailable. Please try again." }));
  }
}
