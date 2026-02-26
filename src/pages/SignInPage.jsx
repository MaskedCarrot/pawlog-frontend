import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppFooter from '../components/AppFooter';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const { user, loading, login, loginInProgress, authError, clearAuthError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const hasGoogleClientId = !!import.meta.env.VITE_GOOGLE_CLIENT_ID;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="border-b border-slate-100">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-center">
          <Link to="/" className="flex items-center gap-2 text-slate-900 hover:text-primary transition-colors">
            <span className="text-2xl">🐾</span>
            <span className="text-lg font-semibold tracking-tight">PawLog</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-10">
            <h1 className="text-xl font-semibold text-slate-900 tracking-tight mb-1">Sign in</h1>
            <p className="text-sm text-slate-500">Pet care routines, care sheets & peace of mind.</p>
          </div>

          <div className="space-y-3">
            {!hasGoogleClientId && (
              <p className="text-amber-600 text-xs text-center mb-2">Configure VITE_GOOGLE_CLIENT_ID in .env</p>
            )}
            {authError && (
              <div
                className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2"
                role="alert"
              >
                <span className="flex-1">{authError}</span>
                <button type="button" onClick={clearAuthError} className="text-red-500 hover:text-red-700 shrink-0" aria-label="Dismiss">
                  ×
                </button>
              </div>
            )}
            <button
              onClick={() => login()}
              disabled={loginInProgress}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loginInProgress ? (
                <>
                  <LoadingSpinner size="sm" />
                  Signing in…
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
          </div>

          {!hasGoogleClientId && (
            <p className="text-xs text-gray-400 mt-4 text-center">Add your Google OAuth client ID to enable sign-in</p>
          )}
        </div>

        <div className="w-full max-w-md mt-12 pt-8 border-t border-slate-100">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider text-center mb-4">What pet parents say</p>
          <div className="space-y-4">
            <p className="text-sm text-slate-600 text-center italic">&ldquo;One link and my sitter had everything — routines, vet info, allergies. So easy.&rdquo;</p>
            <p className="text-sm text-slate-600 text-center italic">&ldquo;Finally stopped forgetting my dog&apos;s medicine. The reminders are a lifesaver.&rdquo;</p>
          </div>
        </div>
      </div>

      <footer className="border-t border-slate-100">
        <AppFooter variant="compact" />
      </footer>
    </div>
  );
}
