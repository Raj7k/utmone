import { useState } from "react";
import { Download, CheckCircle2, AlertCircle, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function Backup() {
  const { toast } = useToast();
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

  // Fetch backup logs (manual exports only)
  const { data: backupLogs } = useQuery({
    queryKey: ["backup-logs", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];

      const { data, error } = await supabase
        .from("backup_logs")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .neq("backup_type", "github")
        .order("created_at", { ascending: false })
        .limit(10);

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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Backup & Export</h1>
        <p className="text-muted-foreground">
          Manage your data backups and exports. Your data, your control.
        </p>
      </div>

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
          <h2 className="text-xl font-semibold mb-4">Recent Exports</h2>
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
                    <p className="text-sm font-medium capitalize">{log.backup_type} Export</p>
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
