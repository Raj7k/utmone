import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSkeleton } from "@/components/SkeletonLoader";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { lazyWithRetry } from "@/utils/lazyWithRetry";

// Admin pages - with retry for resilience
const AdminDashboard = lazyWithRetry(() => import("@/pages/admin/Dashboard"));
const WaitlistManagement = lazyWithRetry(() => import("@/pages/admin/WaitlistManagement"));
const UserManagement = lazyWithRetry(() => import("@/pages/admin/UserManagement"));
const LandingManagement = lazyWithRetry(() => import("@/pages/admin/LandingManagement"));
const ProductAnalytics = lazyWithRetry(() => import("@/pages/admin/ProductAnalytics"));
const SystemMonitoring = lazyWithRetry(() => import("@/pages/admin/SystemMonitoring"));
const FeatureFlags = lazyWithRetry(() => import("@/pages/admin/FeatureFlags"));
const FlagDetails = lazyWithRetry(() => import("@/pages/admin/FlagDetails"));
const PartnersManagement = lazyWithRetry(() => import("@/pages/admin/PartnersManagement"));
const SystemTests = lazyWithRetry(() => import("@/pages/admin/SystemTests"));
const MFAVerify = lazyWithRetry(() => import("@/pages/admin/MFAVerify"));
const AdminSecurity = lazyWithRetry(() => import("@/pages/admin/AdminSecurity"));
const SubscriptionManagement = lazyWithRetry(() => import("@/pages/admin/SubscriptionManagement"));
const FeedbackManagement = lazyWithRetry(() => import("@/pages/admin/FeedbackManagement"));
const RoadmapManagement = lazyWithRetry(() => import("@/pages/admin/RoadmapManagement"));
const VerificationRequests = lazyWithRetry(() => import("@/pages/admin/VerificationRequests"));
// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Suspense fallback={<DashboardSkeleton />}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  </ProtectedRoute>
);

export const adminRoutes = [
  <Route key="admin-mfa" path="/admin/mfa-verify" element={<ProtectedRoute><Suspense fallback={<DashboardSkeleton />}><MFAVerify /></Suspense></ProtectedRoute>} />,
  <Route key="admin" path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />,
  <Route key="admin-waitlist" path="/admin/waitlist" element={<AdminRoute><WaitlistManagement /></AdminRoute>} />,
  <Route key="admin-users" path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />,
  <Route key="admin-landing" path="/admin/landing" element={<AdminRoute><LandingManagement /></AdminRoute>} />,
  <Route key="admin-product" path="/admin/product" element={<AdminRoute><ProductAnalytics /></AdminRoute>} />,
  <Route key="admin-system" path="/admin/system" element={<AdminRoute><SystemMonitoring /></AdminRoute>} />,
  <Route key="admin-flags" path="/admin/feature-flags" element={<AdminRoute><FeatureFlags /></AdminRoute>} />,
  <Route key="admin-flag-detail" path="/admin/flags/:flagKey" element={<AdminRoute><FlagDetails /></AdminRoute>} />,
  <Route key="admin-security" path="/admin/security" element={<AdminRoute><AdminSecurity /></AdminRoute>} />,
  <Route key="admin-partners" path="/admin/partners" element={<AdminRoute><PartnersManagement /></AdminRoute>} />,
  <Route key="admin-tests" path="/admin/tests" element={<AdminRoute><SystemTests /></AdminRoute>} />,
  <Route key="admin-subscriptions" path="/admin/subscriptions" element={<AdminRoute><SubscriptionManagement /></AdminRoute>} />,
  <Route key="admin-feedback" path="/admin/feedback" element={<AdminRoute><FeedbackManagement /></AdminRoute>} />,
  <Route key="admin-roadmap" path="/admin/roadmap" element={<AdminRoute><RoadmapManagement /></AdminRoute>} />,
  <Route key="admin-verification" path="/admin/verification" element={<AdminRoute><VerificationRequests /></AdminRoute>} />,
];
