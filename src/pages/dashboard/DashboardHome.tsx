import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { AnalyticsPulseTile } from "@/components/dashboard/bento/AnalyticsPulseTile";
import { YourPlanTile } from "@/components/dashboard/bento/YourPlanTile";
import { ReferralTile } from "@/components/dashboard/bento/ReferralTile";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";

const DashboardHome = () => {
  const { id: activePlan, displayName } = useCurrentPlan();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-4xl font-display font-bold text-label">Dashboard</h1>
          {/* DEBUG: Visual indicator of active plan */}
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            DEBUG: Current Active Plan = {activePlan}
          </span>
        </div>
        <p className="text-body-apple text-secondary-label mt-2">
          Create and manage your short links
        </p>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Row 1: Analytics Pulse + Your Plan */}
        <div className="tile-analytics">
          <AnalyticsPulseTile />
        </div>
        <div className="tile-your-plan">
          <YourPlanTile />
        </div>

        {/* Row 2: Quick Create + Referral */}
        <div className="tile-quick-create">
          <QuickCreateTile />
        </div>
        <div className="tile-referral">
          <ReferralTile />
        </div>

        {/* Row 3: Recent Links - Full Width */}
        <div className="tile-recent-links">
          <BentoRecentLinksTile />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
