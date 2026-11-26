import { toNodeHandler } from "better-auth/node";
import type { IncomingMessage, ServerResponse } from "node:http";
import { auth, ensureAuthDatabase, googleOAuthConfigured } from "../../src/server/auth";

const authHandler = toNodeHandler(auth);

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    await ensureAuthDatabase();

    if (new URL(req.url || "/", "http://localhost").pathname === "/api/auth/config") {
      res.statusCode = 200;
      res.setHeader("Cache-Control", "no-store");
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ googleEnabled: googleOAuthConfigured }));
      return;
    }

    await authHandler(req, res);
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
