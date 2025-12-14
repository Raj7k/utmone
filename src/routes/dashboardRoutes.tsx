import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Dashboard pages - lazy loaded
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardLinks = lazy(() => import("@/pages/dashboard/Links"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/Analytics"));
const DashboardQRCodes = lazy(() => import("@/pages/dashboard/QRCodes"));
const Targeting = lazy(() => import("@/pages/dashboard/Targeting"));
const BulkCreate = lazy(() => import("@/pages/dashboard/BulkCreate"));
const CacheMonitoring = lazy(() => import("@/pages/dashboard/CacheMonitoring"));
const AnalyticsPerformance = lazy(() => import("@/pages/dashboard/AnalyticsPerformance"));
const LinkHealth = lazy(() => import("@/pages/dashboard/LinkHealth"));
const Experiments = lazy(() => import("@/pages/dashboard/Experiments"));
const Attribution = lazy(() => import("@/pages/dashboard/Attribution"));
const RobustAttribution = lazy(() => import("@/pages/RobustAttribution"));
const DashboardSales = lazy(() => import("@/pages/dashboard/Sales"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/Events"));
const Intelligence = lazy(() => import("@/pages/dashboard/Intelligence"));
const OneLinkValidator = lazy(() => import("@/pages/dashboard/OneLinkValidator"));
const URLShortenerPro = lazy(() => import("@/pages/dashboard/URLShortenerPro"));
const Campaigns = lazy(() => import("@/pages/dashboard/Campaigns"));
const CampaignDetails = lazy(() => import("@/pages/dashboard/CampaignDetails"));
const LinkDetail = lazy(() => import("@/pages/LinkDetail"));
const ApprovalQueue = lazy(() => import("@/pages/ApprovalQueue"));

// Dashboard route wrapper
const DashboardRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardLayout>{children}</DashboardLayout>
    </Suspense>
  </ProtectedRoute>
);

export const dashboardRoutes = [
  <Route key="dashboard" path="/dashboard" element={<DashboardRoute><DashboardHome /></DashboardRoute>} />,
  <Route key="dashboard-links" path="/dashboard/links" element={<DashboardRoute><DashboardLinks /></DashboardRoute>} />,
  <Route key="dashboard-analytics" path="/dashboard/analytics" element={<DashboardRoute><DashboardAnalytics /></DashboardRoute>} />,
  <Route key="dashboard-qr" path="/dashboard/qr-codes" element={<DashboardRoute><DashboardQRCodes /></DashboardRoute>} />,
  <Route key="dashboard-url-shortener" path="/dashboard/url-shortener" element={<DashboardRoute><URLShortenerPro /></DashboardRoute>} />,
  <Route key="dashboard-targeting" path="/dashboard/targeting" element={<DashboardRoute><Targeting /></DashboardRoute>} />,
  <Route key="dashboard-targeting-link" path="/dashboard/targeting/:linkId" element={<DashboardRoute><Targeting /></DashboardRoute>} />,
  <Route key="dashboard-bulk" path="/dashboard/bulk-create" element={<DashboardRoute><BulkCreate /></DashboardRoute>} />,
  <Route key="dashboard-onelink" path="/dashboard/onelink-validator" element={<DashboardRoute><OneLinkValidator /></DashboardRoute>} />,
  <Route key="dashboard-campaigns" path="/dashboard/campaigns" element={<DashboardRoute><Campaigns /></DashboardRoute>} />,
  <Route key="dashboard-campaign-detail" path="/dashboard/campaigns/:id" element={<DashboardRoute><CampaignDetails /></DashboardRoute>} />,
  <Route key="dashboard-cache" path="/dashboard/cache-monitoring" element={<DashboardRoute><CacheMonitoring /></DashboardRoute>} />,
  <Route key="dashboard-perf" path="/dashboard/analytics-performance" element={<DashboardRoute><AnalyticsPerformance /></DashboardRoute>} />,
  <Route key="dashboard-health" path="/dashboard/link-health" element={<DashboardRoute><LinkHealth /></DashboardRoute>} />,
  <Route key="dashboard-experiments" path="/dashboard/experiments" element={<DashboardRoute><Experiments /></DashboardRoute>} />,
  <Route key="dashboard-attribution" path="/dashboard/attribution" element={<DashboardRoute><Attribution /></DashboardRoute>} />,
  <Route key="dashboard-robust" path="/dashboard/robust-attribution" element={<DashboardRoute><RobustAttribution /></DashboardRoute>} />,
  <Route key="dashboard-sales" path="/dashboard/sales" element={<DashboardRoute><DashboardSales /></DashboardRoute>} />,
  <Route key="dashboard-events" path="/dashboard/events" element={<DashboardRoute><DashboardEvents /></DashboardRoute>} />,
  <Route key="dashboard-intelligence" path="/dashboard/intelligence" element={<DashboardRoute><Intelligence /></DashboardRoute>} />,
  <Route key="dashboard-link-detail" path="/dashboard/links/:linkId" element={<DashboardRoute><LinkDetail /></DashboardRoute>} />,
  <Route key="dashboard-approvals" path="/dashboard/approvals" element={<DashboardRoute><ApprovalQueue /></DashboardRoute>} />,
];
