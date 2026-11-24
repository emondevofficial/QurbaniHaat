import React from 'react';
import { UserPlus, ShieldCheck } from 'lucide-react';
import { SocialGoogleButton } from '../components/SocialGoogleButton';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { APP_TITLE } from '../config/env';

export const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { navigate } = useRouter();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl space-y-6 animate__animated animate__fadeIn">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto mb-3">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Create your {APP_TITLE} account
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Your Google account securely creates a buyer profile, or signs you in if you already have one.
          </p>
        </div>

        <SocialGoogleButton redirectTo="/" />

        <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Secure sign-in powered by Google OAuth</span>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-stone-500">
            Already have an account?{' '}
            <button
              id="goto-login-link-btn"
              onClick={() => navigate('/login')}
              className="text-emerald-700 font-bold hover:underline cursor-pointer"
            >
              Continue to sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
