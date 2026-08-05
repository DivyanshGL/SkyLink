import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItemProps {
  to: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const NavItem: React.FC<NavItemProps> = ({ to, label, icon, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sky-500 ${
          isActive ? 'text-sky-600' : 'text-gray-600 hover:text-sky-600'
        }`
      }
    >
      {({ isActive }) => (
        <>
          {icon && <span className="text-current opacity-80">{icon}</span>}
          {label}
          {isActive && (
            <motion.div
              layoutId="navbar-active-indicator"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-sky-600 rounded-t-md"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  );
};
