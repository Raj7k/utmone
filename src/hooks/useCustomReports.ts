import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { toast } from "sonner";

export interface CustomReport {
  id: string;
  workspace_id: string;
  report_name: string;
  report_type: string;
  report_config: Record<string, any>;
  is_scheduled: boolean;
  schedule_frequency?: string;
  schedule_recipients?: string[];
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useCustomReports = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["custom-reports", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('custom_reports')
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as CustomReport[];
    },
    enabled: !!workspaceId,
  });

  const createReport = useMutation({
    mutationFn: async (report: Omit<CustomReport, "id" | "created_at" | "updated_at" | "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabaseFrom('custom_reports')
        .insert({
          ...report,
          workspace_id: workspaceId,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-reports", workspaceId] });
      toast.success("Report created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create report");
    },
  });

  const updateReport = useMutation({
    mutationFn: async ({ reportId, updates }: { reportId: string; updates: Partial<CustomReport> }) => {
      const { error } = await supabaseFrom('custom_reports')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-reports", workspaceId] });
      toast.success("Report updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update report");
    },
  });

  const deleteReport = useMutation({
    mutationFn: async (reportId: string) => {
      const { error } = await supabaseFrom('custom_reports')
        .delete()
        .eq("id", reportId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom-reports", workspaceId] });
      toast.success("Report deleted");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete report");
    },
  });

  return {
    reports,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
  };
};
