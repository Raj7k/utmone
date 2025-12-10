import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowRight, Plus, Sparkles, Orbit } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
} from "reactflow";
import "reactflow/dist/style.css";

const CHANNEL_NODES = [
  { id: "google", label: "Google Ads", benchmarkFlow: 0.35 },
  { id: "meta", label: "Meta Ads", benchmarkFlow: 0.25 },
  { id: "linkedin", label: "LinkedIn", benchmarkFlow: 0.15 },
  { id: "email", label: "Email", benchmarkFlow: 0.4 },
  { id: "organic", label: "Organic", benchmarkFlow: 0.3 },
  { id: "referral", label: "Referral", benchmarkFlow: 0.5 },
];

const initialNodes: Node[] = [
  {
    id: "revenue",
    type: "output",
    position: { x: 400, y: 300 },
    data: { label: "💰 Revenue" },
    style: {
      background: "hsl(var(--primary))",
      border: "2px solid hsl(var(--primary))",
      borderRadius: "50%",
      width: 100,
      height: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "hsl(var(--primary-foreground))",
      fontWeight: "bold",
      fontSize: "14px",
    },
  },
];

const initialEdges: Edge[] = [];

export default function Galaxy() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [goldenPath, setGoldenPath] = useState<string[]>([]);

  const onConnect = useCallback(
    (params: Connection) => {
      const sourceNode = CHANNEL_NODES.find(n => n.id === params.source);
      const flowRate = sourceNode?.benchmarkFlow || 0.2;
      
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: {
              stroke: "hsl(var(--primary))",
              strokeWidth: Math.max(2, flowRate * 10),
            },
          },
          eds
        )
      );
    },
    [setEdges]
  );

  const addChannel = (channel: typeof CHANNEL_NODES[0]) => {
    const existingNode = nodes.find(n => n.id === channel.id);
    if (existingNode) return;

    const angle = Math.random() * Math.PI * 2;
    const radius = 200 + Math.random() * 100;
    const x = 400 + Math.cos(angle) * radius;
    const y = 300 + Math.sin(angle) * radius;

    const newNode: Node = {
      id: channel.id,
      type: "input",
      position: { x, y },
      data: { label: channel.label },
      style: {
        background: "hsl(var(--card))",
        border: "2px solid hsl(var(--primary) / 0.5)",
        borderRadius: "50%",
        width: 80,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "hsl(var(--foreground))",
        fontWeight: "500",
        fontSize: "12px",
      },
    };

    setNodes((nds) => [...nds, newNode]);
  };

  const calculateGoldenPath = () => {
    // Find path with highest flow to revenue
    const connectedToRevenue = edges.filter(e => e.target === "revenue");
    if (connectedToRevenue.length === 0) return;

    const pathScores = connectedToRevenue.map(edge => {
      const channel = CHANNEL_NODES.find(n => n.id === edge.source);
      return { source: edge.source, score: channel?.benchmarkFlow || 0 };
    });

    pathScores.sort((a, b) => b.score - a.score);
    setGoldenPath([pathScores[0]?.source || "", "revenue"]);
  };

  const shareResult = () => {
    const channelCount = nodes.length - 1;
    const connectionCount = edges.length;
    const text = `🌌 My Attribution Galaxy:\n\n🪐 ${channelCount} Marketing Channels\n🔗 ${connectionCount} Attribution Paths\n✨ Golden Path: ${goldenPath.join(" → ") || "Not calculated"}\n\nBuilt with utm.one Attribution Galaxy`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="dark min-h-screen bg-background">
      <AppHeader />
      
      {/* Stars background - subtle */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.2 + 0.05,
            }}
            animate={{
              opacity: [0.05, 0.2, 0.05],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-4">
              <Orbit className="w-4 h-4 text-primary" />
              <span className="text-sm font-display font-medium text-muted-foreground uppercase tracking-wider">causal graph builder</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 hero-gradient">
              attribution galaxy
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              drag planets to build your marketing constellation. connect them to revenue to see the golden path.
            </p>
          </motion.div>

          {/* Channel Palette */}
          <div className="flex flex-wrap justify-center gap-3 mb-6">
            {CHANNEL_NODES.map(channel => {
              const isAdded = nodes.some(n => n.id === channel.id);
              return (
                <Button
                  key={channel.id}
                  onClick={() => addChannel(channel)}
                  disabled={isAdded}
                  variant="outline"
                  className={`transition-all ${isAdded ? "opacity-50 cursor-not-allowed" : "hover:scale-105 hover:border-primary"}`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {channel.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Canvas */}
        <div className="h-[500px] w-full border-y border-border bg-card/50">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="attribution-galaxy"
          >
            <Background color="hsl(var(--border))" gap={32} />
            <Controls className="[&_button]:bg-card [&_button]:border-border [&_button:hover]:bg-muted" />
            <MiniMap 
              style={{ background: "hsl(var(--card))" }}
              nodeColor={() => "hsl(var(--primary))"}
            />
          </ReactFlow>
        </div>

        {/* Actions */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Button
              onClick={calculateGoldenPath}
              disabled={edges.length === 0}
              className="bg-system-yellow text-black font-display font-semibold hover:bg-system-yellow/90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Find Golden Path
            </Button>
            
            {goldenPath.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2"
              >
                <Badge className="bg-system-yellow/20 text-system-yellow border-system-yellow/30 px-4 py-2">
                  ✨ {goldenPath.map(p => {
                    const channel = CHANNEL_NODES.find(c => c.id === p);
                    return channel?.label || p;
                  }).join(" → ")}
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={shareResult}
              variant="outline"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Star Map
            </Button>
            <Link to="/early-access">
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground">
                Build This Reality
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}