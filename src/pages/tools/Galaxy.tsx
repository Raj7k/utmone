import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowRight, Plus, Sparkles, Orbit } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
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
  { id: "google", label: "Google Ads", color: "#4285F4", benchmarkFlow: 0.35 },
  { id: "meta", label: "Meta Ads", color: "#1877F2", benchmarkFlow: 0.25 },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", benchmarkFlow: 0.15 },
  { id: "email", label: "Email", color: "#EA4335", benchmarkFlow: 0.4 },
  { id: "organic", label: "Organic", color: "#34A853", benchmarkFlow: 0.3 },
  { id: "referral", label: "Referral", color: "#FBBC04", benchmarkFlow: 0.5 },
];

const initialNodes: Node[] = [
  {
    id: "revenue",
    type: "output",
    position: { x: 400, y: 300 },
    data: { label: "💰 Revenue" },
    style: {
      background: "linear-gradient(135deg, #FFD700, #FFA500)",
      border: "2px solid #FFD700",
      borderRadius: "50%",
      width: 100,
      height: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#000",
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
              stroke: sourceNode?.color || "#fff",
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
        background: `${channel.color}20`,
        border: `2px solid ${channel.color}`,
        borderRadius: "50%",
        width: 80,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
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
    <div className="min-h-screen bg-[#0a0a1a]">
      <AppHeader />
      
      {/* Stars background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-4">
              <Orbit className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300 uppercase tracking-wider">causal graph builder</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Attribution Galaxy
              </span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
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
                  className={`
                    border-2 transition-all
                    ${isAdded 
                      ? "opacity-50 cursor-not-allowed" 
                      : "hover:scale-105"
                    }
                  `}
                  style={{
                    borderColor: channel.color,
                    color: isAdded ? "#666" : channel.color,
                    background: isAdded ? "transparent" : `${channel.color}10`,
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {channel.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Canvas */}
        <div className="h-[500px] w-full border-y border-purple-500/20 bg-[#05051a]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            className="attribution-galaxy"
          >
            <Background color="#1a1a3a" gap={32} />
            <Controls className="[&_button]:bg-purple-500/20 [&_button]:border-purple-500/30 [&_button:hover]:bg-purple-500/40" />
            <MiniMap 
              style={{ background: "#0a0a1a" }}
              nodeColor={(node) => {
                const channel = CHANNEL_NODES.find(c => c.id === node.id);
                return channel?.color || "#FFD700";
              }}
            />
          </ReactFlow>
        </div>

        {/* Actions */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8">
            <Button
              onClick={calculateGoldenPath}
              disabled={edges.length === 0}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-semibold"
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
                <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
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
              className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Star Map
            </Button>
            <Link to="/early-access">
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
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
