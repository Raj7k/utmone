import { ResponsiveSankey } from "@nivo/sankey";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JourneyFlowData {
  source_node: string;
  target_node: string;
  flow_value: number;
  conversion_rate: number;
}

interface JourneySankeyProps {
  data: JourneyFlowData[];
  isLoading: boolean;
}

export const JourneySankey = ({ data, isLoading }: JourneySankeyProps) => {
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

  // Transform data for Nivo Sankey format
  const nodes: Array<{ id: string }> = [];
  const links: Array<{ source: string; target: string; value: number }> = [];
  const nodeSet = new Set<string>();

  // Extract unique nodes and create links
  data.forEach((flow) => {
    if (!nodeSet.has(flow.source_node)) {
      nodeSet.add(flow.source_node);
      nodes.push({ id: flow.source_node });
    }
    if (!nodeSet.has(flow.target_node)) {
      nodeSet.add(flow.target_node);
      nodes.push({ id: flow.target_node });
    }

    links.push({
      source: flow.source_node,
      target: flow.target_node,
      value: flow.flow_value,
    });
  });

  const sankeyData = { nodes, links };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">customer journey flow</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          visualize how users move from source to conversion
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[600px]">
          <ResponsiveSankey
            data={sankeyData}
            margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
            align="justify"
            colors={{ scheme: "category10" }}
            nodeOpacity={1}
            nodeHoverOthersOpacity={0.35}
            nodeThickness={18}
            nodeSpacing={24}
            nodeBorderWidth={0}
            nodeBorderRadius={3}
            linkOpacity={0.5}
            linkHoverOthersOpacity={0.1}
            linkContract={3}
            enableLinkGradient={true}
            labelPosition="outside"
            labelOrientation="horizontal"
            labelPadding={16}
            labelTextColor={{
              from: "color",
              modifiers: [["darker", 1]],
            }}
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                translateX: 130,
                itemWidth: 100,
                itemHeight: 14,
                itemDirection: "right-to-left",
                itemsSpacing: 2,
                itemTextColor: "hsl(var(--foreground))",
                symbolSize: 14,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "hsl(var(--primary))",
                    },
                  },
                ],
              },
            ]}
            theme={{
              text: {
                fill: "hsl(var(--foreground))",
                fontSize: 11,
              },
              tooltip: {
                container: {
                  background: "hsl(var(--card))",
                  color: "hsl(var(--card-foreground))",
                  fontSize: 12,
                  borderRadius: "6px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  padding: "8px 12px",
                },
              },
            }}
          />
        </div>
      </CardContent>
    </Card>
  );
};
