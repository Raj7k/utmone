import { useState } from "react";
import { GitBranch, Download, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Backups = () => {
  const [githubEnabled, setGithubEnabled] = useState(false);
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectGitHub = async () => {
    if (!githubToken || !githubRepo) {
      toast.error("Please provide GitHub token and repository");
      return;
    }

    setIsConnecting(true);
    try {
      const { data, error } = await supabase.functions.invoke("configure-github-backup", {
        body: { githubToken, githubRepo, enabled: true },
      });

      if (error) throw error;

      setGithubEnabled(true);
      toast.success("GitHub backup configured successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to configure GitHub backup");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleManualExport = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("export-links");
      
      if (error) throw error;

      // Create download link
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `utm-one-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Link database exported successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to export links");
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold text-foreground mb-4">
            Backup & Data Export
          </h1>
          <p className="text-lg text-muted-foreground">
            Own your data with automated GitHub backups and manual exports.
          </p>
        </div>

        {/* GitHub Auto-Backup */}
        <Card className="p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <GitBranch className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.9)' }} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                GitHub Auto-Backup
              </h2>
              <p className="text-muted-foreground mb-6">
                Automatically backup your entire link database to a private GitHub repository every night at 2 AM UTC.
              </p>

              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/20">
                  <div>
                    <p className="font-medium text-foreground">Enable Nightly Backups</p>
                    <p className="text-sm text-muted-foreground">Automatically push to GitHub every night</p>
                  </div>
                  <Switch
                    checked={githubEnabled}
                    onCheckedChange={setGithubEnabled}
                    aria-label="Enable GitHub auto-backup"
                  />
                </div>

                {githubEnabled && (
                  <div className="space-y-4 p-4 rounded-lg border border-border">
                    <div>
                      <Label htmlFor="githubToken">GitHub Personal Access Token</Label>
                      <Input
                        id="githubToken"
                        type="password"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxxx"
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        <a 
                          href="https://github.com/settings/tokens/new?scopes=repo" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="hover:underline inline-flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.9)' }}
                        >
                          Create token with 'repo' scope
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="githubRepo">GitHub Repository</Label>
                      <Input
                        id="githubRepo"
                        placeholder="username/utm-one-backups"
                        value={githubRepo}
                        onChange={(e) => setGithubRepo(e.target.value)}
                        className="mt-2"
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Format: username/repository-name
                      </p>
                    </div>

                    <Button 
                      onClick={handleConnectGitHub}
                      disabled={isConnecting}
                      className="w-full"
                    >
                      {isConnecting ? "Connecting..." : "Connect GitHub"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Your data, your control:</strong> Backups are pushed to YOUR private repository. 
              utm.one never stores or accesses your GitHub token after initial connection.
            </div>
          </div>
        </Card>

        {/* Manual Export */}
        <Card className="p-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Download className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.9)' }} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Manual Export
              </h2>
              <p className="text-muted-foreground mb-6">
                Download your complete link database as JSON right now. Includes all links, UTM parameters, and click analytics.
              </p>
              <Button onClick={handleManualExport} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export All Links (JSON)
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Backups;
