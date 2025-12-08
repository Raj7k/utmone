import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStateValues } from "@/hooks/useStateValues";
import { DollarSign, TrendingUp } from "lucide-react";

interface StateValueHeatmapProps {
  workspaceId: string | undefined;
  conversionReward?: number;
}

export const StateValueHeatmap = ({ workspaceId, conversionReward = 100 }: StateValueHeatmapProps) => {
  const { data: stateValues, isLoading } = useStateValues(workspaceId, conversionReward);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>page value heatmap</CardTitle>
          <CardDescription>calculating state values...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!stateValues || stateValues.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>page value heatmap</CardTitle>
          <CardDescription>no journey data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxValue = Math.max(...stateValues.map(v => v.state_value));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          page value heatmap
        </CardTitle>
        <CardDescription>
          mdp-calculated value of each page state
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stateValues.slice(0, 10).map((node) => {
          const valuePercent = maxValue > 0 ? (node.state_value / maxValue) * 100 : 0;
          const hue = Math.round(valuePercent * 1.2); // 0 (red) to 120 (green)
          
          return (
            <div key={node.node_id} className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {node.node_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {node.node_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white-90">
                    ${node.state_value.toFixed(2)}
                  </span>
                  {node.conversion_probability > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {(node.conversion_probability * 100).toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${valuePercent}%`,
                    backgroundColor: `hsl(${hue}, 70%, 50%)`,
                  }}
                />
              </div>
              {node.next_best_action && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  best next: {node.next_best_action.split(': ')[1]}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};
