import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Shield } from "lucide-react";

interface AdminMFAGuardProps {
  children: React.ReactNode;
}

export const AdminMFAGuard = ({ children }: AdminMFAGuardProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  const { data: mfaStatus } = useQuery({
    queryKey: ['admin-mfa-status', location.pathname],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { requiresMFA: false, hasKeys: false };

      const { data: authenticators } = await supabase
        .from('user_authenticators')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      const hasKeys = authenticators && authenticators.length > 0;

      if (!hasKeys) {
        return { requiresMFA: false, hasKeys: false };
      }

      // Check session-based MFA verification (stored in sessionStorage)
      const sessionMFAVerified = sessionStorage.getItem('admin_mfa_verified');
      const sessionUserId = sessionStorage.getItem('admin_mfa_user_id');
      
      // Require MFA if:
      // 1. No session verification exists
      // 2. Session verification is for a different user
      // 3. Session verification expired (15 minutes for extra security)
      if (!sessionMFAVerified || sessionUserId !== user.id) {
        return { requiresMFA: true, hasKeys: true };
      }

      const verifiedAt = new Date(sessionMFAVerified);
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
      const requiresMFA = verifiedAt < fifteenMinutesAgo;

      return { requiresMFA, hasKeys };
    },
    enabled: !!isAdmin && !isAdminLoading,
    refetchInterval: 60 * 1000, // Check every minute
  });

  useEffect(() => {
    if (isAdminLoading || !mfaStatus) {
      return;
    }

    setIsChecking(false);

    if (isAdmin && mfaStatus.hasKeys && mfaStatus.requiresMFA) {
      if (location.pathname !== '/admin/mfa-verify') {
        navigate('/admin/mfa-verify', { replace: true });
      }
    }
  }, [isAdmin, isAdminLoading, mfaStatus, navigate, location.pathname]);

  if (isChecking || isAdminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Shield className="h-12 w-12 mx-auto animate-pulse text-foreground" />
          <p className="text-muted-foreground">verifying security clearance...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
