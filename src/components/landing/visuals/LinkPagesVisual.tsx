import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, Briefcase, ShoppingBag, Share2 } from "lucide-react";

// Link Pages Visual: Matching Attribution structure exactly
// Grey base, single orange accent, proper sizing
export const LinkPagesVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1]; // 5 strands matching Attribution
  const fontStack = "'SF Mono', SFMono-Regular, ui-monospace, Menlo, monospace";
  const accentColor = "#F97316"; // Single orange accent

  useEffect(() => {
    setParticles(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.25,
    })));
  }, []);

  // Destinations with proportional widths
  const destinations = [
    { y: 10, width: 28, icon: FileText },
    { y: 22, width: 35, icon: Briefcase },
    { y: 34, width: 42, icon: ShoppingBag },
    { y: 46, width: 32, icon: Share2 },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom filter */}
        <filter id="lpBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="lpFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Flow gradient - orange to white to grey */}
        <linearGradient id="lpFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={accentColor} stopOpacity="0.7" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#71717A" stopOpacity="0.5" />
        </linearGradient>
        
        {/* Source gradient */}
        <radialGradient id="sourceGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor={accentColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.15" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="lpDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#lpDotGrid)" opacity="0.3" />

      {/* Source node - single link origin */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: appleEase }}
      >
        <circle cx="18" cy="30" r="10" fill="url(#sourceGlow)" />
        <circle cx="18" cy="30" r="10" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.4" />
        {/* Pulse ring */}
        <motion.circle
          cx="18"
          cy="30"
          r="10"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.5"
          animate={{ 
            r: [10, 13, 10],
            opacity: [0.5, 0.1, 0.5],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        {/* Inner core */}
        <circle cx="18" cy="30" r="5" fill="rgba(249,115,22,0.2)" stroke={accentColor} strokeWidth="0.4" />
        <text 
          x="18" 
          y="32" 
          fill="white" 
          fontSize="4" 
          textAnchor="middle" 
          fontFamily={fontStack}
          fontWeight="bold"
          opacity="0.9"
        >
          1
        </text>
      </motion.g>

      {/* Multi-strand fiber flows to destinations - 5 strands each */}
      {destinations.map((dest, destIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = dest.y + 3;
          return (
            <motion.path
              key={`fiber-${destIdx}-${strandIdx}`}
              d={`M 28 ${30 + offset * 0.6} Q 55 ${30 + (baseY - 30) * 0.3 + offset * 0.4}, ${120 - dest.width - 4} ${baseY + offset * 0.3}`}
              fill="none"
              stroke={isCenter ? "url(#lpFlow)" : "#52525B"}
              strokeWidth={isCenter ? 1.0 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#lpFiberGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + destIdx * 0.08, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Destination bars with icons OUTSIDE on right side */}
      {destinations.map((dest, i) => {
        const IconComponent = dest.icon;
        const barX = 120 - dest.width - 4;
        return (
          <g key={`dest-${i}`}>
            <motion.rect
              x={barX}
              y={dest.y}
              width={dest.width}
              height="6"
              rx="2"
              fill="#52525B"
              fillOpacity={0.2}
              stroke="#52525B"
              strokeOpacity={0.5}
              strokeWidth="0.4"
              initial={{ width: 0 }}
              animate={{ width: dest.width }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.08, ease: appleEase }}
            />
            {/* Pulse glow */}
            <motion.rect
              x={barX}
              y={dest.y}
              width={dest.width}
              height="6"
              rx="2"
              fill="none"
              stroke="#71717A"
              strokeWidth="0.3"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 1.5, delay: i * 0.2, repeat: Infinity, ease: appleEase }}
            />
            {/* Icon OUTSIDE bar on right - mirrored from Attribution */}
            <foreignObject x="110" y={dest.y - 1} width="10" height="8">
              <div className="flex items-center justify-center w-full h-full">
                <IconComponent className="w-2 h-2 text-zinc-400" strokeWidth={2} />
              </div>
            </foreignObject>
          </g>
        );
      })}

      {/* Heartbeat particles - single orange accent */}
      {particles.map((particle) => {
        const dest = destinations[particle.path];
        const barX = 120 - dest.width - 4;
        return (
          <motion.circle
            key={particle.id}
            r="1.5"
            fill={accentColor}
            filter="url(#lpFiberGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M 28 30 Q 55 ${30 + (dest.y + 3 - 30) * 0.3}, ${barX} ${dest.y + 3}")`,
            }}
          />
        );
      })}
    </svg>
  );
};