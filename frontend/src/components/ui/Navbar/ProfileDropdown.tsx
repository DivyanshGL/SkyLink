import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Ticket, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '../Button';

interface ProfileDropdownProps {
  email: string | null;
  role: string | null;
  onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ email, role, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const firstLetter = email ? email.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLinkClick = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-white font-bold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        {firstLetter}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
          >
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
              <p className="text-sm text-gray-500">Signed in as</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{email}</p>
            </div>
            
            <div className="py-2">
              <button
                onClick={() => handleLinkClick('/profile')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600 flex items-center gap-3 transition-colors"
              >
                <User size={16} /> My Profile
              </button>
              <button
                onClick={() => handleLinkClick('/bookings')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-sky-600 flex items-center gap-3 transition-colors"
              >
                <Ticket size={16} /> My Bookings
              </button>
              
              {role === 'ADMIN' && (
                <button
                  onClick={() => handleLinkClick('/admin')}
                  className="w-full text-left px-4 py-2 text-sm text-sky-600 hover:bg-sky-50 font-medium flex items-center gap-3 transition-colors"
                >
                  <LayoutDashboard size={16} /> Admin Dashboard
                </button>
              )}
            </div>
            
            <div className="border-t border-gray-100 py-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
