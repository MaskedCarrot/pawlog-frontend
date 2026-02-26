import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRoutine, updateRoutine, getRoutine, deleteRoutine } from '../api/routines';
import { createProCheckout } from '../api/polar';
import { getPet } from '../api/pets';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteButton from '../components/DeleteButton';

export default function RoutineFormPage() {
  const { user, isProMember } = useAuth();
  const navigate = useNavigate();
  const { petId, routineId } = useParams();
  const isEdit = !!routineId;

  const [pet, setPet] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    taskType: 'FOOD',
    recurrenceType: 'DAILY',
    timeOfDay: '09:00',
    remindMe: false,
    remindMinutesAfter: 10,
    medicine: '',
    medicineInstructions: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!petId || !user?.id) return;
    getPet(petId, user.id).then(setPet).catch(() => {});
  }, [petId, user?.id]);

  useEffect(() => {
    if (!isEdit || !routineId) return;
    setLoading(true);
    getRoutine(routineId)
      .then((r) => {
        setForm({
          name: r.name || '',
          description: r.description || '',
          taskType: r.taskType || (r.medicine ? 'MEDICINE' : r.name?.toLowerCase().includes('walk') ? 'WALK' : 'FOOD'),
          recurrenceType: r.recurrenceType || 'DAILY',
          timeOfDay: r.timeOfDay ? r.timeOfDay.slice(0, 5) : '09:00',
          remindMe: r.remindMe ?? false,
          remindMinutesAfter: r.remindMinutesAfter ?? 10,
          medicine: r.medicine || '',
          medicineInstructions: r.medicineInstructions || '',
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [routineId, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        petId,
        name: form.name,
        description: form.description || null,
        taskType: form.taskType,
        recurrenceType: form.recurrenceType,
        timeOfDay: form.timeOfDay,
        remindMe: isProMember ? form.remindMe : false,
        remindMinutesAfter: form.remindMinutesAfter,
        medicine: form.taskType === 'MEDICINE' ? form.medicine || null : null,
        medicineInstructions: form.taskType === 'MEDICINE' ? form.medicineInstructions || null : null,
      };
      if (isEdit) {
        await updateRoutine(routineId, payload);
      } else {
        await createRoutine(payload, user.id);
      }
      navigate(`/pets/${petId}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteRoutine(routineId);
      navigate(`/pets/${petId}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <div className="mb-6">
        <Link to={`/pets/${petId}`} className="text-sm text-gray-500 hover:text-gray-700">← Back to {pet?.name || 'pet'}</Link>
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{isEdit ? 'Edit Task' : 'Add Task'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Task type</label>
          <select value={form.taskType} onChange={(e) => setForm({ ...form, taskType: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <option value="FOOD">🥣 Food</option>
            <option value="WALK">🦮 Walk</option>
            <option value="MEDICINE">💊 Medicine</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Morning walk" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. 30 min walk" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
            <input type="time" value={form.timeOfDay} onChange={(e) => setForm({ ...form, timeOfDay: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recurrence</label>
            <select value={form.recurrenceType} onChange={(e) => setForm({ ...form, recurrenceType: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="CUSTOM">Custom</option>
            </select>
          </div>
        </div>
        {form.taskType === 'MEDICINE' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine *</label>
              <input type="text" required value={form.medicine} onChange={(e) => setForm({ ...form, medicine: e.target.value })} placeholder="e.g. Heartworm pill" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine instructions</label>
              <input type="text" value={form.medicineInstructions} onChange={(e) => setForm({ ...form, medicineInstructions: e.target.value })} placeholder="e.g. Hide in cheese" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            </div>
          </>
        )}
        <div className={`rounded-xl border-2 p-4 transition-colors ${!isProMember ? 'border-amber-200/60 bg-amber-50/30' : form.remindMe ? 'border-primary/30 bg-primary/5' : 'border-gray-100 bg-gray-50/50'}`}>
          {isProMember ? (
            <>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={form.remindMe}
                  onChange={(e) => setForm({ ...form, remindMe: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/50"
                />
                <div>
                  <span className="font-medium text-gray-900">Email reminder if task is missed</span>
                  <p className="text-sm text-gray-500 mt-0.5">Get an email when the task isn&apos;t completed on time</p>
                </div>
              </label>
              {form.remindMe && (
                <div className="mt-4 pt-4 border-t border-gray-200/80 space-y-2">
                  <p className="text-sm text-gray-700">Send reminder if not completed within</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <select
                      value={form.remindMinutesAfter}
                      onChange={(e) => setForm({ ...form, remindMinutesAfter: parseInt(e.target.value) })}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    >
                      {[5, 10, 15, 20, 30, 45, 60].map((m) => (
                        <option key={m} value={m}>{m} minutes</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-500">of the scheduled time</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-1 text-amber-600" aria-hidden>🔒</span>
                <div>
                  <span className="font-medium text-gray-900">Email reminder if task is missed</span>
                  <p className="text-sm text-gray-500 mt-0.5">Get an email when the task isn&apos;t completed on time</p>
                  <p className="text-sm font-medium text-amber-700 mt-2">Pro feature — Upgrade to unlock</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setCheckoutLoading(true);
                  try {
                    const { url } = await createProCheckout(user.id);
                    if (url) window.location.href = url;
                  } catch (e) {
                    console.error(e);
                  } finally {
                    setCheckoutLoading(false);
                  }
                }}
                disabled={checkoutLoading}
                className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark disabled:opacity-70 shrink-0"
              >
                {checkoutLoading ? 'Loading...' : 'Upgrade for $4.99/mo'}
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-3 pt-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark disabled:opacity-50">
            {saving ? 'Saving...' : (isEdit ? 'Save' : 'Add Task')}
          </button>
          <Link to={`/pets/${petId}`} className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
            Cancel
          </Link>
          {isEdit && (
            <DeleteButton
              onClick={handleDelete}
              deleting={deleting}
              className="px-6 py-2 text-red-600 font-medium rounded-xl hover:bg-red-50 disabled:opacity-50 ml-auto"
            >
              {deleting ? 'Deleting...' : 'Delete task'}
            </DeleteButton>
          )}
        </div>
      </form>
    </div>
  );
}
