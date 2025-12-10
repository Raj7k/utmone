import { motion } from "framer-motion";

// Animated identity stitching: 3 devices → 1 unified identity
export const IdentityStitchingMini = () => {
  const devices = [
    { x: 20, y: 15, icon: "M16 8v8M12 12h8", label: "📱" },
    { x: 20, y: 30, icon: "M8 20h16v12H8zM12 32v4", label: "💻" },
    { x: 20, y: 45, icon: "M10 35h12v8H10z", label: "📧" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="stitchGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Device nodes */}
      {devices.map((device, i) => (
        <g key={i}>
          {/* Device circle */}
          <motion.circle
            cx={device.x}
            cy={device.y}
            r="6"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="2 2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.15, duration: 0.3 }}
          />
          
          {/* Animated connection line to unified node */}
          <motion.line
            x1={device.x + 6}
            y1={device.y}
            x2="90"
            y2="30"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
          />

          {/* Stitching particle traveling to center */}
          <motion.circle
            r="2"
            fill="white"
            filter="url(#stitchGlow)"
            initial={{ cx: device.x + 6, cy: device.y, opacity: 0 }}
            animate={{
              cx: [device.x + 6, 90],
              cy: [device.y, 30],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 1.5,
              delay: 0.8 + i * 0.3,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "easeInOut"
            }}
          />
        </g>
      ))}

      {/* Unified identity node */}
      <motion.circle
        cx="90"
        cy="30"
        r="10"
        fill="rgba(255,255,255,0.05)"
        stroke="white"
        strokeWidth="1.5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
      />
      
      {/* Inner unified dot */}
      <motion.circle
        cx="90"
        cy="30"
        r="3"
        fill="white"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ delay: 1.1, duration: 0.4 }}
      />

      {/* Pulsing ring around unified identity */}
      <motion.circle
        cx="90"
        cy="30"
        r="14"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1.2], opacity: [0.5, 0] }}
        transition={{ delay: 1.3, duration: 1.5, repeat: Infinity }}
      />

      {/* Label */}
      <motion.text
        x="90"
        y="48"
        fill="rgba(255,255,255,0.4)"
        fontSize="6"
        textAnchor="middle"
        fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        1 identity
      </motion.text>
    </svg>
  );
};
