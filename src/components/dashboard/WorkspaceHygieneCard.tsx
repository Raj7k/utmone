import { AlertTriangle, Archive, CheckCircle2, Trash2, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export const WorkspaceHygieneCard = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["hygiene-notifications", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from("workspace_hygiene_notifications")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .eq("dismissed", false)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  const dismissMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from("workspace_hygiene_notifications")
        .update({ 
          dismissed: true, 
          dismissed_at: new Date().toISOString() 
        })
        .eq("id", notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hygiene-notifications"] });
      toast.success("notification dismissed");
    },
    onError: (error) => {
      toast.error("failed to dismiss notification");
      console.error("Error dismissing notification:", error);
    },
  });

  const bulkArchiveMutation = useMutation({
    mutationFn: async (linkIds: string[]) => {
      const { error } = await supabase
        .from("links")
        .update({ status: "archived" })
        .in("id", linkIds);

      if (error) throw error;
      return linkIds.length;
    },
    onSuccess: (count, linkIds) => {
      // Find and dismiss the notification
      const staleNotif = notifications?.find(n => n.notification_type === "stale_links");
      if (staleNotif) {
        dismissMutation.mutate(staleNotif.id);
      }
      
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast.success(`archived ${count} stale links`);
    },
    onError: (error) => {
      toast.error("failed to archive links");
      console.error("Error archiving links:", error);
    },
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/3"></div>
          <div className="h-4 bg-muted rounded w-2/3"></div>
        </div>
      </Card>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <Card className="p-6 border-border/50 bg-card">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
            <CheckCircle2 className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-display font-semibold text-foreground">
              workspace is clean
            </h3>
            <p className="text-sm text-muted-foreground">
              no stale data or cleanup suggestions at the moment
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const isStaleLinks = notification.notification_type === "stale_links";
        const isBrokenQR = notification.notification_type === "broken_qr_codes";
        
        return (
          <Card key={notification.id} className="p-6 border-amber-200/50 bg-amber-50/50 dark:border-amber-900/30 dark:bg-amber-950/20">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
                {isBrokenQR ? (
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                ) : (
                  <Trash2 className="h-5 w-5 text-amber-600 dark:text-amber-500" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-display font-semibold text-foreground">
                      {isStaleLinks && "stale links detected"}
                      {isBrokenQR && "deleted link accessed"}
                      {notification.notification_type === "deprecated_tags" && "deprecated utm tags"}
                    </h3>
                    <Badge variant="outline" className="bg-background/50">
                      {notification.item_count}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {isStaleLinks && `found ${notification.item_count} links with no traffic in 30+ days`}
                    {isBrokenQR && "someone just accessed a deleted link with physical QR code"}
                    {notification.notification_type === "deprecated_tags" && `${notification.item_count} utm tags haven't been used in 6+ months`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {isStaleLinks && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        const linkIds = notification.item_ids as string[];
                        bulkArchiveMutation.mutate(linkIds);
                      }}
                      disabled={bulkArchiveMutation.isPending}
                    >
                      <Archive className="h-4 w-4 mr-2" />
                      archive all
                    </Button>
                  )}

                  {isBrokenQR && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => {
                        // Navigate to link details
                        const linkId = (notification.item_ids as string[])[0];
                        window.location.href = `/dashboard/links/${linkId}`;
                      }}
                    >
                      restore link
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => dismissMutation.mutate(notification.id)}
                    disabled={dismissMutation.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    dismiss
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};