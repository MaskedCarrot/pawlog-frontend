import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCareSheet } from '../api/caresheet';
import { completeSharedRoutine } from '../api/routines';
import EmergencyBar from '../components/EmergencyBar';
import AppFooter from '../components/AppFooter';
import SharePageHeader from '../components/SharePageHeader';
import LoadingSpinner from '../components/LoadingSpinner';

function getRoutineIcon(r) {
  const type = r.taskType || (r.medicine ? 'MEDICINE' : r.name?.toLowerCase().includes('walk') ? 'WALK' : 'FOOD');
  if (type === 'MEDICINE') return '💊';
  if (type === 'WALK') return '🦮';
  if (type === 'MISC') return '📋';
  return '🥣';
}

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

export default function CareSheetPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getCareSheet(token)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleComplete = async (routineShareToken) => {
    try {
      const updated = await completeSharedRoutine(routineShareToken);
      setData((prev) => ({
        ...prev,
        routines: prev.routines.map((r) =>
          r.shareToken === routineShareToken
            ? { ...r, lastCompletedAt: updated.lastCompletedAt, isCompletedForCurrentPeriod: true }
            : r
        ),
      }));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SharePageHeader />
        <div className="flex items-center justify-center min-h-[50vh]"><LoadingSpinner size="lg" /></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SharePageHeader />
        <div className="flex items-center justify-center min-h-[50vh]"><div className="text-red-600">{error}</div></div>
      </div>
    );
  }
  if (!data) return null;

  const age = getAgeYears(data.birthDate);
  const speciesLabel = data.species ? (data.species === 'CAT' ? 'Cat' : 'Dog') : null;
  const subtitleParts = [data.breed?.trim(), speciesLabel, age != null ? `${age} yr${age !== 1 ? 's' : ''}` : null].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <SharePageHeader />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl flex-shrink-0">
              {(data.species || 'DOG') === 'CAT' ? '🐈' : '🐕'}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-semibold text-gray-900">Daily care for {data.petName}</h1>
              {subtitleParts.length > 0 && <p className="text-gray-500 mt-1">{subtitleParts.join(' • ')}</p>}
              {data.allergies && (
                <p className="text-sm text-amber-700 mt-1">⚠️ Allergies: {data.allergies}</p>
              )}
            </div>
          </div>

          {(data.vetContactNumber || data.emergencyContactNumber) && (
            <div className="px-6 pt-4">
              <EmergencyBar
                vetName={data.vetName}
                vetContact={data.vetContactNumber}
                emergencyContactNumber={data.emergencyContactNumber}
                emergencyContactName={data.emergencyContactName}
              />
            </div>
          )}

          <div className="p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Daily Routine</h2>
            {data.routines.length === 0 ? (
              <p className="text-gray-500 text-sm">No routines yet.</p>
            ) : (
              <div className="space-y-3">
                {data.routines.map((r) => (
                  <div
                    key={r.shareToken}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50/50"
                  >
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
                      <button
                        onClick={() => handleComplete(r.shareToken)}
                        className={`inline-flex items-center justify-center min-h-[36px] px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap ${r.isCompletedForCurrentPeriod ? 'bg-primary/20 text-primary' : 'bg-gray-100 text-gray-600 hover:bg-primary/10 hover:text-primary'}`}
                      >
                        {r.isCompletedForCurrentPeriod ? 'Done' : 'Complete'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-8 p-4 bg-primary/10 rounded-2xl text-center">
          <p className="text-sm text-gray-700 mb-2">Want a dashboard for your pets? Join PawLog.</p>
          <Link to="/signin" className="text-primary font-medium hover:underline">Create free account</Link>
        </div>
      </div>
      <footer className="mt-12 border-t border-gray-200">
        <AppFooter variant="compact" />
      </footer>
    </div>
  );
}
