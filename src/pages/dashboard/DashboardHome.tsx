import { useState, useCallback, useEffect, startTransition, lazy, Suspense } from "react";
import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { DemoModeBanner } from "@/components/dashboard/DemoModeBanner";
import { WelcomeModal } from "@/components/dashboard/WelcomeModal";
import { DashboardQuickActions } from "@/components/dashboard/DashboardQuickActions";
import { FirstRunExperience } from "@/components/dashboard/FirstRunExperience";
import { FirstLinkSuccess } from "@/components/dashboard/FirstLinkSuccess";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useDashboardUnified } from "@/hooks/useDashboardUnified";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useQueryClient } from "@tanstack/react-query";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { DashboardContentLoader } from "@/components/loading/DashboardContentLoader";
import { LazySection } from "@/components/loading/LazySection";
import { ActivityFeedSkeleton } from "@/components/loading/CardSkeleton";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";

const DashboardHome = () => {
  const { showDemoMode } = useDemoMode();
  const { currentWorkspace, isWorkspaceLoading, retry } = useWorkspaceContext();
  
  // CONSOLIDATED: Single unified query - passes data to child components
  const { links, stats, onboarding, isFetching, isFetched, isLoading, isStale, refetch } = useDashboardUnified();
  const hasLinks = onboarding.hasLinks;

  // Workspace timeout fallback - show retry after 3 seconds
  const [workspaceTimeout, setWorkspaceTimeout] = useState(false);

  // Workspace timeout logic - only reset when workspace actually loads
  useEffect(() => {
    if (isWorkspaceLoading && !currentWorkspace) {
      const timer = setTimeout(() => setWorkspaceTimeout(true), 3000);
      return () => clearTimeout(timer);
    } else if (currentWorkspace) {
      setWorkspaceTimeout(false);
    }
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
      queryClient.invalidateQueries({ queryKey: ['dashboard-direct'] });
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
        <DashboardContentLoader context="dashboard" minHeight="50vh" />
        <div className="flex justify-center mt-4">
          <Button variant="outline" onClick={retry} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            retry
          </Button>
        </div>
      </div>
    );
  }

  // Show loading state while data is loading (before any content checks)
  if (isLoading && !isFetched) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <DashboardContentLoader context="dashboard" minHeight="60vh" />
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

  // Regular dashboard - render with fade-in
  return (
    <ErrorBoundary section="dashboard-home">
      <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto relative animate-fade-in">
        {/* Subtle loading indicator for background refresh */}
        {(isFetching || isStale) && (
          <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
            {isStale && !isFetching && (
              <span className="text-xs text-muted-foreground">updating...</span>
            )}
            <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
          </div>
        )}

        {showDemoMode && (
          <ErrorBoundary section="demo-mode-banner">
            <DemoModeBanner />
          </ErrorBoundary>
        )}

        {/* OPTIMIZED: Pass onboarding data from unified hook - no separate query */}
        <ErrorBoundary section="onboarding-checklist">
          <OnboardingChecklist onboarding={onboarding} isLoading={isLoading} />
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

        {/* OPTIMIZED: Pass stats from unified hook - no separate query */}
        <ErrorBoundary section="quick-stats">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <QuickStats stats={stats} isLoading={isLoading} />
          </div>
        </ErrorBoundary>

        {/* OPTIMIZED: Pass links from unified hook - no separate query */}
        <LazySection fallback={<ActivityFeedSkeleton />}>
          <ErrorBoundary section="activity-feed">
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <ActivityFeed links={links} isLoading={isLoading} />
            </div>
          </ErrorBoundary>
        </LazySection>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardHome;