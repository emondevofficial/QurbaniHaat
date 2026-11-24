import React, { useState } from 'react';
import { useRouter } from '../context/RouterContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { APP_TITLE } from '../config/env';
import { 
  ShieldCheck, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut, 
  Sparkles,
  ChevronDown,
  Layers
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { path, navigate } = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { showToast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      setMobileMenuOpen(false);
      showToast('You have been logged out successfully.', 'info', 'Logged Out');
      navigate('/');
    } catch (error: unknown) {
      showToast(error instanceof Error ? error.message : 'Sign out failed. Please try again.', 'error', 'Sign Out Failed');
    }
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Animals', href: '/animals' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && path === '/') return true;
    if (href !== '/' && path.startsWith(href)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shadow-xs">
      {/* Top Banner Notice */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 border-b border-stone-800">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span>Eid-ul-Adha 2025/2026 Qurbani Haat: 100% Shariah Compliant & Vet Certified Livestock</span>
        <span className="hidden md:inline-block bg-emerald-900/90 text-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-semibold border border-emerald-700/50">Free Health Audit</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo */}
          <div 
            id="nav-logo"
            onClick={() => navigate('/')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-emerald-200 transition-transform group-hover:scale-105">
              <span>{APP_TITLE ? APP_TITLE.charAt(0) : 'M'}</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-emerald-900">{APP_TITLE}</span>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">Live</span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium -mt-0.5">Modern Livestock Marketplace</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 h-full">
            {navLinks.map((link) => (
              <button
                key={link.href}
                id={`nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => navigate(link.href)}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  isActive(link.href)
                    ? 'text-emerald-600 font-semibold border-b-2 border-emerald-600'
                    : 'text-stone-500 hover:text-emerald-600'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action Area (Auth State) */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="nav-user-dropdown-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full border border-stone-200 hover:border-emerald-300 hover:bg-stone-50 transition-all focus:outline-none"
                >
                  <img
                    src={user.photoUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-600"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <span className="text-xs font-semibold text-stone-800 max-w-[120px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    id="nav-user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 py-2 z-50 animate__animated animate__fadeIn animate__faster"
                  >
                    <div className="px-4 py-2.5 border-b border-stone-100">
                      <p className="text-xs font-semibold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                    </div>

                    <button
                      id="nav-dropdown-profile-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/my-profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-emerald-600" />
                      <span>My Profile</span>
                    </button>

                    <button
                      id="nav-dropdown-animals-btn"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        navigate('/animals');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-2.5 transition-colors"
                    >
                      <Layers className="w-4 h-4 text-emerald-600" />
                      <span>Browse Livestock</span>
                    </button>

                    <div className="border-t border-stone-100 my-1"></div>

                    <button
                      id="nav-dropdown-logout-btn"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  id="nav-login-btn"
                  onClick={() => navigate('/login')}
                  className="text-sm font-semibold text-stone-600 px-4 py-2 hover:bg-stone-50 rounded-md transition-colors"
                >
                  Login
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => navigate('/register')}
                  className="text-sm font-semibold bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 shadow-md shadow-emerald-200 transition-all"
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && user && (
              <button
                onClick={() => navigate('/my-profile')}
                className="w-8 h-8 rounded-full overflow-hidden border border-emerald-600"
              >
                <img src={user.photoUrl} alt={user.name} className="w-full h-full object-cover" />
              </button>
            )}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-stone-600 hover:text-emerald-700 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div 
          id="mobile-nav-drawer"
          className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3 animate__animated animate__fadeInDown animate__faster"
        >
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate(link.href);
                }}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
                  isActive(link.href)
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="border-t border-stone-100 pt-3">
            {isAuthenticated && user ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/my-profile');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-stone-700 hover:bg-emerald-50"
                >
                  <UserIcon className="w-4 h-4 text-emerald-600" />
                  <span>My Profile ({user.name})</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
