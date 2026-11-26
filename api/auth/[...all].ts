import type { IncomingMessage, ServerResponse } from "node:http";

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.statusCode = status;
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  try {
    const { getAuthConfigurationError, googleOAuthConfigured } = await import(
      "../../src/server/auth-environment.js"
    );
    const configurationError = getAuthConfigurationError();
    if (configurationError) {
      console.error("Authentication configuration error:", configurationError);
      sendJson(res, 503, { error: configurationError });
      return;
    }

    if (req.url?.split("?")[0] === "/api/auth/config") {
      sendJson(res, 200, { googleEnabled: googleOAuthConfigured });
      return;
    }

    const [{ toNodeHandler }, { auth, ensureAuthDatabase }] = await Promise.all([
      import("better-auth/node"),
      import("../../src/server/auth.js"),
    ]);
    await ensureAuthDatabase();
    await toNodeHandler(auth)(req, res);
  } catch (error: unknown) {
    const detail = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
    console.error("Vercel authentication function failed:", detail, error);
    if (res.headersSent) {
      throw error;
    }
    sendJson(res, 500, {
      error: "Authentication is temporarily unavailable. Please try again.",
    });
  }
}
