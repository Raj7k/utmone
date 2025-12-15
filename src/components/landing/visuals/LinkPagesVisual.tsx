import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Link Pages: One link → multiple destinations Sankey flow
export const LinkPagesVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.5,
    }));
    setParticles(newParticles);
  }, []);

  const destinations = [
    { y: 12, label: "Blog", color: "#F97316" },
    { y: 24, label: "Portfolio", color: "#EC4899" },
    { y: 36, label: "Store", color: "#8B5CF6" },
    { y: 48, label: "Social", color: "#06B6D4" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {destinations.map((dest, i) => (
          <linearGradient key={`gradient-${i}`} id={`linkPageFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
            <stop offset="100%" stopColor={dest.color} stopOpacity="0.3" />
          </linearGradient>
        ))}
        <filter id="linkGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="sunsetGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EC4899" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
      </defs>

      {/* Source: Single utm.one link (phone mockup) */}
      <motion.g
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Phone frame */}
        <rect x="4" y="12" width="16" height="36" rx="2" fill="none" stroke="url(#sunsetGradient)" strokeWidth="0.8" />
        <rect x="6" y="14" width="12" height="32" rx="1" fill="url(#sunsetGradient)" fillOpacity="0.15" />
        
        {/* Mini link rows */}
        {[0, 1, 2, 3].map((i) => (
          <motion.rect
            key={i}
            x="7"
            y={16 + i * 7}
            width="10"
            height="4"
            rx="0.5"
            fill="white"
            fillOpacity={0.6 - i * 0.1}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          />
        ))}
      </motion.g>

      {/* Flow curves from center to destinations */}
      {destinations.map((dest, i) => (
        <motion.path
          key={`flow-${i}`}
          d={`M 24 30 Q 55 30, 90 ${dest.y + 3}`}
          fill="none"
          stroke={`url(#linkPageFlow-${i})`}
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
        />
      ))}

      {/* Destination nodes */}
      {destinations.map((dest, i) => (
        <g key={`dest-${i}`}>
          <motion.rect
            x="92"
            y={dest.y}
            width="24"
            height="6"
            rx="1.5"
            fill={dest.color}
            fillOpacity={0.3}
            stroke={dest.color}
            strokeOpacity={0.6}
            strokeWidth="0.5"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.7 + i * 0.1 }}
          />
          <motion.text
            x="104"
            y={dest.y + 4.2}
            fill="white"
            fontSize="3"
            textAnchor="middle"
            fontFamily="ui-sans-serif"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.9 + i * 0.1 }}
          >
            {dest.label}
          </motion.text>
        </g>
      ))}

      {/* Animated particles */}
      {particles.map((particle) => {
        const dest = destinations[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1.5"
            fill={dest.color}
            filter="url(#linkGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.8,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: "linear",
            }}
            style={{
              offsetPath: `path("M 24 30 Q 55 30, 90 ${dest.y + 3}")`,
            }}
          />
        );
      })}

      {/* Stats label */}
      <motion.text
        x="12"
        y="56"
        fill="white"
        fontSize="3.5"
        fontFamily="ui-monospace"
        fillOpacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        47 links • 12.4K clicks
      </motion.text>
    </svg>
  );
};
