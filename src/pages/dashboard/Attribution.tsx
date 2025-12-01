import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttributionModelSelector } from "@/components/analytics/AttributionModelSelector";
import { AttributionTable } from "@/components/analytics/AttributionTable";
import { JourneySankey } from "@/components/analytics/JourneySankey";
import { useAttribution, useJourneyFlow, type AttributionModel } from "@/hooks/useAttribution";
import { useWorkspace } from "@/hooks/useWorkspace";
import { subDays } from "date-fns";

const Attribution = () => {
  const { currentWorkspace } = useWorkspace();
  const [model, setModel] = useState<AttributionModel>("linear");
  const [dateRangeDays, setDateRangeDays] = useState<number>(30);
  
  const dateRange = {
    from: subDays(new Date(), dateRangeDays),
    to: new Date(),
  };

  const { data: attributionData, isLoading: isLoadingAttribution } = useAttribution(
    currentWorkspace?.id,
    model,
    dateRange.from,
    dateRange.to
  );

  const { data: flowData, isLoading: isLoadingFlow } = useJourneyFlow(
    currentWorkspace?.id,
    dateRange.from,
    dateRange.to
  );

  // Calculate summary stats
  const totalConversions = attributionData?.reduce((sum, row) => sum + row.total_conversions, 0) || 0;
  const totalRevenue = attributionData?.reduce((sum, row) => sum + row.total_revenue, 0) || 0;
  const uniqueSources = new Set(attributionData?.map(row => row.source)).size;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">multi-touch attribution</h1>
        <p className="text-muted-foreground">
          understand which touchpoints drive conversions across the customer journey
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <AttributionModelSelector value={model} onChange={setModel} />
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">date range</label>
          <Select value={dateRangeDays.toString()} onValueChange={(v) => setDateRangeDays(parseInt(v))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">last 7 days</SelectItem>
              <SelectItem value="30">last 30 days</SelectItem>
              <SelectItem value="90">last 90 days</SelectItem>
              <SelectItem value="365">last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              total conversions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              total revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              active sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueSources}</div>
          </CardContent>
        </Card>
      </div>

      <AttributionTable data={attributionData || []} isLoading={isLoadingAttribution} />

      <JourneySankey data={flowData || []} isLoading={isLoadingFlow} />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">about attribution models</CardTitle>
          <CardDescription>
            how we calculate credit for each touchpoint
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">linear attribution</h4>
            <p className="text-sm text-muted-foreground">
              gives equal credit to all touchpoints in the customer journey. best for understanding overall contribution.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">time decay</h4>
            <p className="text-sm text-muted-foreground">
              gives more credit to recent touchpoints using a 7-day half-life. best for understanding what drove the final decision.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">position-based (u-shaped)</h4>
            <p className="text-sm text-muted-foreground">
              gives 40% credit to first touchpoint, 40% to last touchpoint, and splits remaining 20% among middle touchpoints. best for balancing awareness and conversion.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attribution;
