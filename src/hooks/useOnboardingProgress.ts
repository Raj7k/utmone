import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";

interface OnboardingProgress {
  hasLinks: boolean;
  hasQrCodes: boolean;
  hasViewedAnalytics: boolean;
  hasInvitedTeam: boolean;
  hasCustomDomain: boolean;
  hasInstalledPixel: boolean;
  isLoading: boolean;
  isFetched: boolean;
}

export const useOnboardingProgress = (): OnboardingProgress => {
  const { currentWorkspace } = useWorkspace();

  const { data, isLoading, isFetched } = useQuery({
    queryKey: ['onboarding-progress', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { count: linkCount } = await supabase
        .from('links')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id)
        .eq('workspace_id', currentWorkspace.id);

      const { count: qrCount } = await supabase
        .from('qr_codes')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('first_analytics_viewed_at, team_members_invited_count')
        .eq('id', user.id)
        .single();

      const { data: domains } = await supabase
        .from('domains')
        .select('id')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_verified', true)
        .not('domain', 'in', '(go.utm.one,utm.click)')
        .limit(1);

      const { data: pixels } = await supabase
        .from('pixel_configs')
        .select('id')
        .eq('workspace_id', currentWorkspace.id)
        .limit(1);

      return {
        hasLinks: (linkCount || 0) > 0,
        hasQrCodes: (qrCount || 0) > 0,
        hasViewedAnalytics: !!profile?.first_analytics_viewed_at,
        hasInvitedTeam: (profile?.team_members_invited_count || 0) > 0,
        hasCustomDomain: !!domains && domains.length > 0,
        hasInstalledPixel: !!pixels && pixels.length > 0,
      };
    },
    enabled: !!currentWorkspace,
    staleTime: 30000,
    placeholderData: (previousData) => previousData,
  });

  // Consider loading until workspace is ready AND query has actually fetched
  const isActuallyLoading = !currentWorkspace || isLoading || !isFetched;

  return {
    hasLinks: data?.hasLinks ?? false,
    hasQrCodes: data?.hasQrCodes ?? false,
    hasViewedAnalytics: data?.hasViewedAnalytics ?? false,
    hasInvitedTeam: data?.hasInvitedTeam ?? false,
    hasCustomDomain: data?.hasCustomDomain ?? false,
    hasInstalledPixel: data?.hasInstalledPixel ?? false,
    isLoading: isActuallyLoading,
    isFetched,
  };
};
