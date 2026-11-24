import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface RouterContextType {
  path: string;
  query: Record<string, string>;
  navigate: (to: string) => void;
  goBack: () => void;
}

const RouterContext = createContext<RouterContextType | undefined>(undefined);

function parseLocation(): { path: string; query: Record<string, string> } {
  let fullPath = window.location.pathname;
  let searchStr = window.location.search;

  // Support hash routing fallback if served on static host without rewrite rule
  if (window.location.hash && window.location.hash.startsWith('#/')) {
    const hashContent = window.location.hash.slice(1);
    const [hPath, hSearch] = hashContent.split('?');
    fullPath = hPath || '/';
    searchStr = hSearch ? `?${hSearch}` : '';
  }

  // Normalize path
  if (!fullPath || fullPath === '') fullPath = '/';

  // Parse search params
  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(searchStr);
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return { path: fullPath, query: params };
}

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [routeState, setRouteState] = useState(parseLocation);

  useEffect(() => {
    const handlePopState = () => {
      setRouteState(parseLocation());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    // Check if target has search query or path
    const [targetPath, targetQuery] = to.split('?');
    const newUrl = to.startsWith('/') ? to : `/${to}`;

    // Update browser history
    window.history.pushState({}, '', newUrl);
    setRouteState(parseLocation());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  return (
    <RouterContext.Provider value={{ path: routeState.path, query: routeState.query, navigate, goBack }}>
      {children}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};
