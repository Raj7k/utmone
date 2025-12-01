import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JourneyFlowData {
  source_node: string;
  target_node: string;
  flow_value: number;
  conversion_rate: number;
}

interface JourneySankeyDiagramProps {
  data: JourneyFlowData[];
  isLoading: boolean;
}

export const JourneySankeyDiagram = ({ data, isLoading }: JourneySankeyDiagramProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">customer journey flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">loading journey flow data...</div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">customer journey flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">no journey flow data available for this period</div>
        </CardContent>
      </Card>
    );
  }

  // Group flows by source
  const flowsBySource = data.reduce((acc, flow) => {
    if (!acc[flow.source_node]) {
      acc[flow.source_node] = [];
    }
    acc[flow.source_node].push(flow);
    return acc;
  }, {} as Record<string, JourneyFlowData[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">customer journey flow</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          visualize how users move from source to conversion
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(flowsBySource).map(([source, flows]) => (
          <div key={source} className="space-y-2">
            <div className="font-medium text-sm">{source}</div>
            <div className="space-y-1 pl-4 border-l-2 border-primary/20">
              {flows.map((flow, idx) => (
                <div key={idx} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-sm">{flow.target_node}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{flow.flow_value} users</span>
                    <span className="font-medium">{flow.conversion_rate.toFixed(1)}% conv.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
