import React from 'react';
import { RouterProvider, useRouter } from './context/RouterContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { AllAnimalsPage } from './pages/AllAnimalsPage';
import { AnimalDetailsPage } from './pages/AnimalDetailsPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyProfilePage } from './pages/MyProfilePage';
import { UpdateProfilePage } from './pages/UpdateProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { APP_TITLE } from './config/env';

const AppRoutes: React.FC = () => {
  const { path } = useRouter();

  React.useEffect(() => {
    if (APP_TITLE) {
      document.title = `${APP_TITLE} - Modern Livestock Marketplace`;
    }
  }, []);

  const renderCurrentPage = () => {
    // Normalize path
    const cleanPath = path.split('?')[0].replace(/\/$/, '') || '/';

    switch (cleanPath) {
      case '/':
        return <HomePage />;
      case '/animals':
        return <AllAnimalsPage />;
      case '/details-page':
        return <AnimalDetailsPage />;
      case '/login':
        return <LoginPage />;
      case '/register':
        return <RegisterPage />;
      case '/my-profile':
        return <MyProfilePage />;
      case '/my-profile/update':
      case '/update-profile':
      case '/update-information':
      case '/profile/update':
        return <UpdateProfilePage />;
      default:
        // Handle path with animal id like /details-page/1
        if (cleanPath.startsWith('/details-page/')) {
          return <AnimalDetailsPage />;
        }
        return <NotFoundPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-emerald-600 selection:text-white">
      <Navbar />
      <main className="flex-1 w-full">
        {renderCurrentPage()}
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RouterProvider>
          <AppRoutes />
        </RouterProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
