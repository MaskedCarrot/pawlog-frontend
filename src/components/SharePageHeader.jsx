import { Link } from 'react-router-dom';

export default function SharePageHeader() {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
      <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-center">
        <Link to="/" className="flex items-center gap-2 text-gray-900 hover:text-primary transition-colors">
          <span className="text-2xl">🐾</span>
          <span className="text-xl font-semibold">PawLog</span>
        </Link>
      </div>
    </header>
  );
}
