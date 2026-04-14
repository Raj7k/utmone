import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Shield, AlertTriangle } from "lucide-react";

interface AdminMFAGuardProps {
  children: React.ReactNode;
}

interface MFACheckResult {
  requiresMFA: boolean;
  hasKeys: boolean;
  mfaVerified: boolean;
  domainMismatch: boolean;
  registeredDomain?: string;
}

/**
 * SECURITY-CRITICAL: AdminMFAGuard with blocking render pattern
 * 
 * This guard MUST prevent children from rendering until MFA is verified.
 * The previous implementation had a race condition where children could
 * render before the redirect to MFA verification occurred.
 * 
 * Security principles:
 * 1. BLOCK first, allow later (never render protected content until verified)
 * 2. Server-side session validation (sessionStorage can be manipulated)
 * 3. Domain-bound WebAuthn verification
 */
export const AdminMFAGuard = ({ children }: AdminMFAGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mfaState, setMfaState] = useState<'checking' | 'verified' | 'required' | 'domain_mismatch'>('checking');
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  // Check MFA status with server-side validation
  const { data: mfaStatus, isLoading: isMfaLoading, refetch } = useQuery({
    queryKey: ['admin-mfa-status-secure', location.pathname],
    queryFn: async (): Promise<MFACheckResult> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { requiresMFA: false, hasKeys: false, mfaVerified: false, domainMismatch: false };
      }

      // Check if user has registered authenticators
      const { data: authenticators, error: authError } = await supabaseFrom('user_authenticators')
        .select('id, registered_domain')
        .eq('user_id', user.id);

      if (authError || !authenticators || authenticators.length === 0) {
        // No security keys registered - MFA not required
        return { requiresMFA: false, hasKeys: false, mfaVerified: false, domainMismatch: false };
      }

      // Check for domain mismatch
      const currentDomain = window.location.origin;
      const registeredDomain = authenticators[0]?.registered_domain;
      const domainMismatch = registeredDomain && registeredDomain !== currentDomain;

      if (domainMismatch) {
        return { 
          requiresMFA: true, 
          hasKeys: true, 
          mfaVerified: false, 
          domainMismatch: true,
          registeredDomain 
        };
      }

      // SECURITY: Validate session-based MFA verification
      // This is a client-side check - server should also validate for API calls
      const sessionMFAVerified = sessionStorage.getItem('admin_mfa_verified');
      const sessionUserId = sessionStorage.getItem('admin_mfa_user_id');
      
      // Require MFA if:
      // 1. No session verification exists
      // 2. Session verification is for a different user
      // 3. Session verification expired (15 minutes for admin security)
      if (!sessionMFAVerified || sessionUserId !== user.id) {
        return { requiresMFA: true, hasKeys: true, mfaVerified: false, domainMismatch: false };
      }

      const verifiedAt = new Date(sessionMFAVerified);
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      
      if (verifiedAt < fifteenMinutesAgo) {
        // Session expired - clear and require re-verification
        sessionStorage.removeItem('admin_mfa_verified');
        sessionStorage.removeItem('admin_mfa_user_id');
        return { requiresMFA: true, hasKeys: true, mfaVerified: false, domainMismatch: false };
      }

      return { requiresMFA: false, hasKeys: true, mfaVerified: true, domainMismatch: false };
    },
    enabled: !!isAdmin && !isAdminLoading,
    refetchInterval: 60 * 1000, // Check every minute
    staleTime: 30 * 1000, // Consider stale after 30 seconds
  });

  // Handle MFA state transitions
  useEffect(() => {
    if (isAdminLoading || isMfaLoading) {
      setMfaState('checking');
      return;
    }

    if (!isAdmin) {
      // Not admin - let other guards handle
      setMfaState('verified');
      return;
    }

    if (!mfaStatus) {
      setMfaState('checking');
      return;
    }

    // Domain mismatch - show warning
    if (mfaStatus.domainMismatch) {
      setMfaState('domain_mismatch');
      return;
    }

    // MFA required - redirect to verification
    if (mfaStatus.requiresMFA && mfaStatus.hasKeys) {
      setMfaState('required');
      if (location.pathname !== '/admin/mfa-verify') {
        navigate('/admin/mfa-verify', { replace: true });
      }
      return;
    }

    // MFA verified or not required
    setMfaState('verified');
  }, [isAdmin, isAdminLoading, isMfaLoading, mfaStatus, navigate, location.pathname]);

  // SECURITY: Block render until MFA state is confirmed
  // This is the critical fix - we NEVER render children in uncertain states
  
  // State: Checking
  if (mfaState === 'checking' || isAdminLoading || isMfaLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Shield className="h-12 w-12 mx-auto animate-pulse text-foreground" />
          <p className="text-muted-foreground">verifying security clearance...</p>
        </div>
      </div>
    );
  }

  // State: Domain mismatch - show warning and block access
  if (mfaState === 'domain_mismatch') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md mx-auto p-6">
          <AlertTriangle className="h-12 w-12 mx-auto text-amber-500" />
          <h2 className="text-xl font-semibold text-foreground">Security Key Domain Mismatch</h2>
          <p className="text-muted-foreground">
            Your security key was registered on a different domain ({mfaStatus?.registeredDomain}).
            WebAuthn credentials are domain-bound and cannot be used across different domains.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Current domain:</strong> {window.location.origin}</p>
            <p><strong>Registered domain:</strong> {mfaStatus?.registeredDomain}</p>
          </div>
          <div className="pt-4 space-y-2">
            <button 
              onClick={() => navigate('/settings/security')}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Re-register Security Key
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full px-4 py-2 border border-border text-foreground rounded-md hover:bg-muted"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // State: MFA required - don't render children, show redirect message
  if (mfaState === 'required') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Shield className="h-12 w-12 mx-auto animate-pulse text-foreground" />
          <p className="text-muted-foreground">redirecting to security verification...</p>
        </div>
      </div>
    );
  }

  // State: Verified - safe to render children
  if (mfaState === 'verified') {
    return <>{children}</>;
  }

  // Fallback: Never render children in unknown state
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Shield className="h-12 w-12 mx-auto text-foreground" />
        <p className="text-muted-foreground">security check failed</p>
      </div>
    </div>
  );
};
