import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createRoutine, updateRoutine } from '../api/routines';
import { createProCheckout } from '../api/polar';
import { useAuth } from '../context/AuthContext';

export default function RoutineModal({ petId, petName, userId: propUserId, routine, onClose, onSaved }) {
  const { user, isProMember } = useAuth();
  const userId = propUserId ?? user?.id;
  const isEdit = !!routine;

  const [form, setForm] = useState({
    name: '',
    description: '',
    recurrenceType: 'DAILY',
    timeOfDay: '09:00',
    remindMe: false,
    medicine: '',
    medicineInstructions: '',
  });
  const [saving, setSaving] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (routine) {
      setForm({
        name: routine.name || '',
        description: routine.description || '',
        recurrenceType: routine.recurrenceType || 'DAILY',
        timeOfDay: routine.timeOfDay ? routine.timeOfDay.slice(0, 5) : '09:00',
        remindMe: routine.remindMe ?? false,
        medicine: routine.medicine || '',
        medicineInstructions: routine.medicineInstructions || '',
      });
    }
  }, [routine]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        petId,
        name: form.name,
        description: form.description || null,
        recurrenceType: form.recurrenceType,
        timeOfDay: form.timeOfDay,
        remindMe: isProMember ? form.remindMe : false,
        medicine: form.medicine || null,
        medicineInstructions: form.medicineInstructions || null,
      };
      if (isEdit) {
        await updateRoutine(routine.id, payload);
      } else {
        await createRoutine(payload, userId);
      }
      onSaved?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{isEdit ? 'Edit Task' : 'Add Task'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning walk" className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="e.g. 30 min walk" className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input type="time" value={form.timeOfDay} onChange={e => setForm({ ...form, timeOfDay: e.target.value })} className="input-time" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
              <select value={form.recurrenceType} onChange={e => setForm({ ...form, recurrenceType: e.target.value })} className="input-select">
                <option value="DAILY">Daily</option>
                <option value="WEEKLY">Weekly</option>
                <option value="CUSTOM">Does not repeat</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine (optional)</label>
            <input type="text" value={form.medicine} onChange={e => setForm({ ...form, medicine: e.target.value })} placeholder="e.g. Heartworm pill" className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Medicine instructions</label>
            <input type="text" value={form.medicineInstructions} onChange={e => setForm({ ...form, medicineInstructions: e.target.value })} placeholder="e.g. Hide in cheese" className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          {isProMember ? (
            <label className="flex cursor-pointer items-start gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={form.remindMe}
                onChange={e => setForm({ ...form, remindMe: e.target.checked })}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50"
              />
              <div>
                <span className="font-medium text-gray-900">Email reminder if task is missed</span>
                <p className="text-xs text-gray-500 mt-0.5">Get an email when the task is overdue</p>
              </div>
            </label>
          ) : (
            <div className="flex flex-col gap-3 p-3 rounded-xl border border-amber-200/60 bg-amber-50/30">
              <div className="flex items-start gap-3">
                <span className="text-amber-600" aria-hidden>🔒</span>
                <div>
                  <span className="font-medium text-gray-900">Email reminder if task is missed</span>
                  <p className="text-xs text-gray-500 mt-0.5">Get an email when the task is overdue</p>
                  <p className="text-xs font-medium text-amber-700 mt-1">Pro feature — Upgrade to unlock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setCheckoutLoading(true);
                  try {
                    const { url } = await createProCheckout(userId);
                    if (url) window.location.href = url;
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
                disabled={checkoutLoading}
                className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark disabled:opacity-70 text-sm"
              >
                {checkoutLoading ? 'Loading...' : 'Upgrade for $4.99/mo'}
              </button>
            </div>
          )}
          <div className="flex gap-3 pt-4">
            <button type="submit" disabled={saving} className="px-4 py-2 bg-primary text-white font-medium rounded-xl disabled:opacity-50">
              {saving ? 'Saving...' : (isEdit ? 'Save' : 'Add')}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-200 rounded-xl text-gray-700">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const container = typeof document !== 'undefined' ? document.body : null;
  if (!container) return null;
  return createPortal(modalContent, container);
}
