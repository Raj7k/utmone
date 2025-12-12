import { useState, useCallback, useEffect, startTransition } from "react";
import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { DemoModeBanner } from "@/components/dashboard/DemoModeBanner";
import { WelcomeModal } from "@/components/dashboard/WelcomeModal";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { FirstRunExperience } from "@/components/dashboard/FirstRunExperience";
import { FirstLinkSuccess } from "@/components/dashboard/FirstLinkSuccess";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useQueryClient } from "@tanstack/react-query";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

// Skeleton for data sections only (not full page)
const ContentSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="h-32 bg-muted rounded-2xl" />
    <div className="h-48 bg-muted rounded-2xl" />
  </div>
);

const DashboardHome = () => {
  const { showDemoMode } = useDemoMode();
  const { hasLinks, isLoading: isLoadingProgress, isFetched } = useOnboardingProgress();
  const { currentWorkspace, isWorkspaceLoading, retry } = useWorkspaceContext();

  // Delayed skeleton - only show after 500ms to prevent flash
  const [showSkeleton, setShowSkeleton] = useState(false);
  
  // Workspace timeout fallback - show retry after 3 seconds
  const [workspaceTimeout, setWorkspaceTimeout] = useState(false);

  // Delayed skeleton logic
  useEffect(() => {
    if (isLoadingProgress && !isFetched) {
      const timer = setTimeout(() => setShowSkeleton(true), 500);
      return () => clearTimeout(timer);
    }
    setShowSkeleton(false);
  }, [isLoadingProgress, isFetched]);

  // Workspace timeout logic
  useEffect(() => {
    if (isWorkspaceLoading && !currentWorkspace) {
      const timer = setTimeout(() => setWorkspaceTimeout(true), 3000);
      return () => clearTimeout(timer);
    }
    setWorkspaceTimeout(false);
  }, [isWorkspaceLoading, currentWorkspace]);

  // Complete navigation as soon as we have any data (cached or fresh)
  useEffect(() => {
    if (isFetched) {
      completeNavigation();
    }
  }, [isFetched]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdLinkUrl, setCreatedLinkUrl] = useState("");
  const queryClient = useQueryClient();

  const handleLinkCreated = useCallback(() => {
    // Use startTransition for non-urgent cache invalidation
    startTransition(() => {
      queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
      queryClient.invalidateQueries({ queryKey: ['activity-feed'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-links-count'] });
    });
    
    const slug = Math.random().toString(36).substring(2, 8);
    setCreatedLinkUrl(`utm.one/${slug}`);
    setShowSuccess(true);
  }, [queryClient]);

  const handleContinue = useCallback(() => {
    setShowSuccess(false);
  }, []);

  // Workspace timeout - show retry option
  if (workspaceTimeout && !currentWorkspace) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <p className="text-muted-foreground text-center">
            taking longer than expected to load your workspace...
          </p>
          <Button variant="outline" onClick={retry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            retry
          </Button>
        </div>
      </div>
    );
  }

  // First-run experience for users without links
  if (!hasLinks && !showSuccess) {
    return (
      <ErrorBoundary section="dashboard-home">
        <WelcomeModal onLinkCreated={handleLinkCreated} />
        <FirstRunExperience onLinkCreated={handleLinkCreated} />
      </ErrorBoundary>
    );
  }

  // Success celebration
  if (showSuccess) {
    return (
      <ErrorBoundary section="dashboard-home">
        <FirstLinkSuccess 
          shortUrl={createdLinkUrl} 
          onContinue={handleContinue} 
        />
      </ErrorBoundary>
    );
  }

  // Regular dashboard - render immediately
  return (
    <ErrorBoundary section="dashboard-home">
      <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
        {showDemoMode && (
          <ErrorBoundary section="demo-mode-banner">
            <DemoModeBanner />
          </ErrorBoundary>
        )}

        <ErrorBoundary section="onboarding-checklist">
          <OnboardingChecklist />
        </ErrorBoundary>

        <ErrorBoundary section="quick-actions">
          <div className="animate-fade-in">
            <DashboardQuickActions />
          </div>
        </ErrorBoundary>

        <ErrorBoundary section="quick-create">
          <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <QuickCreateTile />
          </div>
        </ErrorBoundary>

        <ErrorBoundary section="quick-stats">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <QuickStats />
          </div>
        </ErrorBoundary>

        <ErrorBoundary section="activity-feed">
          <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
            <ActivityFeed />
          </div>
        </ErrorBoundary>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardHome;
