/**
 * utm.one tracking utility for revenue attribution and cross-device identity
 * 
 * Usage:
 * - trackRevenue(planTier, price) - Call after successful plan upgrade
 * - identifyUser(email, name) - Call after login/signup for cross-device tracking
 */

declare global {
  interface Window {
    utmone?: (
      action: 'track' | 'identify',
      eventOrEmail: string,
      dataOrName?: Record<string, unknown> | string
    ) => void;
  }
}

/**
 * Track revenue event (plan upgrades, purchases)
 */
export function trackRevenue(planTier: string, price: number, currency = 'USD') {
  if (typeof window !== 'undefined' && window.utmone && price > 0) {
    window.utmone('track', 'purchase', { 
      revenue: price,
      plan: planTier,
      currency,
    });
    console.log('[utm.one] Revenue tracked:', { plan: planTier, revenue: price });
  }
}

/**
 * Identify user for cross-device attribution (100% accuracy)
 */
export function identifyUser(email: string, name?: string) {
  if (typeof window !== 'undefined' && window.utmone && email) {
    window.utmone('identify', email, name || '');
    console.log('[utm.one] User identified:', email);
  }
}
