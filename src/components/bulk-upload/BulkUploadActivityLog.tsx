import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity } from "lucide-react";
import { useBulkUploadActivity } from "@/hooks/useBulkUploadActivity";
import { useWorkspaceMembers } from "@/hooks/useWorkspaceMembers";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface BulkUploadActivityLogProps {
  bulkUploadId: string;
  workspaceId: string;
}

const actionTypeLabels: Record<string, string> = {
  created: "Created upload",
  processed: "Processed links",
  commented: "Added comment",
  approval_requested: "Requested approval",
  approved: "Approved request",
  rejected: "Rejected request",
  template_saved: "Saved template",
  template_applied: "Applied template",
  assigned: "Assigned upload",
};

const actionTypeStyles: Record<string, { background: string; color: string }> = {
  created: { background: 'hsl(var(--primary) / 0.15)', color: 'hsl(var(--primary))' },
  processed: { background: 'rgba(34,197,94,0.15)', color: 'rgba(34,197,94,0.9)' },
  commented: { background: 'rgba(168,85,247,0.15)', color: 'rgba(168,85,247,0.9)' },
  approval_requested: { background: 'rgba(234,179,8,0.15)', color: 'rgba(234,179,8,0.9)' },
  approved: { background: 'rgba(34,197,94,0.15)', color: 'rgba(34,197,94,0.9)' },
  rejected: { background: 'rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.9)' },
  template_saved: { background: 'rgba(99,102,241,0.15)', color: 'rgba(99,102,241,0.9)' },
  template_applied: { background: 'rgba(6,182,212,0.15)', color: 'rgba(6,182,212,0.9)' },
  assigned: { background: 'rgba(249,115,22,0.15)', color: 'rgba(249,115,22,0.9)' },
};

export function BulkUploadActivityLog({ bulkUploadId, workspaceId }: BulkUploadActivityLogProps) {
  const { activities, isLoading } = useBulkUploadActivity(bulkUploadId);
  const { getMemberName, getMemberAvatar } = useWorkspaceMembers(workspaceId);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('bulk-upload-activity')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bulk_upload_activity',
          filter: `bulk_upload_id=eq.${bulkUploadId}`
        },
        () => {
          // Trigger refetch
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bulkUploadId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
        <CardDescription>
          track all actions and changes for this bulk upload
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              loading activity...
            </div>
          ) : activities.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-8">
              no activity recorded yet
            </div>
          ) : (
            <div className="relative space-y-4">
              {/* Timeline line */}
              <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

              {activities.map((activity) => (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-background flex items-center justify-center" style={{ border: '2px solid rgba(255,255,255,0.3)' }}>
                    <div className="w-2 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.6)' }} />
                  </div>

                  {/* Activity content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={getMemberAvatar(activity.user_id) || undefined} />
                          <AvatarFallback className="text-xs">
                            {getMemberName(activity.user_id)[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium text-sm">
                            {getMemberName(activity.user_id)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        style={actionTypeStyles[activity.action_type] || { background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}
                      >
                        {actionTypeLabels[activity.action_type] || activity.action_type}
                      </Badge>
                    </div>

                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="text-sm text-muted-foreground">
                        {activity.metadata.links_count && (
                          <span>{activity.metadata.links_count} links</span>
                        )}
                        {activity.metadata.template_name && (
                          <span>Template: {activity.metadata.template_name}</span>
                        )}
                        {activity.metadata.notes && (
                          <span className="block mt-1 italic">{activity.metadata.notes}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
