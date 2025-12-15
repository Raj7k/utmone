import React, { Suspense } from "react";
import { Navigate, Outlet, Route } from "react-router-dom";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { AppProvider } from "@/contexts/AppProvider";
import { AppWithHelp } from "@/components/AppWithHelp";
import { PerformanceProvider } from "@/components/performance/PerformanceProvider";
import { LinkIdRedirect } from "@/components/redirects/LinkIdRedirect";
import { AdminLayout } from "@/components/admin/AdminLayout";

const DashboardHome = React.lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardLinks = React.lazy(() => import("@/pages/dashboard/Links"));
const DashboardAnalytics = React.lazy(() => import("@/pages/dashboard/Analytics"));
const DashboardQRCodes = React.lazy(() => import("@/pages/dashboard/QRCodes"));
const DashboardLinkPages = React.lazy(() => import("@/pages/dashboard/LinkPages"));
const DashboardLinkPageBuilder = React.lazy(() => import("@/pages/dashboard/LinkPageBuilder"));
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
const URLShortenerPro = React.lazy(() => import("@/pages/dashboard/URLShortenerPro"));
const LinkDetail = React.lazy(() => import("@/pages/LinkDetail"));
const Campaigns = React.lazy(() => import("@/pages/dashboard/Campaigns"));
const CampaignDetails = React.lazy(() => import("@/pages/dashboard/CampaignDetails"));

const OnboardingWizard = React.lazy(() => import("@/pages/OnboardingWizard"));
const TotpVerification = React.lazy(() => import("@/pages/auth/TotpVerification"));
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
const Settings = React.lazy(() => import("@/pages/Settings"));
const Backup = React.lazy(() => import("@/pages/Settings/Backup"));
const DeveloperSettings = React.lazy(() => import("@/pages/DeveloperSettings"));
const ApprovalQueue = React.lazy(() => import("@/pages/ApprovalQueue"));
const IntegrationsSettings = React.lazy(() => import("@/pages/Settings/Integrations"));
const GTMSettings = React.lazy(() => import("@/pages/integrations/GTMSettings"));
const PartnerDashboard = React.lazy(() => import("@/pages/Partners/Dashboard"));
const ClientWorkspaces = React.lazy(() => import("@/pages/ClientWorkspaces"));
const PerformanceAudit = React.lazy(() => import("@/pages/dev/PerformanceAudit"));
const PrivacyPolicy = React.lazy(() => import("@/pages/PrivacyPolicy"));

export const AppLayout = () => (
  <AppProvider>
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  </AppProvider>
);

