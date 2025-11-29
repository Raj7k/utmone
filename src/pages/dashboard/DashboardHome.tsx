import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { AnalyticsPulseTile } from "@/components/dashboard/bento/AnalyticsPulseTile";
import { YourPlanTile } from "@/components/dashboard/bento/YourPlanTile";
import { ReferralTile } from "@/components/dashboard/bento/ReferralTile";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";
import { AIInsightsTile } from "@/components/dashboard/bento/AIInsightsTile";
import { QuickToolsTile } from "@/components/dashboard/bento/QuickToolsTile";
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

        {/* Responsive Bento Grid with proper mobile ordering */}
        <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
          {/* Row 1: Quick Create (mobile: full width, first; tablet: 6 cols; desktop: 8 cols) */}
          <div className="md:col-span-6 lg:col-span-8 order-1">
            <ErrorBoundary section="quick-create">
              <QuickCreateTile />
            </ErrorBoundary>
          </div>
          
          {/* Row 1: Plan Usage (mobile: full width; tablet: 6 cols; desktop: 4 cols) */}
          <div className="md:col-span-6 lg:col-span-4 order-2">
            <ErrorBoundary section="plan-tile">
              <YourPlanTile />
            </ErrorBoundary>
          </div>

          {/* Row 2: Analytics Pulse (mobile: full width; tablet: 6 cols; desktop: 7 cols) */}
          <div className="md:col-span-6 lg:col-span-7 order-3">
            <ErrorBoundary section="analytics-pulse">
              <AnalyticsPulseTile />
            </ErrorBoundary>
          </div>
          
          {/* Row 2: Quick Tools (mobile: full width; tablet: 6 cols; desktop: 5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 order-4">
            <ErrorBoundary section="quick-tools">
              <QuickToolsTile />
            </ErrorBoundary>
          </div>

          {/* Row 3: AI Insights (mobile: full width; tablet: 6 cols; desktop: 5 cols) */}
          <div className="md:col-span-6 lg:col-span-5 order-5">
            <ErrorBoundary section="ai-insights">
              <AIInsightsTile />
            </ErrorBoundary>
          </div>
          
          {/* Row 3: Referral (mobile: full width; tablet: 6 cols; desktop: 7 cols) */}
          <div className="md:col-span-6 lg:col-span-7 order-6">
            <ErrorBoundary section="referral-tile">
              <ReferralTile />
            </ErrorBoundary>
          </div>

          {/* Row 4: Recent Links (full width on all breakpoints) */}
          <div className="md:col-span-6 lg:col-span-12 order-7">
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

