import { ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * Protected route wrapper for admin-only pages
 * Automatically redirects non-admin users to homepage
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isLoading } = useAdminAuth();

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'rgba(59,130,246,1)', borderTopColor: 'transparent' }} />
          <p className="text-sm text-secondary-label">Verifying authorization...</p>
        </div>
      </div>
    );
  }

  // Only render children if user is admin
  // Redirect is handled by useAdminAuth hook
  return isAdmin ? <>{children}</> : null;
}
