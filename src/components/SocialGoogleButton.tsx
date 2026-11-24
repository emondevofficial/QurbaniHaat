import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';

interface SocialGoogleButtonProps {
  redirectTo?: string;
}

export const SocialGoogleButton: React.FC<SocialGoogleButtonProps> = ({ redirectTo = '/' }) => {
  const { googleLogin } = useAuth();
  const { query } = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!query.error) return;
    const error = query.error.toLowerCase();
    setErrorMessage(
      ['access_denied', 'cancelled', 'canceled', 'user_cancelled'].includes(error)
        ? 'Google sign-in was cancelled. You can try again whenever you are ready.'
        : 'Google sign-in could not be completed. Please try again.'
    );
  }, [query.error]);

  const handleClick = async () => {
    setLoading(true);
    setErrorMessage('');
    const result = await googleLogin(redirectTo);
    if (!result.success) {
      setErrorMessage(result.error || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {errorMessage && (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs"
        >
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="leading-snug">{errorMessage}</span>
        </div>
      )}
      <button
        id="google-social-login-btn"
        type="button"
        onClick={handleClick}
        disabled={loading}
        aria-busy={loading}
        className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm font-semibold text-stone-700 shadow-sm hover:shadow transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-stone-300 border-t-stone-700 rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z" />
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.73 7.18l7.65 5.93c4.47-4.13 7.12-10.2 7.12-17.58Z" />
            <path fill="#FBBC05" d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.87.93 7.52 2.56 10.78l7.97-6.19Z" />
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.9-5.87l-7.65-5.93c-2.13 1.43-4.86 2.28-8.25 2.28-6.26 0-11.57-4.22-13.47-9.91l-7.97 6.19C6.51 42.62 14.62 48 24 48Z" />
          </svg>
        )}
        <span>{loading ? 'Connecting to Google…' : 'Continue with Google'}</span>
      </button>
    </div>
  );
};
