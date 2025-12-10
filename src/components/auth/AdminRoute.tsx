import { ReactNode } from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Shield } from 'lucide-react';

interface AdminRouteProps {
  children: ReactNode;
}

/**
 * SECURITY-CRITICAL: Protected route wrapper for admin-only pages
 * 
 * This component uses a BLOCKING render pattern - children are NEVER
 * rendered until admin status is confirmed. This prevents any possibility
 * of unauthorized content exposure during loading states.
 * 
 * Security principles:
 * 1. Block first, allow later
 * 2. Show loading UI, not protected content, during verification
 * 3. Redirect is handled by useAdminAuth hook
 */
export function AdminRoute({ children }: AdminRouteProps) {
  const { isAdmin, isLoading, error } = useAdminAuth();

  // SECURITY: Show loading state while checking authorization
  // NEVER render children during this state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <Shield className="w-8 h-8 mx-auto animate-pulse text-foreground" />
          <p className="text-sm text-muted-foreground">verifying authorization...</p>
        </div>
      </div>
    );
  }

  // SECURITY: If there's an error or user is not admin, show access denied
  // The useAdminAuth hook handles the redirect, but we also block here
  if (error || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <Shield className="w-8 h-8 mx-auto text-destructive" />
          <p className="text-sm text-muted-foreground">access denied</p>
        </div>
      </div>
    );
  }

  // SECURITY: Only render children when we have confirmed admin status
  return <>{children}</>;
}
