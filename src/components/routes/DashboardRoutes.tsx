import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Dashboard pages - lazy loaded
const DashboardHome = lazy(() => import("@/pages/dashboard/DashboardHome"));
const DashboardLinks = lazy(() => import("@/pages/dashboard/Links"));
const DashboardAnalytics = lazy(() => import("@/pages/dashboard/Analytics"));
const DashboardQRCodes = lazy(() => import("@/pages/dashboard/QRCodes"));
const Targeting = lazy(() => import("@/pages/dashboard/Targeting"));
const BulkCreate = lazy(() => import("@/pages/dashboard/BulkCreate"));
const Attribution = lazy(() => import("@/pages/dashboard/Attribution"));
const DashboardSales = lazy(() => import("@/pages/dashboard/Sales"));
const DashboardEvents = lazy(() => import("@/pages/dashboard/Events"));
const Intelligence = lazy(() => import("@/pages/dashboard/Intelligence"));
const Campaigns = lazy(() => import("@/pages/dashboard/Campaigns"));
const CampaignDetails = lazy(() => import("@/pages/dashboard/CampaignDetails"));
const Settings = lazy(() => import("@/pages/Settings"));
const OnboardingWizard = lazy(() => import("@/pages/OnboardingWizard"));

const wrap = (Component: React.ComponentType) => (
  <Suspense fallback={<DashboardSkeleton />}>
    <Component />
  </Suspense>
);

export function DashboardRoutes() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={wrap(DashboardHome)} />
          <Route path="/links" element={wrap(DashboardLinks)} />
          <Route path="/analytics" element={wrap(DashboardAnalytics)} />
          <Route path="/qr" element={wrap(DashboardQRCodes)} />
          <Route path="/targeting" element={wrap(Targeting)} />
          <Route path="/bulk" element={wrap(BulkCreate)} />
          <Route path="/attribution" element={wrap(Attribution)} />
          <Route path="/sales" element={wrap(DashboardSales)} />
          <Route path="/events" element={wrap(DashboardEvents)} />
          <Route path="/intelligence" element={wrap(Intelligence)} />
          <Route path="/campaigns" element={wrap(Campaigns)} />
          <Route path="/campaigns/:id" element={wrap(CampaignDetails)} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export function SettingsRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/*" element={wrap(Settings)} />
      </Routes>
    </ProtectedRoute>
  );
}

export function OnboardingRoutes() {
  return (
    <ProtectedRoute>
      <Routes>
        <Route path="/" element={wrap(OnboardingWizard)} />
      </Routes>
    </ProtectedRoute>
  );
}
