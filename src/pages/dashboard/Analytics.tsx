import { useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview";
import { DeviceBreakdown } from "@/components/analytics/DeviceBreakdown";
import { GeolocationMap } from "@/components/analytics/GeolocationMap";
import { UTMCampaignRollups } from "@/components/analytics/UTMCampaignRollups";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConversionFunnel } from "@/components/analytics/ConversionFunnel";
import { useConversionMetrics } from "@/hooks/useConversionMetrics";
import { AIInsightCard } from "@/components/analytics/AIInsightCard";
import { AnomalyAlert } from "@/components/analytics/AnomalyAlert";
import { useAnomalies } from "@/hooks/useAnomalies";
import { OwnerPerformance } from "@/components/analytics/OwnerPerformance";
import { ClickHeatmap } from "@/components/analytics/ClickHeatmap";
import { BestTimeCard } from "@/components/analytics/BestTimeCard";
import { DayOfWeekChart } from "@/components/analytics/DayOfWeekChart";
import { ComparisonDashboard } from "@/components/analytics/ComparisonDashboard";
import { useComparisonMetrics } from "@/hooks/useComparisonMetrics";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Activity } from "lucide-react";
import { useRealtimeClicks } from "@/hooks/useRealtimeClicks";
import { cn } from "@/lib/utils";
import { FeatureHint } from "@/components/FeatureHint";

export default function Analytics() {
  const { currentWorkspace } = useWorkspace();
  const conversionMetrics = useConversionMetrics(undefined, currentWorkspace?.id);
  const { data: anomalies, invalidate: invalidateAnomalies } = useAnomalies(currentWorkspace?.id || '');
  const { data: comparisonMetrics } = useComparisonMetrics({ workspaceId: currentWorkspace?.id || '', period: 'month' });
  const { recentClick, liveCount, isLive } = useRealtimeClicks(currentWorkspace?.id || '');

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-body-apple text-secondary-label">loading analytics…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <FeatureHint
        id="analytics-first-visit"
        title="Your Analytics Dashboard"
        description="Your click data will appear here once your links start getting traffic. Share your links to see real-time insights."
        className="mb-content"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-large-title font-bold text-label mb-2 heading">analytics</h1>
          <p className="text-body-apple text-secondary-label">
            real-time insights into your link performance
          </p>
        </div>
        {isLive && (
          <div className="flex items-center gap-2 px-3 py-1 bg-system-green/10 border border-system-green/20 rounded-full">
            <Activity className="h-3 w-3 text-system-green animate-pulse" />
            <span className="text-xs text-system-green">live ({liveCount})</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-secondary-label mb-2">total clicks</div>
          {comparisonMetrics ? (
            <>
              <div className="text-4xl font-bold text-label mb-2 metric-text">
                {comparisonMetrics.clicks.current.toLocaleString()}
              </div>
              <div className={cn(
                "flex items-center gap-2 text-xs",
                comparisonMetrics.clicks.change > 0 ? "text-system-green" : "text-system-red"
              )}>
                <TrendingUp className="h-3 w-3" />
                <span>
                  {comparisonMetrics.clicks.change > 0 ? '↑' : '↓'} {Math.abs(comparisonMetrics.clicks.change).toFixed(1)}% vs last month
                </span>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          )}
        </Card>
        <Card className="p-6">
          <div className="text-sm text-secondary-label mb-2">click rate</div>
          {comparisonMetrics ? (
            <>
              <div className="text-4xl font-bold text-label mb-2 metric-text">
                {comparisonMetrics.clickRate.current.toFixed(1)}
              </div>
              <div className={cn(
                "flex items-center gap-2 text-xs",
                comparisonMetrics.clickRate.change > 0 ? "text-system-green" : "text-system-red"
              )}>
                <TrendingUp className="h-3 w-3" />
                <span>
                  {comparisonMetrics.clickRate.change > 0 ? '↑' : '↓'} {Math.abs(comparisonMetrics.clickRate.change).toFixed(1)}% vs last month
                </span>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          )}
        </Card>
        <Card className="p-6">
          <div className="text-sm text-secondary-label mb-2">unique visitors</div>
          {comparisonMetrics ? (
            <>
              <div className="text-4xl font-bold text-label mb-2 metric-text">
                {comparisonMetrics.uniqueClicks.current.toLocaleString()}
              </div>
              <div className={cn(
                "flex items-center gap-2 text-xs",
                comparisonMetrics.uniqueClicks.change > 0 ? "text-system-green" : "text-system-red"
              )}>
                <TrendingUp className="h-3 w-3" />
                <span>
                  {comparisonMetrics.uniqueClicks.change > 0 ? '↑' : '↓'} {Math.abs(comparisonMetrics.uniqueClicks.change).toFixed(1)}% vs last month
                </span>
              </div>
            </>
          ) : (
            <>
              <Skeleton className="h-10 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </>
          )}
        </Card>
      </div>

      <AIInsightCard workspaceId={currentWorkspace.id} />

      {anomalies && anomalies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-title-2 font-semibold text-label">anomalies detected</h2>
          {anomalies.slice(0, 3).map((anomaly) => (
            <AnomalyAlert 
              key={anomaly.id} 
              anomaly={anomaly as any}
              onDismiss={invalidateAnomalies}
            />
          ))}
        </div>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">overview</TabsTrigger>
          <TabsTrigger value="team">team</TabsTrigger>
          <TabsTrigger value="conversions">conversions</TabsTrigger>
          <TabsTrigger value="devices">devices</TabsTrigger>
          <TabsTrigger value="geography">geography</TabsTrigger>
          <TabsTrigger value="campaigns">campaigns</TabsTrigger>
          <TabsTrigger value="timing">timing</TabsTrigger>
          <TabsTrigger value="compare">compare</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AnalyticsOverview workspaceId={currentWorkspace.id} />
        </TabsContent>

        <TabsContent value="team">
          <OwnerPerformance workspaceId={currentWorkspace.id} />
        </TabsContent>

        <TabsContent value="conversions" className="space-y-6">
          {conversionMetrics.data && (
            <ConversionFunnel
              clicks={conversionMetrics.data.totalClicks}
              leads={conversionMetrics.data.leads}
              signups={conversionMetrics.data.signups}
              purchases={conversionMetrics.data.purchases}
              revenue={conversionMetrics.data.totalRevenue}
            />
          )}
        </TabsContent>

        <TabsContent value="devices">
          <DeviceBreakdown workspaceId={currentWorkspace.id} />
        </TabsContent>

        <TabsContent value="geography">
          <GeolocationMap workspaceId={currentWorkspace.id} />
        </TabsContent>

        <TabsContent value="campaigns">
          <UTMCampaignRollups workspaceId={currentWorkspace.id} />
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <ClickHeatmap workspaceId={currentWorkspace.id} />
          <div className="grid gap-6 md:grid-cols-2">
            <BestTimeCard workspaceId={currentWorkspace.id} />
            <DayOfWeekChart workspaceId={currentWorkspace.id} />
          </div>
        </TabsContent>

        <TabsContent value="compare">
          <ComparisonDashboard workspaceId={currentWorkspace.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
