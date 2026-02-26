import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteRoutine } from '../api/routines';
import DeleteButton from './DeleteButton';

function getRoutineIcon(routine) {
  const type = routine.taskType || (routine.medicine ? 'MEDICINE' : routine.name?.toLowerCase().includes('walk') ? 'WALK' : 'FOOD');
  if (type === 'MEDICINE') return '💊';
  if (type === 'WALK') return '🦮';
  return '🥣';
}

export default function RoutineList({ routines, onComplete, onRefresh, onAddTask, onDeleteRoutine }) {
  const [deletingId, setDeletingId] = useState(null);
  const sorted = [...routines].sort((a, b) => (a.timeOfDay || '').localeCompare(b.timeOfDay || ''));

  const handleDelete = async (r) => {
    setDeletingId(r.id);
    try {
      await deleteRoutine(r.id);
      onRefresh?.();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  if (routines.length === 0) {
    return (
      <div>
        <p className="text-gray-500 text-sm mb-2">No routines yet.</p>
        {onAddTask && (
          <Link to={onAddTask} className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 border border-primary/20">
            + Add your first task
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map(r => (
        <div key={r.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xl flex-shrink-0">{getRoutineIcon(r)}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{r.name}</p>
              {(r.description || r.medicineInstructions) && (
                <p className="text-sm text-gray-500">{r.description || r.medicineInstructions}</p>
              )}
              {r.timeOfDay && <p className="text-xs text-gray-400">{r.timeOfDay}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <Link to={`/pets/${r.petId}/routines/${r.id}/edit`} className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
              Edit
            </Link>
            <button
              onClick={() => onComplete(r.id)}
              className={`inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${r.isCompletedForCurrentPeriod ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'}`}
            >
              {r.isCompletedForCurrentPeriod ? 'Done' : 'Complete'}
            </button>
            <DeleteButton
              onClick={() => handleDelete(r)}
              deleting={deletingId === r.id}
              className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              {deletingId === r.id ? 'Deleting...' : 'Delete'}
            </DeleteButton>
          </div>
        </div>
      ))}
    </div>
  );
}
