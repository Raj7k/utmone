import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowRight } from "lucide-react";

interface NextBestActionPanelProps {
  nodeName: string;
  nodeType: string;
  stateValue: number;
  nextBestAction: string | null;
  edges: Array<{
    target_name: string;
    probability: number;
    value: number;
  }>;
}

export const NextBestActionPanel = ({
  nodeName,
  nodeType,
  stateValue,
  nextBestAction,
  edges,
}: NextBestActionPanelProps) => {
  return (
    <Card className="border-primary/50">
      <CardHeader>
        <CardTitle className="text-lg">{nodeName}</CardTitle>
        <CardDescription>
          {nodeType} • value: ${stateValue.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {nextBestAction && (
          <div className="p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">recommended next step</span>
            </div>
            <p className="text-sm">{nextBestAction.split(': ')[1]}</p>
          </div>
        )}

        {edges.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">all transitions:</p>
            <div className="space-y-2">
              {edges
                .sort((a, b) => b.value - a.value)
                .map((edge, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span>{edge.target_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">
                        {(edge.probability * 100).toFixed(0)}%
                      </span>
                      <span className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                        ${edge.value.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
