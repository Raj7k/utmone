import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { GoogleIcon } from "@/components/icons/SocialIcons";
import { FileText, Users } from "lucide-react";

// Cinematic Journey Sankey: Matching Attribution structure exactly
// Icons OUTSIDE boxes, grey base, single green accent
export const JourneySankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number; isGolden: boolean }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1]; // 5 strands matching Attribution
  const fontStack = "'SF Mono', SFMono-Regular, ui-monospace, Menlo, monospace";

  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.3,
      isGolden: i % 3 === 0,
    })));
  }, []);

  // Touchpoints with proportional widths like Attribution
  const touchpoints = [
    { y: 12, width: 45, icon: GoogleIcon, isComponent: true, isGolden: true },
    { y: 27, width: 32, icon: FileText, isComponent: false, isGolden: false },
    { y: 42, width: 28, icon: Users, isComponent: false, isGolden: false },
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
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Flow gradients - grey to white to green */}
        <linearGradient id="journeyFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#71717A" stopOpacity="0.6" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.5" />
        </linearGradient>
        
        <linearGradient id="journeyFlowGolden" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.6" />
        </linearGradient>
        
        {/* Revenue gradient */}
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
      
      {/* Source bars with icons OUTSIDE - matching Attribution exactly */}
      {touchpoints.map((tp, i) => {
        const IconComponent = tp.icon;
        const barColor = tp.isGolden ? "#F59E0B" : "#52525B";
        return (
          <g key={i}>
            <motion.rect
              x="16"
              y={tp.y}
              width={tp.width}
              height="6"
              rx="2"
              fill={barColor}
              fillOpacity={0.2}
              stroke={barColor}
              strokeOpacity={0.5}
              strokeWidth="0.4"
              initial={{ width: 0 }}
              animate={{ width: tp.width }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: appleEase }}
            />
            {/* Pulse glow */}
            <motion.rect
              x="16"
              y={tp.y}
              width={tp.width}
              height="6"
              rx="2"
              fill="none"
              stroke={barColor}
              strokeWidth="0.3"
              animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: appleEase }}
            />
            {/* Icon OUTSIDE the bar - matching Attribution */}
            <foreignObject x="4" y={tp.y - 1} width="10" height="8">
              <div className="flex items-center justify-center w-full h-full">
                {tp.isComponent ? (
                  <IconComponent className="w-2 h-2" />
                ) : (
                  <IconComponent className="w-2 h-2 text-zinc-400" strokeWidth={2} />
                )}
              </div>
            </foreignObject>
          </g>
        );
      })}
      
      {/* Multi-strand fiber flows - 5 strands like Attribution */}
      {touchpoints.map((tp, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = tp.y + 3;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M ${16 + tp.width} ${baseY + offset * 0.8} Q 70 ${baseY + offset * 0.4}, 92 30`}
              fill="none"
              stroke={isCenter ? (tp.isGolden ? "url(#journeyFlowGolden)" : "url(#journeyFlow)") : "#52525B"}
              strokeWidth={isCenter ? 1.0 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#journeyGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}
      
      {/* Heartbeat particles */}
      {particles.map((p) => {
        const tp = touchpoints[p.path];
        return (
          <motion.circle
            key={p.id}
            r={p.isGolden ? 2 : 1.5}
            fill={p.isGolden ? "#F59E0B" : "#22C55E"}
            filter="url(#journeyGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              delay: p.delay,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M ${16 + tp.width} ${tp.y + 3} Q 70 ${tp.y + 3}, 92 30")`,
            }}
          />
        );
      })}
      
      {/* Revenue node with bloom */}
      <motion.circle
        cx="102"
        cy="30"
        r="10"
        fill="url(#journeyRevenue)"
        filter="url(#journeyBloom)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      />
      
      {/* Pulsing outer ring */}
      <motion.circle
        cx="102"
        cy="30"
        r="10"
        fill="none"
        stroke="#22C55E"
        strokeWidth="0.5"
        animate={{ 
          r: [10, 14, 10],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
      />
      
      {/* Inner core */}
      <circle cx="102" cy="30" r="6" fill="rgba(34,197,94,0.3)" stroke="#22C55E" strokeWidth="0.5" />
      
      {/* Dollar sign - matching Attribution */}
      <motion.text
        x="102"
        y="32"
        fill="white"
        fontSize="5"
        textAnchor="middle"
        fontFamily={fontStack}
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        $
      </motion.text>
    </svg>
  );
};