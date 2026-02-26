import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import SideMenu from './SideMenu';
import BackButton from './BackButton';
import UserAvatar from './UserAvatar';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/settings', label: 'Preferences' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Desktop sidebar - hidden on mobile */}
      <aside className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:bottom-0 md:w-64 bg-white border-r border-slate-200/80 z-10">
        <div className="px-5 py-5 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2.5">
            <span className="text-xl">🐾</span>
            <span className="font-semibold text-slate-800 tracking-tight">PawLog</span>
          </Link>
        </div>
        <nav className="flex-1 px-4 py-3 space-y-0.5 overflow-y-auto">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === to ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2.5 mb-1 min-w-0">
            <UserAvatar user={user} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate" title={user?.name}>{user?.name}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
          >
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
      {/* Mobile header + hamburger - only on mobile */}
      <header className="md:hidden bg-white border-b border-slate-200/80 sticky top-0 z-10 flex-shrink-0">
        <div className="px-4 flex items-center h-14 gap-2">
          <BackButton />
          <button onClick={() => setMenuOpen(true)} className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-50 text-slate-600" aria-label="Open menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link to="/dashboard" className="flex items-center gap-2 font-semibold text-slate-800 truncate flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">🐾</span> PawLog
          </Link>
        </div>
      </header>

      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">{children}</div>
      </main>
      </div>
    </div>
  );
}
