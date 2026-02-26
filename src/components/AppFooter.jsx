import { Link } from 'react-router-dom';

const SUPPORT_EMAIL = 'support-pawlog@maskedcarrotlabs.com';

export default function AppFooter({ variant = 'default' }) {
  const compact = variant === 'compact';
  const linkClass = 'text-gray-500 hover:text-gray-900 transition-colors';

  if (compact) {
    return (
      <footer className="py-6 text-center text-sm border-t border-gray-200/80 bg-gray-50">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-gray-500">
          <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>Contact</a>
          <span className="text-gray-300">·</span>
          <Link to="/privacy" className={linkClass}>Privacy</Link>
          <span className="text-gray-300">·</span>
          <Link to="/terms" className={linkClass}>Terms</Link>
        </div>
        <p className="mt-3 text-gray-400 text-xs">© {new Date().getFullYear()} PawLog · MaskedCarrotLabs</p>
      </footer>
    );
  }

  return (
    <footer className="border-t border-gray-200/80 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🐾</span>
            <span className="font-semibold text-gray-800">PawLog</span>
            <span className="text-gray-400 text-sm hidden sm:inline">by MaskedCarrotLabs</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link to="/privacy" className={linkClass}>Privacy</Link>
            <Link to="/terms" className={linkClass}>Terms</Link>
            <a href={`mailto:${SUPPORT_EMAIL}`} className={linkClass}>Contact</a>
          </div>
        </div>
        <p className="mt-6 pt-6 border-t border-gray-200/60 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} PawLog. Pet care made simple.
        </p>
      </div>
    </footer>
  );
}
