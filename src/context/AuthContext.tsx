import React, { createContext, useContext, useMemo } from 'react';
import { User } from '../types';
import { authClient, useAuthSession } from '../lib/auth-client';

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  googleLogin: (redirectTo?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
  updateUser: (data: { name?: string; image?: string }) => Promise<AuthResult>;
  refetchSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getErrorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, isPending: isLoading, refetch } = useAuthSession();

  const user: User | null = useMemo(() => {
    if (!session?.user) return null;
    const authenticatedUser = session.user;
    return {
      id: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email,
      photoUrl: authenticatedUser.image || '',
      image: authenticatedUser.image || undefined,
      emailVerified: authenticatedUser.emailVerified,
      createdAt: authenticatedUser.createdAt
        ? new Date(authenticatedUser.createdAt).toISOString()
        : '',
    };
  }, [session]);

  const googleLogin = async (redirectTo = '/'): Promise<AuthResult> => {
    try {
      const configResponse = await fetch('/api/auth/config', {
        credentials: 'same-origin',
        cache: 'no-store',
      });
      if (!configResponse.ok) {
        let serverError: string | undefined;
        try {
          const errorResponse = await configResponse.json() as { error?: string };
          serverError = errorResponse.error;
        } catch {
          serverError = undefined;
        }
        return {
          success: false,
          error: configResponse.status === 404
            ? 'The authentication endpoint is not deployed for this site. Deploy the /api/auth serverless function and try again.'
            : serverError || (configResponse.status === 503
              ? 'Authentication is not configured on the server. Check the deployment environment variables.'
              : 'The authentication service is unavailable. Please try again.'),
        };
      }

      const config = await configResponse.json() as { googleEnabled?: boolean };
      if (!config.googleEnabled) {
        return {
          success: false,
          error: 'Google sign-in is not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the server environment.',
        };
      }

      const safeRedirect = redirectTo.startsWith('/') && !redirectTo.startsWith('//')
        ? redirectTo
        : '/';
      const response = await authClient.signIn.social({
        provider: 'google',
        callbackURL: `${window.location.origin}${safeRedirect}`,
        errorCallbackURL: `${window.location.origin}/login?error=oauth`,
        additionalParams: {
          prompt: 'select_account',
        },
      });

      if (response.error) {
        return {
          success: false,
          error: response.error.message || 'Google sign-in could not be started. Please try again.',
        };
      }

      return { success: true };
    } catch (error: unknown) {
      return {
        success: false,
        error: error instanceof TypeError && error.message.toLowerCase().includes('fetch')
          ? 'Could not reach the authentication server. Check your connection and deployment, then try again.'
          : getErrorMessage(error, 'Could not connect to Google sign-in. Check your connection and try again.'),
      };
    }
  };

  const logout = async (): Promise<void> => {
    const response = await authClient.signOut({});
    if (response.error) {
      throw new Error(response.error.message || 'Sign out failed. Please try again.');
    }
    await refetch();
  };

  const updateUser = async (data: { name?: string; image?: string }): Promise<AuthResult> => {
    if (!session?.user) {
      return { success: false, error: 'Your session has expired. Please sign in again.' };
    }

    try {
      const response = await authClient.updateUser({
        name: data.name?.trim(),
        image: data.image?.trim() || undefined,
      });

      if (response.error) {
        return { success: false, error: response.error.message || 'Failed to update your profile.' };
      }

      await refetch();
      return { success: true };
    } catch (error: unknown) {
      return { success: false, error: getErrorMessage(error, 'Failed to update your profile.') };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!session?.user,
        isLoading,
        googleLogin,
        logout,
        updateUser,
        refetchSession: async () => { await refetch(); },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
