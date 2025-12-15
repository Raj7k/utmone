import { motion } from "framer-motion";
import { BarChart2, Link2, Users } from "lucide-react";

// Cinematic AI Nexus: Icosahedron wireframe → pulsing core → prediction beam → smart routing
export const AIInsightPipelineVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-0.8, 0, 0.8]; // 3 strands per input
  
  const inputs = [
    { y: 14, icon: BarChart2, label: "Metrics", color: "#8B5CF6" },
    { y: 28, icon: Link2, label: "Links", color: "#06B6D4" },
    { y: 42, icon: Users, label: "Audience", color: "#EC4899" },
  ];

  // Icosahedron wireframe vertices (simplified 2D projection)
  const icosahedronLines = [
    "M 60 18 L 54 26", "M 60 18 L 66 26", "M 54 26 L 50 34",
    "M 66 26 L 70 34", "M 50 34 L 54 42", "M 70 34 L 66 42",
    "M 54 42 L 60 46", "M 66 42 L 60 46", "M 54 26 L 66 26",
    "M 50 34 L 70 34", "M 54 42 L 66 42", "M 60 18 L 50 34",
    "M 60 18 L 70 34", "M 60 46 L 50 34", "M 60 46 L 70 34",
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom filter for core glow */}
        <filter id="aiBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="aiFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Input fiber gradients */}
        {inputs.map((input, i) => (
          <linearGradient key={`aiFlow-${i}`} id={`aiFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={input.color} stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" />
          </linearGradient>
        ))}
        
        {/* Prediction beam gradient */}
        <linearGradient id="predictionBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.6" />
        </linearGradient>
        
        {/* Core energy gradient */}
        <radialGradient id="coreEnergy" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#5412AE" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="aiDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.12" />
        </pattern>
      </defs>
      
      {/* Background dot grid */}
      <rect x="0" y="0" width="120" height="60" fill="url(#aiDotGrid)" opacity="0.4" />
      
      {/* Input nodes with frosted glass */}
      {inputs.map((input, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: appleEase }}
        >
          <rect
            x="4"
            y={input.y}
            width="16"
            height="8"
            rx="1.5"
            fill={`${input.color}15`}
            stroke={input.color}
            strokeOpacity="0.5"
            strokeWidth="0.4"
          />
          <foreignObject x="5" y={input.y + 1.5} width="5" height="5">
            <input.icon className="w-full h-full" style={{ color: input.color, opacity: 0.8 }} />
          </foreignObject>
          <text x="15" y={input.y + 5.5} fill="white" fontSize="2.2" fontFamily="ui-monospace" opacity="0.6">{input.label}</text>
        </motion.g>
      ))}
      
      {/* Multi-strand fiber bundles to nexus */}
      {inputs.map((input, inputIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 1;
          return (
            <motion.path
              key={`fiber-${inputIdx}-${strandIdx}`}
              d={`M 20 ${input.y + 4 + offset} Q 35 ${input.y + 4 + offset * 0.5}, 48 ${32 + offset * 0.3}`}
              fill="none"
              stroke={isCenter ? `url(#aiFlow-${inputIdx})` : input.color}
              strokeWidth={isCenter ? 0.8 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.25}
              filter={isCenter ? "url(#aiFiberGlow)" : undefined}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + inputIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}
      
      {/* Heartbeat pulse particles on input fibers */}
      {inputs.map((input, i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="1.5"
          fill={input.color}
          filter="url(#aiFiberGlow)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1, // 60bpm
            delay: i * 0.33,
            repeat: Infinity,
            ease: appleEase,
          }}
          style={{
            offsetPath: `path("M 20 ${input.y + 4} Q 35 ${input.y + 4}, 48 32")`,
          }}
        />
      ))}
      
      {/* Central Nexus - Rotating Icosahedron Wireframe */}
      <g transform="translate(0, 0)">
        {/* Wireframe lines */}
        {icosahedronLines.map((d, i) => (
          <motion.path
            key={`ico-${i}`}
            d={d}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="0.3"
            strokeOpacity="0.6"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.03, ease: appleEase }}
          />
        ))}
        
        {/* Slow rotation overlay */}
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "60px 32px" }}
        >
          <circle cx="60" cy="32" r="12" fill="none" stroke="#06B6D4" strokeWidth="0.2" strokeDasharray="1 2" strokeOpacity="0.3" />
        </motion.g>
        
        {/* Pulsing core energy */}
        <motion.circle
          cx="60"
          cy="32"
          r="6"
          fill="url(#coreEnergy)"
          filter="url(#aiBloom)"
          animate={{
            r: [5, 7, 5],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        
        {/* Core center */}
        <circle cx="60" cy="32" r="3" fill="rgba(139,92,246,0.4)" stroke="#8B5CF6" strokeWidth="0.5" />
        <text x="60" y="33.5" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" opacity="0.9">AI</text>
      </g>
      
      {/* PREDICTION BEAM - shoots forward with phantom graph */}
      <motion.g>
        {/* Prediction beam line */}
        <motion.path
          d="M 72 32 L 90 32"
          fill="none"
          stroke="url(#predictionBeam)"
          strokeWidth="1"
          filter="url(#aiFiberGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, delay: 1, ease: appleEase }}
        />
        
        {/* Phantom prediction graph - dashed upward trend */}
        <motion.path
          d="M 90 32 L 95 30 L 100 28 L 105 24 L 110 20"
          fill="none"
          stroke="#22C55E"
          strokeWidth="0.6"
          strokeDasharray="2 1.5"
          strokeOpacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.3, ease: appleEase }}
        />
        
        {/* Prediction data tags */}
        <motion.g
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.4, ease: appleEase }}
        >
          <rect x="102" y="16" width="14" height="5" rx="1" fill="rgba(34,197,94,0.2)" stroke="#22C55E" strokeWidth="0.3" strokeOpacity="0.6" />
          <text x="109" y="19.5" fill="#22C55E" fontSize="2.2" textAnchor="middle" fontFamily="ui-monospace" opacity="0.9">+24%</text>
        </motion.g>
      </motion.g>
      
      {/* SMART ROUTING - fork with blocked/optimized paths */}
      <motion.g>
        {/* Fork from nexus */}
        <motion.path
          d="M 60 42 L 60 48"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.6"
          strokeOpacity="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.5, ease: appleEase }}
        />
        
        {/* Blocked path (left) - turns red and fades */}
        <motion.path
          d="M 60 48 Q 50 50, 40 54"
          fill="none"
          stroke="#EF4444"
          strokeWidth="0.5"
          initial={{ pathLength: 0, opacity: 0.6 }}
          animate={{ 
            pathLength: 1,
            opacity: [0.6, 0.6, 0.15],
          }}
          transition={{ duration: 0.8, delay: 1.7, ease: appleEase }}
        />
        <motion.text
          x="38"
          y="56"
          fill="#EF4444"
          fontSize="2"
          fontFamily="ui-monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.6, 0.2] }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          ✕
        </motion.text>
        
        {/* Optimized path (right) - turns green and accelerates */}
        <motion.path
          d="M 60 48 Q 70 50, 80 54"
          fill="none"
          stroke="#22C55E"
          strokeWidth="0.8"
          filter="url(#aiFiberGlow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 1.7, ease: appleEase }}
        />
        
        {/* Lock icon that opens */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 2.2, duration: 0.3, ease: appleEase }}
        >
          <circle cx="82" cy="55" r="2.5" fill="rgba(34,197,94,0.2)" stroke="#22C55E" strokeWidth="0.3" />
          <text x="82" y="56.5" fill="#22C55E" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace">✓</text>
        </motion.g>
      </motion.g>
      
      {/* Energy particles around nexus */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <motion.circle
            key={`energy-${i}`}
            cx={60 + Math.cos(angle) * 10}
            cy={32 + Math.sin(angle) * 10}
            r="0.6"
            fill="#8B5CF6"
            filter="url(#aiFiberGlow)"
            animate={{
              opacity: [0, 0.8, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.15,
              repeat: Infinity,
              ease: appleEase,
            }}
          />
        );
      })}
      
      {/* Footer stats */}
      <motion.text
        x="60"
        y="58"
        fill="white"
        fontSize="2.2"
        fontFamily="ui-monospace"
        textAnchor="middle"
        fillOpacity="0.4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        Predict · Attribute · Optimize
      </motion.text>
    </svg>
  );
};
