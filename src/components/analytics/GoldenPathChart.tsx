import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGoldenPaths } from "@/hooks/useGoldenPaths";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Line, ReferenceLine } from "recharts";
import { Crown, Zap } from "lucide-react";

interface GoldenPathChartProps {
  workspaceId: string | undefined;
}

export const GoldenPathChart = ({ workspaceId }: GoldenPathChartProps) => {
  const { data: paths, isLoading } = useGoldenPaths(workspaceId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>golden paths</CardTitle>
          <CardDescription>calculating pareto frontier...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!paths || paths.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>golden paths</CardTitle>
          <CardDescription>no complete journeys found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const paretoOptimal = paths.filter(p => p.is_pareto_optimal);
  const subOptimal = paths.filter(p => !p.is_pareto_optimal);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-500" />
          the efficient frontier
        </CardTitle>
        <CardDescription>
          paths balancing speed (steps) vs value (revenue)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              type="number" 
              dataKey="total_steps" 
              name="Steps" 
              label={{ value: 'Steps', position: 'insideBottom', offset: -10 }}
            />
            <YAxis 
              type="number" 
              dataKey="total_value" 
              name="Value" 
              label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload[0]) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                      <p className="font-semibold mb-1">
                        {data.is_pareto_optimal ? '⭐ Golden Path' : 'Path'} #{data.path_id}
                      </p>
                      <p className="text-sm">Steps: {data.total_steps}</p>
                      <p className="text-sm">Value: ${data.total_value.toFixed(2)}</p>
                      <p className="text-sm">Efficiency: {data.efficiency_score.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {data.path_nodes.join(' → ')}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            {/* Sub-optimal paths (gray) */}
            <Scatter name="Sub-optimal" data={subOptimal} fill="hsl(var(--muted-foreground))" opacity={0.3}>
              {subOptimal.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Scatter>
            
            {/* Pareto-optimal paths (gold) */}
            <Scatter name="Golden Path" data={paretoOptimal} fill="#FFD700">
              {paretoOptimal.map((entry, index) => (
                <Cell key={`cell-${index}`} />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>

        {paretoOptimal.length > 0 && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>golden paths identified:</span>
            </div>
            {paretoOptimal.slice(0, 3).map((path) => (
              <div key={path.path_id} className="bg-muted/50 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {path.total_steps} steps
                  </span>
                  <span className="text-sm font-bold text-primary">
                    ${path.total_value.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {path.path_nodes.join(' → ')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Zap className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs">
                    efficiency: {path.efficiency_score.toFixed(2)} $/step
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
