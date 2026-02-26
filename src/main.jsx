import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import './index.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function Root() {
  if (import.meta.env.PROD && !clientId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="text-center max-w-md">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Configuration Error</h1>
          <p className="text-gray-600 text-sm">
            VITE_GOOGLE_CLIENT_ID is not set. Add it to your deployment environment (e.g. Vercel, Netlify).
          </p>
        </div>
      </div>
    );
  }
  return (
    <GoogleOAuthProvider clientId={clientId || 'no-op.apps.googleusercontent.com'}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
