import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GitBranch, CheckCircle, AlertCircle, Clock, ExternalLink } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function GitHubBackupSettings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [repoOwner, setRepoOwner] = useState("");
  const [repoName, setRepoName] = useState("");
  const [isEnabled, setIsEnabled] = useState(true);

  // Fetch current workspace
  const { data: workspace } = useQuery({
    queryKey: ["current-workspace"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("workspaces")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Fetch GitHub integration
  const { data: integration, isLoading } = useQuery({
    queryKey: ["github-integration", workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return null;

      const { data, error } = await supabase
        .from("integrations")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("provider", "github")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!workspace?.id,
  });

  // Fetch backup schedule
  const { data: schedule } = useQuery({
    queryKey: ["backup-schedule", workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return null;

      const { data, error } = await supabase
        .from("backup_schedules")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("backup_type", "github")
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!workspace?.id,
  });

  // Fetch recent backup logs
  const { data: recentBackups } = useQuery({
    queryKey: ["backup-logs", workspace?.id],
    queryFn: async () => {
      if (!workspace?.id) return [];

      const { data, error } = await supabase
        .from("backup_logs")
        .select("*")
        .eq("workspace_id", workspace.id)
        .eq("backup_type", "github")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: !!workspace?.id,
  });

  const configureMutation = useMutation({
    mutationFn: async () => {
      if (!workspace?.id) throw new Error("No workspace found");

      const { data, error } = await supabase.functions.invoke("configure-github-backup", {
        body: {
          githubRepo: `${repoOwner}/${repoName}`,
          enabled: isEnabled,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["github-integration"] });
      queryClient.invalidateQueries({ queryKey: ["backup-schedule"] });
      toast({
        title: "GitHub Backup Configured",
        description: "Your backups are now set up and will run daily at 2AM UTC.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Configuration Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const triggerBackupMutation = useMutation({
    mutationFn: async () => {
      if (!workspace?.id) throw new Error("No workspace found");

      const { data, error } = await supabase.functions.invoke("github-backup", {
        body: {
          workspaceId: workspace.id,
          manual: true,
        },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["backup-logs"] });
      toast({
        title: "Backup Started",
        description: "Your manual backup is running. Check back in a few minutes.",
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

  const isConfigured = integration && integration.is_active;

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/4"></div>
          <div className="h-20 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary/10">
            <GitBranch className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-semibold mb-2 text-foreground">
              GitHub Auto-Backup
            </h3>
            <p className="text-sm text-secondary-label">
              Automatically back up all your links to GitHub every night. Your data stays in your repository, under your control.
            </p>
          </div>
          {isConfigured && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
              <CheckCircle className="h-4 w-4" />
              <span>Active</span>
            </div>
          )}
        </div>

        {!isConfigured ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="repoOwner">GitHub Username or Organization</Label>
              <Input
                id="repoOwner"
                placeholder="octocat"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="repoName">Repository Name</Label>
              <Input
                id="repoName"
                placeholder="utm-one-backups"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
              />
              <p className="text-xs text-secondary-label">
                Repository will be created if it doesn't exist. Must be private.
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="enabled">Enable Daily Backups</Label>
                <p className="text-xs text-secondary-label">
                  Runs every day at 2AM UTC
                </p>
              </div>
              <Switch
                id="enabled"
                checked={isEnabled}
                onCheckedChange={setIsEnabled}
              />
            </div>

            <Button
              onClick={() => configureMutation.mutate()}
              disabled={!repoOwner || !repoName || configureMutation.isPending}
              className="w-full"
            >
              {configureMutation.isPending ? "Connecting..." : "Connect GitHub"}
            </Button>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-foreground">What you'll need:</p>
              <ul className="text-sm text-secondary-label space-y-1 list-disc list-inside">
                <li>A GitHub account (free or paid)</li>
                <li>Permission to create repositories</li>
                <li>GitHub personal access token with repo scope</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Repository</span>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <span className="flex items-center gap-1">
                    View on GitHub
                    <ExternalLink className="h-3 w-3" />
                  </span>
                </Button>
              </div>
              <p className="text-sm text-secondary-label">
                GitHub repository configured (encrypted)
              </p>
            </div>

            {schedule && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-secondary-label" />
                    <span className="text-sm font-medium text-foreground">Last Backup</span>
                  </div>
                  <p className="text-sm text-secondary-label">
                    {schedule.last_backup_at
                      ? new Date(schedule.last_backup_at).toLocaleString()
                      : "Never"}
                  </p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-secondary-label" />
                    <span className="text-sm font-medium text-foreground">Next Backup</span>
                  </div>
                  <p className="text-sm text-secondary-label">
                    {schedule.next_backup_at
                      ? new Date(schedule.next_backup_at).toLocaleString()
                      : "Scheduled"}
                  </p>
                </div>
              </div>
            )}

            <Button
              onClick={() => triggerBackupMutation.mutate()}
              disabled={triggerBackupMutation.isPending}
              variant="outline"
              className="w-full"
            >
              {triggerBackupMutation.isPending ? "Running..." : "Run Backup Now"}
            </Button>
          </div>
        )}
      </Card>

      {/* Recent Backups */}
      {recentBackups && recentBackups.length > 0 && (
        <Card className="p-6">
          <h3 className="font-display text-lg font-semibold mb-4 text-foreground">
            Recent Backups
          </h3>
          <div className="space-y-3">
            {recentBackups.map((backup) => (
              <div
                key={backup.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  {backup.status === "completed" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-600" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {new Date(backup.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-secondary-label">
                      {new Date(backup.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground capitalize">
                    {backup.status}
                  </p>
                  {backup.file_path && (
                    <a
                      href={backup.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs hover:underline text-primary"
                    >
                      View File
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
