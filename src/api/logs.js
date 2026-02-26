import { api } from './client';

export async function getLogs(petId, userId) {
  return api('GET', `/api/logs?petId=${petId}`, null, userId);
}

export async function getLog(id) {
  return api('GET', `/api/logs/${id}`);
}

export async function createLog(data, userId) {
  return api('POST', '/api/logs', data, userId);
}

export async function updateLog(id, data, userId) {
  return api('PUT', `/api/logs/${id}`, data, userId);
}

export async function deleteLog(id, userId) {
  return api('DELETE', `/api/logs/${id}`, null, userId);
}

export async function shareLog(id, userId) {
  return api('POST', `/api/logs/${id}/share`, null, userId);
}

export async function getSharedLog(token) {
  return api('GET', `/api/share/${token}`);
}
