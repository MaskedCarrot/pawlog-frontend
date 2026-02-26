import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserAvatar from './UserAvatar';

const nav = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/settings', label: 'Preferences' },
];

export default function SideMenu({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} aria-hidden="true" />
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white shadow-xl z-50 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 font-semibold text-slate-800">
            <span className="text-xl">🐾</span> PawLog
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-50 text-slate-600" aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`block px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === to ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <UserAvatar user={user} size="md" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate" title={user?.name}>{user?.name}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
