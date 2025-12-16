import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";

// Cinematic Event Halo: Scanning QR → Detection beam → Data crystallization
export const EventHaloVisual = () => {
  const [scanComplete, setScanComplete] = useState(false);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanComplete(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Smoke thread positions
  const smokeThreads = [
    { y: 18, offset: 0, color: "#3B82F6" },
    { y: 26, offset: 0.2, color: "#8B5CF6" },
    { y: 30, offset: 0, color: "#10B981" },
    { y: 34, offset: -0.15, color: "#F59E0B" },
    { y: 42, offset: 0.1, color: "#EF4444" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full transform-gpu">
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
        
        {/* Fiber glow */}
        <filter id="haloFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Beam glow */}
        <filter id="haloBeamGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Gold revenue gradient */}
        <radialGradient id="haloGoldRevenue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#10B981" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Source QR gradient */}
        <linearGradient id="haloSourceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Thread gradients */}
        {smokeThreads.map((thread, i) => (
          <linearGradient key={`threadGrad-${i}`} id={`threadGrad-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={thread.color} stopOpacity="0.6" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
          </linearGradient>
        ))}
        
        {/* Dot grid */}
        <pattern id="haloDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#haloDotGrid)" opacity="0.3" />

      {/* Source booth - frosted glass with color */}
      <motion.g
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: appleEase }}
      >
        <rect
          x="4"
          y="20"
          width="18"
          height="20"
          rx="3"
          fill="url(#haloSourceGradient)"
          stroke="#8B5CF6"
          strokeOpacity="0.5"
          strokeWidth="0.4"
        />
        
        {/* Pulsing edge */}
        <motion.rect
          x="4"
          y="20"
          width="18"
          height="20"
          rx="3"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.3"
          animate={{ strokeOpacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: appleEase }}
        />
        
        {/* QR Icon */}
        <foreignObject x="8" y="23" width="10" height="10">
          <div className="flex items-center justify-center w-full h-full">
            <QrCode className="w-3 h-3" style={{ color: '#8B5CF6' }} strokeWidth={1.5} />
          </div>
        </foreignObject>
        
        <text 
          x="13" 
          y="38" 
          fill="#8B5CF6" 
          fontSize="5" 
          textAnchor="middle" 
          fontFamily="ui-monospace"
          fontWeight="bold"
        >
          100
        </text>
      </motion.g>

      {/* Stage 1: Ghost smoke threads (faint) */}
      {smokeThreads.map((thread, i) => (
        <motion.path
          key={`smoke-${i}`}
          d={`M 24 ${thread.y} C 42 ${thread.y + thread.offset * 10}, 62 ${thread.y + thread.offset * 5}, 85 30`}
          fill="none"
          stroke={thread.color}
          strokeWidth="0.3"
          strokeLinecap="round"
          strokeOpacity="0.15"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: i * 0.1, ease: appleEase }}
        />
      ))}

      {/* Stage 2: Scanning beam with glow */}
      <motion.line
        x1="0"
        y1="8"
        x2="0"
        y2="52"
        stroke="#10B981"
        strokeWidth="0.5"
        filter="url(#haloBeamGlow)"
        animate={{ 
          x1: [24, 85, 85, 24],
          x2: [24, 85, 85, 24],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Beam trail */}
      <motion.line
        x1="0"
        y1="10"
        x2="0"
        y2="50"
        stroke="#10B981"
        strokeWidth="3"
        strokeOpacity="0.1"
        animate={{ 
          x1: [22, 83, 83, 22],
          x2: [22, 83, 83, 22],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

      {/* Stage 3: Crystallized fiber-optic lines (appear after beam passes) */}
      {smokeThreads.map((thread, i) => (
        <motion.path
          key={`crystal-${i}`}
          d={`M 24 ${thread.y} C 42 ${thread.y + thread.offset * 10}, 62 ${thread.y + thread.offset * 5}, 85 30`}
          fill="none"
          stroke={`url(#threadGrad-${i})`}
          strokeWidth="1"
          strokeLinecap="round"
          filter="url(#haloFiberGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: scanComplete ? 1 : 0,
            opacity: scanComplete ? 1 : 0
          }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.08,
            ease: appleEase
          }}
        />
      ))}

      {/* Stage 4: Detection lens with bloom */}
      <motion.circle
        cx="95"
        cy="30"
        r="10"
        fill="url(#haloGoldRevenue)"
        filter="url(#haloBloom)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      />
      
      {/* Pulsing outer ring */}
      <motion.circle
        cx="95"
        cy="30"
        r="10"
        fill="none"
        stroke="#10B981"
        strokeWidth="0.5"
        animate={{ 
          r: [10, 14, 10],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
      />
      
      {/* Inner core */}
      <circle cx="95" cy="30" r="6" fill="rgba(16,185,129,0.3)" stroke="#10B981" strokeWidth="0.5" />

      {/* Detection count in lens */}
      <motion.text
        x="95"
        y="33"
        fill="white"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        847
      </motion.text>

      {/* Particles along threads */}
      {smokeThreads.slice(0, 3).map((thread, i) => (
        <motion.circle
          key={`particle-${i}`}
          r="2"
          fill={thread.color}
          filter="url(#haloFiberGlow)"
          animate={{ 
            offsetDistance: scanComplete ? ["0%", "100%"] : "0%",
            opacity: scanComplete ? [0, 1, 1, 0] : 0,
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            delay: i * 0.3,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: appleEase,
          }}
          style={{
            offsetPath: `path("M 24 ${thread.y} C 42 ${thread.y + thread.offset * 10}, 62 ${thread.y + thread.offset * 5}, 85 30")`,
          }}
        />
      ))}

      {/* Stats footer */}
      <motion.text
        x="60"
        y="56"
        fill="rgba(16,185,129,0.8)"
        fontSize="4.5"
        fontFamily="'SF Mono', ui-monospace, monospace"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        100 scanned · 847 detected
      </motion.text>
    </svg>
  );
};
