import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPet, createCareSheetShare } from '../api/pets';
import { getRoutines, completeRoutine } from '../api/routines';
import { getLogs } from '../api/logs';
import EmergencyBar from '../components/EmergencyBar';
import RoutineList from '../components/RoutineList';
import LogList from '../components/LogList';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PetDetailPage() {
  const { user } = useAuth();
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    if (!user?.id || !id) return;
    Promise.all([
      getPet(id, user.id),
      getRoutines(id, user.id),
      getLogs(id, user.id),
    ])
      .then(([p, r, l]) => {
        setPet(p);
        setRoutines(r);
        setLogs(l);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id, id]);

  const handleCompleteRoutine = async (routineId) => {
    try {
      const updated = await completeRoutine(routineId);
      setRoutines(prev => prev.map(r => r.id === routineId ? updated : r));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyCareSheet = async () => {
    setCopying(true);
    try {
      const token = await createCareSheetShare(id, user.id);
      const url = `${window.location.origin}/share/caresheet/${token}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
      setTimeout(() => setShareUrl(null), 3000);
    } catch (e) {
      console.error(e);
    } finally {
      setCopying(false);
    }
  };

  const refreshRoutines = () => {
    if (user?.id && id) getRoutines(id, user.id).then(setRoutines);
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!pet) return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{pet.name}&apos;s Profile</h1>
          <p className="text-gray-500">{pet.breed || pet.species} {pet.birthDate && `• ${new Date().getFullYear() - new Date(pet.birthDate).getFullYear()} yrs`}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:flex-shrink-0">
          <Link to={`/pets/${id}/edit`} className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
            Edit Pet
          </Link>
          <button onClick={handleCopyCareSheet} disabled={copying} className="inline-flex items-center justify-center min-h-[44px] px-4 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-dark gap-2 disabled:opacity-70">
            {copying && <LoadingSpinner size="sm" />}
            {copying ? 'Copying...' : (shareUrl ? 'Copied!' : 'Copy Care Sheet')}
          </button>
        </div>
      </div>

      {(pet.vetContactNumber || pet.emergencyContactNumber) && (
        <EmergencyBar
          vetName={pet.vetName}
          vetContact={pet.vetContactNumber}
          emergencyContactNumber={pet.emergencyContactNumber}
          emergencyContactName={pet.emergencyContactName}
        />
      )}

      <Card title="Daily Routine">
        {routines.length > 0 && (
          <div className="flex justify-end mb-4">
            <Link to={`/pets/${id}/routines/new`} className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 border border-primary/20 min-h-[44px]">
              + Add Task
            </Link>
          </div>
        )}
        <RoutineList routines={routines} onComplete={handleCompleteRoutine} onRefresh={refreshRoutines} onAddTask={`/pets/${id}/routines/new`} onDeleteRoutine={refreshRoutines} />
      </Card>

      <Card title="Logs">
        <LogList logs={logs} petId={id} userId={user.id} onRefresh={() => getLogs(id, user.id).then(setLogs)} />
      </Card>
    </div>
  );
}
