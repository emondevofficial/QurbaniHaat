import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl overflow-hidden border border-stone-200 p-0 shadow-sm animate-pulse"
        >
          <div className="h-52 bg-stone-200 w-full" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-stone-200 rounded w-1/3" />
            <div className="h-6 bg-stone-200 rounded w-3/4" />
            <div className="h-4 bg-stone-100 rounded w-full" />
            <div className="flex gap-2 pt-2">
              <div className="h-6 bg-stone-100 rounded-full w-16" />
              <div className="h-6 bg-stone-100 rounded-full w-16" />
              <div className="h-6 bg-stone-100 rounded-full w-16" />
            </div>
            <div className="pt-3">
              <div className="h-9 bg-stone-200 rounded-xl w-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
