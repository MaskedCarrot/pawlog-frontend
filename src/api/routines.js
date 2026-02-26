import { api } from './client';

export async function getRoutines(petId, userId) {
  return api('GET', `/api/routines?petId=${petId}`, null, userId);
}

export async function getRoutine(id) {
  return api('GET', `/api/routines/${id}`);
}

const backendRoutineFields = ['petId', 'name', 'description', 'recurrenceType', 'timeOfDay', 'remindMe', 'medicine', 'medicineInstructions'];

function toBackendPayload(data) {
  const out = {};
  backendRoutineFields.forEach((k) => { if (data[k] !== undefined) out[k] = data[k]; });
  return out;
}

export async function createRoutine(data, userId) {
  return api('POST', '/api/routines', toBackendPayload(data), userId);
}

export async function updateRoutine(id, data) {
  return api('PUT', `/api/routines/${id}`, toBackendPayload(data));
}

export async function deleteRoutine(id) {
  return api('DELETE', `/api/routines/${id}`);
}

export async function completeRoutine(id) {
  return api('POST', `/api/routines/${id}/complete`);
}

export async function shareRoutine(id) {
  return api('POST', `/api/routines/${id}/share`);
}

export async function getSharedRoutine(token) {
  return api('GET', `/api/share/routine/${token}`);
}

export async function completeSharedRoutine(token) {
  return api('POST', `/api/share/routine/${token}/complete`);
}
