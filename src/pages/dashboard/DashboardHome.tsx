import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { DemoModeBanner } from "@/components/dashboard/DemoModeBanner";
import { WelcomeModal } from "@/components/dashboard/WelcomeModal";
import { useDemoMode } from "@/hooks/useDemoMode";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DashboardHome = () => {
  const { showDemoMode } = useDemoMode();

  return (
    <ErrorBoundary section="dashboard-home">
      {/* Welcome Modal for first-time users */}
      <WelcomeModal />
      
      <div className="p-6 lg:p-8 space-y-8 max-w-5xl mx-auto">
        {/* Demo Mode Banner */}
        {showDemoMode && (
          <ErrorBoundary section="demo-mode-banner">
            <DemoModeBanner />
          </ErrorBoundary>
        )}

        {/* Onboarding Checklist - Shows for new users */}
        <ErrorBoundary section="onboarding-checklist">
          <OnboardingChecklist />
        </ErrorBoundary>

        {/* Hero: Quick Create */}
        <ErrorBoundary section="quick-create">
          <div className="animate-fade-in">
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
