import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MousePointer, Activity, Target } from "lucide-react";

export const AIInsightPipelineVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.3,
    })));
  }, []);

  const sources = [
    { y: 15, icon: MousePointer, color: "#10B981", label: "Clicks" },
    { y: 30, icon: Activity, color: "#22C55E", label: "Sessions" },
    { y: 45, icon: Target, color: "#34D399", label: "Leads" },
  ];

  // Icosahedron edges (2D projection)
  const icosaEdges = [
    [[0, -6], [5, -2]], [[5, -2], [3, 5]], [[3, 5], [-3, 5]], 
    [[-3, 5], [-5, -2]], [[-5, -2], [0, -6]], [[0, -6], [3, 5]],
    [[0, -6], [-3, 5]], [[5, -2], [-3, 5]], [[-5, -2], [3, 5]],
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="aiGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="aiCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#10B981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
        </radialGradient>
        
        <pattern id="aiDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#aiDotGrid)" opacity="0.3" />

      {/* Source icons + labels OUTSIDE */}
      {sources.map((source, i) => (
        <g key={i}>
          <foreignObject x="2" y={source.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-1.5 h-1.5 text-zinc-400" />
            </div>
          </foreignObject>
          
          <text
            x="9"
            y={source.y + 3}
            fill="rgba(161,161,170,0.8)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {source.label}
          </text>
          
          <motion.circle
            cx="30"
            cy={source.y + 2}
            r="2"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, ease: appleEase }}
          />
        </g>
      ))}

      {/* Super thin grey fiber lines to AI core */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 2;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 32 ${baseY + offset * 0.5} Q 50 ${baseY + offset * 0.3}, 60 30`}
              fill="none"
              stroke={isCenter ? source.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#aiGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* AI Nexus - Rotating Icosahedron wireframe */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "70px 30px" }}
      >
        {icosaEdges.map((edge, i) => (
          <motion.line
            key={i}
            x1={70 + edge[0][0]}
            y1={30 + edge[0][1]}
            x2={70 + edge[1][0]}
            y2={30 + edge[1][1]}
            stroke="#10B981"
            strokeWidth="0.3"
            strokeOpacity="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + i * 0.05, duration: 0.3, ease: appleEase }}
          />
        ))}
      </motion.g>

      {/* Core energy ball */}
      <motion.circle
        cx="70"
        cy="30"
        r="4"
        fill="url(#aiCore)"
        filter="url(#aiGlow)"
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
      />

      {/* Prediction beam with phantom line */}
      <motion.line
        x1="78"
        y1="30"
        x2="110"
        y2="20"
        stroke="#10B981"
        strokeWidth="0.5"
        strokeDasharray="2,2"
        strokeOpacity="0.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1, duration: 0.8, ease: appleEase }}
      />

      {/* Prediction label */}
      <motion.text
        x="100"
        y="16"
        fill="#10B981"
        fontSize="3"
        fontFamily="'SF Mono', ui-monospace"
        fillOpacity="0.7"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        +24%
      </motion.text>

      {/* Particles */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1"
            fill={source.color}
            filter="url(#aiGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.8,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M 32 ${source.y + 2} Q 50 ${source.y + 2}, 60 30")`,
            }}
          />
        );
      })}
    </svg>
  );
};
