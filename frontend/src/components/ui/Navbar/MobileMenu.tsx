import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, LogOut, Ticket, LayoutDashboard, Plane, Search } from 'lucide-react';
import { Button } from '../Button';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  email: string | null;
  role: string | null;
  onLogout: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, isAuthenticated, email, role, onLogout }) => {
  const firstLetter = email ? email.charAt(0).toUpperCase() : 'U';

  const menuVariants = {
    closed: { x: "-100%", transition: { type: "tween", duration: 0.3 } },
    open: { x: 0, transition: { type: "tween", duration: 0.3 } }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col md:hidden"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="bg-sky-500 p-1.5 rounded-lg text-white shadow-sm">
                  <Plane size={20} className="transform -rotate-45" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">SkyLink</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4">
              <nav className="px-4 space-y-2">
                <NavLink 
                  to="/" 
                  onClick={onClose}
                  className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-600' : 'text-gray-700 hover:bg-gray-50'}`}
                >
                  <Search size={20} /> Search Flights
                </NavLink>

                {isAuthenticated ? (
                  <>
                    <NavLink 
                      to="/bookings" 
                      onClick={onClose}
                      className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <Ticket size={20} /> My Bookings
                    </NavLink>
                    <NavLink 
                      to="/profile" 
                      onClick={onClose}
                      className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-600' : 'text-gray-700 hover:bg-gray-50'}`}
                    >
                      <User size={20} /> Profile
                    </NavLink>
                    {role === 'ADMIN' && (
                      <NavLink 
                        to="/admin" 
                        onClick={onClose}
                        className={({isActive}) => `flex items-center gap-3 p-3 rounded-lg font-medium transition-colors ${isActive ? 'bg-sky-50 text-sky-600' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        <LayoutDashboard size={20} /> Admin Dashboard
                      </NavLink>
                    )}
                  </>
                ) : null}
              </nav>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 px-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-bold">
                      {firstLetter}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{email}</p>
                    </div>
                  </div>
                  <Button 
                    variant="danger" 
                    className="w-full justify-center"
                    onClick={() => { onClose(); onLogout(); }}
                  >
                    <LogOut size={18} className="mr-2" /> Logout
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <NavLink to="/login" onClick={onClose} className="w-full">
                    <Button variant="outline" className="w-full justify-center">Log In</Button>
                  </NavLink>
                  <NavLink to="/register" onClick={onClose} className="w-full">
                    <Button className="w-full justify-center">Sign Up</Button>
                  </NavLink>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
