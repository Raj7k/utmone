import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Cinematic AI Pipeline: Noisy data → AI Lens → Clean signal with glows
export const AIInsightPipelineVisual = () => {
  const [lensPosition, setLensPosition] = useState(25);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setLensPosition(prev => prev >= 95 ? 25 : prev);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Generate noisy path points
  const noisyPoints = Array.from({ length: 20 }, (_, i) => {
    const x = 10 + (i * 5);
    const noise = Math.sin(i * 1.5) * 3 + Math.cos(i * 2.3) * 2;
    return `${x},${30 + noise}`;
  }).join(' ');

  // Smooth bezier curve path
  const smoothPath = "M 10 30 C 30 30, 50 28, 70 30 S 90 32, 110 30";

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full transform-gpu">
      <defs>
        {/* Bloom effect filter */}
        <filter id="aiBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Lens glow */}
        <filter id="aiLensGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* AI lens gradient */}
        <radialGradient id="aiLensGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Clean signal gradient */}
        <linearGradient id="cleanSignal" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
        </linearGradient>
        
        {/* Clip path for lens reveal */}
        <clipPath id="lensClip">
          <motion.rect
            x="0"
            y="0"
            width={lensPosition + "%"}
            height="100%"
            animate={{ width: ["25%", "95%", "95%", "25%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </clipPath>
        
        {/* Inverse clip for noisy section */}
        <clipPath id="noisyClip">
          <motion.rect
            y="0"
            height="100%"
            animate={{ 
              x: ["25%", "95%", "95%", "25%"],
              width: ["75%", "5%", "5%", "75%"]
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          />
        </clipPath>
        
        {/* Dot grid */}
        <pattern id="aiDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#aiDotGrid)" opacity="0.3" />

      {/* The noisy grey line (problem data) - visible after lens */}
      <polyline
        points={noisyPoints}
        fill="none"
        stroke="rgba(239,68,68,0.4)"
        strokeWidth="0.8"
        strokeLinecap="round"
        clipPath="url(#noisyClip)"
      />
      
      {/* Vibrating effect on noisy line */}
      <motion.polyline
        points={noisyPoints}
        fill="none"
        stroke="rgba(239,68,68,0.2)"
        strokeWidth="1.2"
        strokeLinecap="round"
        clipPath="url(#noisyClip)"
        animate={{ 
          y: [-0.5, 0.5, -0.5],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 0.15, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform, opacity' }}
      />

      {/* The clean signal (solution) - revealed by lens with glow */}
      <motion.path
        d={smoothPath}
        fill="none"
        stroke="url(#cleanSignal)"
        strokeWidth="1"
        strokeLinecap="round"
        clipPath="url(#lensClip)"
        filter="url(#aiLensGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: appleEase }}
        style={{ willChange: 'stroke-dashoffset' }}
      />

      {/* The AI Lens - with bloom */}
      <motion.g
        animate={{ x: [0, 70, 70, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ willChange: 'transform' }}
      >
        {/* Lens body with glow */}
        <motion.circle
          cx="30"
          cy="30"
          r="12"
          fill="url(#aiLensGradient)"
          filter="url(#aiBloom)"
        />
        
        {/* Lens pulsing ring */}
        <motion.circle
          cx="30"
          cy="30"
          r="12"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.5"
          animate={{ 
            r: [12, 15, 12],
            opacity: [0.5, 0.1, 0.5],
          }}
          transition={{ duration: 1.2, repeat: Infinity, ease: appleEase }}
        />
        
        {/* Inner lens ring */}
        <circle
          cx="30"
          cy="30"
          r="8"
          fill="none"
          stroke="rgba(139,92,246,0.4)"
          strokeWidth="0.3"
        />
        
        {/* AI text */}
        <text
          x="30"
          y="33"
          fill="white"
          fontSize="5"
          textAnchor="middle"
          fontFamily="ui-monospace"
          fontWeight="bold"
        >
          AI
        </text>
      </motion.g>

      {/* Particles along clean path */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`particle-${i}`}
          r="2"
          fill="#10B981"
          filter="url(#aiLensGlow)"
          animate={{ 
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.5,
            delay: i * 0.4,
            repeat: Infinity,
            repeatDelay: 0.5,
            ease: appleEase,
          }}
          style={{
            offsetPath: `path("${smoothPath}")`,
          }}
        />
      ))}

      {/* Labels */}
      <text
        x="10"
        y="52"
        fill="rgba(239,68,68,0.6)"
        fontSize="4.5"
        fontFamily="'SF Mono', ui-monospace, monospace"
      >
        noisy
      </text>
      
      <motion.text
        x="100"
        y="52"
        fill="rgba(16,185,129,0.8)"
        fontSize="4.5"
        fontFamily="'SF Mono', ui-monospace, monospace"
        textAnchor="end"
        animate={{ opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: appleEase }}
      >
        clean
      </motion.text>

      {/* Output prediction indicator */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <motion.line
          x1="110"
          y1="30"
          x2="118"
          y2="26"
          stroke="#10B981"
          strokeWidth="0.5"
          strokeDasharray="1,1"
          filter="url(#aiLensGlow)"
        />
        
        <motion.text
          x="116"
          y="22"
          fill="#10B981"
          fontSize="4.5"
          fontFamily="'SF Mono', ui-monospace, monospace"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          +24%
        </motion.text>
      </motion.g>
    </svg>
  );
};
