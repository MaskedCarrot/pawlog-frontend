import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import DashboardPage from './pages/DashboardPage';
import PetDetailPage from './pages/PetDetailPage';
import PetFormPage from './pages/PetFormPage';
import RoutineFormPage from './pages/RoutineFormPage';
import SettingsPage from './pages/SettingsPage';
import ShareLogPage from './pages/ShareLogPage';
import ShareRoutinePage from './pages/ShareRoutinePage';
import CareSheetPage from './pages/CareSheetPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/signin" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/share/:token" element={<ShareLogPage />} />
      <Route path="/share/routine/:token" element={<ShareRoutinePage />} />
      <Route path="/share/caresheet/:token" element={<CareSheetPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>} />
      <Route path="/pets" element={<Navigate to="/dashboard" replace />} />
      <Route path="/settings" element={<ProtectedRoute><Layout><SettingsPage /></Layout></ProtectedRoute>} />
      <Route path="/pets/new" element={<ProtectedRoute><Layout><PetFormPage /></Layout></ProtectedRoute>} />
      <Route path="/pets/:id" element={<ProtectedRoute><Layout><PetDetailPage /></Layout></ProtectedRoute>} />
      <Route path="/pets/:id/edit" element={<ProtectedRoute><Layout><PetFormPage /></Layout></ProtectedRoute>} />
      <Route path="/pets/:petId/routines/new" element={<ProtectedRoute><Layout><RoutineFormPage /></Layout></ProtectedRoute>} />
      <Route path="/pets/:petId/routines/:routineId/edit" element={<ProtectedRoute><Layout><RoutineFormPage /></Layout></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
