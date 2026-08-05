import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Search, Menu } from 'lucide-react';
import { NavItem } from './NavItem';
import { ProfileDropdown } from './ProfileDropdown';
import { MobileMenu } from './MobileMenu';
import { Button } from '../Button';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Sync auth state
  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem('token'));
      setUserRole(localStorage.getItem('role'));
      setUserEmail(localStorage.getItem('email'));
    };
    
    // Initial load
    handleAuthChange();

    window.addEventListener('auth:unauthorized', handleAuthChange);
    // Custom event for successful login if needed, or rely on layout reload
    // In React Router, we often rely on context, but here we'll use an interval or event
    return () => window.removeEventListener('auth:unauthorized', handleAuthChange);
  }, []);

  // Sync auth state on interval as a fallback since no Context is used for Auth
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      if (!!token !== isAuthenticated) {
        setIsAuthenticated(!!token);
        setUserRole(localStorage.getItem('role'));
        setUserEmail(localStorage.getItem('email'));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);


  // Handle scroll for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    setIsAuthenticated(false);
    setUserRole(null);
    setUserEmail(null);
    navigate('/login');
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 py-3' 
            : 'bg-white py-4 border-b border-gray-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10">
            
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center gap-2 outline-none focus-visible:ring-2 focus-visible:ring-sky-500 rounded-lg p-1"
              aria-label="SkyLink Home"
            >
              <div className="bg-sky-500 p-1.5 rounded-lg text-white shadow-sm flex items-center justify-center">
                <Plane size={22} className="transform -rotate-45" />
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight hidden sm:block">SkyLink</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 mx-6">
              <NavItem to="/" label="Home" />
              <NavItem to="/flights" label="Flights" />
              {isAuthenticated && (
                <>
                  <NavItem to="/bookings" label="My Bookings" />
                  <NavItem to="/profile" label="Profile" />
                </>
              )}
              {isAuthenticated && userRole === 'ADMIN' && (
                <NavItem to="/admin" label="Admin" />
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              {/* Global Search Icon Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/flights')}
                className="hidden sm:flex p-2 text-gray-500 hover:text-sky-600 hover:bg-sky-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Search Flights"
              >
                <Search size={20} />
              </motion.button>

              <div className="hidden md:flex items-center gap-3 ml-2 border-l pl-4 border-gray-200">
                {isAuthenticated ? (
                  <ProfileDropdown 
                    email={userEmail} 
                    role={userRole} 
                    onLogout={handleLogout} 
                  />
                ) : (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/login')}
                      className="font-semibold"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => navigate('/register')}
                      className="font-semibold"
                    >
                      Register
                    </Button>
                  </>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 -mr-2 text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={isMobileMenuOpen}
              >
                <Menu size={24} />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Spacer to prevent content from jumping under fixed header */}
      <div className="h-[73px]"></div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        isAuthenticated={isAuthenticated}
        email={userEmail}
        role={userRole}
        onLogout={handleLogout}
      />
    </>
  );
};
