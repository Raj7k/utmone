import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendingUp, Award } from "lucide-react";

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
  
  // Prepare data for scatter plot
  const chartData = links.map(link => ({
    ...link,
    isParetoOptimal: paretoOptimalLinks.some(p => p.id === link.id),
    displayName: link.name.length > 20 ? link.name.substring(0, 20) + '...' : link.name
  }));

  // Calculate averages for reference lines
  const avgCTR = links.reduce((sum, l) => sum + l.ctr, 0) / links.length;
  const avgConversion = links.reduce((sum, l) => sum + l.conversionRate, 0) / links.length;

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
              
              {/* Non-optimal links */}
              <Scatter 
                name="Standard Links" 
                data={chartData.filter(d => !d.isParetoOptimal)} 
                fill="hsl(var(--muted-foreground))"
                fillOpacity={0.4}
              />
              
              {/* Pareto-optimal links */}
              <Scatter 
                name="Pareto-Optimal Links" 
                data={chartData.filter(d => d.isParetoOptimal)} 
                fill="hsl(var(--primary))"
                fillOpacity={0.8}
              />
            </ScatterChart>
          </ResponsiveContainer>

          <div className="text-sm text-muted-foreground">
            <p>Links in the <span className="text-primary font-medium">upper-right region</span> are Pareto-optimal: they achieve the best trade-off between CTR and conversion rate.</p>
          </div>
        </div>
      </Card>

      {/* Insights */}
      {paretoOptimalLinks.length > 0 && (
        <Card className="p-4">
          <h4 className="text-sm font-medium mb-3">optimization insights</h4>
          <div className="space-y-2 text-sm">
            {links.filter(l => !isParetoOptimal(l, links)).slice(0, 3).map(link => {
              const bestCTR = Math.max(...paretoOptimalLinks.map(p => p.ctr));
              const bestConversion = Math.max(...paretoOptimalLinks.map(p => p.conversionRate));
              
              const ctrGap = ((bestCTR - link.ctr) / link.ctr * 100).toFixed(0);
              const conversionGap = ((bestConversion - link.conversionRate) / link.conversionRate * 100).toFixed(0);
              
              return (
                <div key={link.id} className="p-3 bg-muted/30 rounded-lg">
                  <p className="font-medium">{link.name}</p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {parseFloat(ctrGap) > parseFloat(conversionGap) 
                      ? `Could improve CTR by ${ctrGap}% to match top performers`
                      : `Could improve conversion rate by ${conversionGap}% to match top performers`
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
