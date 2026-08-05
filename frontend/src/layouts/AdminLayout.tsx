import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Plane, LayoutDashboard, Users, Ticket, LogOut, Settings } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('email');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Flights', path: '/admin/flights', icon: Plane },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Bookings', path: '/admin/bookings', icon: Ticket },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex fixed h-full z-20">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-sky-500 p-1.5 rounded-lg text-white">
              <Plane size={20} className="transform -rotate-45" />
            </div>
            <span className="text-xl font-bold tracking-tight">SkyLink Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-sky-600 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => item.path === location.pathname)?.name || 'Admin Panel'}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
              A
            </div>
          </div>
        </header>
        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
