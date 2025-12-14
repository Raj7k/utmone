import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace";
import { queryKeys } from "@/lib/queryConfig";
import { useAppSession, getCachedWorkspaceId } from "@/contexts/AppSessionContext";

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

// Get cached onboarding progress for instant render
function getCachedProgress(): Partial<OnboardingProgress> | null {
  try {
    const cached = localStorage.getItem('utm_onboarding_cache');
    if (!cached) return null;
    const { data, timestamp } = JSON.parse(cached);
    // 5 minute cache
    if (Date.now() - timestamp > 5 * 60 * 1000) {
      localStorage.removeItem('utm_onboarding_cache');
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function cacheProgress(progress: Partial<OnboardingProgress>): void {
  try {
    localStorage.setItem('utm_onboarding_cache', JSON.stringify({
      data: progress,
      timestamp: Date.now(),
    }));
  } catch {
    // Ignore storage errors
  }
}

export const useOnboardingProgress = (): OnboardingProgress => {
  const { currentWorkspace } = useWorkspace();
  const { user } = useAppSession();
  
  // Use cached IDs for instant query start
  const cachedWorkspaceId = getCachedWorkspaceId();
  const workspaceId = currentWorkspace?.id || cachedWorkspaceId;
  const userId = user?.id;

  const { data, isLoading, isFetched } = useQuery({
    queryKey: queryKeys.dashboard.onboarding(workspaceId || ''),
    queryFn: async () => {
      if (!workspaceId || !userId) return null;

      // Parallel queries for faster loading
      const [linksResult, qrResult, profileResult, domainsResult, pixelsResult] = await Promise.all([
        supabase
          .from('links')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', userId)
          .eq('workspace_id', workspaceId),
        supabase
          .from('qr_codes')
          .select('*', { count: 'exact', head: true })
          .eq('created_by', userId),
        supabase
          .from('profiles')
          .select('first_analytics_viewed_at, team_members_invited_count')
          .eq('id', userId)
          .single(),
        supabase
          .from('domains')
          .select('id')
          .eq('workspace_id', workspaceId)
          .eq('is_verified', true)
          .not('domain', 'in', '(go.utm.one,utm.click)')
          .limit(1),
        supabase
          .from('pixel_configs')
          .select('id')
          .eq('workspace_id', workspaceId)
          .limit(1),
      ]);

      const progress = {
        hasLinks: (linksResult.count || 0) > 0,
        hasQrCodes: (qrResult.count || 0) > 0,
        hasViewedAnalytics: !!profileResult.data?.first_analytics_viewed_at,
        hasInvitedTeam: (profileResult.data?.team_members_invited_count || 0) > 0,
        hasCustomDomain: !!domainsResult.data && domainsResult.data.length > 0,
        hasInstalledPixel: !!pixelsResult.data && pixelsResult.data.length > 0,
      };

      // Cache for next load
      cacheProgress(progress);

      return progress;
    },
    // Enable query only with valid user and workspace
    enabled: !!userId && !!workspaceId && workspaceId.length > 0,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    // Use cached progress as placeholder for instant render
    placeholderData: getCachedProgress() as any ?? undefined,
  });

  // Only loading if no cached data AND query still running
  const cachedProgress = getCachedProgress();
  const hasPlaceholder = !!cachedProgress || !!data;
  const isActuallyLoading = !hasPlaceholder && (isLoading || !isFetched);

  return {
    hasLinks: data?.hasLinks ?? cachedProgress?.hasLinks ?? false,
    hasQrCodes: data?.hasQrCodes ?? cachedProgress?.hasQrCodes ?? false,
    hasViewedAnalytics: data?.hasViewedAnalytics ?? cachedProgress?.hasViewedAnalytics ?? false,
    hasInvitedTeam: data?.hasInvitedTeam ?? cachedProgress?.hasInvitedTeam ?? false,
    hasCustomDomain: data?.hasCustomDomain ?? cachedProgress?.hasCustomDomain ?? false,
    hasInstalledPixel: data?.hasInstalledPixel ?? cachedProgress?.hasInstalledPixel ?? false,
    isLoading: isActuallyLoading,
    isFetched: isFetched || !!cachedProgress,
  };
};
