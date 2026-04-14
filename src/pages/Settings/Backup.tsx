import { useState } from "react";
import { Github, Download, Clock, CheckCircle2, AlertCircle, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Backup() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isExporting, setIsExporting] = useState(false);

  // Get current workspace
  const { data: workspaces } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const currentWorkspace = workspaces?.[0];

  // Fetch backup schedule
  const { data: backupSchedule } = useQuery({
    queryKey: ["backup-schedule", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return null;

      const { data, error } = await supabaseFrom('backup_schedules')
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .eq("backup_type", "github")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace,
  });

  // Fetch backup logs
  const { data: backupLogs } = useQuery({
    queryKey: ["backup-logs", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];

      const { data, error } = await supabaseFrom('backup_logs')
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace,
  });

  // Fetch GitHub integration
  const { data: githubIntegration } = useQuery({
    queryKey: ["github-integration", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return null;

      const { data, error } = await supabaseFrom('integrations')
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .eq("provider", "github")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace,
  });

  // Manual export mutation
  const exportMutation = useMutation({
    mutationFn: async (format: 'json' | 'csv' | 'sql') => {
      setIsExporting(true);
      
      const { data: links, error } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", currentWorkspace?.id || "");

      if (error) throw error;

      let content = '';
      let filename = '';

      if (format === 'json') {
        content = JSON.stringify(links, null, 2);
        filename = `utm-one-backup-${new Date().toISOString()}.json`;
      } else if (format === 'csv') {
        const headers = Object.keys(links[0] || {}).join(',');
        const rows = links.map(link => 
          Object.values(link).map(v => `"${v}"`).join(',')
        );
        content = [headers, ...rows].join('\n');
        filename = `utm-one-backup-${new Date().toISOString()}.csv`;
      } else if (format === 'sql') {
        const tableName = 'links';
        const inserts = links.map(link => {
          const columns = Object.keys(link).join(', ');
          const values = Object.values(link).map(v => 
            typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v
          ).join(', ');
          return `INSERT INTO ${tableName} (${columns}) VALUES (${values});`;
        });
        content = inserts.join('\n');
        filename = `utm-one-backup-${new Date().toISOString()}.sql`;
      }

      // Download file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      setIsExporting(false);
    },
    onSuccess: () => {
      toast({
        title: "Export Complete",
        description: "Your workspace data has been exported successfully.",
      });
    },
    onError: (error: Error) => {
      setIsExporting(false);
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Trigger manual GitHub backup
  const githubBackupMutation = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('github-backup', {
        body: { 
          workspaceId: currentWorkspace?.id,
          manual: true,
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backup-logs"] });
      toast({
        title: "GitHub Backup Started",
        description: "Your data is being backed up to GitHub.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Backup Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Backup & Export</h1>
        <p className="text-muted-foreground">
          Manage your data backups and exports. Your data, your control.
        </p>
      </div>

      {/* GitHub Backup */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10">
            <Github className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Automatic GitHub Backups</h2>
            <p className="text-muted-foreground">
              Connect your GitHub account to automatically backup all your links every night.
            </p>
          </div>
        </div>

        {githubIntegration ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Connected to GitHub</p>
                  <p className="text-sm text-muted-foreground">
                    Last backup: {backupSchedule?.last_backup_at 
                      ? new Date(backupSchedule.last_backup_at).toLocaleString() 
                      : 'Never'}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => githubBackupMutation.mutate()}
                disabled={githubBackupMutation.isPending}
              >
                {githubBackupMutation.isPending ? "Backing up..." : "Backup Now"}
              </Button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Enable Automatic Backups</Label>
                <Switch checked={backupSchedule?.is_enabled} />
              </div>
              
              <div className="flex items-center justify-between">
                <Label>Backup Frequency</Label>
                <Select value={backupSchedule?.frequency || "daily"}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ) : (
          <Button className="w-full">
            <Github className="h-4 w-4 mr-2" />
            Connect GitHub
          </Button>
        )}
      </Card>

      {/* Manual Export */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10">
            <Download className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Manual Export</h2>
            <p className="text-muted-foreground">
              Download your workspace data in multiple formats.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button
            variant="outline"
            onClick={() => exportMutation.mutate('json')}
            disabled={isExporting}
          >
            Export JSON
          </Button>
          <Button
            variant="outline"
            onClick={() => exportMutation.mutate('csv')}
            disabled={isExporting}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => exportMutation.mutate('sql')}
            disabled={isExporting}
          >
            Export SQL
          </Button>
        </div>
      </Card>

      {/* Self-Hosting */}
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-primary/10">
            <Server className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-2">Self-Hosting with Docker</h2>
            <p className="text-muted-foreground">
              Run utm.one on your own infrastructure with complete independence.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg">
            <code className="text-sm">docker-compose up -d</code>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <a href="https://github.com/utm-one/self-hosted" target="_blank" rel="noopener noreferrer">
              View Documentation
            </a>
          </Button>
        </div>
      </Card>

      {/* Recent Backups */}
      {backupLogs && backupLogs.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Backups</h2>
          <div className="space-y-2">
            {backupLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  {log.status === 'completed' ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <div>
                    <p className="text-sm font-medium capitalize">{log.backup_type} Backup</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                {log.file_path && (
                  <Button variant="ghost" size="sm" asChild>
                    <a href={log.file_path} target="_blank" rel="noopener noreferrer">
                      View
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}