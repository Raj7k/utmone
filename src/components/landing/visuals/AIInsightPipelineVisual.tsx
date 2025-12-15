import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarChart2, Link2, Users } from "lucide-react";

// AI Intelligence Visual: Matching Attribution structure exactly
// Icons OUTSIDE boxes, grey base, single emerald accent
export const AIInsightPipelineVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1]; // 5 strands matching Attribution
  const fontStack = "'SF Mono', SFMono-Regular, ui-monospace, Menlo, monospace";
  const accentColor = "#10B981"; // Single emerald accent

  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.3,
    })));
  }, []);

  // Inputs with proportional widths like Attribution
  const inputs = [
    { y: 12, width: 38, icon: BarChart2 },
    { y: 27, width: 45, icon: Link2 },
    { y: 42, width: 32, icon: Users },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom filter */}
        <filter id="aiBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
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
        
        {/* Flow gradient - grey to white to emerald */}
        <linearGradient id="aiFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#71717A" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
        </linearGradient>
        
        {/* Output gradient */}
        <linearGradient id="aiOutput" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
        </linearGradient>
        
        {/* AI core gradient */}
        <radialGradient id="aiCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#A1A1AA" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#52525B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#27272A" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="aiDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#aiDotGrid)" opacity="0.3" />
      
      {/* Input bars with icons OUTSIDE - matching Attribution exactly */}
      {inputs.map((input, i) => {
        const IconComponent = input.icon;
        return (
          <g key={i}>
            <motion.rect
              x="16"
              y={input.y}
              width={input.width}
              height="6"
              rx="2"
              fill="#52525B"
              fillOpacity={0.2}
              stroke="#52525B"
              strokeOpacity={0.5}
              strokeWidth="0.4"
              initial={{ width: 0 }}
              animate={{ width: input.width }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: appleEase }}
            />
            {/* Pulse glow */}
            <motion.rect
              x="16"
              y={input.y}
              width={input.width}
              height="6"
              rx="2"
              fill="none"
              stroke="#71717A"
              strokeWidth="0.3"
              animate={{ strokeOpacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: appleEase }}
            />
            {/* Icon OUTSIDE the bar - matching Attribution */}
            <foreignObject x="4" y={input.y - 1} width="10" height="8">
              <div className="flex items-center justify-center w-full h-full">
                <IconComponent className="w-2 h-2 text-zinc-400" strokeWidth={2} />
              </div>
            </foreignObject>
          </g>
        );
      })}
      
      {/* Multi-strand fiber flows to AI core - 5 strands */}
      {inputs.map((input, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = input.y + 3;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M ${16 + input.width} ${baseY + offset * 0.8} Q 55 ${baseY + offset * 0.4}, 68 30`}
              fill="none"
              stroke={isCenter ? "url(#aiFlow)" : "#52525B"}
              strokeWidth={isCenter ? 1.0 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#aiFiberGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}
      
      {/* Central AI Core */}
      <g>
        {/* Outer rotating ring */}
        <motion.circle
          cx="68"
          cy="30"
          r="12"
          fill="none"
          stroke="#52525B"
          strokeWidth="0.3"
          strokeDasharray="2 3"
          strokeOpacity="0.3"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "68px 30px" }}
        />
        
        {/* Core glow */}
        <motion.circle
          cx="68"
          cy="30"
          r="8"
          fill="url(#aiCoreGlow)"
          filter="url(#aiBloom)"
          animate={{ r: [7.5, 8.5, 7.5], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        
        {/* Inner core ring */}
        <circle cx="68" cy="30" r="5" fill="rgba(39,39,42,0.6)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.4" />
        
        {/* AI label */}
        <text 
          x="68" 
          y="32" 
          fill="white" 
          fontSize="5" 
          textAnchor="middle" 
          fontFamily={fontStack}
          fontWeight="bold"
          opacity="0.9"
        >
          AI
        </text>
      </g>
      
      {/* Output fiber bundle - 5 strands */}
      {fiberOffsets.map((offset, strandIdx) => {
        const isCenter = strandIdx === 2;
        return (
          <motion.path
            key={`output-${strandIdx}`}
            d={`M 80 ${30 + offset * 0.6} Q 90 ${30 + offset * 0.4}, 100 ${26 + offset * 0.3}`}
            fill="none"
            stroke={isCenter ? "url(#aiOutput)" : "#52525B"}
            strokeWidth={isCenter ? 1.0 : 0.3}
            strokeLinecap="round"
            strokeOpacity={isCenter ? 0.8 : 0.2}
            filter={isCenter ? "url(#aiFiberGlow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: appleEase }}
          />
        );
      })}
      
      {/* Prediction graph - upward trending */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        {/* Axis lines */}
        <line x1="98" y1="32" x2="98" y2="14" stroke="#52525B" strokeWidth="0.3" strokeOpacity="0.4" />
        <line x1="98" y1="32" x2="116" y2="32" stroke="#52525B" strokeWidth="0.3" strokeOpacity="0.4" />
        
        {/* Trend line */}
        <motion.path
          d="M 100 28 L 104 25 L 108 21 L 112 16"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.8"
          strokeDasharray="1.5 1"
          strokeLinecap="round"
          strokeOpacity="0.8"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.4, ease: appleEase }}
        />
      </motion.g>
      
      {/* Prediction badge */}
      <motion.g
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.4, ease: appleEase }}
      >
        <rect 
          x="104" 
          y="8" 
          width="12" 
          height="6" 
          rx="1.5" 
          fill="rgba(16,185,129,0.15)" 
          stroke={accentColor}
          strokeWidth="0.4" 
          strokeOpacity="0.7" 
        />
        <text 
          x="110" 
          y="12.5" 
          fill={accentColor}
          fontSize="3" 
          textAnchor="middle" 
          fontFamily={fontStack}
          fontWeight="500"
        >
          +24%
        </text>
      </motion.g>
      
      {/* Heartbeat particles */}
      {particles.map((p) => {
        const input = inputs[p.path];
        return (
          <motion.circle
            key={p.id}
            r="1.5"
            fill={accentColor}
            filter="url(#aiFiberGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              delay: p.delay,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M ${16 + input.width} ${input.y + 3} Q 55 ${input.y + 3}, 68 30")`,
            }}
          />
        );
      })}
    </svg>
  );
};