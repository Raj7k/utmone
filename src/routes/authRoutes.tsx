import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { DashboardSkeleton, MarketingSkeleton } from "@/components/SkeletonLoader";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// Auth pages
const Auth = lazy(() => import("@/pages/Auth"));
const AdminAuth = lazy(() => import("@/pages/AdminAuth"));
const Signup = lazy(() => import("@/pages/Signup"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const AuthCallback = lazy(() => import("@/pages/AuthCallback"));
const WaitlistLocked = lazy(() => import("@/pages/WaitlistLocked"));
const WaitlistStatus = lazy(() => import("@/pages/WaitlistStatus"));
const WaitlistPending = lazy(() => import("@/pages/WaitlistPending"));
const TotpVerification = lazy(() => import("@/pages/auth/TotpVerification"));
const PasswordProtected = lazy(() => import("@/pages/PasswordProtected"));
const AcceptInvite = lazy(() => import("@/pages/AcceptInvite"));
const OnboardingWizard = lazy(() => import("@/pages/OnboardingWizard"));
const ClientWorkspaces = lazy(() => import("@/pages/ClientWorkspaces"));
const AnalyticsShare = lazy(() => import("@/pages/AnalyticsShare"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));

const M = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<MarketingSkeleton />}>{children}</Suspense>
);

const D = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<DashboardSkeleton />}>{children}</Suspense>
);

export const authRoutes = [
  <Route key="auth" path="/auth" element={<M><Auth /></M>} />,
  <Route key="admin-auth" path="/admin-auth" element={<M><AdminAuth /></M>} />,
  <Route key="signup" path="/signup" element={<M><Signup /></M>} />,
  <Route key="reset-password" path="/reset-password" element={<M><ResetPassword /></M>} />,
  <Route key="auth-callback" path="/auth/callback" element={<D><AuthCallback /></D>} />,
  <Route key="waitlist-locked" path="/waitlist-locked" element={<M><WaitlistLocked /></M>} />,
  <Route key="waitlist-status" path="/waitlist/status" element={<M><WaitlistStatus /></M>} />,
  <Route key="waitlist-pending" path="/waitlist-pending" element={<M><WaitlistPending /></M>} />,
  <Route key="totp-verify" path="/auth/verify-2fa" element={<D><TotpVerification /></D>} />,
  <Route key="password-protected" path="/password-protected" element={<D><PasswordProtected /></D>} />,
  <Route key="accept-invite" path="/accept-invite" element={<M><AcceptInvite /></M>} />,
  <Route key="onboarding" path="/onboarding" element={<D><OnboardingWizard /></D>} />,
  <Route key="workspaces" path="/workspaces" element={<ProtectedRoute><D><ClientWorkspaces /></D></ProtectedRoute>} />,
  <Route key="analytics-share" path="/analytics/share/:token" element={<M><AnalyticsShare /></M>} />,
  <Route key="privacy" path="/privacy-policy" element={<M><PrivacyPolicy /></M>} />,
];
