import { motion } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface Node {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
}

export const NeuralMesh = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [time, setTime] = useState(0);

  // Initialize nodes
  useEffect(() => {
    const initialNodes: Node[] = [];
    for (let i = 0; i < 40; i++) {
      initialNodes.push({
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 150,
        z: (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        vz: (Math.random() - 0.5) * 0.2,
      });
    }
    setNodes(initialNodes);
  }, []);

  // Animate - breathing effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 0.02);
      setNodes(prev => prev.map(node => {
        let { x, y, z, vx, vy, vz } = node;
        
        // Add some organic movement
        x += vx + Math.sin(time * 2 + x * 0.01) * 0.2;
        y += vy + Math.cos(time * 2 + y * 0.01) * 0.2;
        z += vz;

        // Bounds
        if (Math.abs(x) > 100) vx *= -1;
        if (Math.abs(y) > 75) vy *= -1;
        if (Math.abs(z) > 50) vz *= -1;

        return { x, y, z, vx, vy, vz };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [time]);

  // Calculate connections
  const connections = useMemo(() => {
    const lines: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
    const maxDist = 60;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.3;
          // Project to 2D
          const scale1 = 1 + nodes[i].z / 200;
          const scale2 = 1 + nodes[j].z / 200;
          lines.push({
            x1: 150 + nodes[i].x * scale1,
            y1: 100 + nodes[i].y * scale1,
            x2: 150 + nodes[j].x * scale2,
            y2: 100 + nodes[j].y * scale2,
            opacity,
          });
        }
      }
    }
    return lines;
  }, [nodes]);

  return (
    <div className="relative w-[300px] h-[200px]">
      <svg className="w-full h-full" viewBox="0 0 300 200">
        {/* Connections */}
        {connections.map((line, i) => (
          <line
            key={i}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={`rgba(255, 255, 255, ${line.opacity})`}
            strokeWidth="0.5"
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const scale = 1 + node.z / 200;
          const x = 150 + node.x * scale;
          const y = 100 + node.y * scale;
          const size = 1.5 + node.z / 100;
          const opacity = 0.3 + (node.z + 50) / 200;

          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={size}
              fill={`rgba(255, 255, 255, ${opacity})`}
              style={{ filter: node.z > 20 ? 'drop-shadow(0 0 2px white)' : 'none' }}
            />
          );
        })}

        {/* Central glow */}
        <circle
          cx="150"
          cy="100"
          r="40"
          fill="url(#meshGlow)"
          style={{ mixBlendMode: 'screen' }}
        />

        <defs>
          <radialGradient id="meshGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0.1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </radialGradient>
        </defs>
      </svg>

      {/* Label */}
      <motion.div
        className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
          neural processing
        </div>
      </motion.div>
    </div>
  );
};
