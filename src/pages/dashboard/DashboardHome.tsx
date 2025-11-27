import { QuickCreateTile } from "@/components/dashboard/bento/QuickCreateTile";
import { AnalyticsPulseTile } from "@/components/dashboard/bento/AnalyticsPulseTile";
import { YourPlanTile } from "@/components/dashboard/bento/YourPlanTile";
import { BentoRecentLinksTile } from "@/components/dashboard/bento/BentoRecentLinksTile";

const DashboardHome = () => {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-display font-bold text-label">Dashboard</h1>
        <p className="text-body-apple text-secondary-label mt-2">
          Create and manage your short links
        </p>
      </div>

      {/* Bento Grid */}
      <div className="bento-grid">
        {/* Tile 1: Quick Create - Full Width */}
        <div className="tile-quick-create">
          <QuickCreateTile />
        </div>

        {/* Tile 2: Analytics Pulse - 7 columns on desktop */}
        <div className="tile-analytics">
          <AnalyticsPulseTile />
        </div>

        {/* Tile 4: Your Plan - 5 columns on desktop */}
        <div className="tile-your-plan">
          <YourPlanTile />
        </div>

        {/* Tile 3: Recent Links - Full Width */}
        <div className="tile-recent-links">
          <BentoRecentLinksTile />
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
