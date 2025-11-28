import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { AnalyticsPulseTile } from "@/components/dashboard/bento/AnalyticsPulseTile";
import { YourPlanTile } from "@/components/dashboard/bento/YourPlanTile";
import { ReferralTile } from "@/components/dashboard/bento/ReferralTile";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";

const DashboardHome = () => {
  const { id: activePlan, displayName } = useCurrentPlan();

  return (
    <div>
      {/* Strict 12-Column Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Row 1: Quick Create (8 cols) + Plan Usage (4 cols) */}
        <div className="lg:col-span-8">
          <QuickCreateTile />
        </div>
        <div className="lg:col-span-4">
          <YourPlanTile />
        </div>

        {/* Row 2: Analytics Pulse (8 cols) + Referral (4 cols) */}
        <div className="lg:col-span-8">
          <AnalyticsPulseTile />
        </div>
        <div className="lg:col-span-4">
          <ReferralTile />
        </div>

        {/* Row 3: Recent Links (Full Width) */}
        <div className="lg:col-span-12">
          <BentoRecentLinksTile />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
