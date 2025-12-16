import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Apple Pro aesthetic: "Noisy data → AI Lens → Clean signal"
// Grey jagged line transforms into smooth white Bezier through a lens
export const AIInsightPipelineVisual = () => {
  const [lensPosition, setLensPosition] = useState(25);
  const appleSpring = [0.16, 1, 0.3, 1] as const;

  useEffect(() => {
    // Animate lens sweep
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
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Frosted glass lens gradient */}
        <radialGradient id="aiLensGlass" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.08)" />
          <stop offset="70%" stopColor="rgba(255,255,255,0.02)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
        
        {/* Clip path for lens reveal */}
        <clipPath id="lensClip">
          <motion.rect
            x="0"
            y="0"
            width={lensPosition + "%"}
            height="100%"
            animate={{ width: ["25%", "95%", "95%", "25%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: appleSpring }}
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
            transition={{ duration: 4, repeat: Infinity, ease: appleSpring }}
          />
        </clipPath>
      </defs>
      
      {/* Transparent background */}

      {/* The noisy grey line (problem data) - visible after lens */}
      <polyline
        points={noisyPoints}
        fill="none"
        stroke="rgba(113,113,122,0.4)"
        strokeWidth="0.8"
        strokeLinecap="round"
        clipPath="url(#noisyClip)"
      />
      
      {/* Vibrating effect on noisy line */}
      <motion.polyline
        points={noisyPoints}
        fill="none"
        stroke="rgba(113,113,122,0.2)"
        strokeWidth="1.2"
        strokeLinecap="round"
        clipPath="url(#noisyClip)"
        animate={{ 
          y: [-0.5, 0.5, -0.5],
          opacity: [0.2, 0.3, 0.2]
        }}
        transition={{ duration: 0.15, repeat: Infinity }}
      />

      {/* The clean white line (solution) - revealed by lens */}
      <motion.path
        d={smoothPath}
        fill="none"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="0.5"
        strokeLinecap="round"
        clipPath="url(#lensClip)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: appleSpring }}
      />

      {/* The AI Lens - frosted glass circle that sweeps */}
      <motion.g
        animate={{ x: [0, 70, 70, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: appleSpring }}
      >
        {/* Lens body */}
        <circle
          cx="30"
          cy="30"
          r="12"
          fill="url(#aiLensGlass)"
        />
        
        {/* Lens rim - hairline white */}
        <circle
          cx="30"
          cy="30"
          r="12"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="0.3"
        />
        
        {/* Inner lens ring */}
        <circle
          cx="30"
          cy="30"
          r="8"
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="0.2"
        />
      </motion.g>

      {/* Attribution dots trail - desaturated purple at 40% */}
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.g
          key={`dot-${i}`}
          animate={{ 
            x: [0, 70, 70, 0],
            opacity: [0, 1, 1, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: appleSpring,
            delay: i * 0.08
          }}
        >
          {/* Plus sign (+) */}
          <motion.text
            x={20 + i * 8}
            y={42 + (i % 2) * 3}
            fill="rgba(84,18,174,0.35)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace"
            fontWeight="300"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.35, 0.35, 0] }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              delay: 0.5 + i * 0.15 
            }}
          >
            +
          </motion.text>
        </motion.g>
      ))}

      {/* Small attribution dots */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`attr-${i}`}
          cx={25 + i * 12}
          cy={44}
          r="0.8"
          fill="rgba(84,18,174,0.3)"
          animate={{ 
            opacity: [0, 0.3, 0.3, 0],
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            delay: 0.8 + i * 0.2 
          }}
        />
      ))}

      {/* Labels */}
      <text
        x="10"
        y="52"
        fill="rgba(113,113,122,0.6)"
        fontSize="4"
        fontFamily="'SF Mono', ui-monospace"
      >
        noisy
      </text>
      
      <motion.text
        x="100"
        y="52"
        fill="rgba(255,255,255,0.6)"
        fontSize="4"
        fontFamily="'SF Mono', ui-monospace"
        textAnchor="end"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        clean
      </motion.text>

      {/* Output prediction indicator */}
      <motion.line
        x1="110"
        y1="30"
        x2="118"
        y2="26"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="0.3"
        strokeDasharray="1,1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 2, duration: 1, ease: appleSpring }}
      />
      
      <motion.text
        x="116"
        y="22"
        fill="rgba(255,255,255,0.6)"
        fontSize="4"
        fontFamily="'SF Mono', ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
      >
        +24%
      </motion.text>
    </svg>
  );
};
