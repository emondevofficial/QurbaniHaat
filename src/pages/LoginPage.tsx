import React from 'react';
import { LogIn, ShieldCheck } from 'lucide-react';
import { SocialGoogleButton } from '../components/SocialGoogleButton';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { APP_TITLE } from '../config/env';

export const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { navigate, query } = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(query.redirectTo || '/');
    }
  }, [isAuthenticated, navigate, query.redirectTo]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl space-y-6 animate__animated animate__fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-3">
            <LogIn className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Sign in to {APP_TITLE}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Use your Google account to access animal records, place bookings, and manage your profile.
          </p>
        </div>

        <SocialGoogleButton redirectTo={query.redirectTo || '/'} />

        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure sign-in powered by Google OAuth</span>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-stone-500">
            New to {APP_TITLE}?{' '}
            <button
              id="goto-register-link-btn"
              onClick={() => navigate('/register')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
