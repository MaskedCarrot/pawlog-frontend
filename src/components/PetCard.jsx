import { Link } from 'react-router-dom';

function getAgeYears(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

export default function PetCard({ pet, tasks }) {
  const speciesEmoji = pet.species === 'DOG' ? '🐕' : '🐈';
  const { total = 0, completed = 0 } = tasks || {};
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const age = getAgeYears(pet.birthDate);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      <div className="p-4 flex gap-4 flex-1 min-h-0">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
          {speciesEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{pet.name}</h3>
          <p className="text-sm text-gray-500">
            {pet.breed || pet.species} {age !== null && `• Age: ${age} yr${age !== 1 ? 's' : ''}`}
          </p>
          {tasks && total > 0 && (
            <>
              <p className="text-sm text-gray-600 mt-1">Tasks today: {completed}/{total}</p>
              <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total} aria-label={`${completed} of ${total} tasks completed today`}>
                <div className="h-full bg-primary rounded-full transition-all duration-300 flex-shrink-0" style={{ width: `${progress}%`, minWidth: progress > 0 ? 8 : 0 }} />
              </div>
            </>
          )}
        </div>
      </div>
      <Link to={`/pets/${pet.id}`} className="block w-full py-3 px-4 text-center text-sm font-medium text-primary hover:bg-primary/5 border-t border-gray-50 mt-auto">
        Manage Routine →
      </Link>
    </div>
  );
}
