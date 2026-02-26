import { useNavigate, useLocation } from 'react-router-dom';

const ROOT_PATHS = ['/dashboard', '/settings', '/'];

export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  if (ROOT_PATHS.includes(path)) return null;

  let backPath = null;
  if (path === '/pets/new') backPath = '/dashboard';
  else {
    const petMatch = path.match(/^\/pets\/([^/]+)/);
    if (petMatch) {
      const petId = petMatch[1];
      if (path === `/pets/${petId}`) backPath = '/dashboard';
      else if (path === `/pets/${petId}/edit`) backPath = `/pets/${petId}`;
      else if (path.match(/^\/pets\/[^/]+\/routines\//)) backPath = `/pets/${petId}`;
    }
  }

  return (
    <button
      type="button"
      onClick={() => (backPath ? navigate(backPath) : navigate(-1))}
      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 sm:hidden flex-shrink-0"
      aria-label="Go back"
    >
      ←
    </button>
  );
}
