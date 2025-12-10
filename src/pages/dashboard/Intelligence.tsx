import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import PulseHero from "@/components/intelligence/PulseHero";
import ContextSwitcher, { IntelligenceContext } from "@/components/intelligence/ContextSwitcher";
import RevenueBentoCard from "@/components/intelligence/RevenueBentoCard";
import PerformanceSnapshot from "@/components/intelligence/PerformanceSnapshot";
import TopCampaignsCard from "@/components/intelligence/TopCampaignsCard";
import EventImpactRow from "@/components/intelligence/EventImpactRow";
import ChannelMixDonut from "@/components/intelligence/ChannelMixDonut";
import GeoHeatTiles from "@/components/intelligence/GeoHeatTiles";
import LiveActivityRail from "@/components/intelligence/LiveActivityRail";

type PeriodOption = "today" | "7d" | "30d" | "90d";

export default function Intelligence() {
  const { currentWorkspace } = useWorkspace();
  const [period, setPeriod] = useState<PeriodOption>("7d");
  const [context, setContext] = useState<IntelligenceContext>("all");

  const periodDays: Record<PeriodOption, number> = {
    today: 1,
    "7d": 7,
    "30d": 30,
    "90d": 90,
  };

  return (
    <PageContentWrapper
      title="intelligence"
      description="your unified analytics command center"
    >
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6 min-w-0">
          {/* Pulse Hero - Live Activity Bar */}
          <PulseHero
            workspaceId={currentWorkspace?.id}
            period={period}
            onPeriodChange={setPeriod}
          />

          {/* Context Switcher */}
          <ContextSwitcher value={context} onChange={setContext} />

          {/* Primary Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Revenue Attribution - Large Card (spans 2 columns) */}
            <div className="lg:col-span-2">
              <RevenueBentoCard
                workspaceId={currentWorkspace?.id}
                days={periodDays[period]}
                context={context}
              />
            </div>

            {/* Performance Snapshot - Medium Card */}
            <div className="lg:col-span-1">
              <PerformanceSnapshot
                workspaceId={currentWorkspace?.id}
                days={periodDays[period]}
              />
            </div>
          </div>

          {/* Secondary Row - Campaigns & Channel Mix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TopCampaignsCard
              workspaceId={currentWorkspace?.id}
              days={periodDays[period]}
              context={context}
            />
            <ChannelMixDonut
              workspaceId={currentWorkspace?.id}
              days={periodDays[period]}
            />
          </div>

          {/* Event Impact Row */}
          {(context === "all" || context === "events") && (
            <EventImpactRow
              workspaceId={currentWorkspace?.id}
              days={periodDays[period]}
            />
          )}

          {/* Tertiary Row - Geo */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <GeoHeatTiles
              workspaceId={currentWorkspace?.id}
              days={periodDays[period]}
            />
            {/* Placeholder for Sales Velocity (Phase 3 continued) */}
            <div className="rounded-2xl border border-border bg-card/50 p-6 flex items-center justify-center min-h-[200px]">
              <p className="text-muted-foreground text-sm">sales velocity coming soon</p>
            </div>
          </div>
        </div>

        {/* Live Activity Rail - Right Sidebar (hidden on mobile) */}
        <div className="hidden xl:block w-80 shrink-0">
          <div className="sticky top-6">
            <LiveActivityRail workspaceId={currentWorkspace?.id} />
          </div>
        </div>
      </div>
    </PageContentWrapper>
  );
}
