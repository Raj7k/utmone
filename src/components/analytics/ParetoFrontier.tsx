import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartWrapper } from "@/components/charts/ChartWrapper";
import { useChartAccessibility } from "@/hooks/useChartAccessibility";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Line } from "recharts";
import { TrendingUp, Award, AlertTriangle } from "lucide-react";

interface LinkPerformance {
  id: string;
  name: string;
  ctr: number; // Click-through rate
  conversionRate: number;
  clicks: number;
  conversions: number;
}

interface ParetoFrontierProps {
  links: LinkPerformance[];
}

export function ParetoFrontier({ links }: ParetoFrontierProps) {
  // Calculate Pareto optimality
  const isParetoOptimal = (link: LinkPerformance, allLinks: LinkPerformance[]): boolean => {
    return !allLinks.some(other => 
      other.id !== link.id &&
      other.ctr >= link.ctr &&
      other.conversionRate >= link.conversionRate &&
      (other.ctr > link.ctr || other.conversionRate > link.conversionRate)
    );
  };

  const paretoOptimalLinks = links.filter(link => isParetoOptimal(link, links));
  
  // Sort Pareto points by CTR for gold line connection
  const sortedParetoPoints = [...paretoOptimalLinks]
    .sort((a, b) => a.ctr - b.ctr)
    .map(link => ({
      ctr: link.ctr,
      conversionRate: link.conversionRate,
    }));
  
  // Prepare data for scatter plot
  const chartData = links.map(link => ({
    ...link,
    isParetoOptimal: paretoOptimalLinks.some(p => p.id === link.id),
    displayName: link.name.length > 20 ? link.name.substring(0, 20) + '...' : link.name
  }));

  // Calculate averages for reference lines
  const avgCTR = links.reduce((sum, l) => sum + l.ctr, 0) / links.length;
  const avgConversion = links.reduce((sum, l) => sum + l.conversionRate, 0) / links.length;

  // Accessibility data
  const accessibilityData = useChartAccessibility(
    chartData,
    "Campaign Performance - Click-through Rate vs Conversion Rate",
    "name",
    ["ctr", "conversionRate"]
  );

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;
    
    const data = payload[0].payload;
    
    return (
      <Card className="p-3 shadow-lg border">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <p className="font-medium text-sm">{data.name}</p>
            {data.isParetoOptimal && (
              <Badge variant="default" className="h-5 text-xs">
                <Award className="h-3 w-3 mr-1" />
                optimal
              </Badge>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">CTR</p>
              <p className="font-medium">{(data.ctr * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Conversion</p>
              <p className="font-medium">{(data.conversionRate * 100).toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Clicks</p>
              <p className="font-medium">{data.clicks.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Conversions</p>
              <p className="font-medium">{data.conversions.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">pareto optimization frontier</h3>
            </div>
            <Badge variant="outline">
              {paretoOptimalLinks.length} optimal links
            </Badge>
          </div>

          <ChartWrapper height={400} accessibilityData={accessibilityData}>
            <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="ctr" 
                name="CTR"
                domain={[0, 'auto']}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                type="number" 
                dataKey="conversionRate" 
                name="Conversion Rate"
                domain={[0, 'auto']}
                tickFormatter={(value) => `${(value * 100).toFixed(1)}%`}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip content={<CustomTooltip />} />
              
              {/* Reference lines for averages */}
              <ReferenceLine 
                x={avgCTR} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: 'avg CTR', position: 'top', fill: 'hsl(var(--muted-foreground))' }}
              />
              <ReferenceLine 
                y={avgConversion} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: 'avg conversion', position: 'right', fill: 'hsl(var(--muted-foreground))' }}
              />
              
              {/* Non-optimal links (gray) */}
              <Scatter 
                name="room to improve" 
                data={chartData.filter(d => !d.isParetoOptimal)} 
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.3}
              />
              
              {/* Pareto-optimal links (gold) */}
              <Scatter 
                name="top performers" 
                data={chartData.filter(d => d.isParetoOptimal)} 
                fill="hsl(45 93% 47%)"
                fillOpacity={0.9}
              />
              
              {/* Gold line connecting Pareto frontier */}
              {sortedParetoPoints.length > 1 && (
                <Line
                  data={sortedParetoPoints}
                  type="monotone"
                  dataKey="conversionRate"
                  stroke="hsl(45 93% 47%)"
                  strokeWidth={3}
                  dot={false}
                  isAnimationActive={false}
                />
              )}
            </ScatterChart>
          </ResponsiveContainer>
          </ChartWrapper>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(45 93% 47%)' }} />
              <span>🏆 top performers — efficient frontier</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-muted-foreground opacity-30" />
              <span>⚠️ room to improve</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Two-column insights */}
      {paretoOptimalLinks.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Top Performers */}
          <Card className="p-4 border-amber-500/20 bg-amber-500/5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold">🏆 top performers</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              these links achieve the best balance of engagement and conversion
            </p>
            <div className="space-y-2 text-sm">
              {paretoOptimalLinks.slice(0, 3).map((link, index) => (
                <div key={link.id} className="p-2 bg-background/50 rounded">
                  <p className="font-medium text-xs">{index + 1}. {link.name}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>{(link.ctr * 100).toFixed(1)}% CTR</span>
                    <span>{(link.conversionRate * 100).toFixed(1)}% conv</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Room to Improve */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold">⚠️ room to improve</h4>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              opportunities to optimize these campaigns
            </p>
            <div className="space-y-2 text-sm">
              {links.filter(l => !isParetoOptimal(l, links)).slice(0, 3).map(link => {
                const bestCTR = Math.max(...paretoOptimalLinks.map(p => p.ctr));
                const bestConversion = Math.max(...paretoOptimalLinks.map(p => p.conversionRate));
                
                const ctrGap = link.ctr > 0 ? ((bestCTR - link.ctr) / link.ctr * 100).toFixed(0) : '0';
                const conversionGap = link.conversionRate > 0 ? ((bestConversion - link.conversionRate) / link.conversionRate * 100).toFixed(0) : '0';
                
                return (
                  <div key={link.id} className="p-2 bg-muted/20 rounded">
                    <p className="font-medium text-xs">{link.name}</p>
                    <p className="text-muted-foreground text-xs mt-1">
                      {parseFloat(ctrGap) > parseFloat(conversionGap) 
                        ? `could boost CTR by ${ctrGap}%`
                        : `could boost conversion by ${conversionGap}%`
                      }
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
