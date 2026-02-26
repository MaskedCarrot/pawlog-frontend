import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPets, deletePet } from '../api/pets';
import { deleteUser } from '../api/users';
import { submitFeedback } from '../api/feedback';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';
import DeleteButton from '../components/DeleteButton';

export default function SettingsPage() {
  const { user, logout, isProMember } = useAuth();
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackError, setFeedbackError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    getPets(user.id)
      .then(setPets)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user?.id]);

  const handleDelete = async (pet) => {
    if (!confirm(`Delete ${pet.name}? This will remove all routines and logs for this pet.`)) return;
    setDeletingId(pet.id);
    try {
      await deletePet(pet.id, user.id);
      setPets((prev) => prev.filter((p) => p.id !== pet.id));
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleSendFeedback = async () => {
    setFeedbackError(null);
    if (feedbackStars < 1 || feedbackStars > 5) {
      setFeedbackError('Please select a rating (1–5 stars).');
      return;
    }
    setFeedbackSending(true);
    try {
      await submitFeedback(feedbackStars, feedbackNote, user.id);
      setFeedbackSent(true);
      setFeedbackStars(0);
      setFeedbackNote('');
      setFeedbackError(null);
      setTimeout(() => setFeedbackSent(false), 2000);
    } catch (e) {
      setFeedbackError(e.message || 'Failed to send feedback. Please try again.');
    } finally {
      setFeedbackSending(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;
    setDeletingAccount(true);
    try {
      await deleteUser(user.id, user.id);
      logout();
      localStorage.clear();
      sessionStorage.clear();
      navigate('/', { replace: true });
      window.location.reload();
    } catch (e) {
      alert(e.message);
    } finally {
      setDeletingAccount(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  const listRowClass = 'flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors group';

  const formatSubscriptionDate = (epochMs) =>
    new Date(epochMs).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  const daysRemaining = (epochMs) =>
    Math.ceil((epochMs - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight mb-8">Preferences</h1>

      {isProMember && user?.proMemberUntil && (
        <Card title="Subscription">
          <div className="space-y-2">
            <p className="text-slate-900 font-medium">
              Valid until {formatSubscriptionDate(user.proMemberUntil)}
            </p>
            <p className="text-sm text-slate-500">
              {daysRemaining(user.proMemberUntil)} days remaining
            </p>
          </div>
        </Card>
      )}

      <Card title="Pets">
        <p className="text-sm text-slate-600 mb-4">
          Remove a pet and all their routines and logs. This cannot be undone.
        </p>
        {pets.length === 0 ? (
          <p className="text-sm text-slate-500">You don&apos;t have any pets yet.</p>
        ) : (
          <div className="space-y-3">
            {pets.map((pet) => (
              <div key={pet.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="font-medium text-slate-900">{pet.name}</p>
                  <p className="text-sm text-slate-500">{pet.breed || pet.species}</p>
                </div>
                <DeleteButton
                  onClick={() => handleDelete(pet)}
                  deleting={deletingId === pet.id}
                  className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {deletingId === pet.id ? (
                    <>
                      <LoadingSpinner size="sm" />
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </DeleteButton>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Help & Legal" list>
          <a href="mailto:support@pawlog.app" className={listRowClass}>
            <div>
              <p className="font-medium text-slate-900">Contact support</p>
              <p className="text-sm text-slate-500 mt-0.5">Need help? We&apos;ll get back to you.</p>
              <p className="text-sm text-slate-600 mt-1 font-mono">support@pawlog.app</p>
            </div>
            <span className="text-slate-400 group-hover:text-primary transition-colors">→</span>
          </a>
          <div className="px-6 py-4">
            <button
              type="button"
              onClick={() => { setFeedbackOpen((o) => !o); setFeedbackError(null); }}
              className="flex items-center justify-between gap-4 w-full text-left hover:opacity-80 transition-opacity group"
            >
              <div>
                <p className="font-medium text-slate-900">Send feedback</p>
                <p className="text-sm text-slate-500 mt-0.5">Rate us and leave a note.</p>
              </div>
              <span className="text-slate-400 group-hover:text-primary transition-colors">{feedbackOpen ? '−' : '→'}</span>
            </button>
            {feedbackOpen && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                {feedbackError && (
                  <p className="text-sm text-red-600">{feedbackError}</p>
                )}
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setFeedbackStars(n)}
                      className="text-2xl leading-none transition-transform hover:scale-110"
                      aria-label={`${n} star${n > 1 ? 's' : ''}`}
                    >
                      <span className={n <= feedbackStars ? 'text-amber-500' : 'text-slate-300'}>{n <= feedbackStars ? '★' : '☆'}</span>
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedbackNote}
                  onChange={(e) => setFeedbackNote(e.target.value)}
                  placeholder="Optional note..."
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleSendFeedback}
                  disabled={feedbackStars === 0 || feedbackSending}
                  className="px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {feedbackSending ? 'Sending...' : feedbackSent ? 'Thanks!' : 'Send'}
                </button>
              </div>
            )}
          </div>
          <Link to="/privacy" className={listRowClass}>
            <span className="font-medium text-slate-900">Privacy Policy</span>
            <span className="text-slate-400 group-hover:text-primary transition-colors">→</span>
          </Link>
          <Link to="/terms" className={listRowClass}>
            <span className="font-medium text-slate-900">Terms of Service</span>
            <span className="text-slate-400 group-hover:text-primary transition-colors">→</span>
          </Link>
      </Card>

      <Card title="Delete app data">
        <p className="text-sm text-slate-600 mb-4">
          Clear all local data and sign out. This will remove your session. Your data on the server (if using real login) will not be affected.
        </p>
        <button
          type="button"
          onClick={() => {
            if (confirm('Clear all app data and sign out?')) {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/';
            }
          }}
          className="px-4 py-2 text-red-600 font-medium rounded-lg hover:bg-red-50 border border-red-200 transition-colors"
        >
          Clear data & sign out
        </button>
      </Card>

      <Card title="Delete account">
        <p className="text-sm text-slate-600 mb-4">
          This action is irreversible. All your pets, routines, and logs will be permanently deleted.
        </p>
        {!deleteAccountOpen ? (
          <button
            type="button"
            onClick={() => setDeleteAccountOpen(true)}
            className="px-4 py-2 bg-red-50 text-red-700 font-medium rounded-lg hover:bg-red-100 border border-red-200 transition-colors"
          >
            Delete account
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-medium text-slate-900">Type <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">DELETE</span> to confirm:</p>
            <input
              type="text"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full max-w-xs px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deleteConfirmText !== 'DELETE' || deletingAccount}
                className="px-4 py-2 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 border border-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deletingAccount ? 'Deleting...' : 'Permanently delete my account'}
              </button>
              <button
                type="button"
                onClick={() => { setDeleteAccountOpen(false); setDeleteConfirmText(''); }}
                disabled={deletingAccount}
                className="px-4 py-2 text-slate-600 font-medium rounded-lg hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
