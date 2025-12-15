/**
 * DashboardShell - Full providers for dashboard/admin routes
 * 
 * This shell loads ALL providers needed for the app:
 * - QueryClientProvider (React Query)
 * - AppProvider (session + workspace)
 * - NotificationProvider
 * - ProtectedRoute wrapper
 * 
 * Routes using this shell:
 * - /dashboard/*
 * - /admin/*
 * - /settings/*
 * - /onboarding
 */

import { ReactNode, Suspense, lazy } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryConfig';
import { AppProvider } from '@/contexts/AppProvider';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';
import { ModalProvider } from '@/contexts/ModalContext';
import { DashboardSkeleton } from '@/components/SkeletonLoader';

// Lazy load admin simulation - only needed in admin routes
const AdminSimulationProvider = lazy(() => 
  import('@/contexts/AdminSimulationContext').then(m => ({ default: m.AdminSimulationProvider }))
);

interface DashboardShellProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const DashboardShell = ({ children, requireAuth = true }: DashboardShellProps) => {
  const content = requireAuth ? (
    <ProtectedRoute>
      {children}
    </ProtectedRoute>
  ) : children;

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AppProvider>
          <ModalProvider>
            <Toaster />
            {content}
          </ModalProvider>
        </AppProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
};

// Variant for admin routes that need simulation provider
export const AdminShell = ({ children }: { children: ReactNode }) => {
  return (
    <DashboardShell>
      <Suspense fallback={<DashboardSkeleton />}>
        <AdminSimulationProvider>
          {children}
        </AdminSimulationProvider>
      </Suspense>
    </DashboardShell>
  );
};
