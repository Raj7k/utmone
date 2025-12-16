import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, QrCode, Share2, Globe } from "lucide-react";

// Apple Pro aesthetic: fiber optic data streams, frosted glass hub, silver wire
export const LinksQRSankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleSpring = [0.16, 1, 0.3, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.35,
    })));
  }, []);

  const sources = [
    { y: 12, icon: Link, label: "UTM" },
    { y: 24, icon: QrCode, label: "QR" },
    { y: 36, icon: Share2, label: "Social" },
    { y: 48, icon: Globe, label: "Web" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Frosted glass gradient for central hub */}
        <radialGradient id="linksHubGlass" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(26,26,26,0.95)" />
          <stop offset="60%" stopColor="rgba(26,26,26,0.8)" />
          <stop offset="100%" stopColor="rgba(26,26,26,0.5)" />
        </radialGradient>
      </defs>
      
      {/* Pure black background */}
      <rect x="0" y="0" width="120" height="60" fill="#000000" />

      {/* Source icons + labels - monochrome */}
      {sources.map((source, i) => (
        <g key={i}>
          <foreignObject x="2" y={source.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-1.5 h-1.5" style={{ color: 'rgba(161,161,170,0.5)' }} />
            </div>
          </foreignObject>
          
          <text
            x="9"
            y={source.y + 3}
            fill="rgba(161,161,170,0.5)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {source.label}
          </text>
          
          <motion.circle
            cx="24"
            cy={source.y + 2}
            r="1.5"
            fill="none"
            stroke="rgba(113,113,122,0.25)"
            strokeWidth="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.12, ease: appleSpring, duration: 0.6 }}
          />
        </g>
      ))}

      {/* Hairline silver fiber lines to hub - NO glow */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 2;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 26 ${baseY + offset * 0.5} Q 45 ${baseY + offset * 0.25}, 54 30`}
              fill="none"
              stroke={isCenter ? "rgba(255,255,255,0.5)" : "rgba(113,113,122,0.1)"}
              strokeWidth={isCenter ? 0.4 : 0.15}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.2 + srcIdx * 0.12, ease: appleSpring }}
            />
          );
        })
      ))}

      {/* Central hub - frosted glass */}
      <motion.circle
        cx="60"
        cy="30"
        r="6"
        fill="url(#linksHubGlass)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 100, damping: 15 }}
      />
      
      {/* Hub rim light */}
      <motion.circle
        cx="60"
        cy="30"
        r="6"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.7, ease: appleSpring, duration: 0.6 }}
      />

      {/* Output lines from hub - silver wire */}
      {[15, 30, 45].map((destY, i) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          return (
            <motion.path
              key={`out-${i}-${strandIdx}`}
              d={`M 66 ${30 + offset * 0.3} Q 82 ${(30 + destY) / 2 + offset * 0.15}, 100 ${destY}`}
              fill="none"
              stroke={isCenter ? "rgba(255,255,255,0.5)" : "rgba(113,113,122,0.1)"}
              strokeWidth={isCenter ? 0.4 : 0.15}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.2, delay: 0.9 + i * 0.12, ease: appleSpring }}
            />
          );
        })
      ))}

      {/* Output hollow circles - zinc stroke */}
      {[15, 30, 45].map((destY, i) => (
        <motion.circle
          key={`dest-${i}`}
          cx="104"
          cy={destY}
          r="1.5"
          fill="none"
          stroke="rgba(113,113,122,0.3)"
          strokeWidth="0.3"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.2 + i * 0.12, ease: appleSpring, duration: 0.6 }}
        />
      ))}

      {/* Silver particles - no glow */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="0.5"
            fill="rgba(255,255,255,0.7)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: ["0%", "100%"],
              opacity: [0, 0.7, 0.7, 0],
            }}
            transition={{
              duration: 1.8,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: appleSpring,
            }}
            style={{
              offsetPath: `path("M 26 ${source.y + 2} Q 45 ${source.y + 2}, 54 30")`,
            }}
          />
        );
      })}
    </svg>
  );
};
