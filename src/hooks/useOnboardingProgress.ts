import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { queryKeys } from "@/lib/queryConfig";

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
    queryKey: queryKeys.dashboard.onboarding(currentWorkspace?.id || ''),
    queryFn: async () => {
      if (!currentWorkspace) return null;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Run all 5 queries in parallel for faster loading
      const [linksResult, qrResult, profileResult, domainsResult, pixelsResult] = await Promise.all([
        supabase
          .from('links')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id)
          .eq('workspace_id', currentWorkspace.id),
        supabase
          .from('qr_codes')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', user.id),
        supabase
          .from('profiles')
          .select('first_analytics_viewed_at, team_members_invited_count')
          .eq('id', user.id)
          .single(),
        supabase
          .from('domains')
          .select('id')
          .eq('workspace_id', currentWorkspace.id)
          .eq('is_verified', true)
          .not('domain', 'in', '(go.utm.one,utm.click)')
          .limit(1),
        supabase
          .from('pixel_configs')
          .select('id')
          .eq('workspace_id', currentWorkspace.id)
          .limit(1),
      ]);

      return {
        hasLinks: (linksResult.count || 0) > 0,
        hasQrCodes: (qrResult.count || 0) > 0,
        hasViewedAnalytics: !!profileResult.data?.first_analytics_viewed_at,
        hasInvitedTeam: (profileResult.data?.team_members_invited_count || 0) > 0,
        hasCustomDomain: !!domainsResult.data && domainsResult.data.length > 0,
        hasInstalledPixel: !!pixelsResult.data && pixelsResult.data.length > 0,
      };
    },
    enabled: !!currentWorkspace,
    staleTime: 5 * 60 * 1000, // 5 minutes - onboarding rarely changes
    gcTime: 30 * 60 * 1000,
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
