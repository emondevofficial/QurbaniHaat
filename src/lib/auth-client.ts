/**
 * Better Auth Client Configuration
 * Official React client connected to /api/auth endpoints
 * Reference: https://better-auth.com/docs/concepts/client
 */
import { createAuthClient } from "better-auth/react";
import type { auth } from "../server/auth";

type AuthClientOptions = { $InferAuth: typeof auth.options };

export const authClient = createAuthClient<AuthClientOptions>();

export function useAuthSession() {
  const sessionState = authClient.useSession();
  return {
    ...sessionState,
    data: sessionState.data as typeof auth.$Infer.Session | null,
  };
}
