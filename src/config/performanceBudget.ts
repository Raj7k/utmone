/**
 * Performance budget configuration
 * Defines thresholds for Core Web Vitals and bundle sizes
 */

export const PERFORMANCE_BUDGET = {
  // Core Web Vitals (milliseconds, except CLS)
  LCP: 2500,    // Largest Contentful Paint
  FID: 100,     // First Input Delay
  CLS: 0.1,     // Cumulative Layout Shift
  INP: 200,     // Interaction to Next Paint
  TTFB: 800,    // Time to First Byte
  FCP: 1800,    // First Contentful Paint

  // Bundle size limits (bytes)
  MAX_JS_BUNDLE: 500_000,      // 500KB
  MAX_CSS_BUNDLE: 100_000,     // 100KB
  MAX_INITIAL_LOAD: 200_000,   // 200KB for initial JS

  // Default route load time budget
  DEFAULT_ROUTE_LOAD_TIME: 1500, // 1.5s

  // Route-specific budgets (milliseconds)
  routes: {
    '/': { maxLoadTime: 1000 },
    '/dashboard': { maxLoadTime: 1500 },
    '/dashboard/links': { maxLoadTime: 1500 },
    '/dashboard/intelligence': { maxLoadTime: 2000 },
    '/dashboard/attribution': { maxLoadTime: 2000 },
    '/dashboard/qr-codes': { maxLoadTime: 1500 },
    '/settings': { maxLoadTime: 1000 },
  } as Record<string, { maxLoadTime: number }>,

  // Rating thresholds for display
  getRating(metric: 'LCP' | 'FID' | 'CLS' | 'INP' | 'TTFB' | 'FCP', value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      INP: { good: 200, poor: 500 },
      TTFB: { good: 800, poor: 1800 },
      FCP: { good: 1800, poor: 3000 },
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  },
} as const;
