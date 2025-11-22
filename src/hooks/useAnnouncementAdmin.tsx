import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AnnouncementConfig } from "@/lib/announcementConfig";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";

export const useAnnouncementAdmin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();

  // Fetch all announcement configs
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcement-configs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcement_configs")
        .select("*")
        .order("priority", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Fetch analytics for an announcement
  const fetchAnnouncementAnalytics = async (announcementId: string, days = 30) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [impressions, clicks, dismissals] = await Promise.all([
      supabase
        .from("announcement_impressions")
        .select("*", { count: "exact" })
        .eq("announcement_id", announcementId)
        .gte("created_at", startDate.toISOString()),
      supabase
        .from("announcement_clicks")
        .select("*", { count: "exact" })
        .eq("announcement_id", announcementId)
        .gte("created_at", startDate.toISOString()),
      supabase
        .from("announcement_dismissals")
        .select("*", { count: "exact" })
        .eq("announcement_id", announcementId)
        .gte("created_at", startDate.toISOString()),
    ]);

    const impressionCount = impressions.count || 0;
    const clickCount = clicks.count || 0;
    const dismissalCount = dismissals.count || 0;

    return {
      impressions: impressionCount,
      clicks: clickCount,
      dismissals: dismissalCount,
      ctr: impressionCount > 0 ? (clickCount / impressionCount) * 100 : 0,
      dismissalRate: impressionCount > 0 ? (dismissalCount / impressionCount) * 100 : 0,
    };
  };

  // Create announcement
  const createMutation = useMutation({
    mutationFn: async (config: Partial<AnnouncementConfig>) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from("announcement_configs")
        .insert({
          config_id: config.id!,
          message: config.message!,
          cta_text: config.ctaText,
          cta_link: config.ctaLink,
          start_date: config.startDate?.toISOString(),
          end_date: config.endDate?.toISOString(),
          days_of_week: config.daysOfWeek,
          time_range_start: config.timeRange?.start,
          time_range_end: config.timeRange?.end,
          user_segment: config.userSegment,
          priority: config.priority!,
          rotation_group: config.rotationGroup,
          rotation_interval_minutes: config.rotationIntervalMinutes,
          created_by: user?.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement-configs"] });
      toast({ title: "Announcement created successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to create announcement", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Update announcement
  const updateMutation = useMutation({
    mutationFn: async ({ id, config }: { id: string; config: Partial<AnnouncementConfig> }) => {
      const { data, error } = await supabase
        .from("announcement_configs")
        .update({
          message: config.message,
          cta_text: config.ctaText,
          cta_link: config.ctaLink,
          start_date: config.startDate?.toISOString(),
          end_date: config.endDate?.toISOString(),
          days_of_week: config.daysOfWeek,
          time_range_start: config.timeRange?.start,
          time_range_end: config.timeRange?.end,
          user_segment: config.userSegment,
          priority: config.priority,
          rotation_group: config.rotationGroup,
          rotation_interval_minutes: config.rotationIntervalMinutes,
          is_active: config.priority !== undefined ? true : undefined,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement-configs"] });
      toast({ title: "Announcement updated successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to update announcement", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Delete announcement
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // Fetch announcement before deleting for audit log
      const { data: announcement } = await supabase
        .from("announcement_configs")
        .select("*")
        .eq("id", id)
        .single();

      const { error } = await supabase
        .from("announcement_configs")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Log audit action
      if (announcement) {
        await logAction({
          action: 'delete',
          resourceType: 'announcement',
          resourceId: id,
          oldValues: announcement,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement-configs"] });
      toast({ title: "Announcement deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Failed to delete announcement", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  // Toggle active status
  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase
        .from("announcement_configs")
        .update({ is_active: isActive })
        .eq("id", id);

      if (error) throw error;
      
      // Log audit action
      await logAction({
        action: isActive ? 'activate' : 'pause',
        resourceType: 'announcement',
        resourceId: id,
        newValues: { is_active: isActive },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcement-configs"] });
    },
  });

  return {
    announcements,
    isLoading,
    fetchAnnouncementAnalytics,
    createAnnouncement: createMutation.mutate,
    updateAnnouncement: updateMutation.mutate,
    deleteAnnouncement: deleteMutation.mutate,
    toggleActive: toggleActiveMutation.mutate,
  };
};
