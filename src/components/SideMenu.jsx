import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <Link to="/dashboard" onClick={onClose} className="flex items-center gap-2 font-semibold text-gray-800">
            <span className="text-xl">🐾</span> PawLog
          </Link>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600" aria-label="Close menu">
            ✕
          </button>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={onClose}
              className={`block px-4 py-3 rounded-xl text-sm font-medium ${location.pathname === to ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <div className="px-4 py-2 mb-2">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={() => { logout(); onClose(); }}
            className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
