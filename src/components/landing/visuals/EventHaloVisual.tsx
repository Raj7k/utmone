import { motion } from "framer-motion";

// Cinematic Event Halo: Fiber-optic streams → rotating halo core → sonar detection rings
export const EventHaloVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  
  // Generate fiber strand offsets for multi-strand effect
  const fiberOffsets = [-1.5, -0.75, 0, 0.75, 1.5];
  
  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom effect filter */}
        <filter id="haloBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow with additive blending */}
        <filter id="fiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Fiber gradient - white hot center to emerald edge */}
        <linearGradient id="fiberCore" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
        </linearGradient>
        
        {/* Halo ring gradient */}
        <linearGradient id="haloRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
        </linearGradient>
        
        {/* Frosted glass effect */}
        <filter id="frostedGlass" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.3" />
        </filter>
        
        {/* Dot grid pattern for background */}
        <pattern id="dotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.15" fill="white" fillOpacity="0.15" />
        </pattern>
      </defs>
      
      {/* Background dot grid */}
      <rect x="0" y="0" width="120" height="60" fill="url(#dotGrid)" opacity="0.3" />
      
      {/* Source: Frosted glass booth node */}
      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: appleEase }}
      >
        <rect
          x="4"
          y="22"
          width="18"
          height="16"
          rx="2"
          fill="rgba(255,255,255,0.06)"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="0.4"
          filter="url(#frostedGlass)"
        />
        {/* Glowing edge when active */}
        <motion.rect
          x="4"
          y="22"
          width="18"
          height="16"
          rx="2"
          fill="none"
          stroke="#10B981"
          strokeWidth="0.3"
          animate={{ 
            strokeOpacity: [0.2, 0.6, 0.2],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        <text x="13" y="31" fill="white" fontSize="3" textAnchor="middle" fontFamily="ui-monospace" opacity="0.7">Booth</text>
        <text x="13" y="35" fill="white" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" opacity="0.4">100 scans</text>
      </motion.g>
      
      {/* Multi-strand fiber-optic flow - 5 parallel strands */}
      {fiberOffsets.map((offset, i) => {
        const isCenter = i === 2;
        const opacity = isCenter ? 1 : 0.25 - Math.abs(offset) * 0.08;
        const strokeWidth = isCenter ? 1.2 : 0.4;
        
        return (
          <motion.path
            key={`fiber-${i}`}
            d={`M 22 ${30 + offset} C 40 ${30 + offset}, 55 ${30 + offset * 0.5}, 70 30`}
            fill="none"
            stroke={isCenter ? "url(#fiberCore)" : "#10B981"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeOpacity={opacity}
            filter={isCenter ? "url(#fiberGlow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: appleEase }}
          />
        );
      })}
      
      {/* Heartbeat pulse on fibers - 60bpm */}
      <motion.ellipse
        cx="45"
        cy="30"
        rx="3"
        ry="1.5"
        fill="#FFFFFF"
        filter="url(#fiberGlow)"
        animate={{
          cx: [22, 70],
          opacity: [0.8, 0],
          scale: [0.8, 1.2],
        }}
        transition={{
          duration: 1, // 60bpm
          repeat: Infinity,
          ease: appleEase,
        }}
      />
      
      {/* The Halo Core - rotating rings */}
      <g transform="translate(85, 30)">
        {/* Outer detection ring - slow rotation */}
        <motion.circle
          cx="0"
          cy="0"
          r="18"
          fill="none"
          stroke="url(#haloRingGrad)"
          strokeWidth="0.3"
          strokeDasharray="3 6"
          strokeOpacity="0.3"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0 0" }}
        />
        
        {/* Middle ring - medium rotation */}
        <motion.circle
          cx="0"
          cy="0"
          r="14"
          fill="none"
          stroke="#10B981"
          strokeWidth="0.4"
          strokeDasharray="2 4"
          strokeOpacity="0.4"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0 0" }}
        />
        
        {/* Inner ring - fast rotation */}
        <motion.circle
          cx="0"
          cy="0"
          r="10"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="0.5"
          strokeDasharray="1.5 3"
          strokeOpacity="0.6"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "0 0" }}
        />
        
        {/* Sonar pulse rings - expanding outward */}
        {[0, 1, 2].map((ring) => (
          <motion.circle
            key={`sonar-${ring}`}
            cx="0"
            cy="0"
            r="4"
            fill="none"
            stroke="#10B981"
            strokeWidth="0.5"
            initial={{ r: 4, opacity: 0.6 }}
            animate={{ 
              r: [4, 22],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 2.5,
              delay: ring * 0.8,
              repeat: Infinity,
              ease: appleEase,
            }}
          />
        ))}
        
        {/* Core glow */}
        <motion.circle
          cx="0"
          cy="0"
          r="5"
          fill="rgba(16,185,129,0.25)"
          filter="url(#haloBloom)"
          animate={{
            r: [5, 6, 5],
            fillOpacity: [0.25, 0.4, 0.25],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        
        {/* Core center */}
        <circle cx="0" cy="0" r="4" fill="rgba(16,185,129,0.3)" stroke="#10B981" strokeWidth="0.5" />
        <text x="0" y="1.5" fill="white" fontSize="3" textAnchor="middle" fontFamily="ui-monospace" opacity="0.9">halo</text>
      </g>
      
      {/* Particle sparks around halo */}
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const baseRadius = 8;
        return (
          <motion.circle
            key={`spark-${i}`}
            cx={85 + Math.cos(angle) * baseRadius}
            cy={30 + Math.sin(angle) * baseRadius}
            r="0.8"
            fill="#10B981"
            filter="url(#fiberGlow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.2, 0.5],
              cx: 85 + Math.cos(angle) * (baseRadius + 8),
              cy: 30 + Math.sin(angle) * (baseRadius + 8),
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.12,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: appleEase,
            }}
          />
        );
      })}
      
      {/* Detection dots - representing walk-by visitors */}
      {[
        { x: 75, y: 16 }, { x: 95, y: 14 }, { x: 105, y: 20 },
        { x: 72, y: 44 }, { x: 98, y: 46 }, { x: 108, y: 40 },
      ].map((dot, i) => (
        <motion.circle
          key={`detect-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="1.2"
          fill="#10B981"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1, 1],
            opacity: [0, 0.8, 0.4],
          }}
          transition={{ 
            delay: 1.2 + i * 0.15,
            duration: 0.8,
            ease: appleEase,
          }}
        />
      ))}
      
      {/* Stats footer */}
      <motion.text
        x="85"
        y="55"
        fill="white"
        fontSize="2.5"
        fontFamily="ui-monospace"
        textAnchor="middle"
        initial={{ opacity: 0, y: 58 }}
        animate={{ opacity: 0.5, y: 55 }}
        transition={{ delay: 1.5, duration: 0.5, ease: appleEase }}
      >
        +847 halo visitors detected
      </motion.text>
    </svg>
  );
};
