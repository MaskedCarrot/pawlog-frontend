import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedLog } from '../api/logs';
import SharePageHeader from '../components/SharePageHeader';
import AppFooter from '../components/AppFooter';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ShareLogPage() {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getSharedLog(token)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <SharePageHeader />
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">{data.title}</h1>
          <p className="text-sm text-gray-500 mb-4">{data.petName} • {new Date(data.loggedAt).toLocaleDateString()}</p>
          {data.content && <p className="text-gray-700 whitespace-pre-wrap">{data.content}</p>}
        </div>
        <div className="mt-8 p-4 bg-primary/10 rounded-2xl text-center">
          <p className="text-sm text-gray-700 mb-2">Want a dashboard for your pets?</p>
          <Link to="/signin" className="text-primary font-medium hover:underline">Create free account on PawLog</Link>
        </div>
      </div>
      <footer className="mt-12 border-t border-gray-200">
        <AppFooter variant="compact" />
      </footer>
    </div>
  );
}
