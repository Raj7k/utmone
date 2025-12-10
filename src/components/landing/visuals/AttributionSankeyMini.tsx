import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Continuous Sankey-style attribution flow with particle animation
export const AttributionSankeyMini = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate continuous particle stream
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.4,
    }));
    setParticles(newParticles);
  }, []);

  const sources = [
    { y: 12, width: 50 },
    { y: 24, width: 38 },
    { y: 36, width: 55 },
    { y: 48, width: 30 },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="sankeyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
        </linearGradient>
        <filter id="particleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Source bars with staggered animation */}
      {sources.map((source, i) => (
        <motion.rect
          key={i}
          x="8"
          y={source.y}
          width={source.width}
          height="6"
          rx="2"
          fill={`rgba(255,255,255,${0.2 + i * 0.1})`}
          initial={{ width: 0 }}
          animate={{ width: source.width }}
          transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
        />
      ))}

      {/* Flow curves to revenue node */}
      {sources.map((source, i) => (
        <motion.path
          key={`flow-${i}`}
          d={`M ${8 + source.width} ${source.y + 3} Q 80 ${source.y + 3}, 100 30`}
          fill="none"
          stroke="url(#sankeyFlow)"
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* Animated particles flowing to revenue */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="2"
            fill="white"
            filter="url(#particleGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "linear"
            }}
            style={{
              offsetPath: `path("M ${8 + source.width} ${source.y + 3} Q 80 ${source.y + 3}, 100 30")`,
            }}
          />
        );
      })}

      {/* Revenue node with glow effect */}
      <motion.circle
        cx="108"
        cy="30"
        r="8"
        fill="none"
        stroke="white"
        strokeWidth="1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      />
      <motion.circle
        cx="108"
        cy="30"
        r="12"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
      />
      <motion.text
        x="108"
        y="33"
        fill="white"
        fontSize="6"
        textAnchor="middle"
        fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        $
      </motion.text>
    </svg>
  );
};
