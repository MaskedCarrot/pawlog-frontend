import { api } from './client';

export async function createUser(data) {
  return api('POST', '/api/createUser', data);
}

export async function getUser(id) {
  return api('GET', `/api/users/${id}`);
}

export async function deleteUser(id, userId) {
  return api('DELETE', `/api/users/${id}`, null, userId);
}
