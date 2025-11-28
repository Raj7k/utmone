import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { AnalyticsPulseTile } from "@/components/dashboard/bento/AnalyticsPulseTile";
import { YourPlanTile } from "@/components/dashboard/bento/YourPlanTile";
import { ReferralTile } from "@/components/dashboard/bento/ReferralTile";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const DashboardHome = () => {
  const { id: activePlan, displayName } = useCurrentPlan();

  return (
    <ErrorBoundary section="dashboard-home">
      <div>
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

          {/* Row 2: Analytics Pulse (8 cols) + Referral (4 cols) */}
          <div className="lg:col-span-8">
            <ErrorBoundary section="analytics-pulse">
              <AnalyticsPulseTile />
            </ErrorBoundary>
          </div>
          <div className="lg:col-span-4">
            <ErrorBoundary section="referral-tile">
              <ReferralTile />
            </ErrorBoundary>
          </div>

          {/* Row 3: Recent Links (Full Width) */}
          <div className="lg:col-span-12">
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
