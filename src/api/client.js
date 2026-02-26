const API_BASE = import.meta.env.VITE_API_URL || '';

export async function api(method, path, body, userId, fetchOptions = {}) {
  if (!API_BASE && import.meta.env.PROD) {
    throw new Error('VITE_API_URL is not configured. Set it in your deployment environment.');
  }
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['X-User-Id'] = userId;

  const url = API_BASE ? `${API_BASE}${path}` : path;
  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    referrerPolicy: 'no-referrer',
    ...fetchOptions,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || err.message || `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}
