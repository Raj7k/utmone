/**
 * AppRoutes - All authenticated app routes (dashboard, admin, settings)
 * 
 * IMPORTANT: This file is LAZY LOADED from App.tsx
 * It should never be imported by marketing routes.
 */

import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { LinkIdRedirect } from "@/components/redirects/LinkIdRedirect";

// Dashboard pages
const DashboardHome = React.lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardLinks = React.lazy(() => import("@/pages/dashboard/Links"));
const DashboardAnalytics = React.lazy(() => import("@/pages/dashboard/Analytics"));
const DashboardQRCodes = React.lazy(() => import("@/pages/dashboard/QRCodes"));
const DashboardLinkPages = React.lazy(() => import("@/pages/dashboard/LinkPages"));
const DashboardLinkPageBuilder = React.lazy(() => import("@/pages/dashboard/LinkPageBuilder"));
const DashboardLinkPageCreate = React.lazy(() => import("@/pages/dashboard/LinkPageCreate"));
const Targeting = React.lazy(() => import("@/pages/dashboard/Targeting"));
const BulkCreate = React.lazy(() => import("@/pages/dashboard/BulkCreate"));
const CacheMonitoring = React.lazy(() => import("@/pages/dashboard/CacheMonitoring"));
const AnalyticsPerformance = React.lazy(() => import("@/pages/dashboard/AnalyticsPerformance"));
const LinkHealth = React.lazy(() => import("@/pages/dashboard/LinkHealth"));
const Experiments = React.lazy(() => import("@/pages/dashboard/Experiments"));
const Attribution = React.lazy(() => import("@/pages/dashboard/Attribution"));
const RobustAttribution = React.lazy(() => import("@/pages/RobustAttribution"));
const DashboardSales = React.lazy(() => import("@/pages/dashboard/Sales"));
const DashboardEvents = React.lazy(() => import("@/pages/dashboard/Events"));
const Intelligence = React.lazy(() => import("@/pages/dashboard/Intelligence"));
const OneLinkValidator = React.lazy(() => import("@/pages/dashboard/OneLinkValidator"));
const LinkDetail = React.lazy(() => import("@/pages/LinkDetail"));
const Campaigns = React.lazy(() => import("@/pages/dashboard/Campaigns"));
const CampaignDetails = React.lazy(() => import("@/pages/dashboard/CampaignDetails"));

// Onboarding
const OnboardingWizard = React.lazy(() => import("@/pages/OnboardingWizard"));
const TotpVerification = React.lazy(() => import("@/pages/auth/TotpVerification"));

// Admin pages
const AdminDashboard = React.lazy(() => import("@/pages/admin/Dashboard"));
const WaitlistManagement = React.lazy(() => import("@/pages/admin/WaitlistManagement"));
const UserManagement = React.lazy(() => import("@/pages/admin/UserManagement"));
const LandingManagement = React.lazy(() => import("@/pages/admin/LandingManagement"));
const ProductAnalytics = React.lazy(() => import("@/pages/admin/ProductAnalytics"));
const SystemMonitoring = React.lazy(() => import("@/pages/admin/SystemMonitoring"));
const FeatureFlags = React.lazy(() => import("@/pages/admin/FeatureFlags"));
const FlagDetails = React.lazy(() => import("@/pages/admin/FlagDetails"));
const PartnersManagement = React.lazy(() => import("@/pages/admin/PartnersManagement"));
const SystemTests = React.lazy(() => import("@/pages/admin/SystemTests"));
const MFAVerify = React.lazy(() => import("@/pages/admin/MFAVerify"));
const AdminSecurity = React.lazy(() => import("@/pages/admin/AdminSecurity"));
const SubscriptionManagement = React.lazy(() => import("@/pages/admin/SubscriptionManagement"));
const FeedbackManagement = React.lazy(() => import("@/pages/admin/FeedbackManagement"));
const RoadmapManagement = React.lazy(() => import("@/pages/admin/RoadmapManagement"));
const VerificationRequests = React.lazy(() => import("@/pages/admin/VerificationRequests"));

// Settings
const Settings = React.lazy(() => import("@/pages/Settings"));
const Backup = React.lazy(() => import("@/pages/Settings/Backup"));
const DeveloperSettings = React.lazy(() => import("@/pages/DeveloperSettings"));
const ApprovalQueue = React.lazy(() => import("@/pages/ApprovalQueue"));
const IntegrationsSettings = React.lazy(() => import("@/pages/Settings/Integrations"));
const GTMSettings = React.lazy(() => import("@/pages/integrations/GTMSettings"));

// Partner dashboard
const PartnerDashboard = React.lazy(() => import("@/pages/Partners/Dashboard"));
const ClientWorkspaces = React.lazy(() => import("@/pages/ClientWorkspaces"));

// Helper component for dashboard routes
const DashboardPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardSkeleton />}>
    <DashboardLayout>
      {children}
    </DashboardLayout>
  </Suspense>
);

