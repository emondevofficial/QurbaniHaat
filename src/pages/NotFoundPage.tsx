import React from 'react';
import { useRouter } from '../context/RouterContext';
import { Compass, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-xl animate__animated animate__fadeIn">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
          <Compass className="w-10 h-10 animate-spin" style={{ animationDuration: '10s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-emerald-700 font-mono tracking-wider">404</span>
          <h1 className="text-2xl font-extrabold text-stone-900 font-serif">
            Haat Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
            The pasture trail you are looking for might have moved, or the animal ID is not registered in our current seasonal inventory.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            id="not-found-home-btn"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
          
          <button
            id="not-found-animals-btn"
            onClick={() => navigate('/animals')}
            className="w-full sm:w-auto px-5 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Browse Livestock</span>
          </button>
        </div>
      </div>
    </div>
  );
};
