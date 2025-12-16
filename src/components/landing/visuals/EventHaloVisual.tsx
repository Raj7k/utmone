import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { QrCode } from "lucide-react";

// Apple Pro aesthetic: "Smoke → Scanning beam → Crystallized data"
// Faint ghost threads → hairline beam sweeps → solid white lines emerge
export const EventHaloVisual = () => {
  const [scanComplete, setScanComplete] = useState(false);
  const appleSpring = [0.16, 1, 0.3, 1] as const;
  
  useEffect(() => {
    // Loop: scan → hold → reset
    const interval = setInterval(() => {
      setScanComplete(prev => !prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Smoke thread positions (barely visible ghost streams)
  const smokeThreads = [
    { y: 18, offset: 0 },
    { y: 26, offset: 0.2 },
    { y: 30, offset: 0 },
    { y: 34, offset: -0.15 },
    { y: 42, offset: 0.1 },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full transform-gpu">
      <defs>
        {/* Frosted glass gradient for destination lens */}
        <radialGradient id="haloLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(26,26,26,0.95)" />
          <stop offset="60%" stopColor="rgba(26,26,26,0.8)" />
          <stop offset="100%" stopColor="rgba(26,26,26,0.4)" />
        </radialGradient>
      </defs>
      
      {/* Transparent background */}

      {/* Source booth - frosted glass card */}
      <motion.g
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: appleSpring }}
        style={{ willChange: 'transform, opacity' }}
      >
        <rect
          x="4"
          y="22"
          width="16"
          height="16"
          rx="2"
          fill="rgba(26,26,26,0.8)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="0.3"
        />
        
        {/* QR Icon - monochrome */}
        <foreignObject x="7" y="24" width="10" height="10">
          <div className="flex items-center justify-center w-full h-full">
            <QrCode className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.5)' }} strokeWidth={1.5} />
          </div>
        </foreignObject>
        
        <text 
          x="12" 
          y="36" 
          fill="rgba(255,255,255,0.5)" 
          fontSize="4.5" 
          textAnchor="middle" 
          fontFamily="'SF Mono', ui-monospace, monospace"
        >
          100
        </text>
      </motion.g>

      {/* Stage 1: Ghost smoke threads (5% opacity) */}
      {smokeThreads.map((thread, i) => (
        <motion.path
          key={`smoke-${i}`}
          d={`M 22 ${thread.y} C 40 ${thread.y + thread.offset * 10}, 60 ${thread.y + thread.offset * 5}, 85 30`}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, delay: i * 0.1, ease: appleSpring }}
          style={{ willChange: 'stroke-dashoffset' }}
        />
      ))}

      {/* Stage 2: Scanning beam - hairline white vertical line */}
      <motion.line
        x1="0"
        y1="8"
        x2="0"
        y2="52"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.3"
        animate={{ 
          x1: [22, 85, 85, 22],
          x2: [22, 85, 85, 22],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
      />
      
      {/* Beam glow trail (subtle) */}
      <motion.line
        x1="0"
        y1="10"
        x2="0"
        y2="50"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="2"
        animate={{ 
          x1: [20, 83, 83, 20],
          x2: [20, 83, 83, 20],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
      />

      {/* Stage 3: Crystallized solid white lines (appear after beam passes) */}
      {smokeThreads.map((thread, i) => (
        <motion.path
          key={`crystal-${i}`}
          d={`M 22 ${thread.y} C 40 ${thread.y + thread.offset * 10}, 60 ${thread.y + thread.offset * 5}, 85 30`}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="0.4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: scanComplete ? 1 : 0,
            opacity: scanComplete ? 1 : 0
          }}
          transition={{ 
            duration: 0.8, 
            delay: i * 0.08,
            ease: "linear"
          }}
          style={{ willChange: 'stroke-dashoffset, opacity' }}
        />
      ))}

      {/* Stage 4: Black hole lens destination */}
      <motion.circle
        cx="95"
        cy="30"
        r="10"
        fill="url(#haloLens)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
        style={{ willChange: 'transform' }}
      />
      
      {/* Lens rim - hairline white */}
      <motion.circle
        cx="95"
        cy="30"
        r="10"
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 15 }}
        style={{ willChange: 'transform' }}
      />
      
      {/* Inner lens ring - light bending effect */}
      <motion.circle
        cx="95"
        cy="30"
        r="6"
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth="0.2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, type: "spring", stiffness: 100, damping: 15 }}
        style={{ willChange: 'transform' }}
      />

      {/* Output: Single perfect white line exits right */}
      <motion.line
        x1="105"
        y1="30"
        x2="118"
        y2="30"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.4"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 0.8, ease: appleSpring }}
        style={{ willChange: 'stroke-dashoffset' }}
      />
      
      {/* Subtle pulse on output */}
      <motion.circle
        cx="116"
        cy="30"
        r="1"
        fill="rgba(255,255,255,0.4)"
        animate={{ 
          opacity: [0.4, 0.6, 0.4],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* Detection count in lens */}
      <motion.text
        x="95"
        y="33"
        fill="rgba(255,255,255,0.7)"
        fontSize="6"
        textAnchor="middle"
        fontFamily="'SF Mono', ui-monospace, monospace"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        847
      </motion.text>

      {/* Stats footer */}
      <motion.text
        x="60"
        y="56"
        fill="rgba(113,113,122,0.6)"
        fontSize="4.5"
        fontFamily="'SF Mono', ui-monospace, monospace"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, ease: appleSpring }}
      >
        100 scanned · 847 detected
      </motion.text>
    </svg>
  );
};
