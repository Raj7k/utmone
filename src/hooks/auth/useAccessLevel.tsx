import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";

export const useAccessLevel = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["access-level"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabaseFrom('profiles')
        .select("access_level, onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const accessLevel = profile?.access_level ?? 0;
  const onboardingCompleted = profile?.onboarding_completed ?? false;

  // Feature gating based on access level
  const canCreateLinks = accessLevel >= 2;
  const canGenerateQR = accessLevel >= 2;
  const hasFullUTM = accessLevel >= 3;
  const hasFullAnalytics = accessLevel >= 3;
  const hasAPIAccess = accessLevel >= 4;
  const hasExperimentalFeatures = accessLevel >= 4;
  
  // Daily limits for limited beta (level 2)
  const dailyLinkLimit = accessLevel === 2 ? 10 : accessLevel >= 3 ? Infinity : 0;
  const dailyQRLimit = accessLevel === 2 ? 5 : accessLevel >= 3 ? Infinity : 0;

  const getAccessLevelLabel = (): string => {
    const labels: Record<number, string> = {
      0: "Waitlist",
      1: "Read-Only Preview",
      2: "Limited Beta",
      3: "Full Access",
      4: "Power User",
    };
    return labels[accessLevel] || "Unknown";
  };

  return {
    accessLevel,
    onboardingCompleted,
    canCreateLinks,
    canGenerateQR,
    hasFullUTM,
    hasFullAnalytics,
    hasAPIAccess,
    hasExperimentalFeatures,
    dailyLinkLimit,
    dailyQRLimit,
    getAccessLevelLabel,
    isLoading,
  };
};
