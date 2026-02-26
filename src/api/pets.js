import { api } from './client';

export async function getPets(userId) {
  return api('GET', '/api/pets', null, userId);
}

export async function getPet(id, userId) {
  return api('GET', `/api/pets/${id}`, null, userId);
}

export async function createPet(data, userId) {
  return api('POST', '/api/pets', data, userId);
}

export async function updatePet(id, data, userId) {
  return api('PUT', `/api/pets/${id}`, data, userId);
}

export async function deletePet(id, userId) {
  return api('DELETE', `/api/pets/${id}`, null, userId);
}

export async function createCareSheetShare(petId, userId) {
  const res = await api('POST', `/api/pets/${petId}/care-sheet/share`, null, userId);
  return res.token;
}
