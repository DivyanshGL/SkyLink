import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/ui/Navbar/Navbar';

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex flex-col relative">
        <Outlet />
      </main>
    </div>
  );
};
