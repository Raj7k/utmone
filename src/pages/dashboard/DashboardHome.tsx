import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { AnalyticsPulseTile } from "@/components/dashboard/bento/AnalyticsPulseTile";
import { YourPlanTile } from "@/components/dashboard/bento/YourPlanTile";
import { ReferralTile } from "@/components/dashboard/bento/ReferralTile";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";
import { AIInsightsTile } from "@/components/dashboard/bento/AIInsightsTile";
import { OnboardingChecklist } from "@/components/dashboard/OnboardingChecklist";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DashboardHome = () => {
  const { id: activePlan, displayName } = useCurrentPlan();

  return (
    <ErrorBoundary section="dashboard-home">
      <div className="space-y-6">
        {/* Onboarding Checklist - Shows for new users */}
        <ErrorBoundary section="onboarding-checklist">
          <OnboardingChecklist />
        </ErrorBoundary>

        {/* Strict 12-Column Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Row 1: Quick Create (8 cols) + Plan Usage (4 cols) */}
          <div className="lg:col-span-8">
            <ErrorBoundary section="quick-create">
              <QuickCreateTile />
            </ErrorBoundary>
          </div>
          <div className="lg:col-span-4">
            <ErrorBoundary section="plan-tile">
              <YourPlanTile />
            </ErrorBoundary>
          </div>

          {/* Row 2: Analytics Pulse (8 cols) + AI Insights (4 cols) */}
          <div className="lg:col-span-8">
            <ErrorBoundary section="analytics-pulse">
              <AnalyticsPulseTile />
            </ErrorBoundary>
          </div>
          <div className="lg:col-span-4">
            <ErrorBoundary section="ai-insights">
              <AIInsightsTile />
            </ErrorBoundary>
          </div>

          {/* Row 3: Referral (4 cols) + Recent Links (8 cols) */}
          <div className="lg:col-span-4">
            <ErrorBoundary section="referral-tile">
              <ReferralTile />
            </ErrorBoundary>
          </div>
          <div className="lg:col-span-8">
            <ErrorBoundary section="recent-links">
              <BentoRecentLinksTile />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default DashboardHome;

