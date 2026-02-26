import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { createUser, getUser } from '../api/users';

const AuthContext = createContext(null);

const STORAGE_KEY = 'pawlog_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAuthError(null);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch Google profile');
        const profile = await res.json();

        const backendUser = await createUser({
          googleId: profile.sub,
          email: profile.email,
          name: profile.name,
          pictureUrl: profile.picture,
        });

        const userData = {
          id: backendUser.id,
          email: backendUser.email,
          name: backendUser.name,
          pictureUrl: backendUser.pictureUrl,
          proMemberUntil: backendUser.proMemberUntil ?? null,
        };
        setUser(userData);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('Login failed:', err);
        setAuthError(err.message || 'Sign-in failed. Check that the backend is running and CORS is configured.');
      }
    },
    onError: (err) => {
      console.error('Google login failed:', err);
      setAuthError(err.error_description || err.error || 'Google sign-in failed');
    },
    flow: 'implicit',
    scope: 'email profile openid',
  });

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const refreshUser = useCallback(async () => {
    if (!user?.id) return;
    try {
      const backendUser = await getUser(user.id);
      const userData = {
        id: backendUser.id,
        email: backendUser.email,
        name: backendUser.name,
        pictureUrl: backendUser.pictureUrl,
        proMemberUntil: backendUser.proMemberUntil ?? null,
      };
      setUser(userData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch {
      // ignore
    }
  }, [user?.id]);

  const isProMember = user?.proMemberUntil != null && user.proMemberUntil > Date.now();

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, authError, isProMember, clearAuthError: () => setAuthError(null) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
