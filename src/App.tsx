/**
 * App.tsx - Two-Shell Architecture
 * 
 * MARKETING SHELL: Fast FCP, no dashboard code
 * - /, /pricing, /features/*, /solutions/*, /resources/*, /help/*, /docs/*, /tools/*, /legal/*
 * 
 * DASHBOARD SHELL: Full providers, lazy loaded
 * - /dashboard/*, /admin/*, /settings/*, /onboarding
 * 
 * PUBLIC PAGE SHELL: Lightweight for /u/:slug
 */

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ScrollToTop } from "./components/ScrollToTop";
import { SkipToContent } from "./components/SkipToContent";
import { NetworkStatus } from "./components/ui/network-status";
import { MarketingSkeleton, DashboardSkeleton } from "./components/SkeletonLoader";
import { InstallPrompt } from "./components/pwa/InstallPrompt";
import { UpdateNotification } from "./components/pwa/UpdateNotification";
import { lazyWithChunkLogging } from "./utils/chunkLogger";

// Import shells
import { MarketingShell } from "./shells/MarketingShell";
import { AuthShell } from "./shells/AuthShell";
import { PublicPageShell } from "./shells/PublicPageShell";

// LAZY LOAD entire dashboard shell and routes - this is the key performance win
const DashboardShell = lazyWithChunkLogging(
  "dashboard-shell",
  () => import("./shells/DashboardShell").then(m => ({ default: m.DashboardShell })),
);
const AppRoutes = lazyWithChunkLogging("dashboard-routes", () => import("./routes/AppRoutes"));

// Global modals - lazy loaded
const GlobalEarlyAccessModal = lazyWithChunkLogging(
  "marketing-early-access-modal",
  () => import("./components/early-access/GlobalEarlyAccessModal").then(m => ({ default: m.GlobalEarlyAccessModal })),
);

// Marketing pages - lazy loaded but in marketing bundle
const Index = lazyWithChunkLogging("marketing-index", () => import("./public/routes/Index"));
const Pricing = lazyWithChunkLogging("marketing-pricing", () => import("./public/routes/Pricing"));

// Auth pages (part of auth shell - lightweight with QueryClient)
const Auth = lazy(() => import("./pages/Auth"));
const AdminAuth = lazy(() => import("./pages/AdminAuth"));
const Signup = lazy(() => import("./pages/Signup"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const TotpVerification = lazy(() => import("./pages/auth/TotpVerification"));

// Public link page - uses PublicPageShell
const PublicLinkPage = lazy(() => import("./pages/PublicLinkPage"));

// Waitlist pages
const WaitlistPending = lazy(() => import("./pages/WaitlistPending"));
const WaitlistLocked = lazy(() => import("./pages/WaitlistLocked"));
const WaitlistStatus = lazy(() => import("./pages/WaitlistStatus"));

// Import all marketing routes
const MarketingRoutes = lazyWithChunkLogging("marketing-routes", () => import("./routes/MarketingRoutes"));

const NotFound = lazy(() => import("./pages/NotFound"));

// Marketing layout - no heavy providers
const MarketingLayout = () => (
  <MarketingShell>
    <SkipToContent />
    <ScrollToTop />
    <NetworkStatus />
    <Outlet />
    <Suspense fallback={null}>
      <GlobalEarlyAccessModal />
    </Suspense>
    <InstallPrompt />
    <UpdateNotification />
  </MarketingShell>
);

// Auth layout - lightweight with QueryClient for feature flags
const AuthLayout = () => (
  <AuthShell>
    <SkipToContent />
    <ScrollToTop />
    <NetworkStatus />
    <Outlet />
  </AuthShell>
);

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* PUBLIC LINK PAGES - Lightweight shell, no dashboard code */}
          <Route path="/u/:slug" element={
            <PublicPageShell>
              <Suspense fallback={<MarketingSkeleton />}>
                <PublicLinkPage />
              </Suspense>
            </PublicPageShell>
          } />

          {/* DASHBOARD ROUTES - Lazy loaded with full providers */}
          <Route path="/dashboard/*" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/admin/*" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/settings/*" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/onboarding" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/links/*" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/analytics" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/approval-queue" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />
          <Route path="/client-workspaces" element={
            <Suspense fallback={<DashboardSkeleton />}>
              <DashboardShell>
                <AppRoutes />
              </DashboardShell>
            </Suspense>
          } />

          {/* AUTH ROUTES - Lightweight shell with QueryClient for feature flags */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<Suspense fallback={<MarketingSkeleton />}><Auth /></Suspense>} />
            <Route path="/auth/verify-2fa" element={<Suspense fallback={<MarketingSkeleton />}><TotpVerification /></Suspense>} />
            <Route path="/mc" element={<Suspense fallback={<MarketingSkeleton />}><AdminAuth /></Suspense>} />
            <Route path="/signup" element={<Suspense fallback={<MarketingSkeleton />}><Signup /></Suspense>} />
            <Route path="/reset-password" element={<Suspense fallback={<MarketingSkeleton />}><ResetPassword /></Suspense>} />
            <Route path="/auth/callback" element={<Suspense fallback={<DashboardSkeleton />}><AuthCallback /></Suspense>} />
            <Route path="/waitlist-pending" element={<Suspense fallback={<MarketingSkeleton />}><WaitlistPending /></Suspense>} />
            <Route path="/waitlist-locked" element={<Suspense fallback={<MarketingSkeleton />}><WaitlistLocked /></Suspense>} />
            <Route path="/waitlist-status" element={<Suspense fallback={<MarketingSkeleton />}><WaitlistStatus /></Suspense>} />
          </Route>

          {/* MARKETING ROUTES - Minimal shell, fast FCP */}
          <Route element={<MarketingLayout />}>
            <Route path="/" element={<Suspense fallback={<MarketingSkeleton />}><Index /></Suspense>} />
            <Route path="/pricing" element={<Suspense fallback={<MarketingSkeleton />}><Pricing /></Suspense>} />

            {/* All other marketing routes */}
            <Route path="/*" element={
              <Suspense fallback={<MarketingSkeleton />}>
                <MarketingRoutes />
              </Suspense>
            } />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Suspense fallback={<MarketingSkeleton />}><NotFound /></Suspense>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
