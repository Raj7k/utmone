import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingDown, DollarSign, Users } from "lucide-react";
import { usePipelineFunnel } from "@/hooks/usePipelineFunnel";
import { subDays } from "date-fns";

interface PipelineFunnelProps {
  workspaceId: string;
}

export const PipelineFunnel = ({ workspaceId }: PipelineFunnelProps) => {
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  
  const { data: stages, isLoading } = usePipelineFunnel(
    workspaceId,
    startDate,
    endDate
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    );
  }

  if (!stages || stages.length === 0) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">pipeline funnel</h3>
        <div className="text-center py-8 text-tertiary-label">
          <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">no pipeline data yet</p>
          <p className="text-xs mt-2">
            connect your CRM to track the full sales lifecycle
          </p>
        </div>
      </Card>
    );
  }

  const totalRevenue = stages.reduce((sum, stage) => sum + (stage.total_value || 0), 0);
  const closedWonStage = stages.find(s => s.stage === 'Closed Won');

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">pipeline funnel</h3>
          <p className="text-sm text-tertiary-label">
            full lifecycle conversion tracking
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-system-green">
            <DollarSign className="h-4 w-4" />
            <span className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-tertiary-label">total revenue</p>
        </div>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const maxCount = stages[0]?.count || 1;
          const widthPercent = (stage.count / maxCount) * 100;
          const isLastStage = index === stages.length - 1;
          
          return (
            <div key={stage.stage} className="relative">
              {/* Funnel Bar */}
              <div className="relative">
                <div
                  className={`h-16 rounded-lg flex items-center justify-between px-4 transition-all ${
                    stage.stage === 'Closed Won'
                      ? 'bg-system-green/20 border-2 border-system-green'
                      : 'bg-card-grouped border border-separator'
                  }`}
                  style={{ width: `${widthPercent}%` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold text-label">
                      {stage.stage}
                    </div>
                    <div className="text-xs text-tertiary-label">
                      {stage.count.toLocaleString()} users
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {stage.total_value > 0 && (
                      <div className="text-sm font-medium text-system-green">
                        ${stage.total_value.toLocaleString()}
                      </div>
                    )}
                    {stage.conversion_rate > 0 && (
                      <div className="text-xs text-secondary-label">
                        {stage.conversion_rate.toFixed(1)}%
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Drop-off Arrow */}
              {!isLastStage && (
                <div className="flex items-center gap-2 ml-4 mt-1 mb-1">
                  <TrendingDown className="h-3 w-3 text-system-orange opacity-50" />
                  <span className="text-xs text-tertiary-label">
                    {stages[index + 1] && stage.count > 0
                      ? `${(((stage.count - stages[index + 1].count) / stage.count) * 100).toFixed(1)}% drop-off`
                      : ''}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Metrics */}
      {closedWonStage && (
        <div className="mt-6 pt-6 border-t border-separator">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-tertiary-label mb-1">win rate</p>
              <p className="text-lg font-semibold">
                {closedWonStage.conversion_rate.toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-tertiary-label mb-1">avg deal value</p>
              <p className="text-lg font-semibold">
                ${closedWonStage.avg_value.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-tertiary-label mb-1">revenue per lead</p>
              <p className="text-lg font-semibold">
                ${(totalRevenue / (stages[1]?.count || 1)).toFixed(0)}
              </p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
