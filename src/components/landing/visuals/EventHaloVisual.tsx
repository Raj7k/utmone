import { motion } from "framer-motion";

// Event Halo: Booth scans → Halo detection with sonar rings
export const EventHaloVisual = () => {
  const haloRings = [0, 1, 2, 3];
  
  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="haloGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
        </linearGradient>
        <filter id="haloGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="radarGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Booth node (left side) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <rect x="8" y="22" width="20" height="16" rx="2" fill="none" stroke="#10B981" strokeWidth="0.8" />
        <rect x="10" y="24" width="16" height="12" rx="1" fill="#10B981" fillOpacity="0.15" />
        
        {/* QR scan icon */}
        <rect x="13" y="27" width="3" height="3" fill="#10B981" fillOpacity="0.6" />
        <rect x="17" y="27" width="3" height="3" fill="#10B981" fillOpacity="0.6" />
        <rect x="13" y="31" width="3" height="3" fill="#10B981" fillOpacity="0.6" />
        <rect x="17" y="31" width="3" height="3" fill="#10B981" fillOpacity="0.4" />
        
        <motion.text
          x="18"
          y="43"
          fill="#10B981"
          fontSize="3"
          textAnchor="middle"
          fontFamily="ui-sans-serif"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.5 }}
        >
          100 scans
        </motion.text>
      </motion.g>

      {/* Flow path from booth to halo center */}
      <motion.path
        d="M 30 30 Q 50 30, 70 30"
        fill="none"
        stroke="url(#haloGradient)"
        strokeWidth="2"
        strokeDasharray="4 2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Halo detection center */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {/* Expanding sonar rings */}
        {haloRings.map((ring) => (
          <motion.circle
            key={ring}
            cx="85"
            cy="30"
            r={8 + ring * 6}
            fill="none"
            stroke="#10B981"
            strokeWidth="0.5"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: 2.5,
              delay: 0.8 + ring * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Radar sweep effect */}
        <motion.path
          d="M 85 30 L 85 10 A 20 20 0 0 1 105 30 Z"
          fill="url(#radarGradient)"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ transformOrigin: "85px 30px" }}
        />

        {/* Center detection node */}
        <motion.circle
          cx="85"
          cy="30"
          r="6"
          fill="#10B981"
          fillOpacity="0.3"
          stroke="#10B981"
          strokeWidth="1"
          filter="url(#haloGlow)"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
          }}
        />
        
        {/* Inner glow */}
        <circle cx="85" cy="30" r="3" fill="#10B981" fillOpacity="0.6" />
      </motion.g>

      {/* Detected visitors appearing around halo */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60 - 90) * (Math.PI / 180);
        const radius = 18;
        const x = 85 + Math.cos(angle) * radius;
        const y = 30 + Math.sin(angle) * radius;
        
        return (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r="1.5"
            fill="#06B6D4"
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1, 1, 0],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 2,
              delay: 1 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 1,
            }}
          />
        );
      })}

      {/* Stats */}
      <motion.text
        x="85"
        y="55"
        fill="#10B981"
        fontSize="3.5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 1.2 }}
      >
        +847 halo visitors
      </motion.text>
    </svg>
  );
};
