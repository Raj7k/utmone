import { lazy, Suspense } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardSkeleton } from "@/components/SkeletonLoader";

// Settings pages
const Settings = lazy(() => import("@/pages/Settings"));
const Backup = lazy(() => import("@/pages/Settings/Backup"));
const DeveloperSettings = lazy(() => import("@/pages/DeveloperSettings"));

// Settings route wrapper
const SettingsRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Suspense fallback={<DashboardSkeleton />}>
      {children}
    </Suspense>
  </ProtectedRoute>
);

export const settingsRoutes = [
  <Route key="settings" path="/settings" element={<SettingsRoute><Settings /></SettingsRoute>} />,
  <Route key="settings-workspace" path="/settings/workspace" element={<SettingsRoute><Settings /></SettingsRoute>} />,
  <Route key="settings-profile" path="/settings/profile" element={<SettingsRoute><Settings /></SettingsRoute>} />,
  <Route key="settings-domains" path="/settings/domains" element={<SettingsRoute><Settings /></SettingsRoute>} />,
  <Route key="settings-billing" path="/settings/billing" element={<SettingsRoute><Settings /></SettingsRoute>} />,
  <Route key="settings-tracking" path="/settings/tracking" element={<SettingsRoute><Settings /></SettingsRoute>} />,
  <Route key="settings-backups" path="/settings/backups" element={<SettingsRoute><Backup /></SettingsRoute>} />,
  <Route key="settings-backup" path="/settings/backup" element={<SettingsRoute><Backup /></SettingsRoute>} />,
  <Route key="settings-developer" path="/settings/developer" element={<SettingsRoute><DeveloperSettings /></SettingsRoute>} />,
];
