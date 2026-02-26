import { api } from './client';

/**
 * Create a Polar checkout session for Pro upgrade.
 * Returns { url } to redirect the user to Polar checkout.
 */
export async function createProCheckout(userId) {
  const successUrl = `${window.location.origin}/dashboard?checkout=success`;
  const returnUrl = `${window.location.origin}/dashboard`;
  return api(
    'POST',
    `/api/polar/checkout?successUrl=${encodeURIComponent(successUrl)}&returnUrl=${encodeURIComponent(returnUrl)}`,
    null,
    userId
  );
}
