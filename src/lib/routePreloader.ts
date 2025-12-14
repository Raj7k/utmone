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
 * Common route preloaders - expanded for marketing pages
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
  analyticsFeature: () => preloadRoute(() => import("@/pages/features/Analytics")),
  cleanTrack: () => preloadRoute(() => import("@/pages/features/CleanTrack")),
  eventHalo: () => preloadRoute(() => import("@/pages/features/EventHalo")),
  sentinel: () => preloadRoute(() => import("@/pages/features/Sentinel")),
  // Product page
  product: () => preloadRoute(() => import("@/pages/Product")),
  // Solution pages
  marketers: () => preloadRoute(() => import("@/pages/solutions/Marketers")),
  sales: () => preloadRoute(() => import("@/pages/solutions/Sales")),
  developers: () => preloadRoute(() => import("@/pages/solutions/Developers")),
  // Resource pages
  resources: () => preloadRoute(() => import("@/pages/Resources")),
  playbooks: () => preloadRoute(() => import("@/pages/resources/Playbooks")),
  guides: () => preloadRoute(() => import("@/pages/resources/Guides")),
};

/**
 * Hook to preload on hover - instant for fast navigation
 * Usage: <Link onMouseEnter={createPreloadHandler('dashboard')} to="/dashboard">
 */
export function createPreloadHandler(routeKey: keyof typeof preloaders) {
  return () => {
    // Trigger immediately for fastest navigation
    preloaders[routeKey]?.();
  };
}
