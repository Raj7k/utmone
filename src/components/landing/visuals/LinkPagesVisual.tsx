import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FileText, Briefcase, ShoppingBag, Share2 } from "lucide-react";

// Cinematic Link Pages: Single source → fiber diverge → multi-destination glow
export const LinkPagesVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-0.5, 0, 0.5]; // 3 strands per flow

  useEffect(() => {
    setParticles(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.25,
    })));
  }, []);

  // Single orange accent - grey base for all destinations
  const accentColor = "#F97316";
  const destinations = [
    { y: 15, label: "Blog", icon: FileText },
    { y: 27, label: "Portfolio", icon: Briefcase },
    { y: 39, label: "Store", icon: ShoppingBag },
    { y: 51, label: "Social", icon: Share2 },
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
        
        {/* Single flow gradient - orange accent throughout */}
        <linearGradient id="lpFlowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" stopOpacity="0.8" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#71717A" stopOpacity="0.5" />
        </linearGradient>
        
        {/* Source gradient */}
        <radialGradient id="sourceGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#F97316" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="lpDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#lpDotGrid)" opacity="0.3" />

      {/* Source: Single link with frosted glass and glow */}
      <motion.g
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: appleEase }}
      >
        <rect x="4" y="24" width="20" height="12" rx="2" fill="url(#sourceGlow)" />
        <rect x="4" y="24" width="20" height="12" rx="2" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="0.4" />
        {/* Pulse glow */}
        <motion.rect
          x="4"
          y="24"
          width="20"
          height="12"
          rx="2"
          fill="none"
          stroke="#F97316"
          strokeWidth="0.3"
          animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        <text x="14" y="31.5" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" opacity="0.8">utm.one</text>
      </motion.g>

      {/* Multi-strand fiber flows to destinations - grey base with orange center */}
      {destinations.map((dest, destIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 1;
          return (
            <motion.path
              key={`fiber-${destIdx}-${strandIdx}`}
              d={`M 24 ${30 + offset} Q 55 ${30 + offset * 0.5}, 88 ${dest.y + 3 + offset * 0.3}`}
              fill="none"
              stroke={isCenter ? "url(#lpFlowGradient)" : "#52525B"}
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

      {/* Destination bars with icons - grey base, subtle orange pulse */}
      {destinations.map((dest, i) => {
        const IconComponent = dest.icon;
        return (
          <motion.g key={`dest-${i}`}>
            <motion.rect
              x="90"
              y={dest.y}
              width="24"
              height="6"
              rx="1"
              fill="rgba(63,63,70,0.3)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.4"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.08, ease: appleEase }}
            />
            {/* Subtle pulse - grey with hint of orange */}
            <motion.rect
              x="90"
              y={dest.y}
              width="24"
              height="6"
              rx="1"
              fill="none"
              stroke={accentColor}
              strokeWidth="0.3"
              animate={{ 
                strokeOpacity: [0.1, 0.3, 0.1],
              }}
              transition={{ 
                duration: 1.5,
                delay: i * 0.25,
                repeat: Infinity,
                ease: appleEase,
              }}
            />
            {/* Icon - grey base */}
            <foreignObject x="91" y={dest.y + 0.5} width="5" height="5">
              <div className="flex items-center justify-center w-full h-full">
                <IconComponent className="w-1.5 h-1.5 text-zinc-400" strokeWidth={2} />
              </div>
            </foreignObject>
            <motion.text
              x="105"
              y={dest.y + 4.2}
              fill="white"
              fontSize="2.5"
              textAnchor="middle"
              fontFamily="ui-monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 0.7 + i * 0.08, ease: appleEase }}
            >
              {dest.label}
            </motion.text>
          </motion.g>
        );
      })}

      {/* Heartbeat particles - single orange accent */}
      {particles.map((particle) => {
        const dest = destinations[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1.2"
            fill={accentColor}
            filter="url(#lpFiberGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.3, 0.8],
            }}
            transition={{
              duration: 1,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1.5,
              ease: appleEase,
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
        transition={{ delay: 1, ease: appleEase }}
      >
        47 links · 12.4K clicks
      </motion.text>
    </svg>
  );
};
