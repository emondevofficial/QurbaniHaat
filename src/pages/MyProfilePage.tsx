import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Edit3, 
  LogOut, 
  Lock,
  Layers,
  Award,
  CheckCircle2
} from 'lucide-react';

export const MyProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Sign out failed. Please try again.', 'error', 'Sign Out Failed');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500">Loading user profile...</p>
      </div>
    );
  }

  // Private route safeguard
  if (!user || !isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Sign In Required</h2>
          <p className="text-xs text-stone-500 mt-2">
            Please log in to view your Qurbani buyer profile and booking history.
          </p>
        </div>
        <button
          onClick={() => navigate('/login?redirectTo=/my-profile')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate__animated animate__fadeIn">
      
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-xl relative overflow-hidden">
        {/* Accent banner background */}
        <div className="h-32 -mx-6 -mt-6 sm:-mx-10 sm:-mt-10 bg-gradient-to-r from-emerald-800 via-emerald-700 to-stone-900 relative">
          <div className="absolute top-4 right-6 flex items-center gap-2">
            <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-200 text-[11px] font-bold px-3 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{user.emailVerified ? 'Verified Google Email' : 'Google Account'}</span>
            </span>
          </div>
        </div>

        {/* User Details Overview: Name, Photo, Email */}
        <div className="relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-12 pb-6 border-b border-stone-100">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
            {/* User Photo */}
            <div className="relative">
              <img
                id="my-profile-avatar"
                src={user.image || user.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                alt={user.name}
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl bg-stone-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
                }}
              />
              <div className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white" title="Active">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            {/* Name & Email */}
            <div className="space-y-1">
              <h1 id="my-profile-name" className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
                {user.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-stone-500">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span id="my-profile-email" className="font-mono text-stone-700">{user.email}</span>
              </div>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-stone-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member since {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recent'}</span>
              </div>
            </div>
          </div>

          {/* Action Button: Requirement 1: Update Information button navigates to /my-profile/update */}
          <div className="flex items-center gap-3">
            <button
              id="goto-update-profile-btn"
              data-testid="update-button"
              aria-label="Update Information"
              onClick={() => navigate('/my-profile/update')}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer animate__animated animate__pulse animate__infinite"
              style={{ animationDuration: '3s' }}
            >
              <Edit3 className="w-4 h-4" />
              <span>Update Information</span>
            </button>

            <button
              id="my-profile-logout-btn"
              onClick={() => { void handleLogout(); }}
              className="p-2.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Profile Statistics & Badges */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Tier</p>
              <p className="text-xs font-bold text-stone-900">Priority Qurbani Patron</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Live Haat Status</p>
              <p className="text-xs font-bold text-stone-900">Authorized for Direct Booking</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-stone-400 uppercase font-semibold">Veterinary Assurance</p>
              <p className="text-xs font-bold text-stone-900">100% Shariah Compliant</p>
            </div>
          </div>
        </div>

      </div>

      {/* Suggested Quick Actions */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-stone-900">Ready to choose your sacrifice?</h3>
          <p className="text-xs text-stone-500 mt-1">Explore available cows, bulls, and goats with certified live weight.</p>
        </div>
        <button
          onClick={() => navigate('/animals')}
          className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          Explore Livestock Haat
        </button>
      </div>

    </div>
  );
};
