import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plane, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-sky-500 p-2 rounded-xl text-white group-hover:bg-sky-600 transition-colors">
              <Plane size={24} className="transform -rotate-45" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">
              SkyLink
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/search" className="text-gray-600 hover:text-sky-500 font-medium transition-colors">
              Search Flights
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-sky-500 font-medium transition-colors">
                  <User size={20} />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-red-500 hover:bg-red-50 font-medium transition-colors"
                >
                  <LogOut size={20} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-gray-600 hover:text-sky-500 font-medium transition-colors">
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
