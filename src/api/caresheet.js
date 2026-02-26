import { api } from './client';

/** Public endpoint - no auth. Disable cache so completed tasks show correctly on refresh. */
export async function getCareSheet(token) {
  return api('GET', `/api/share/caresheet/${token}`, null, null, { cache: 'no-store' });
}
