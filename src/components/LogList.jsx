import { useState } from 'react';
import { deleteLog } from '../api/logs';
import LogModal from './LogModal';
import DeleteButton from './DeleteButton';

export default function LogList({ logs, petId, userId, onRefresh }) {
  const [showModal, setShowModal] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteLog(id, userId);
      onRefresh?.();
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  const sorted = [...logs].sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt));

  return (
    <div className="space-y-3">
      <button onClick={() => { setEditingLog(null); setShowModal(true); }} className="text-sm font-medium text-primary hover:text-primary-dark">
        + Add Log Entry
      </button>
      {sorted.length === 0 ? (
        <p className="text-gray-500 text-sm">No logs yet.</p>
      ) : (
        sorted.map(log => (
          <div key={log.id} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50">
            <p className="font-medium text-gray-900">{log.title}</p>
            {log.content && <p className="text-sm text-gray-600 mt-1">{log.content}</p>}
            <p className="text-xs text-gray-400 mt-2">{new Date(log.loggedAt).toLocaleString()}</p>
            <div className="flex gap-2 mt-2">
              <DeleteButton
                onClick={() => handleDelete(log.id)}
                deleting={deletingId === log.id}
                className="text-xs text-red-600 hover:underline"
              >
                {deletingId === log.id ? 'Deleting...' : 'Delete'}
              </DeleteButton>
            </div>
          </div>
        ))
      )}
      {showModal && (
        <LogModal petId={petId} userId={userId} log={editingLog} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); onRefresh?.(); }} />
      )}
    </div>
  );
}
