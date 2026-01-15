import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { FloatingWatchLiveButton } from './components/FloatingWatchLiveButton';
import { HomePage } from './components/HomePage';
import { EventsPage } from './components/EventsPage';
import { MediaPage } from './components/MediaPage';
import { NewsPage } from './components/NewsPage';
import { GivePage } from './components/GivePage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { LoginPage } from './components/admin/LoginPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Moon, Sun, Shield } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('access_token');
    if (token) {
      setAccessToken(token);
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  useEffect(() => {
    // Apply dark mode class
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleLoginSuccess = (token: string) => {
    setAccessToken(token);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    setAccessToken(null);
    setIsAdmin(false);
    setCurrentPage('home');
  };

  // Show admin dashboard if logged in as admin
  if (isAdmin && currentPage === 'admin') {
    return <AdminDashboard onLogout={handleLogout} />;
  }

  // Show login page if trying to access admin
  if (currentPage === 'admin' && !isAdmin) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'about':
        return <AboutPage />;
      case 'events':
        return <EventsPage />;
      case 'media':
        return <MediaPage />;
      case 'news':
        return <NewsPage />;
      case 'give':
        return <GivePage />;
      case 'contact':
        return <ContactPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Dark Mode Toggle */}
      <div className="fixed top-24 right-8 z-40 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full bg-white shadow-lg border-purple-200 hover:bg-purple-50"
          title="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-purple-600" />
          ) : (
            <Moon className="w-5 h-5 text-purple-600" />
          )}
        </Button>

        {/* Admin Access Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage('admin')}
          className="rounded-full bg-white shadow-lg border-purple-200 hover:bg-purple-50"
          title={isAdmin ? "Go to Admin Dashboard" : "Admin Login"}
        >
          <Shield className="w-5 h-5 text-purple-600" />
        </Button>
      </div>

      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main>
        {renderPage()}
      </main>

      <FloatingWatchLiveButton />
      
      <Footer />
    </div>
  );
}
