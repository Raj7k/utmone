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
    queryKey: ['admin-mfa-status'],
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

      const { data: profile } = await supabase
        .from('profiles')
        .select('mfa_verified_at')
        .eq('id', user.id)
        .single();

      if (!profile?.mfa_verified_at) {
        return { requiresMFA: true, hasKeys: true };
      }

      const verifiedAt = new Date(profile.mfa_verified_at);
      const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);
      const requiresMFA = verifiedAt < twelveHoursAgo;

      return { requiresMFA, hasKeys };
    },
    enabled: !!isAdmin && !isAdminLoading,
    refetchInterval: 5 * 60 * 1000,
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
