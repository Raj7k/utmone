import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useInfluenceGraph } from "@/hooks/useInfluenceGraph";
import { Loader2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface InfluenceGraphProps {
  workspaceId: string;
  days?: number;
}

export const InfluenceGraph = ({ workspaceId, days = 30 }: InfluenceGraphProps) => {
  const { data, isLoading } = useInfluenceGraph(workspaceId, days);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>influence graph</CardTitle>
          <CardDescription>clean-track multi-touch attribution analysis</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.channels.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>influence graph</CardTitle>
          <CardDescription>clean-track multi-touch attribution analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            not enough journey data yet. conversions will appear here once tracked.
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.channels.map((channel) => ({
    name: channel.channel_name,
    lift: channel.lift * 100, // Convert to percentage
    influenceScore: channel.influence_score,
    conversionRate: channel.conversion_rate * 100,
    journeys: channel.total_journeys,
    conversions: channel.converted_journeys,
    revenue: channel.total_revenue,
  }));

  const getBarColor = (lift: number) => {
    if (lift > 5) return "hsl(var(--success))"; // Strong positive
    if (lift > 0) return "hsl(var(--primary))"; // Positive
    if (lift === 0) return "hsl(var(--muted-foreground))"; // Neutral
    return "hsl(var(--destructive))"; // Negative
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="font-semibold text-sm mb-2">{data.name}</p>
        <div className="space-y-1 text-xs">
          <p className="flex items-center gap-2">
            <span className="text-muted-foreground">lift:</span>
            <span className="font-medium">{data.lift.toFixed(2)}%</span>
            {data.lift > 0 ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : data.lift < 0 ? (
              <TrendingDown className="h-3 w-3 text-destructive" />
            ) : (
              <Minus className="h-3 w-3 text-muted-foreground" />
            )}
          </p>
          <p>
            <span className="text-muted-foreground">conversion rate:</span>{" "}
            <span className="font-medium">{data.conversionRate.toFixed(1)}%</span>
          </p>
          <p>
            <span className="text-muted-foreground">journeys:</span>{" "}
            <span className="font-medium">{data.journeys}</span>
          </p>
          <p>
            <span className="text-muted-foreground">conversions:</span>{" "}
            <span className="font-medium">{data.conversions}</span>
          </p>
          {data.revenue > 0 && (
            <p>
              <span className="text-muted-foreground">revenue:</span>{" "}
              <span className="font-medium">${data.revenue.toFixed(2)}</span>
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>influence graph</CardTitle>
        <CardDescription>
          clean-track multi-touch attribution • baseline conversion rate:{" "}
          {(data.baseline_conversion_rate * 100).toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Channel Influence Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis 
                  label={{ value: "lift (%)", angle: -90, position: "insideLeft" }}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="lift" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.lift)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Performers List */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">top influencers</h4>
            <div className="space-y-2">
              {data.channels.slice(0, 5).map((channel) => (
                <div 
                  key={channel.channel}
                  className="flex items-center justify-between p-3 bg-muted/20 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {channel.lift > 0 ? (
                      <TrendingUp className="h-4 w-4 text-success" />
                    ) : channel.lift < 0 ? (
                      <TrendingDown className="h-4 w-4 text-destructive" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{channel.channel_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {channel.converted_journeys}/{channel.total_journeys} conversions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {channel.lift > 0 ? "+" : ""}{(channel.lift * 100).toFixed(1)}% lift
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(channel.conversion_rate * 100).toFixed(1)}% cvr
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Summary */}
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">insight:</span>{" "}
              {data.channels[0] && data.channels[0].lift > 0 ? (
                <>
                  <span className="font-medium">{data.channels[0].channel_name}</span> is your strongest driver, 
                  with {((data.channels[0].lift / data.baseline_conversion_rate) * 100).toFixed(0)}% higher 
                  conversion rate than baseline.
                </>
              ) : (
                "build more conversion data to see which channels drive revenue."
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};