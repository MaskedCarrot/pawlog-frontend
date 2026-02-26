import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPets } from '../api/pets';
import { getRoutines } from '../api/routines';
import { createProCheckout } from '../api/polar';
import PetCard from '../components/PetCard';
import Card from '../components/Card';
import LoadingSpinner from '../components/LoadingSpinner';

function getGreeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return { text: 'Good morning', emoji: '☀' };
  if (h >= 12 && h < 17) return { text: 'Good afternoon', emoji: '☀' };
  if (h >= 17 && h < 21) return { text: 'Good evening', emoji: '🌅' };
  return { text: 'Good night', emoji: '🌙' };
}

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, isProMember, refreshUser } = useAuth();
  const [pets, setPets] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;
    refreshUser();
  }, [user?.id, refreshUser]);

  // After returning from Polar checkout, retry refresh a few times (webhook may be delayed)
  useEffect(() => {
    if (!user?.id || searchParams.get('checkout') !== 'success') return;
    setSearchParams({}, { replace: true });
    refreshUser();
    const t1 = setTimeout(() => refreshUser(), 1500);
    const t2 = setTimeout(() => refreshUser(), 3500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [user?.id, refreshUser]);

  useEffect(() => {
    if (!user?.id) return;
    getPets(user.id)
      .then(setPets)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [user?.id]);

  const [tasksByPet, setTasksByPet] = useState({});
  useEffect(() => {
    if (!user?.id || !pets.length) return;
    Promise.all(pets.map(p => getRoutines(p.id, user.id)))
      .then(results => {
        const map = {};
        pets.forEach((p, i) => {
          const routines = results[i] || [];
          const completed = routines.filter(r => r.isCompletedForCurrentPeriod).length;
          map[p.id] = { total: routines.length, completed };
        });
        setTasksByPet(map);
      })
      .catch(() => {});
  }, [user?.id, pets]);

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;
  if (error) return <div className="text-red-600">{error}</div>;

  const { text: greetingText, emoji: greetingEmoji } = getGreeting();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {greetingText}, {user?.name?.split(' ')[0] || 'there'}! {greetingEmoji}
      </h1>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-800">Your Pets</h2>
        {pets.length > 0 && (
          <Link to="/pets/new" className="text-sm font-medium text-primary hover:text-primary-dark">
            + Add New Pet
          </Link>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {pets.map(pet => (
          <PetCard key={pet.id} pet={pet} tasks={tasksByPet[pet.id]} />
        ))}
      </div>

      {pets.length === 0 && (
        <Card>
          <div className="text-center">
            <p className="text-gray-600 mb-4">No pets yet. Add your first furry friend!</p>
            <Link to="/pets/new" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark">
              Add Pet
            </Link>
          </div>
        </Card>
      )}

      {!isProMember && (
        <div className="mt-8 bg-primary/10 rounded-2xl border border-primary/20 p-6">
          <h3 className="font-semibold text-gray-900 mb-2">⭐ PawLog Pro</h3>
          <p className="text-sm text-gray-600 mb-4">
            You are on the Free Tier{pets.length >= 1 && ' (1 Pet limit reached)'}. Upgrade to add unlimited pets.
          </p>
          <button
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
            className="px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark disabled:opacity-70"
          >
            {checkoutLoading ? 'Loading...' : 'Upgrade for $4.99/mo'}
          </button>
        </div>
      )}
    </div>
  );
}
