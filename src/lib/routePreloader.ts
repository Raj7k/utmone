/**
 * Preload utilities for route prefetching
 * Enables instant navigation by loading bundles on hover/intent
 */

// Track what's already preloaded to avoid duplicate requests
const preloadedRoutes = new Set<string>();

/**
 * Preload a route's JS bundle on hover/mouseenter
 * Uses <link rel="prefetch"> for browser-optimized loading
 */
export function preloadRoute(routeImport: () => Promise<unknown>) {
  const key = routeImport.toString();
  if (preloadedRoutes.has(key)) return;
  
  preloadedRoutes.add(key);
  
  // Trigger the dynamic import to start loading the chunk
  routeImport().catch(() => {
    // Silent fail - user will just get normal load time
    preloadedRoutes.delete(key);
  });
}

/**
 * Common route preloaders
 */
export const preloaders = {
  dashboard: () => preloadRoute(() => import("@/pages/dashboard/DashboardHome")),
  links: () => preloadRoute(() => import("@/pages/dashboard/Links")),
  analytics: () => preloadRoute(() => import("@/pages/dashboard/Analytics")),
  settings: () => preloadRoute(() => import("@/pages/Settings")),
  pricing: () => preloadRoute(() => import("@/pages/Pricing")),
  earlyAccess: () => preloadRoute(() => import("@/pages/EarlyAccess")),
  // Feature pages
  shortLinks: () => preloadRoute(() => import("@/pages/features/ShortLinks")),
  utmBuilder: () => preloadRoute(() => import("@/pages/features/UTMBuilder")),
  qrGenerator: () => preloadRoute(() => import("@/pages/features/QRGenerator")),
  attributionGraph: () => preloadRoute(() => import("@/pages/features/AttributionGraph")),
  // Product page
  product: () => preloadRoute(() => import("@/pages/Product")),
};

/**
 * Hook to preload on hover
 * Usage: <Link onMouseEnter={usePreloadOnHover('dashboard')} to="/dashboard">
 */
export function createPreloadHandler(routeKey: keyof typeof preloaders) {
  return () => {
    // Use requestIdleCallback for non-blocking preload
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => preloaders[routeKey]?.());
    } else {
      setTimeout(() => preloaders[routeKey]?.(), 100);
    }
  };
}
