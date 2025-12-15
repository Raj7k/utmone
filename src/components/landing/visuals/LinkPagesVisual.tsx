import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Link Pages: Thin minimalist Sankey - one link → multiple destinations
export const LinkPagesVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.4,
    }));
    setParticles(newParticles);
  }, []);

  const destinations = [
    { y: 15, label: "Blog", color: "#F97316" },
    { y: 27, label: "Portfolio", color: "#EC4899" },
    { y: 39, label: "Store", color: "#8B5CF6" },
    { y: 51, label: "Social", color: "#06B6D4" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {destinations.map((dest, i) => (
          <linearGradient key={`gradient-${i}`} id={`lpFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.7" />
            <stop offset="100%" stopColor={dest.color} stopOpacity="0.3" />
          </linearGradient>
        ))}
        <filter id="lpGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="0.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Source: Single link bar */}
      <motion.g
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <rect x="6" y="26" width="18" height="8" rx="1.5" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
        <text x="15" y="31.5" fill="white" fontSize="3" textAnchor="middle" fontFamily="ui-monospace" opacity="0.7">utm.one</text>
      </motion.g>

      {/* Flow curves to destinations */}
      {destinations.map((dest, i) => (
        <motion.path
          key={`flow-${i}`}
          d={`M 24 30 Q 55 30, 88 ${dest.y + 3}`}
          fill="none"
          stroke={`url(#lpFlow-${i})`}
          strokeWidth="1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
        />
      ))}

      {/* Destination bars */}
      {destinations.map((dest, i) => (
        <motion.g key={`dest-${i}`}>
          <motion.rect
            x="90"
            y={dest.y}
            width="24"
            height="6"
            rx="1"
            fill={dest.color}
            fillOpacity="0.15"
            stroke={dest.color}
            strokeOpacity="0.4"
            strokeWidth="0.3"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
          />
          <motion.text
            x="102"
            y={dest.y + 4.2}
            fill="white"
            fontSize="2.5"
            textAnchor="middle"
            fontFamily="ui-monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.7 + i * 0.08 }}
          >
            {dest.label}
          </motion.text>
        </motion.g>
      ))}

      {/* Animated particles */}
      {particles.map((particle) => {
        const dest = destinations[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1"
            fill={dest.color}
            filter="url(#lpGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 2,
              ease: "linear",
            }}
            style={{
              offsetPath: `path("M 24 30 Q 55 30, 88 ${dest.y + 3}")`,
            }}
          />
        );
      })}

      {/* Stats */}
      <motion.text
        x="15"
        y="56"
        fill="white"
        fontSize="2.5"
        fontFamily="ui-monospace"
        fillOpacity="0.4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        47 links · 12.4K clicks
      </motion.text>
    </svg>
  );
};
