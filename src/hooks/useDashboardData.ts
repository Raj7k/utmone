import { useQueries } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { checkPlanLimits } from "@/lib/planEnforcement";

export const useDashboardData = (workspaceId: string | undefined) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["clicks-today", workspaceId],
        queryFn: async () => {
          if (!workspaceId) return 0;
          
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const { count, error } = await supabase
            .from("link_clicks")
            .select("*", { count: "exact", head: true })
            .eq("workspace_id", workspaceId)
            .gte("clicked_at", today.toISOString());

          if (error) throw error;
          return count || 0;
        },
        enabled: !!workspaceId,
      },
      {
        queryKey: ["plan-limits", workspaceId],
        queryFn: () => checkPlanLimits(workspaceId!),
        enabled: !!workspaceId,
      },
      {
        queryKey: ["recent-links", workspaceId],
        queryFn: async () => {
          if (!workspaceId) return [];
          
          const { data, error } = await supabase
            .from("links")
            .select("*")
            .eq("workspace_id", workspaceId)
            .order("created_at", { ascending: false })
            .limit(5);

          if (error) throw error;
          return data || [];
        },
        enabled: !!workspaceId,
      },
      {
        queryKey: ["profile-referral"],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return null;

          const { data, error } = await supabase
            .from("profiles")
            .select("id, email")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          return data;
        },
      },
    ],
  });

  return {
    clicksToday: results[0],
    planLimits: results[1],
    recentLinks: results[2],
    profile: results[3],
    isLoading: results.some((r) => r.isLoading),
    isError: results.some((r) => r.isError),
  };
};
