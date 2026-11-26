import type { Config, Context } from "@netlify/functions";
import {
  auth,
  ensureAuthDatabase,
  googleOAuthConfigured,
} from "../../src/server/auth";

export default async function handleAuth(
  request: Request,
  _context: Context
): Promise<Response> {
  try {
    await ensureAuthDatabase();

    if (new URL(request.url).pathname === "/api/auth/config") {
      return Response.json(
        { googleEnabled: googleOAuthConfigured },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    return await auth.handler(request);
  } catch (error: unknown) {
    console.error("Netlify authentication function failed:", error);
    return Response.json(
      { error: "Authentication is temporarily unavailable. Please try again." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}

export const config: Config = {
  path: ["/api/auth", "/api/auth/*"],
};
