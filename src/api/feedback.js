import { api } from './client';

export async function submitFeedback(rating, note, userId) {
  if (!rating || rating < 1 || rating > 5) {
    throw new Error('Please select a rating between 1 and 5 stars.');
  }
  return api('POST', '/api/feedback', { rating, note: note || null }, userId);
}
