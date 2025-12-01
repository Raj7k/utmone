import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState } from "react";
import { useStateValues } from "@/hooks/useStateValues";
import { NextBestActionPanel } from "./NextBestActionPanel";

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
  workspaceId?: string;
}

const getNodeColor = (type: string): string => {
  switch (type) {
    case 'source':
      return 'hsl(217, 91%, 95%)';
    case 'page':
      return 'hsl(142, 71%, 95%)';
    case 'conversion':
      return 'hsl(142, 76%, 85%)';
    case 'exit':
      return 'hsl(0, 0%, 95%)';
    default:
      return 'hsl(0, 0%, 95%)';
  }
};

const getNodeSize = (traffic: number, maxTraffic: number): number => {
  const minSize = 120;
  const maxSize = 180;
  const ratio = maxTraffic > 0 ? traffic / maxTraffic : 0;
  return minSize + ratio * (maxSize - minSize);
};

export const JourneyGraphViewer = ({ nodes, edges, isLoading, workspaceId }: JourneyGraphViewerProps) => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const { data: stateValues } = useStateValues(workspaceId);

  const flowNodes: Node[] = useMemo(() => {
    const maxTraffic = Math.max(...nodes.map(n => n.traffic || 0));
    const stateValueMap = new Map(stateValues?.map(v => [v.node_id, v.state_value]) || []);
    const maxValue = Math.max(...(stateValues?.map(v => v.state_value) || [0]));
    
    return nodes.map((node, index) => {
      const stateValue = stateValueMap.get(node.id) || 0;
      const valuePercent = maxValue > 0 ? (stateValue / maxValue) * 100 : 0;
      const hue = Math.round(valuePercent * 1.2); // 0 (red) to 120 (green)
      
      return {
        id: node.id,
        type: 'default',
        position: { x: (index % 5) * 250, y: Math.floor(index / 5) * 150 },
        data: {
          label: (
            <div className="text-center">
              <div className="font-medium">{node.name}</div>
              {stateValue > 0 && (
                <div className="text-xs font-bold" style={{ color: `hsl(${hue}, 70%, 40%)` }}>
                  ${stateValue.toFixed(2)}
                </div>
              )}
              <div className="text-xs text-muted-foreground">
                {node.traffic?.toLocaleString()} visits
              </div>
              {node.avgTimeToConversion && (
                <div className="text-xs text-muted-foreground">
                  avg: {Math.round(node.avgTimeToConversion / 3600)}h to convert
                </div>
              )}
            </div>
          ),
        },
        style: {
          background: stateValue > 0 
            ? `linear-gradient(135deg, ${getNodeColor(node.type)}, hsl(${hue}, 70%, 95%))`
            : getNodeColor(node.type),
          border: '2px solid',
          borderColor: stateValue > 0 ? `hsl(${hue}, 70%, 50%)` : 'hsl(var(--border))',
          borderRadius: '8px',
          padding: '10px',
          width: getNodeSize(node.traffic || 0, maxTraffic) + 100,
          fontSize: '12px',
        },
      };
    });
  }, [nodes, stateValues]);

  const flowEdges: Edge[] = useMemo(() => {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: `${(edge.probability * 100).toFixed(1)}%`,
      labelStyle: { fill: 'hsl(var(--foreground))', fontSize: 10 },
      style: {
        strokeWidth: 2 + edge.confidence * 3,
        stroke: `hsl(var(--primary) / ${edge.confidence})`,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: `hsl(var(--primary) / ${edge.confidence})`,
      },
      animated: edge.confidence > 0.8,
    }));
  }, [edges]);

  const [displayNodes, setDisplayNodes, onNodesChange] = useNodesState(flowNodes);
  const [displayEdges, setDisplayEdges, onEdgesChange] = useEdgesState(flowEdges);

  const selectedNodeData = useMemo(() => {
    if (!selectedNode) return null;
    const node = nodes.find(n => n.id === selectedNode);
    const stateValue = stateValues?.find(v => v.node_id === selectedNode);
    const nodeEdges = edges.filter(e => e.source === selectedNode);
    
    if (!node) return null;
    
    return {
      nodeName: node.name,
      nodeType: node.type,
      stateValue: stateValue?.state_value || 0,
      nextBestAction: stateValue?.next_best_action || null,
      edges: nodeEdges.map(e => {
        const targetNode = nodes.find(n => n.id === e.target);
        const targetValue = stateValues?.find(v => v.node_id === e.target);
        return {
          target_name: targetNode?.name || 'Unknown',
          probability: e.probability || 0,
          value: targetValue?.state_value || 0,
        };
      }),
    };
  }, [selectedNode, nodes, edges, stateValues]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>customer journey graph</CardTitle>
          <CardDescription>discovering journey structure...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!nodes || nodes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>customer journey graph</CardTitle>
          <CardDescription>no journey data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>customer journey graph</CardTitle>
          <CardDescription>
            nodes colored by state value • click a node to see next best actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: '600px' }}>
            <ReactFlow
              nodes={displayNodes}
              edges={displayEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onNodeClick={(_, node) => setSelectedNode(node.id)}
              fitView
            >
              <Background />
              <Controls />
              <MiniMap />
            </ReactFlow>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'hsl(217, 91%, 95%)' }}></div>
              <span className="text-xs">Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'hsl(142, 71%, 95%)' }}></div>
              <span className="text-xs">Page</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'hsl(142, 76%, 85%)' }}></div>
              <span className="text-xs">Conversion</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ background: 'hsl(0, 0%, 95%)' }}></div>
              <span className="text-xs">Exit</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedNodeData && (
        <NextBestActionPanel {...selectedNodeData} />
      )}
    </div>
  );
};
