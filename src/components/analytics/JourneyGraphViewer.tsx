import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface JourneyNode {
  id: string;
  name: string;
  type: string;
  value: number;
  traffic: number;
  avgTimeToConversion: number;
}

interface JourneyEdge {
  id: string;
  source: string;
  target: string;
  probability: number;
  count: number;
  confidence: number;
  avgTime: number;
}

interface JourneyGraphViewerProps {
  nodes: JourneyNode[];
  edges: JourneyEdge[];
  isLoading: boolean;
}

const getNodeColor = (type: string): string => {
  switch (type) {
    case "source":
      return "hsl(var(--primary))";
    case "page":
      return "hsl(var(--accent))";
    case "conversion":
      return "hsl(142, 76%, 36%)"; // green
    case "exit":
      return "hsl(0, 84%, 60%)"; // red
    default:
      return "hsl(var(--muted))";
  }
};

const getNodeSize = (traffic: number, maxTraffic: number): number => {
  const minSize = 60;
  const maxSize = 200;
  const normalized = traffic / Math.max(maxTraffic, 1);
  return minSize + normalized * (maxSize - minSize);
};

export const JourneyGraphViewer = ({ nodes, edges, isLoading }: JourneyGraphViewerProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">journey graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">discovering journey structure...</div>
        </CardContent>
      </Card>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">journey graph</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground">
            no journey data available. click "discover structure" to analyze your customer journeys.
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxTraffic = Math.max(...nodes.map((n) => n.traffic));

  // Transform data for ReactFlow
  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((node, index) => {
        const size = getNodeSize(node.traffic, maxTraffic);
        const color = getNodeColor(node.type);

        return {
          id: node.id,
          type: "default",
          position: {
            x: (index % 3) * 300 + 100,
            y: Math.floor(index / 3) * 200 + 100,
          },
          data: {
            label: (
              <div className="text-center p-2">
                <div className="font-bold text-sm">{node.name}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {node.traffic.toLocaleString()} visits
                </div>
                {node.value > 0 && (
                  <div className="text-xs font-bold text-green-600 mt-1">
                    ${node.value.toFixed(2)}
                  </div>
                )}
              </div>
            ),
          },
          style: {
            background: color,
            color: "white",
            border: "none",
            borderRadius: "8px",
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          },
        };
      }),
    [nodes, maxTraffic]
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((edge) => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        label: `${(edge.probability * 100).toFixed(1)}%`,
        labelStyle: { fill: "hsl(var(--foreground))", fontSize: 10 },
        style: {
          strokeWidth: 2 + edge.confidence * 3,
          stroke: `hsl(var(--primary) / ${edge.confidence})`,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: `hsl(var(--primary) / ${edge.confidence})`,
        },
        animated: edge.confidence > 0.8,
      })),
    [edges]
  );

  const [reactFlowNodes, , onNodesChange] = useNodesState(flowNodes);
  const [reactFlowEdges, , onEdgesChange] = useEdgesState(flowEdges);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">journey graph</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          nodes sized by traffic, colored by type, edges weighted by confidence
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[600px] border border-border rounded-lg bg-muted/5">
          <ReactFlow
            nodes={reactFlowNodes}
            edges={reactFlowEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            fitView
            attributionPosition="bottom-right"
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const originalNode = nodes.find((n) => n.id === node.id);
                return originalNode ? getNodeColor(originalNode.type) : "hsl(var(--muted))";
              }}
            />
          </ReactFlow>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor("source") }} />
            Source
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor("page") }} />
            Page
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor("conversion") }} />
            Conversion
          </Badge>
          <Badge variant="outline" className="gap-1">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getNodeColor("exit") }} />
            Exit
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