// Export routes as an array so React Router sees actual Route elements
export const privateRoutes = [
  // Dashboard Routes
  <Route
    key="dashboard"
    path="/dashboard"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardHome />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-link-pages"
    path="/dashboard/link-pages"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardLinkPages />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-link-pages-builder"
    path="/dashboard/link-pages/:pageId"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardLinkPageBuilder />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-links"
    path="/dashboard/links"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardLinks />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-analytics"
    path="/dashboard/analytics"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardAnalytics />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-qr-codes"
    path="/dashboard/qr-codes"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardQRCodes />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route key="dashboard-brickmatrix" path="/dashboard/brickmatrix" element={<Navigate to="/dashboard/qr-codes?tab=brick-builder" replace />} />,
  <Route
    key="dashboard-targeting"
    path="/dashboard/targeting"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <Targeting />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-targeting-linkId"
    path="/dashboard/targeting/:linkId"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <Targeting />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-bulk-create"
    path="/dashboard/bulk-create"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <BulkCreate />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-onelink-validator"
    path="/dashboard/onelink-validator"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <OneLinkValidator />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-campaigns"
    path="/dashboard/campaigns"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <Campaigns />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-campaigns-id"
    path="/dashboard/campaigns/:id"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <CampaignDetails />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-cache-monitoring"
    path="/dashboard/cache-monitoring"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <CacheMonitoring />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-analytics-performance"
    path="/dashboard/analytics-performance"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <AnalyticsPerformance />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-link-health"
    path="/dashboard/link-health"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <LinkHealth />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-experiments"
    path="/dashboard/experiments"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <Experiments />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-attribution"
    path="/dashboard/attribution"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <Attribution />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-robust-attribution"
    path="/dashboard/robust-attribution"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <RobustAttribution />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-sales"
    path="/dashboard/sales"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardSales />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dashboard-event-halo"
    path="/dashboard/event-halo"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <DashboardEvents />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route key="dashboard-events-redirect" path="/dashboard/events" element={<Navigate to="/dashboard/event-halo" replace />} />,
  <Route
    key="dashboard-intelligence"
    path="/dashboard/intelligence"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <Intelligence />
        </DashboardLayout>
      </Suspense>
    )}
  />,

  // Onboarding Routes
  <Route key="onboarding" path="/onboarding" element={<Suspense fallback={<DashboardSkeleton />}><OnboardingWizard /></Suspense>} />,

  // Link redirects
  <Route key="links-redirect" path="/links" element={<Navigate to="/dashboard/links" replace />} />,
  <Route key="links-linkId" path="/links/:linkId" element={<LinkIdRedirect />} />,
  <Route key="dashboard-links-create" path="/dashboard/links/create" element={<Navigate to="/dashboard/links" replace />} />,
  <Route
    key="dashboard-links-linkId"
    path="/dashboard/links/:linkId"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <LinkDetail />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route key="analytics-redirect" path="/analytics" element={<Navigate to="/dashboard/intelligence" replace />} />,

  // 2FA Verification Route
  <Route key="auth-verify-2fa" path="/auth/verify-2fa" element={<Suspense fallback={<DashboardSkeleton />}><TotpVerification /></Suspense>} />,

  // Admin Routes
  <Route key="admin-mfa-verify" path="/admin/mfa-verify" element={<Suspense fallback={<DashboardSkeleton />}><MFAVerify /></Suspense>} />,
  <Route
    key="admin"
    path="/admin"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-waitlist"
    path="/admin/waitlist"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <WaitlistManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-users"
    path="/admin/users"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <UserManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-landing"
    path="/admin/landing"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <LandingManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-product"
    path="/admin/product"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <ProductAnalytics />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-system"
    path="/admin/system"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <SystemMonitoring />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-feature-flags"
    path="/admin/feature-flags"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <FeatureFlags />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-flags-flagKey"
    path="/admin/flags/:flagKey"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <FlagDetails />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-security"
    path="/admin/security"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <AdminSecurity />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-partners"
    path="/admin/partners"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <PartnersManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-tests"
    path="/admin/tests"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <SystemTests />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-subscriptions"
    path="/admin/subscriptions"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <SubscriptionManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-feedback"
    path="/admin/feedback"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <FeedbackManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,
  <Route
    key="admin-roadmap"
    path="/admin/roadmap"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminLayout>
          <RoadmapManagement />
        </AdminLayout>
      </Suspense>
    )}
  />,

  // Settings Routes
  <Route key="settings" path="/settings" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />,
  <Route key="settings-workspace" path="/settings/workspace" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />,
  <Route key="settings-profile" path="/settings/profile" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />,
  <Route key="settings-domains" path="/settings/domains" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />,
  <Route key="settings-billing" path="/settings/billing" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />,
  <Route key="settings-tracking" path="/settings/tracking" element={<Suspense fallback={<DashboardSkeleton />}><Settings /></Suspense>} />,
  <Route key="settings-backups" path="/settings/backups" element={<Suspense fallback={<DashboardSkeleton />}><Backup /></Suspense>} />,
  <Route key="settings-backup" path="/settings/backup" element={<Suspense fallback={<DashboardSkeleton />}><Backup /></Suspense>} />,
  <Route key="settings-developer" path="/settings/developer" element={<Suspense fallback={<DashboardSkeleton />}><DeveloperSettings /></Suspense>} />,
  <Route
    key="dashboard-approvals"
    path="/dashboard/approvals"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <ApprovalQueue />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route key="settings-integrations" path="/settings/integrations" element={<Suspense fallback={<DashboardSkeleton />}><IntegrationsSettings /></Suspense>} />,
  <Route
    key="integrations-gtm"
    path="/integrations/gtm"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <GTMSettings />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route key="partners-dashboard" path="/partners/dashboard" element={<Suspense fallback={<DashboardSkeleton />}><PartnerDashboard /></Suspense>} />,
  <Route
    key="client-workspaces"
    path="/client-workspaces"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardLayout>
          <ClientWorkspaces />
        </DashboardLayout>
      </Suspense>
    )}
  />,
  <Route
    key="dev-performance"
    path="/dev/performance"
    element={(
      <Suspense fallback={<DashboardSkeleton />}>
        <PerformanceProvider>
          <AppWithHelp>
            <PerformanceAudit />
          </AppWithHelp>
        </PerformanceProvider>
      </Suspense>
    )}
  />,
  <Route key="privacy-policy" path="/privacy-policy" element={<Suspense fallback={<DashboardSkeleton />}><PrivacyPolicy /></Suspense>} />,
  <Route key="legal-privacy" path="/legal/privacy" element={<Navigate to="/privacy-policy" replace />} />,
];
