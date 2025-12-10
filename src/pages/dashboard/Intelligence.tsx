import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import PulseHero from "@/components/intelligence/PulseHero";
import ContextSwitcher, { IntelligenceContext } from "@/components/intelligence/ContextSwitcher";
import RevenueBentoCard from "@/components/intelligence/RevenueBentoCard";
import PerformanceSnapshot from "@/components/intelligence/PerformanceSnapshot";
import TopCampaignsCard from "@/components/intelligence/TopCampaignsCard";

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
      <div className="space-y-6">
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

        {/* Secondary Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Top Campaigns */}
          <TopCampaignsCard
            workspaceId={currentWorkspace?.id}
            days={periodDays[period]}
            context={context}
          />

          {/* Placeholder for future Phase 3 components */}
          <div className="rounded-2xl border border-border bg-card/50 p-6 flex items-center justify-center min-h-[200px]">
            <p className="text-muted-foreground text-sm">more insights coming soon</p>
          </div>
        </div>
      </div>
    </PageContentWrapper>
  );
}
