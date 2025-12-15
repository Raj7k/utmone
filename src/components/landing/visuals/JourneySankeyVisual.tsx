import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Cinematic Journey Sankey: Golden fiber path → bloom → revenue convergence
export const JourneySankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: string; delay: number; isGolden: boolean }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-0.8, -0.4, 0, 0.4, 0.8]; // 5 strands for golden, 3 for normal
  
  useEffect(() => {
    const paths = [
      { path: "M 20 15 Q 45 15, 55 22 Q 75 30, 90 30", isGolden: true },
      { path: "M 20 30 Q 45 30, 90 30", isGolden: false },
      { path: "M 20 45 Q 45 45, 55 38 Q 75 30, 90 30", isGolden: false },
    ];
    setParticles(Array.from({ length: 9 }, (_, i) => ({
      id: i,
      ...paths[i % 3],
      delay: i * 0.35,
    })));
  }, []);
  
  const touchpoints = [
    { y: 12, label: "Ad", isGolden: true },
    { y: 27, label: "Blog" },
    { y: 42, label: "Referral" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom filter */}
        <filter id="journeyBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="journeyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Golden path gradient - white hot to gold to green */}
        <linearGradient id="goldenFiber" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.6" />
        </linearGradient>
        
        {/* Normal path gradient */}
        <linearGradient id="normalFiber" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
        </linearGradient>
        
        {/* Revenue node gradient */}
        <radialGradient id="journeyRevenue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#22C55E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="journeyDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#journeyDotGrid)" opacity="0.3" />
      
      {/* Touchpoint nodes */}
      {touchpoints.map((tp, i) => (
        <motion.g
          key={i}
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1, ease: appleEase }}
        >
          <rect
            x="6"
            y={tp.y}
            width="14"
            height="6"
            rx="1"
            fill={tp.isGolden ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)"}
            stroke={tp.isGolden ? "#F59E0B" : "#FFFFFF"}
            strokeOpacity={tp.isGolden ? 0.6 : 0.25}
            strokeWidth="0.4"
          />
          {/* Glow pulse for golden */}
          {tp.isGolden && (
            <motion.rect
              x="6"
              y={tp.y}
              width="14"
              height="6"
              rx="1"
              fill="none"
              stroke="#F59E0B"
              strokeWidth="0.3"
              animate={{ strokeOpacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
            />
          )}
          <text
            x="13"
            y={tp.y + 4.2}
            fill="white"
            fontSize="2.5"
            textAnchor="middle"
            fontFamily="ui-monospace"
            opacity={tp.isGolden ? 0.9 : 0.5}
          >
            {tp.label}
          </text>
        </motion.g>
      ))}
      
      {/* Normal paths - 3 fiber strands each */}
      {[1, 2].map((pathIdx) => {
        const baseY = pathIdx === 1 ? 30 : 45;
        const targetY = pathIdx === 1 ? 30 : 38;
        return fiberOffsets.slice(1, 4).map((offset, strandIdx) => {
          const isCenter = strandIdx === 1;
          const d = pathIdx === 1
            ? `M 20 ${baseY + offset} Q 45 ${baseY + offset * 0.5}, 90 30`
            : `M 20 ${baseY + offset} Q 45 ${baseY + offset * 0.5}, 55 ${targetY} Q 75 30, 90 30`;
          return (
            <motion.path
              key={`normal-${pathIdx}-${strandIdx}`}
              d={d}
              fill="none"
              stroke="url(#normalFiber)"
              strokeWidth={isCenter ? 0.6 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.4 + pathIdx * 0.1, ease: appleEase }}
            />
          );
        });
      })}
      
      {/* Golden path - 5 fiber strands with bloom */}
      {fiberOffsets.map((offset, strandIdx) => {
        const isCenter = strandIdx === 2;
        return (
          <motion.path
            key={`golden-${strandIdx}`}
            d={`M 20 ${15 + offset * 0.6} Q 45 ${15 + offset * 0.4}, 55 ${22 + offset * 0.2} Q 75 ${30 + offset * 0.1}, 90 30`}
            fill="none"
            stroke={isCenter ? "url(#goldenFiber)" : "#F59E0B"}
            strokeWidth={isCenter ? 1.2 : 0.35}
            strokeLinecap="round"
            strokeOpacity={isCenter ? 1 : 0.3}
            filter={isCenter ? "url(#journeyGlow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.7, delay: 0.3, ease: appleEase }}
          />
        );
      })}
      
      {/* Heartbeat pulse particles */}
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          r={p.isGolden ? 1.8 : 1}
          fill={p.isGolden ? "#F59E0B" : "#FFFFFF"}
          filter={p.isGolden ? "url(#journeyGlow)" : undefined}
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, p.isGolden ? 1 : 0.5, p.isGolden ? 1 : 0.5, 0],
            scale: p.isGolden ? [0.8, 1.3, 0.8] : [1, 1, 1],
          }}
          transition={{
            duration: p.isGolden ? 1 : 1.2,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1,
            ease: appleEase,
          }}
          style={{ offsetPath: `path("${p.path}")` }}
        />
      ))}
      
      {/* Revenue node with bloom */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7, ease: appleEase }}>
        <motion.circle
          cx="100"
          cy="30"
          r="10"
          fill="url(#journeyRevenue)"
          filter="url(#journeyBloom)"
        />
        {/* Spinning gold ring */}
        <motion.circle
          cx="100"
          cy="30"
          r="10"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="0.4"
          strokeDasharray="2 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "100px 30px" }}
        />
        {/* Pulse ring */}
        <motion.circle
          cx="100"
          cy="30"
          r="10"
          fill="none"
          stroke="#22C55E"
          strokeWidth="0.5"
          animate={{ r: [10, 14, 10], opacity: [0.6, 0.1, 0.6] }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        <circle cx="100" cy="30" r="6" fill="rgba(34,197,94,0.3)" stroke="#22C55E" strokeWidth="0.5" />
        <text x="100" y="28" fill="white" fontSize="4" textAnchor="middle" fontFamily="ui-monospace" opacity="0.9">$</text>
        <text x="100" y="33" fill="white" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" opacity="0.5">revenue</text>
      </motion.g>
      
      {/* Footer */}
      <motion.text
        x="60"
        y="56"
        fill="white"
        fontSize="2.5"
        fontFamily="ui-monospace"
        textAnchor="middle"
        fillOpacity="0.4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, ease: appleEase }}
      >
        4.2 avg touchpoints
      </motion.text>
    </svg>
  );
};
