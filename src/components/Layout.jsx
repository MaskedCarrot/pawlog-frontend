import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import SideMenu from './SideMenu';
import BackButton from './BackButton';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/settings', label: 'Preferences' },
];

export default function Layout({ children, onRefresh }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleRefresh = () => {
    if (onRefresh) onRefresh();
    else window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:bottom-0 md:w-64 bg-white border-r border-gray-200 z-10">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between gap-2 pt-6">
          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors order-first flex items-center justify-center"
            aria-label="Refresh"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 flex-1">
            <span className="text-xl">🐾</span>
            <span className="font-semibold text-gray-800">PawLog</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-3 rounded-xl text-sm font-medium ${location.pathname === to ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-3 mb-2 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate" title={user?.name}>{user?.name}</p>
            <p className="text-xs text-gray-500 truncate mt-0.5" title={user?.email}>{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
      {/* Mobile header + hamburger - only on mobile */}
      <header className="md:hidden bg-white border-b border-gray-200 sticky top-0 z-10 flex-shrink-0">
        <div className="px-4 flex items-center h-14 gap-2">
          <BackButton />
          <button onClick={() => setMenuOpen(true)} className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600" aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-gray-800 truncate flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">🐾</span> PawLog
          </Link>
          <button onClick={handleRefresh} className="flex items-center justify-center w-10 h-10 rounded-xl hover:bg-gray-100 text-gray-600 flex-shrink-0" aria-label="Refresh">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
        </div>
      </header>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 py-6">{children}</div>
      </main>
      </div>
    </div>
  );
}
