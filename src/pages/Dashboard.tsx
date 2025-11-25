import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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
import { MobileNav } from "@/components/mobile/MobileNav";
import { AIRecommendationsWidget } from "@/components/dashboard/AIRecommendationsWidget";
import { PerformanceMetrics } from "@/components/dashboard/PerformanceMetrics";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { GlanceableMetrics } from "@/components/dashboard/GlanceableMetrics";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { CreateLinkInline } from "@/components/link/CreateLinkInline";
import { FeatureHint } from "@/components/FeatureHint";
import { AppHeader } from "@/components/layout/AppHeader";

const Dashboard = () => {
  const navigate = useNavigate();
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

  if (isLoading || workspaceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grouped-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-body-apple text-secondary-label">loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Main Content */}
      <main className="container mx-auto px-4 md:px-8 py-group bg-grouped-background min-h-screen">
        <UsageLimitBanner />
        
        {/* Feature Hint for Dashboard */}
        <FeatureHint
          id="dashboard-welcome"
          title="Welcome To Your Dashboard"
          description="This is your quick overview of link performance and recent activity. Create your first link to get started."
          className="mb-content"
        />
        
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

        {/* Glanceable Metrics - New Redesigned Component */}
        {currentWorkspace && (
          <div className="mb-content">
            <GlanceableMetrics />
          </div>
        )}

        {/* Create Link Inline - Optimized Flow */}
        {currentWorkspace && (
          <div className="mb-content">
            <CreateLinkInline workspaceId={currentWorkspace.id} />
          </div>
        )}

        {/* AI Insights & Recent Activity Side by Side */}
        {currentWorkspace && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-card mb-content">
            <AIInsights />
            <RecentActivity />
          </div>
        )}

        {/* Quick Actions - Keep existing for keyboard shortcuts */}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-card mb-content">
            <AIRecommendationsWidget workspaceId={currentWorkspace.id} />
            <PerformanceMetrics workspaceId={currentWorkspace.id} />
          </div>
        )}

        {/* Transparency & Security */}
        {currentWorkspace && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-card mb-content">
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
