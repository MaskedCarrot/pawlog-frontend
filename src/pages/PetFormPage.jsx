import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPet, createPet, updatePet } from '../api/pets';
import LoadingSpinner from '../components/LoadingSpinner';

export default function PetFormPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [form, setForm] = useState({
    name: '',
    species: 'DOG',
    breed: '',
    birthDate: '',
    notes: '',
    temperament: '',
    vetName: '',
    vetContactNumber: '',
    emergencyContactNumber: '',
    emergencyContactName: '',
    allergies: '',
  });
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit || !user?.id) return;
    getPet(id, user.id)
      .then(pet => setForm({
        name: pet.name || '',
        species: pet.species || 'DOG',
        breed: pet.breed || '',
        birthDate: pet.birthDate ? pet.birthDate.slice(0, 10) : '',
        notes: pet.notes || '',
        temperament: pet.temperament || '',
        vetName: pet.vetName || '',
        vetContactNumber: pet.vetContactNumber || '',
        emergencyContactNumber: pet.emergencyContactNumber || '',
        emergencyContactName: pet.emergencyContactName || '',
        allergies: pet.allergies || '',
      }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, isEdit, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form };
      Object.keys(payload).forEach(k => { if (payload[k] === '') payload[k] = null; });
      if (isEdit) {
        await updatePet(id, payload, user.id);
      } else {
        await createPet(payload, user.id);
      }
      navigate('/dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">{isEdit ? 'Edit Pet' : 'Add Pet'}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-xl">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Species *</label>
          <select value={form.species} onChange={e => setForm({ ...form, species: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary">
            <option value="DOG">Dog</option>
            <option value="CAT">Cat</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input type="text" value={form.breed} onChange={e => setForm({ ...form, breed: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
          <input type="date" value={form.birthDate} onChange={e => setForm({ ...form, birthDate: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Temperament / Vibe</label>
          <input type="text" value={form.temperament} onChange={e => setForm({ ...form, temperament: e.target.value })} placeholder="Friendly, active" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vet Name</label>
          <input type="text" value={form.vetName} onChange={e => setForm({ ...form, vetName: e.target.value })} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vet Contact</label>
          <input type="tel" value={form.vetContactNumber} onChange={e => setForm({ ...form, vetContactNumber: e.target.value })} placeholder="+1 555-123-4567" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
          <input type="text" value={form.emergencyContactName} onChange={e => setForm({ ...form, emergencyContactName: e.target.value })} placeholder="e.g. Mom, John" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Number</label>
          <input type="tel" value={form.emergencyContactNumber} onChange={e => setForm({ ...form, emergencyContactNumber: e.target.value })} placeholder="+1 555-987-6543" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
          <input type="text" value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} placeholder="Chicken, grains" className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary" />
        </div>

        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={saving} className="px-6 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark disabled:opacity-50">
            {saving ? 'Saving...' : (isEdit ? 'Save' : 'Add Pet')}
          </button>
          <button type="button" onClick={() => navigate(-1)} className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
