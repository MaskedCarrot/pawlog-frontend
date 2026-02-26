import { useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteRoutine } from '../api/routines';
import DeleteButton from './DeleteButton';

function getRoutineIcon(routine) {
  const type = routine.taskType || (routine.medicine ? 'MEDICINE' : routine.name?.toLowerCase().includes('walk') ? 'WALK' : 'FOOD');
  if (type === 'MEDICINE') return '💊';
  if (type === 'WALK') return '🦮';
  if (type === 'MISC') return '📋';
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
      <div className="text-center py-8">
        <p className="text-slate-500 mb-4">No tasks yet. Add your first routine to get started.</p>
        {onAddTask && (
          <Link to={onAddTask} className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-sm">
            + Add your first task
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {sorted.map(r => (
        <div
          key={r.id}
          className={`flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-lg transition-colors ${
            r.isCompletedForCurrentPeriod
              ? 'bg-emerald-50/60 border border-emerald-100/80'
              : 'bg-slate-50/80 border border-slate-100 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${
              r.isCompletedForCurrentPeriod ? 'bg-emerald-100' : 'bg-white border border-slate-200/60'
            }`}>
              {getRoutineIcon(r)}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`font-medium ${r.isCompletedForCurrentPeriod ? 'text-slate-600 line-through' : 'text-slate-900'}`}>
                {r.name}
              </p>
              {(r.description || r.medicineInstructions) && (
                <p className="text-sm text-slate-500 truncate">{r.description || r.medicineInstructions}</p>
              )}
              {r.timeOfDay && (
                <p className="text-xs text-slate-400 mt-0.5">{r.timeOfDay}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            {!r.isCompletedForCurrentPeriod && (
              <Link to={`/pets/${r.petId}/routines/${r.id}/edit`} className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                Edit
              </Link>
            )}
            <button
              type="button"
              onClick={() => !r.isCompletedForCurrentPeriod && onComplete(r.id)}
              disabled={r.isCompletedForCurrentPeriod}
              className={`inline-flex items-center justify-center min-h-[36px] px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors disabled:opacity-70 disabled:cursor-default ${
                r.isCompletedForCurrentPeriod
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-primary text-white hover:bg-primary-dark'
              }`}
            >
              {r.isCompletedForCurrentPeriod ? '✓ Done' : 'Complete'}
            </button>
            {!r.isCompletedForCurrentPeriod && (
              <DeleteButton
                onClick={() => handleDelete(r)}
                deleting={deletingId === r.id}
                className="inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                {deletingId === r.id ? 'Deleting...' : 'Delete'}
              </DeleteButton>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
