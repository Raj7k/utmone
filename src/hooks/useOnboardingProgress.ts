import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";

interface OnboardingProgress {
  hasLinks: boolean;
  hasQrCodes: boolean;
  hasViewedAnalytics: boolean;
  hasInvitedTeam: boolean;
  hasCustomDomain: boolean;
  isLoading: boolean;
}

export const useOnboardingProgress = (): OnboardingProgress => {
  const { currentWorkspace } = useWorkspace();

  const { data, isLoading } = useQuery({
    queryKey: ['onboarding-progress', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return null;

      // Get current user's profile data
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_link_created_at, first_qr_generated_at, first_analytics_viewed_at, team_members_invited_count')
        .eq('id', user.id)
        .single();

      // Check for custom domains (non-system domains)
      const { data: domains } = await supabase
        .from('domains')
        .select('id')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_verified', true)
        .not('domain', 'in', '(go.utm.one,utm.click)')
        .limit(1);

      return {
        hasLinks: !!profile?.first_link_created_at,
        hasQrCodes: !!profile?.first_qr_generated_at,
        hasViewedAnalytics: !!profile?.first_analytics_viewed_at,
        hasInvitedTeam: (profile?.team_members_invited_count || 0) > 0,
        hasCustomDomain: !!domains && domains.length > 0,
      };
    },
    enabled: !!currentWorkspace,
  });

  return {
    hasLinks: data?.hasLinks ?? false,
    hasQrCodes: data?.hasQrCodes ?? false,
    hasViewedAnalytics: data?.hasViewedAnalytics ?? false,
    hasInvitedTeam: data?.hasInvitedTeam ?? false,
    hasCustomDomain: data?.hasCustomDomain ?? false,
    isLoading,
  };
};
