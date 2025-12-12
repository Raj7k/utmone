import { useState, useCallback, useEffect } from "react";
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

const DashboardHome = () => {
  const { showDemoMode } = useDemoMode();
  const { hasLinks, isLoading: isLoadingProgress, isFetched } = useOnboardingProgress();

  useEffect(() => {
    if (!isLoadingProgress && isFetched) {
      completeNavigation();
    }
  }, [isLoadingProgress, isFetched]);
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdLinkUrl, setCreatedLinkUrl] = useState("");
  const queryClient = useQueryClient();

  const handleLinkCreated = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['onboarding-progress'] });
    queryClient.invalidateQueries({ queryKey: ['activity-feed'] });
    queryClient.invalidateQueries({ queryKey: ['dashboard-links-count'] });
    
    const slug = Math.random().toString(36).substring(2, 8);
    setCreatedLinkUrl(`utm.one/${slug}`);
    setShowSuccess(true);
  }, [queryClient]);

  const handleContinue = useCallback(() => {
    setShowSuccess(false);
  }, []);

  // Show skeleton until we're SURE about the data
  if (isLoadingProgress || !isFetched) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-muted rounded-2xl" />
          <div className="h-48 bg-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  // Only show first-run experience if we've confirmed user has no links
  if (!hasLinks && !showSuccess) {
    return (
      <ErrorBoundary section="dashboard-home">
        <WelcomeModal onLinkCreated={handleLinkCreated} />
        <FirstRunExperience onLinkCreated={handleLinkCreated} />
      </ErrorBoundary>
    );
  }

  // Success celebration after creating first link
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

  // Regular dashboard for users with links
  return (
    <ErrorBoundary section="dashboard-home">
      <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Demo Mode Banner */}
        {showDemoMode && (
          <ErrorBoundary section="demo-mode-banner">
            <DemoModeBanner />
          </ErrorBoundary>
        )}

        {/* Onboarding Checklist - Shows progress for new users */}
        <ErrorBoundary section="onboarding-checklist">
          <OnboardingChecklist />
        </ErrorBoundary>

        {/* Quick Actions */}
        <ErrorBoundary section="quick-actions">
          <div className="animate-fade-in">
            <DashboardQuickActions />
          </div>
        </ErrorBoundary>

        {/* Hero: Quick Create */}
        <ErrorBoundary section="quick-create">
          <div className="animate-fade-in" style={{ animationDelay: '50ms' }}>
            <QuickCreateTile />
          </div>
        </ErrorBoundary>

        {/* Stats Row */}
        <ErrorBoundary section="quick-stats">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <QuickStats />
          </div>
        </ErrorBoundary>

        {/* Activity Feed */}
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
