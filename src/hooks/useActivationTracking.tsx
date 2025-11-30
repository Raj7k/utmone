import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useActivationTracking = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const trackFirstLinkMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ first_link_created_at: new Date().toISOString() })
        .eq("id", user.id)
        .is("first_link_created_at", null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-level"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
    },
    onError: (error: Error) => {
      console.error("Failed to track first link:", error);
    },
  });

  const trackFirstQRMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ first_qr_generated_at: new Date().toISOString() })
        .eq("id", user.id)
        .is("first_qr_generated_at", null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-level"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
    },
    onError: (error: Error) => {
      console.error("Failed to track first QR:", error);
    },
  });

  const trackFirstAnalyticsViewMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("profiles")
        .update({ first_analytics_viewed_at: new Date().toISOString() })
        .eq("id", user.id)
        .is("first_analytics_viewed_at", null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-level"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
    },
    onError: (error: Error) => {
      console.error("Failed to track first analytics view:", error);
    },
  });

  const incrementTeamInvitesMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: profile } = await supabase
        .from("profiles")
        .select("team_members_invited_count")
        .eq("id", user.id)
        .single();

      const currentCount = profile?.team_members_invited_count || 0;

      const { error } = await supabase
        .from("profiles")
        .update({ team_members_invited_count: currentCount + 1 })
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["access-level"] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-progress"] });
      toast({
        title: "Team invite tracked",
        description: "Your activation progress has been updated.",
      });
    },
    onError: (error: Error) => {
      console.error("Failed to track team invite:", error);
    },
  });

  return {
    trackFirstLink: trackFirstLinkMutation.mutate,
    trackFirstQR: trackFirstQRMutation.mutate,
    trackFirstAnalyticsView: trackFirstAnalyticsViewMutation.mutate,
    incrementTeamInvites: incrementTeamInvitesMutation.mutate,
  };
};