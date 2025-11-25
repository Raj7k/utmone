import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { useWorkspace } from "@/hooks/useWorkspace";
import { UsageLimitBanner } from "@/components/UsageLimitBanner";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { KeyboardShortcutsHelp } from "@/components/KeyboardShortcutsHelp";
import { useAnomalies } from "@/hooks/useAnomalies";
import { AnomalyAlert } from "@/components/analytics/AnomalyAlert";
import { RecentLinksWidget } from "@/components/dashboard/RecentLinksWidget";
import { TransparencyCard } from "@/components/dashboard/TransparencyCard";
import { SecurityOverviewWidget } from "@/components/dashboard/SecurityOverviewWidget";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { GlanceableStats } from "@/components/dashboard/GlanceableStats";
import { MobileNav } from "@/components/mobile/MobileNav";
import { useGesture } from "@use-gesture/react";
import { AIRecommendationsWidget } from "@/components/dashboard/AIRecommendationsWidget";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const { currentWorkspace, isLoading: workspaceLoading, createWorkspace } = useWorkspace();
  const { data: anomalies, invalidate: invalidateAnomalies } = useAnomalies(currentWorkspace?.id || '');

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onCreateLink: () => {},
    onShowHelp: () => setShowShortcutsHelp(true),
  });

  // Check for onboarding progress
  const [hasLinks, setHasLinks] = useState(false);
  const [hasQrCodes, setHasQrCodes] = useState(false);

  useEffect(() => {
    const checkProgress = async () => {
      if (!currentWorkspace) return;

      const { data: links } = await supabase
        .from('links')
        .select('id')
        .eq('workspace_id', currentWorkspace.id)
        .limit(1);
      
      setHasLinks(!!links && links.length > 0);

      if (links && links.length > 0) {
        const { data: qrs } = await supabase
          .from('qr_codes')
          .select('id')
          .in('link_id', links.map(l => l.id))
          .limit(1);
        
        setHasQrCodes(!!qrs && qrs.length > 0);
      }
    };

    checkProgress();
  }, [currentWorkspace]);

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
      <header className="h-[72px] border-b border-separator bg-system-background/80 backdrop-blur-xl sticky top-0 z-50">
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
                <Button variant="system" size="sm">dashboard</Button>
                <Button variant="system-tertiary" size="sm" onClick={() => navigate("/links")}>
                  links
                </Button>
                <Button variant="system-tertiary" size="sm" onClick={() => navigate("/analytics")}>
                  analytics
                </Button>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-footnote text-secondary-label hidden md:block">{user?.email}</span>
              <Button variant="system-tertiary" size="icon" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-8 py-group bg-grouped-background min-h-screen">
        <UsageLimitBanner />
        
        {/* Welcome Section */}
        <div className="mb-content">
          <h1 className="text-large-title font-bold text-label mb-2">welcome back</h1>
          <p className="text-body-apple text-secondary-label">here's what's happening with your links today.</p>
        </div>

        {/* Anomalies */}
        {currentWorkspace && anomalies && anomalies.length > 0 && (
          <div className="space-y-4 mb-content">
            <h2 className="text-title-2 font-semibold text-label">anomalies detected</h2>
            {anomalies.slice(0, 3).map((anomaly) => (
              <AnomalyAlert 
                key={anomaly.id} 
                anomaly={anomaly} 
                onDismiss={invalidateAnomalies}
              />
            ))}
          </div>
        )}

        {/* Onboarding Checklist */}
        {currentWorkspace && (
          <div className="mb-content">
            <OnboardingChecklist
              hasLinks={hasLinks}
              hasQrCodes={hasQrCodes}
              hasViewedAnalytics={false}
              hasInvitedTeam={false}
              hasCustomDomain={false}
            />
          </div>
        )}

        {/* Glanceable Stats */}
        {currentWorkspace && (
          <div className="mb-content">
            <GlanceableStats workspaceId={currentWorkspace.id} />
          </div>
        )}

        {/* Quick Actions */}
        {currentWorkspace && (
          <div className="mb-content">
            <QuickActions 
              workspaceId={currentWorkspace.id}
              hasLinks={hasLinks}
              hasQrCodes={hasQrCodes}
            />
          </div>
        )}

        {/* AI Recommendations & Performance Side by Side */}
        {currentWorkspace && (
          <div className="grid md:grid-cols-2 gap-card mb-content">
            <AIRecommendationsWidget workspaceId={currentWorkspace.id} />
            <PerformanceMetrics workspaceId={currentWorkspace.id} />
          </div>
        )}

        {/* Transparency & Security */}
        {currentWorkspace && (
          <div className="grid md:grid-cols-2 gap-card mb-content">
            <TransparencyCard />
            <SecurityOverviewWidget workspaceId={currentWorkspace.id} />
          </div>
        )}

        {/* Recent Links Widget */}
        {currentWorkspace && (
          <RecentLinksWidget workspaceId={currentWorkspace.id} />
        )}

        {/* Keyboard Shortcuts Help */}
        <KeyboardShortcutsHelp 
          open={showShortcutsHelp}
          onOpenChange={setShowShortcutsHelp}
        />
      </main>

      {/* Mobile Navigation */}
      <MobileNav />
    </div>
  );
};

export default Dashboard;
