import React from 'react';
import { useRouter } from '../context/RouterContext';
import { APP_TITLE } from '../config/env';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Heart,
  Facebook, 
  Youtube, 
  Twitter, 
  Instagram,
  ArrowRight
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* 1. About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                {APP_TITLE ? APP_TITLE.charAt(0) : 'M'}
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {APP_TITLE}
              </span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed">
              Bangladesh’s most trusted online livestock marketplace for sacred Qurbani sacrifice. We connect conscientious buyers with verified ethical cattle farms across Bogura, Pabna, Sirajganj, and Kushtia.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-stone-800/90 border border-stone-700 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Shariah Compliant Livestock</span>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <button 
                  onClick={() => navigate('/')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Home</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/animals')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>All Animals & Cattle</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/animals?type=Cow')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Qurbani Cows & Bulls</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/animals?type=Goat')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Black Bengal & Jamunapari Goats</span>
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/my-profile')} 
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight className="w-3 h-3 text-emerald-500" />
                  <span>Buyer Portal & Profile</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 3. Contact Info */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Contact & Haat Office
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                <span>Tejgaon Central Haat & Farm Hub, Level 4, Bir Uttam Mir Shawkat Sarak, Dhaka 1208, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-mono text-stone-200">+880 1712-345678 (Haat Hotline)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@qurbanihaat.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Eid Support & Live Vet Desk</span>
              </li>
            </ul>
          </div>

          {/* 4. Social Links & Coverage */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4">
              Connect With Us
            </h3>
            <p className="text-sm text-stone-400 mb-4 leading-relaxed">
              Follow our daily haat live streams, weigh-in videos, and seasonal arrival updates.
            </p>
            <div className="flex items-center gap-3 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:bg-rose-600 hover:border-rose-500 transition-all"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:bg-sky-600 hover:border-sky-500 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white hover:bg-pink-600 hover:border-pink-500 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            <div className="bg-stone-800/90 rounded-xl p-3.5 border border-stone-700">
              <p className="text-xs text-stone-400 font-medium">
                Live Farm Delivery Coverage: <span className="text-emerald-400 font-semibold">Dhaka, Chittagong, Sylhet & Rajshahi Metros</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} {APP_TITLE}. All rights reserved. Dedicated to authentic, ethical livestock trading.</p>
          <div className="flex items-center gap-1 text-stone-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Eid-ul-Adha Devotees</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
