import { motion } from "framer-motion";

// EKG-style anomaly detection with spike and alert
export const AnomalyPulseMini = () => {
  // EKG baseline path with spike
  const ekgPath = "M5,35 L15,35 L20,33 L25,37 L30,34 L35,36 L40,35 L48,35 L52,10 L56,45 L60,35 L65,35 L75,33 L85,36 L95,35 L115,35";

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="anomalyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>

      {/* Grid lines for context */}
      {[20, 35, 50].map((y) => (
        <motion.line
          key={y}
          x1="5"
          y1={y}
          x2="115"
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        />
      ))}

      {/* EKG line with animation */}
      <motion.path
        d={ekgPath}
        fill="none"
        stroke="url(#ekgGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* Anomaly spike highlight */}
      <motion.circle
        cx="52"
        cy="10"
        r="4"
        fill="rgba(255,255,255,0.8)"
        filter="url(#anomalyGlow)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.5, 1], opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
      />

      {/* Alert ring pulsing */}
      <motion.circle
        cx="52"
        cy="10"
        r="8"
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="1"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 1.5, 0.5], opacity: [0, 0.8, 0] }}
        transition={{ delay: 1.2, duration: 1.5, repeat: Infinity }}
      />

      {/* Second alert ring (offset timing) */}
      <motion.circle
        cx="52"
        cy="10"
        r="12"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: [0.5, 2, 0.5], opacity: [0, 0.5, 0] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
      />

      {/* Alert label */}
      <motion.g
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.3 }}
      >
        <rect
          x="65"
          y="4"
          width="32"
          height="12"
          rx="6"
          fill="rgba(255,255,255,0.15)"
        />
        <text
          x="81"
          y="12"
          fill="white"
          fontSize="6"
          textAnchor="middle"
          fontFamily="ui-monospace"
        >
          +340%
        </text>
      </motion.g>
    </svg>
  );
};
