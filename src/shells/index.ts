/**
 * Route Shells - Separated provider trees for performance
 * 
 * Architecture:
 * - MarketingShell: Minimal providers for fast FCP on marketing pages
 * - DashboardShell: Full providers for authenticated app routes
 * - PublicPageShell: Lightweight QueryClient for public pages like /u/:slug
 */

export { MarketingShell } from './MarketingShell';
export { DashboardShell, AdminShell } from './DashboardShell';
export { PublicPageShell } from './PublicPageShell';
