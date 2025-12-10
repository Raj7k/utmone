import { ClickHeatmap } from "@/components/analytics/ClickHeatmap";
import { BestTimeCard } from "@/components/analytics/BestTimeCard";
import { DayOfWeekChart } from "@/components/analytics/DayOfWeekChart";

interface LinkTimingInsightsProps {
  workspaceId: string;
  linkId: string;
}

export function LinkTimingInsights({ workspaceId, linkId }: LinkTimingInsightsProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-lg font-display font-semibold">timing insights</h3>
        <p className="text-sm text-muted-foreground">
          understand when your audience is most active and optimize your posting schedule
        </p>
      </div>

      {/* Best Time Card */}
      <BestTimeCard workspaceId={workspaceId} linkId={linkId} days={30} />

      {/* Click Heatmap */}
      <ClickHeatmap workspaceId={workspaceId} linkId={linkId} days={30} />

      {/* Day of Week Chart */}
      <DayOfWeekChart workspaceId={workspaceId} linkId={linkId} days={30} />
    </div>
  );
}
