import { Link } from 'react-router-dom';
import { getAgeYears } from '../utils/dateUtils';

export default function PetCard({ pet, tasks }) {
  const speciesEmoji = pet.species === 'DOG' ? '🐕' : '🐈';
  const { total = 0, completed = 0 } = tasks || {};
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const age = getAgeYears(pet.birthDate);

  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-card overflow-hidden hover:shadow-card-hover hover:border-slate-200 transition-all flex flex-col h-full">
      <div className="p-5 flex gap-4 flex-1 min-h-0">
        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl flex-shrink-0">
          {speciesEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate">{pet.name}</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            {pet.breed || pet.species} {age !== null && `• ${age} yr${age !== 1 ? 's' : ''}`}
          </p>
          {tasks && total > 0 && (
            <>
              <p className="text-sm text-slate-600 mt-2">Tasks today: {completed}/{total}</p>
              <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden" role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total} aria-label={`${completed} of ${total} tasks completed today`}>
                <div className="h-full bg-primary rounded-full transition-all duration-300 flex-shrink-0" style={{ width: `${progress}%`, minWidth: progress > 0 ? 6 : 0 }} />
              </div>
            </>
          )}
        </div>
      </div>
      <Link to={`/pets/${pet.id}`} className="block w-full py-3 px-4 text-center text-sm font-medium text-primary hover:bg-primary/5 border-t border-slate-100 mt-auto transition-colors">
        Manage Routine →
      </Link>
    </div>
  );
}
