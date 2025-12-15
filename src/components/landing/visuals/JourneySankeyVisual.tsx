import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Journey Analytics: Multi-touch Sankey with golden path highlight
export const JourneySankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.4,
    }));
    setParticles(newParticles);
  }, []);

  const touchpoints = [
    { y: 10, label: "Ad", color: "#3B82F6" },
    { y: 28, label: "Blog", color: "#F59E0B", isGolden: true },
    { y: 46, label: "Referral", color: "#10B981" },
  ];

  const midNodes = [
    { y: 18, label: "Nurture" },
    { y: 38, label: "Direct", isGolden: true },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="goldenPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="normalPathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#64748B" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#64748B" stopOpacity="0.1" />
        </linearGradient>
        <filter id="journeyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* First touch nodes */}
      {touchpoints.map((tp, i) => (
        <motion.g key={i}>
          <motion.rect
            x="6"
            y={tp.y}
            width="18"
            height="8"
            rx="1.5"
            fill={tp.color}
            fillOpacity={tp.isGolden ? 0.3 : 0.15}
            stroke={tp.color}
            strokeWidth={tp.isGolden ? "1" : "0.5"}
            strokeOpacity={tp.isGolden ? 0.8 : 0.4}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
          <motion.text
            x="15"
            y={tp.y + 5.5}
            fill="white"
            fontSize="3"
            textAnchor="middle"
            fontFamily="ui-sans-serif"
            fillOpacity={tp.isGolden ? 0.9 : 0.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            {tp.label}
          </motion.text>
        </motion.g>
      ))}

      {/* Flow paths: First touch → Mid nodes */}
      {/* Ad → Nurture */}
      <motion.path
        d="M 24 14 Q 35 14, 42 22"
        fill="none"
        stroke="url(#normalPathGradient)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      />
      {/* Blog → Direct (GOLDEN PATH) */}
      <motion.path
        d="M 24 32 Q 35 32, 42 42"
        fill="none"
        stroke="url(#goldenPathGradient)"
        strokeWidth="2.5"
        filter="url(#journeyGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      />
      {/* Referral → Direct */}
      <motion.path
        d="M 24 50 Q 35 50, 42 42"
        fill="none"
        stroke="url(#normalPathGradient)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      />

      {/* Mid decision nodes */}
      {midNodes.map((node, i) => (
        <motion.g key={i}>
          <motion.rect
            x="42"
            y={node.y}
            width="18"
            height="8"
            rx="1.5"
            fill={node.isGolden ? "#FBBF24" : "#64748B"}
            fillOpacity={node.isGolden ? 0.25 : 0.15}
            stroke={node.isGolden ? "#FBBF24" : "#64748B"}
            strokeWidth={node.isGolden ? "1" : "0.5"}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
          />
          <motion.text
            x="51"
            y={node.y + 5.5}
            fill="white"
            fontSize="2.5"
            textAnchor="middle"
            fontFamily="ui-sans-serif"
            fillOpacity={node.isGolden ? 0.9 : 0.5}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.1 }}
          >
            {node.label}
          </motion.text>
        </motion.g>
      ))}

      {/* Flow paths: Mid nodes → Conversion */}
      <motion.path
        d="M 60 22 Q 75 22, 88 30"
        fill="none"
        stroke="url(#normalPathGradient)"
        strokeWidth="1"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />
      <motion.path
        d="M 60 42 Q 75 42, 88 30"
        fill="none"
        stroke="url(#goldenPathGradient)"
        strokeWidth="2.5"
        filter="url(#journeyGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.75 }}
      />

      {/* Conversion node (right) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
      >
        <circle cx="96" cy="30" r="10" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
        <circle cx="96" cy="30" r="6" fill="#10B981" fillOpacity="0.4" />
        <text x="96" y="32" fill="white" fontSize="4" textAnchor="middle" fontFamily="ui-monospace">$</text>
        
        {/* Pulsing ring */}
        <motion.circle
          cx="96"
          cy="30"
          r="12"
          fill="none"
          stroke="#10B981"
          strokeWidth="0.5"
          initial={{ scale: 1, opacity: 0.4 }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.g>

      {/* Golden path particles */}
      {particles.filter(p => p.path === 1).map((particle) => (
        <motion.circle
          key={`golden-${particle.id}`}
          r="2"
          fill="#FBBF24"
          filter="url(#journeyGlow)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: "linear",
          }}
          style={{
            offsetPath: `path("M 24 32 Q 35 32, 42 42 Q 55 42, 60 42 Q 75 42, 88 30")`,
          }}
        />
      ))}

      {/* Stats */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
      >
        <text x="15" y="57" fill="#F59E0B" fontSize="3" fontFamily="ui-monospace" fillOpacity="0.8">golden path</text>
        <text x="80" y="57" fill="white" fontSize="3" fontFamily="ui-monospace" fillOpacity="0.5">4.2 avg touches</text>
      </motion.g>
    </svg>
  );
};
