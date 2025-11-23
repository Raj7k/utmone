import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, QrCode, BarChart3, Plus, LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { useWorkspace } from "@/hooks/useWorkspace";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { AIInsightCard } from "@/components/analytics/AIInsightCard";
import { useAnomalies } from "@/hooks/useAnomalies";
import { AnomalyAlert } from "@/components/analytics/AnomalyAlert";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [createLinkDialogOpen, setCreateLinkDialogOpen] = useState(false);
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();
  const { data: anomalies, invalidate: invalidateAnomalies } = useAnomalies(currentWorkspace?.id || '');

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCreateLink: () => setCreateLinkDialogOpen(true),
    onShowHelp: () => setShowShortcutsHelp(true),
  });

  useEffect(() => {
    // Check authentication
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const initWorkspace = async () => {
      if (!workspaceLoading && !currentWorkspace && user) {
        createWorkspace("My Workspace");
      }
    };
    initWorkspace();
  }, [workspaceLoading, currentWorkspace, user, createWorkspace]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="h-[72px] border-b border-border bg-white/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <img 
                  src="/src/assets/utm-one-logo.svg" 
                  alt="utm.one" 
                  className="h-7 w-auto"
                />
              </div>
              <nav className="hidden md:flex items-center gap-2">
                <Button variant="default" size="sm" className="h-9">dashboard</Button>
                <Button variant="ghost" size="sm" className="h-9" onClick={() => navigate("/links")}>
                  links
                </Button>
                <Button variant="ghost" size="sm" className="h-9" onClick={() => navigate("/analytics")}>
                  analytics
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-small-text text-muted-foreground hidden md:block">{user?.email}</span>
              <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-group">
        <UsageLimitBanner />
        
        {/* AI Insights */}
        {currentWorkspace && (
          <>
            <div className="mb-content">
              <AIInsightCard workspaceId={currentWorkspace.id} />
            </div>
            
            {anomalies && anomalies.length > 0 && (
              <div className="space-y-4 mb-content">
                <h2 className="text-xl font-semibold">anomalies detected</h2>
                {anomalies.slice(0, 3).map((anomaly) => (
                  <AnomalyAlert 
                    key={anomaly.id} 
                    anomaly={anomaly} 
                    onDismiss={invalidateAnomalies}
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        <div className="mb-content">
          <h1 className="text-heading-3 font-bold mb-2">welcome back</h1>
          <p className="text-body-text text-muted-foreground">here's what's happening with your links today.</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-card mb-content">
          <Card className="hover:shadow-lg transition-apple">
            <CardHeader>
              <div className="flex items-center gap-2">
                <LinkIcon className="h-8 w-8 text-primary" />
                <CardTitle>Create Short Link</CardTitle>
              </div>
              <CardDescription>Generate a branded short URL with UTM parameters</CardDescription>
            </CardHeader>
            <CardContent>
              {currentWorkspace ? (
                <CreateLinkDialog 
                  workspaceId={currentWorkspace.id}
                  open={createLinkDialogOpen}
                  onOpenChange={setCreateLinkDialogOpen}
                />
              ) : (
                <Button className="w-full bg-gradient-primary" disabled>
                  <Plus className="h-4 w-4 mr-2" />
                  loading...
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-apple cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <QrCode className="h-8 w-8 text-secondary" />
                <CardTitle>Generate QR Code</CardTitle>
              </div>
              <CardDescription>Create a branded QR code for your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="secondary">
                <Plus className="h-4 w-4 mr-2" />
                generate qr
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-apple cursor-pointer">
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-8 w-8 text-success" />
                <CardTitle>View Analytics</CardTitle>
              </div>
              <CardDescription>Track performance and campaign metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline">
                view analytics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-content">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">No links created yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Clicks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">Across all links</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>QR Codes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">Generated this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">Running campaigns</p>
            </CardContent>
          </Card>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <LinkIcon className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">you don't have any links yet.</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              start by creating your first one.
            </p>
            <Button className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              create link
            </Button>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp 
          open={showShortcutsHelp}
          onOpenChange={setShowShortcutsHelp}
        />
      </main>
    </div>
  );
};

export default Dashboard;
