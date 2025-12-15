import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, QrCode, Share2, Globe } from "lucide-react";

export const LinksQRSankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  useEffect(() => {
    setParticles(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.25,
    })));
  }, []);

  const sources = [
    { y: 12, icon: Link, color: "#0A66C2", label: "UTM" },
    { y: 24, icon: QrCode, color: "#4285F4", label: "QR" },
    { y: 36, icon: Share2, color: "#1DA1F2", label: "Social" },
    { y: 48, icon: Globe, color: "#6366F1", label: "Web" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="linksGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="linksHub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#0A66C2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0A66C2" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="linksDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#linksDotGrid)" opacity="0.3" />

      {/* Source icons + labels OUTSIDE */}
      {sources.map((source, i) => (
        <g key={i}>
          <foreignObject x="2" y={source.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-1.5 h-1.5 text-zinc-400" />
            </div>
          </foreignObject>
          
          <text
            x="9"
            y={source.y + 3}
            fill="rgba(161,161,170,0.8)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {source.label}
          </text>
          
          <motion.circle
            cx="24"
            cy={source.y + 2}
            r="2"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, ease: appleEase }}
          />
        </g>
      ))}

      {/* Super thin grey fiber lines to hub */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 2;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 26 ${baseY + offset * 0.6} Q 45 ${baseY + offset * 0.3}, 58 30`}
              fill="none"
              stroke={isCenter ? source.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#linksGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Central hub */}
      <motion.circle
        cx="60"
        cy="30"
        r="6"
        fill="url(#linksHub)"
        filter="url(#linksGlow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      />
      
      <motion.circle
        cx="60"
        cy="30"
        r="6"
        fill="none"
        stroke="#0A66C2"
        strokeWidth="0.4"
        animate={{ r: [6, 9, 6], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: appleEase }}
      />

      {/* Output lines from hub */}
      {[15, 30, 45].map((destY, i) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          return (
            <motion.path
              key={`out-${i}-${strandIdx}`}
              d={`M 66 ${30 + offset * 0.4} Q 85 ${(30 + destY) / 2 + offset * 0.2}, 100 ${destY}`}
              fill="none"
              stroke={isCenter ? "#22C55E" : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#linksGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 + i * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Output hollow circles */}
      {[15, 30, 45].map((destY, i) => (
        <motion.circle
          key={`dest-${i}`}
          cx="104"
          cy={destY}
          r="2"
          fill="none"
          stroke="rgba(34,197,94,0.5)"
          strokeWidth="0.4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.9 + i * 0.1, ease: appleEase }}
        />
      ))}

      {/* Particles */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1"
            fill={source.color}
            filter="url(#linksGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 0.8,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.6,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M 26 ${source.y + 2} Q 45 ${source.y + 2}, 58 30")`,
            }}
          />
        );
      })}
    </svg>
  );
};
