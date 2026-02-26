import { useState, useEffect } from 'react';
import { createLog, updateLog } from '../api/logs';

export default function LogModal({ petId, userId, log, onClose, onSaved }) {
  const isEdit = !!log;
  const [form, setForm] = useState({ title: '', content: '', loggedAt: new Date().toISOString().slice(0, 16) });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (log) {
      setForm({
        title: log.title || '',
        content: log.content || '',
        loggedAt: log.loggedAt ? log.loggedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
      });
    }
  }, [log]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        petId,
        title: form.title,
        content: form.content || null,
        loggedAt: new Date(form.loggedAt).toISOString(),
      };
      if (isEdit) {
        await updateLog(log.id, payload, userId);
      } else {
        await createLog(payload, userId);
      }
      onSaved?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{isEdit ? 'Edit Log' : 'Add Log'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-700 rounded-xl text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
            <input type="datetime-local" value={form.loggedAt} onChange={e => setForm({ ...form, loggedAt: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl" />
          </div>
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
}
