import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from '../context/RouterContext';
import { useToast } from '../context/ToastContext';
import { 
  User as UserIcon, 
  Image as ImageIcon, 
  Mail,
  ArrowLeft, 
  ArrowRight,
  Check, 
  Lock,
  AlertCircle,
  X
} from 'lucide-react';

const FALLBACK_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';

export const UpdateProfilePage: React.FC = () => {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const { navigate } = useRouter();
  const { showToast } = useToast();

  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Pre-fill form from currently authenticated user session
  useEffect(() => {
    if (user && !isInitialized) {
      setName(user.name || '');
      setImage(user.image || user.photoUrl || '');
      setIsInitialized(true);
    }
  }, [user, isInitialized]);

  // Authentication Protection: Redirect unauthenticated visitors to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login?redirectTo=/my-profile/update');
    }
  }, [isLoading, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500">Loading user session...</p>
      </div>
    );
  }

  // Fallback protection if session not loaded
  if (!isAuthenticated || !user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-stone-900 font-serif">Sign In Required</h2>
          <p className="text-xs text-stone-500 mt-2">
            Please sign in to update your profile information.
          </p>
        </div>
        <button
          onClick={() => navigate('/login?redirectTo=/my-profile/update')}
          className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation: Name is required
    if (!name.trim()) {
      const msg = 'Name is required.';
      setErrorMessage(msg);
      showToast(msg, 'warning', 'Validation Error');
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateUser({
        name: name.trim(),
        image: image.trim(),
      });

      if (!result.success) {
        const errorMsg = result.error || 'Failed to update user information.';
        setErrorMessage(errorMsg);
        showToast(errorMsg, 'error', 'Update Failed');
        return;
      }

      showToast('Profile information updated successfully!', 'success', 'Profile Updated');
      
      // Redirect back to /my-profile
      navigate('/my-profile');
    } catch (error: unknown) {
      console.error('Profile update failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Unexpected error occurred while updating profile.';
      setErrorMessage(errorMsg);
      showToast(errorMsg, 'error', 'Update Failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentOriginalImage = user?.image || user?.photoUrl || FALLBACK_AVATAR;
  const isImageModified = image.trim() !== '' && image.trim() !== currentOriginalImage;

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12 space-y-6 animate__animated animate__fadeIn">
      
      {/* Cancel / Back Button */}
      <div className="flex items-center justify-between">
        <button
          id="back-to-profile-btn"
          type="button"
          onClick={() => navigate('/my-profile')}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-stone-600 hover:text-emerald-700 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Profile</span>
        </button>
      </div>

      {/* Main Profile Update Form Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl space-y-6">
        
        {/* Header */}
        <div className="border-b border-stone-100 pb-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Update Information
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Update your account details below. Changes will be saved immediately to your profile.
          </p>
        </div>

        {/* Inline Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Error: </span>
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-500 hover:text-rose-700 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Image Preview: Clearly distinguishing between Current image and Newly selected image */}
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            {/* Current Image */}
            <div className="flex items-center gap-3">
              <img
                id="current-profile-image"
                src={currentOriginalImage}
                alt="Current profile"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-300 shadow-sm bg-stone-200 shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                }}
              />
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-600 bg-stone-200/80 px-2 py-0.5 rounded-full">
                  Current Image
                </span>
                <p className="text-xs font-semibold text-stone-800">{user?.name || 'Current Profile'}</p>
              </div>
            </div>

            {/* If a new image URL is selected or typed, show arrow & Newly Selected Image */}
            {isImageModified && (
              <>
                <ArrowRight className="w-4 h-4 text-emerald-600 hidden sm:block shrink-0" />
                <div className="flex items-center gap-3">
                  <img
                    id="new-profile-image-preview"
                    src={image.trim()}
                    alt="Newly selected image preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-600 shadow-md bg-stone-200 shrink-0 ring-2 ring-emerald-500/30"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_AVATAR;
                    }}
                  />
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Newly Selected Image
                    </span>
                    <p className="text-xs font-semibold text-emerald-900">Preview</p>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Profile Update Form */}
        <form id="update-information-form" onSubmit={handleUpdateProfile} className="space-y-5">
          
          {/* Field 1: Name (Editable) */}
          <div>
            <label htmlFor="update-name-input" className="block text-xs font-bold text-stone-700 mb-1.5">
              Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="update-name-input"
                name="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                disabled={isUpdating}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all disabled:opacity-60"
              />
            </div>
          </div>

          {/* Field 2: Profile Image / Image (Editable) */}
          <div>
            <label htmlFor="update-image-input" className="block text-xs font-bold text-stone-700 mb-1.5">
              Profile Image <span className="text-stone-400 font-normal">(Image URL)</span>
            </label>
            <div className="relative">
              <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="update-image-input"
                name="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/profile.jpg"
                disabled={isUpdating}
                className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all disabled:opacity-60"
              />
            </div>
            <p className="text-[11px] text-stone-400 mt-1">
              Provide an image URL or choose a preset below.
            </p>
          </div>

          {/* Preset Avatar Selection */}
          <div>
            <span className="text-[11px] font-semibold text-stone-500 block mb-2">Or choose a preset avatar image:</span>
            <div className="flex items-center gap-3">
              {[
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
                'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
                'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
                'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
              ].map((presetUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={isUpdating}
                  onClick={() => setImage(presetUrl)}
                  className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-transform hover:scale-105 cursor-pointer disabled:opacity-60 ${
                    image === presetUrl ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-stone-200'
                  }`}
                  title={`Select preset avatar ${idx + 1}`}
                >
                  <img src={presetUrl} alt={`Avatar preset ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Email: Read-only display (must NOT be an editable field) */}
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1.5">
              Email <span className="text-stone-400 font-normal">(Cannot be edited)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="profile-email-readonly"
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full pl-10 pr-4 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-xs sm:text-sm text-stone-500 cursor-not-allowed select-none font-mono"
              />
            </div>
          </div>

          {/* Action Buttons: Update Information and Cancel */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              id="update-information-submit-btn"
              data-testid="update-information-btn"
              type="submit"
              disabled={isUpdating}
              className="w-full sm:flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-950/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Information</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isUpdating}
              onClick={() => navigate('/my-profile')}
              className="w-full sm:w-auto px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-60"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};


