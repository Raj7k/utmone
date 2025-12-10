import { motion } from "framer-motion";

// Animated customer journey with golden path highlight
export const JourneyFlowMini = () => {
  const pathNodes = [
    { x: 15, y: 30 },
    { x: 40, y: 18 },
    { x: 65, y: 25 },
    { x: 90, y: 35 },
    { x: 110, y: 30 },
  ];

  const altPathNodes = [
    { x: 15, y: 30 },
    { x: 40, y: 42 },
    { x: 65, y: 38 },
    { x: 90, y: 45 },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="goldenPath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
        <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Alternative (dimmed) path */}
      <motion.path
        d={`M ${altPathNodes.map(n => `${n.x},${n.y}`).join(' L ')}`}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
      />

      {/* Golden (primary) path */}
      <motion.path
        d={`M ${pathNodes.map(n => `${n.x},${n.y}`).join(' L ')}`}
        fill="none"
        stroke="url(#goldenPath)"
        strokeWidth="2"
        filter="url(#pathGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />

      {/* Path nodes with staggered appearance */}
      {pathNodes.map((node, i) => (
        <motion.circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={i === pathNodes.length - 1 ? 5 : 3}
          fill={i === pathNodes.length - 1 ? "white" : "rgba(255,255,255,0.6)"}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 300 }}
        />
      ))}

      {/* Traveling particle along golden path */}
      <motion.circle
        r="2.5"
        fill="white"
        filter="url(#pathGlow)"
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{
          duration: 2.5,
          delay: 1,
          repeat: Infinity,
          repeatDelay: 1,
          ease: "linear"
        }}
        style={{
          offsetPath: `path("M ${pathNodes.map(n => `${n.x},${n.y}`).join(' L ')}")`,
        }}
      />

      {/* Conversion indicator at end */}
      <motion.circle
        cx="110"
        cy="30"
        r="8"
        fill="none"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
      />

      {/* "Golden Path" label */}
      <motion.text
        x="60"
        y="8"
        fill="rgba(255,255,255,0.4)"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        golden path
      </motion.text>
    </svg>
  );
};