// Helper component for admin routes
const AdminPage = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardSkeleton />}>
    <AdminLayout>
      {children}
    </AdminLayout>
  </Suspense>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardPage><DashboardHome /></DashboardPage>} />
      <Route path="/dashboard/link-pages" element={<DashboardPage><DashboardLinkPages /></DashboardPage>} />
      <Route path="/dashboard/link-pages/new" element={<DashboardPage><DashboardLinkPageCreate /></DashboardPage>} />
      <Route path="/dashboard/link-pages/:pageId" element={<DashboardPage><DashboardLinkPageBuilder /></DashboardPage>} />
      <Route path="/dashboard/links" element={<DashboardPage><DashboardLinks /></DashboardPage>} />
      <Route path="/dashboard/links/:linkId" element={<DashboardPage><LinkDetail /></DashboardPage>} />
      <Route path="/dashboard/links/create" element={<Navigate to="/dashboard/links" replace />} />
      <Route path="/dashboard/analytics" element={<DashboardPage><DashboardAnalytics /></DashboardPage>} />
      <Route path="/dashboard/qr-codes" element={<DashboardPage><DashboardQRCodes /></DashboardPage>} />
      <Route path="/dashboard/brickmatrix" element={<Navigate to="/dashboard/qr-codes?tab=brick-builder" replace />} />
      <Route path="/dashboard/targeting" element={<DashboardPage><Targeting /></DashboardPage>} />
      <Route path="/dashboard/targeting/:linkId" element={<DashboardPage><Targeting /></DashboardPage>} />
      <Route path="/dashboard/bulk-create" element={<DashboardPage><BulkCreate /></DashboardPage>} />
      <Route path="/dashboard/onelink-validator" element={<DashboardPage><OneLinkValidator /></DashboardPage>} />
      <Route path="/dashboard/campaigns" element={<DashboardPage><Campaigns /></DashboardPage>} />
      <Route path="/dashboard/campaigns/:id" element={<DashboardPage><CampaignDetails /></DashboardPage>} />
      <Route path="/dashboard/cache-monitoring" element={<DashboardPage><CacheMonitoring /></DashboardPage>} />
      <Route path="/dashboard/analytics-performance" element={<DashboardPage><AnalyticsPerformance /></DashboardPage>} />
      <Route path="/dashboard/link-health" element={<DashboardPage><LinkHealth /></DashboardPage>} />
      <Route path="/dashboard/experiments" element={<DashboardPage><Experiments /></DashboardPage>} />
      <Route path="/dashboard/attribution" element={<DashboardPage><Attribution /></DashboardPage>} />
      <Route path="/dashboard/robust-attribution" element={<DashboardPage><RobustAttribution /></DashboardPage>} />
      <Route path="/dashboard/sales" element={<DashboardPage><DashboardSales /></DashboardPage>} />
      <Route path="/dashboard/event-halo" element={<DashboardPage><DashboardEvents /></DashboardPage>} />
      <Route path="/dashboard/events" element={<Navigate to="/dashboard/event-halo" replace />} />
      <Route path="/dashboard/intelligence" element={<DashboardPage><Intelligence /></DashboardPage>} />

      {/* Onboarding */}
      <Route path="/onboarding" element={<Suspense fallback={<DashboardSkeleton />}><OnboardingWizard /></Suspense>} />

      {/* Link redirects */}
      <Route path="/links" element={<Navigate to="/dashboard/links" replace />} />
      <Route path="/links/:linkId" element={<LinkIdRedirect />} />
      <Route path="/analytics" element={<Navigate to="/dashboard/intelligence" replace />} />

      {/* 2FA */}
      <Route path="/auth/verify-2fa" element={<Suspense fallback={<DashboardSkeleton />}><TotpVerification /></Suspense>} />

      {/* Admin Routes */}
      <Route path="/admin/mfa-verify" element={<Suspense fallback={<DashboardSkeleton />}><MFAVerify /></Suspense>} />
      <Route path="/admin" element={<AdminPage><AdminDashboard /></AdminPage>} />
      <Route path="/admin/waitlist" element={<AdminPage><WaitlistManagement /></AdminPage>} />
      <Route path="/admin/users" element={<AdminPage><UserManagement /></AdminPage>} />
      <Route path="/admin/landing" element={<AdminPage><LandingManagement /></AdminPage>} />
      <Route path="/admin/product" element={<AdminPage><ProductAnalytics /></AdminPage>} />
      <Route path="/admin/system" element={<AdminPage><SystemMonitoring /></AdminPage>} />
      <Route path="/admin/feature-flags" element={<AdminPage><FeatureFlags /></AdminPage>} />
      <Route path="/admin/flags/:flagKey" element={<AdminPage><FlagDetails /></AdminPage>} />
      <Route path="/admin/security" element={<AdminPage><AdminSecurity /></AdminPage>} />
      <Route path="/admin/partners" element={<AdminPage><PartnersManagement /></AdminPage>} />
      <Route path="/admin/tests" element={<AdminPage><SystemTests /></AdminPage>} />
      <Route path="/admin/subscriptions" element={<AdminPage><SubscriptionManagement /></AdminPage>} />
      <Route path="/admin/feedback" element={<AdminPage><FeedbackManagement /></AdminPage>} />
      <Route path="/admin/roadmap" element={<AdminPage><RoadmapManagement /></AdminPage>} />
      <Route path="/admin/verification-requests" element={<AdminPage><VerificationRequests /></AdminPage>} />

      {/* Settings Routes */}
      <Route path="/settings" element={<DashboardPage><Settings /></DashboardPage>} />
      <Route path="/settings/*" element={<DashboardPage><Settings /></DashboardPage>} />
      <Route path="/settings/backup" element={<DashboardPage><Backup /></DashboardPage>} />
      <Route path="/settings/developer" element={<DashboardPage><DeveloperSettings /></DashboardPage>} />
      <Route path="/settings/integrations" element={<DashboardPage><IntegrationsSettings /></DashboardPage>} />
      <Route path="/settings/integrations/gtm" element={<DashboardPage><GTMSettings /></DashboardPage>} />

      {/* Approval & Partners */}
      <Route path="/approval-queue" element={<DashboardPage><ApprovalQueue /></DashboardPage>} />
      <Route path="/partners/dashboard" element={<DashboardPage><PartnerDashboard /></DashboardPage>} />
      <Route path="/client-workspaces" element={<DashboardPage><ClientWorkspaces /></DashboardPage>} />
    </Routes>
  );
};

export default AppRoutes;
