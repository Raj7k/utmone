import { motion } from "framer-motion";
import { BarChart2, Link2, Users } from "lucide-react";

// Refined AI Intelligence: Grey/black base → glowing orb core → single prediction output
// Matches Attribution line weights and visual story: Data → AI → Insight
export const AIInsightPipelineVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1.2, -0.6, 0, 0.6, 1.2]; // 5 strands matching Attribution
  
  const inputs = [
    { y: 12, icon: BarChart2, label: "Metrics" },
    { y: 28, icon: Link2, label: "Links" },
    { y: 44, icon: Users, label: "Audience" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom filter for core glow */}
        <filter id="aiBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow - subtle */}
        <filter id="aiFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.6" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Single flow gradient - grey to white to emerald */}
        <linearGradient id="aiFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#71717A" stopOpacity="0.4" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="70%" stopColor="#10B981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
        </linearGradient>
        
        {/* Output beam gradient */}
        <linearGradient id="aiOutputBeam" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
        </linearGradient>
        
        {/* Core orb gradient - grey/slate base with subtle glow */}
        <radialGradient id="aiCoreGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="30%" stopColor="#A1A1AA" stopOpacity="0.6" />
          <stop offset="60%" stopColor="#52525B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#27272A" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Dot grid pattern */}
        <pattern id="aiDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.15" fill="white" fillOpacity="0.08" />
        </pattern>
      </defs>
      
      {/* Background dot grid */}
      <rect x="0" y="0" width="120" height="60" fill="url(#aiDotGrid)" opacity="0.5" />
      
      {/* Input nodes - grey frosted glass */}
      {inputs.map((input, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: i * 0.1, ease: appleEase }}
        >
          <rect
            x="4"
            y={input.y}
            width="18"
            height="8"
            rx="1.5"
            fill="rgba(63,63,70,0.3)"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="0.4"
          />
          <foreignObject x="6" y={input.y + 1.5} width="5" height="5">
            <input.icon className="w-full h-full text-zinc-400" style={{ opacity: 0.7 }} />
          </foreignObject>
          <text x="12" y={input.y + 5.5} fill="white" fontSize="2" fontFamily="ui-monospace" opacity="0.5">{input.label}</text>
        </motion.g>
      ))}
      
      {/* Multi-strand fiber bundles to AI core - 5 strands like Attribution */}
      {inputs.map((input, inputIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2; // Middle strand is brightest
          const isInner = strandIdx === 1 || strandIdx === 3;
          const opacity = isCenter ? 0.85 : isInner ? 0.35 : 0.15;
          const strokeWidth = isCenter ? 1.0 : isInner ? 0.5 : 0.3;
          
          return (
            <motion.path
              key={`fiber-${inputIdx}-${strandIdx}`}
              d={`M 22 ${input.y + 4 + offset * 0.4} Q 38 ${input.y + 4 + offset * 0.2}, 48 ${30 + offset * 0.15}`}
              fill="none"
              stroke={isCenter ? "url(#aiFlowGradient)" : "#52525B"}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeOpacity={opacity}
              filter={isCenter ? "url(#aiFiberGlow)" : undefined}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.7, delay: 0.3 + inputIdx * 0.12, ease: appleEase }}
            />
          );
        })
      ))}
      
      {/* Heartbeat pulse particles on center fibers */}
      {inputs.map((input, i) => (
        <motion.circle
          key={`pulse-${i}`}
          r="1.2"
          fill="#10B981"
          filter="url(#aiFiberGlow)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 0.9, 0.9, 0],
          }}
          transition={{
            duration: 1, // 60bpm heartbeat
            delay: i * 0.33,
            repeat: Infinity,
            ease: appleEase,
          }}
          style={{
            offsetPath: `path("M 22 ${input.y + 4} Q 38 ${input.y + 4}, 48 30")`,
          }}
        />
      ))}
      
      {/* Central AI Core - Simplified Glowing Orb */}
      <g>
        {/* Outer rotating ring - subtle */}
        <motion.circle
          cx="58"
          cy="30"
          r="14"
          fill="none"
          stroke="#52525B"
          strokeWidth="0.3"
          strokeDasharray="2 3"
          strokeOpacity="0.3"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "58px 30px" }}
        />
        
        {/* Middle rotating ring - opposite direction */}
        <motion.circle
          cx="58"
          cy="30"
          r="10"
          fill="none"
          stroke="#71717A"
          strokeWidth="0.25"
          strokeDasharray="1.5 2"
          strokeOpacity="0.25"
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "58px 30px" }}
        />
        
        {/* Pulsing core glow - the main orb */}
        <motion.circle
          cx="58"
          cy="30"
          r="7"
          fill="url(#aiCoreGlow)"
          filter="url(#aiBloom)"
          animate={{
            r: [6.5, 7.5, 6.5],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        
        {/* Inner core ring */}
        <circle 
          cx="58" 
          cy="30" 
          r="4" 
          fill="rgba(39,39,42,0.6)" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="0.4" 
        />
        
        {/* AI label */}
        <text 
          x="58" 
          y="31.5" 
          fill="white" 
          fontSize="3" 
          textAnchor="middle" 
          fontFamily="ui-monospace" 
          opacity="0.85"
        >
          AI
        </text>
      </g>
      
      {/* Output fiber bundle to prediction - 5 strands */}
      {fiberOffsets.map((offset, strandIdx) => {
        const isCenter = strandIdx === 2;
        const isInner = strandIdx === 1 || strandIdx === 3;
        const opacity = isCenter ? 0.9 : isInner ? 0.4 : 0.18;
        const strokeWidth = isCenter ? 1.0 : isInner ? 0.5 : 0.3;
        
        return (
          <motion.path
            key={`output-${strandIdx}`}
            d={`M 68 ${30 + offset * 0.3} Q 78 ${30 + offset * 0.2}, 88 ${28 + offset * 0.15}`}
            fill="none"
            stroke={isCenter ? "url(#aiOutputBeam)" : "#52525B"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeOpacity={opacity}
            filter={isCenter ? "url(#aiFiberGlow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 1.0, ease: appleEase }}
          />
        );
      })}
      
      {/* Prediction graph - upward trending dashed line */}
      <motion.path
        d="M 88 28 L 93 26 L 98 23 L 103 18 L 108 14"
        fill="none"
        stroke="#10B981"
        strokeWidth="0.7"
        strokeDasharray="1.5 1"
        strokeLinecap="round"
        strokeOpacity="0.8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 1.4, ease: appleEase }}
      />
      
      {/* Graph axis lines - subtle grey */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.4 }}
      >
        <line x1="86" y1="32" x2="86" y2="12" stroke="#52525B" strokeWidth="0.25" strokeOpacity="0.4" />
        <line x1="86" y1="32" x2="112" y2="32" stroke="#52525B" strokeWidth="0.25" strokeOpacity="0.4" />
      </motion.g>
      
      {/* Prediction badge - emerald accent */}
      <motion.g
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.9, duration: 0.4, ease: appleEase }}
      >
        <rect 
          x="100" 
          y="9" 
          width="14" 
          height="6" 
          rx="1.5" 
          fill="rgba(16,185,129,0.15)" 
          stroke="#10B981" 
          strokeWidth="0.4" 
          strokeOpacity="0.7" 
        />
        <text 
          x="107" 
          y="13.2" 
          fill="#10B981" 
          fontSize="2.5" 
          textAnchor="middle" 
          fontFamily="ui-monospace" 
          fontWeight="500"
        >
          +24%
        </text>
      </motion.g>
      
      {/* Output pulse particle */}
      <motion.circle
        r="1.3"
        fill="#10B981"
        filter="url(#aiFiberGlow)"
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{
          offsetDistance: ["0%", "100%"],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.2,
          delay: 1.5,
          repeat: Infinity,
          repeatDelay: 0.8,
          ease: appleEase,
        }}
        style={{
          offsetPath: `path("M 68 30 Q 78 30, 88 28 L 108 14")`,
        }}
      />
      
      {/* Subtle energy particles around orb */}
      {[...Array(6)].map((_, i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <motion.circle
            key={`energy-${i}`}
            cx={58 + Math.cos(angle) * 11}
            cy={30 + Math.sin(angle) * 11}
            r="0.5"
            fill="#71717A"
            animate={{
              opacity: [0, 0.5, 0],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 2,
              delay: i * 0.25,
              repeat: Infinity,
              ease: appleEase,
            }}
          />
        );
      })}
      
      {/* Footer label */}
      <motion.text
        x="58"
        y="56"
        fill="white"
        fontSize="2"
        fontFamily="ui-monospace"
        textAnchor="middle"
        fillOpacity="0.35"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        Predict · Attribute · Optimize
      </motion.text>
    </svg>
  );
};
