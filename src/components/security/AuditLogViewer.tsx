import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Clock, User, FileText, Shield } from "lucide-react";
import { format } from "date-fns";
import { AuditLogDiff } from "./AuditLogDiff";

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  admin_user_id: string;
  old_values: any;
  new_values: any;
  created_at: string;
  changed_by_role: string | null;
  ip_address: string | null;
  user_agent: string | null;
}

export const AuditLogViewer = () => {
  const { currentWorkspace } = useWorkspace();
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as AuditLog[];
    },
    enabled: !!currentWorkspace?.id,
  });

  const getActionColor = (action: string) => {
    if (action.includes('create')) return 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400';
    if (action.includes('update')) return 'bg-amber-500/10 text-amber-700 dark:text-amber-400';
    if (action.includes('delete')) return 'bg-destructive/10 text-destructive';
    if (action.includes('approve')) return 'bg-blue-500/10 text-blue-700 dark:text-blue-400';
    return 'bg-muted text-muted-foreground';
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'rgba(59,130,246,1)' }}></div>
        </div>
      </Card>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center space-y-3">
          <Shield className="w-12 h-12 mx-auto text-muted-foreground opacity-50" />
          <h3 className="text-headline font-display font-semibold text-label">no audit logs yet</h3>
          <p className="text-body-apple text-secondary-label">
            workspace actions will be tracked here for security and compliance
          </p>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-0 overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-headline font-display font-semibold text-label mb-1">audit trail</h2>
              <p className="text-body-apple text-secondary-label">
                forensic timeline of all workspace changes
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {logs.length} events
            </Badge>
          </div>
        </div>

        <ScrollArea className="h-[600px]">
          <div className="p-6 space-y-3">
            {logs.map((log, index) => (
              <button
                key={log.id}
                onClick={() => setSelectedLog(log)}
                className="w-full text-left group"
              >
                <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors">
                  {/* Timeline dot */}
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full mt-2" style={{ background: 'rgba(59,130,246,1)' }} />
                    {index < logs.length - 1 && (
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-px h-[calc(100%+12px)] bg-border" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getActionColor(log.action)}>
                        {log.action}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {log.resource_type}
                      </Badge>
                      {log.changed_by_role && (
                        <Badge variant="secondary" className="text-xs">
                          {log.changed_by_role}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-secondary-label">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{format(new Date(log.created_at), 'MMM d, yyyy h:mm a')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span className="truncate max-w-[200px]">
                          {log.admin_user_id.slice(0, 8)}...
                        </span>
                      </div>
                      {(log.old_values || log.new_values) && (
                        <div className="flex items-center gap-1" style={{ color: 'rgba(59,130,246,1)' }}>
                          <FileText className="w-3 h-3" />
                          <span>view changes</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Diff Dialog */}
      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-headline font-display">
              audit log details
            </DialogTitle>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">Action</div>
                  <Badge className={getActionColor(selectedLog.action)}>
                    {selectedLog.action}
                  </Badge>
                </div>
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">Resource</div>
                  <Badge variant="outline">{selectedLog.resource_type}</Badge>
                </div>
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">Timestamp</div>
                  <div className="text-body-apple text-label">
                    {format(new Date(selectedLog.created_at), 'PPpp')}
                  </div>
                </div>
                <div>
                  <div className="text-caption-1-apple text-tertiary-label mb-1">User Role</div>
                  <Badge variant="secondary">
                    {selectedLog.changed_by_role || 'unknown'}
                  </Badge>
                </div>
              </div>

              {/* Diff View */}
              {(selectedLog.old_values || selectedLog.new_values) && (
                <AuditLogDiff
                  oldValues={selectedLog.old_values}
                  newValues={selectedLog.new_values}
                />
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
