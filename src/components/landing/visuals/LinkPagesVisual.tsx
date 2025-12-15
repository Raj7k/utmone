import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Instagram, Twitter, Youtube, LinkIcon } from "lucide-react";

export const LinkPagesVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-0.8, -0.4, 0, 0.4, 0.8];

  useEffect(() => {
    setParticles(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.2,
    })));
  }, []);

  const destinations = [
    { y: 12, icon: Instagram, color: "#E1306C", label: "Instagram" },
    { y: 24, icon: Twitter, color: "#1DA1F2", label: "Twitter" },
    { y: 36, icon: Youtube, color: "#FF0000", label: "YouTube" },
    { y: 48, icon: LinkIcon, color: "#F97316", label: "Website" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="lpGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="lpPortal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="lpDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#lpDotGrid)" opacity="0.3" />

      {/* Central link portal with rotating ring */}
      <motion.circle
        cx="20"
        cy="30"
        r="8"
        fill="none"
        stroke="#F97316"
        strokeWidth="0.4"
        strokeDasharray="2,3"
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "20px 30px" }}
      />
      
      <motion.circle
        cx="20"
        cy="30"
        r="5"
        fill="url(#lpPortal)"
        filter="url(#lpGlow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      />
      
      <motion.circle
        cx="20"
        cy="30"
        r="5"
        fill="none"
        stroke="#F97316"
        strokeWidth="0.4"
        animate={{ r: [5, 7, 5], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: appleEase }}
      />
      
      <motion.text
        x="20"
        y="32"
        fill="white"
        fontSize="4"
        textAnchor="middle"
        fontFamily="'SF Mono', ui-monospace"
        fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        1
      </motion.text>

      {/* Super thin grey fiber lines to destinations */}
      {destinations.map((dest, destIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const destY = dest.y + 2;
          return (
            <motion.path
              key={`fiber-${destIdx}-${strandIdx}`}
              d={`M 28 ${30 + offset * 2} Q 55 ${(30 + destY) / 2 + offset}, 82 ${destY + offset * 0.5}`}
              fill="none"
              stroke={isCenter ? dest.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#lpGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 + destIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Destination icons + labels OUTSIDE */}
      {destinations.map((dest, i) => (
        <g key={i}>
          {/* Small hollow circle connector */}
          <motion.circle
            cx="86"
            cy={dest.y + 2}
            r="2"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, ease: appleEase }}
          />
          
          {/* Label text */}
          <text
            x="90"
            y={dest.y + 3}
            fill="rgba(161,161,170,0.8)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {dest.label}
          </text>
          
          {/* Icon outside */}
          <foreignObject x="112" y={dest.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <dest.icon className="w-1.5 h-1.5 text-zinc-400" />
            </div>
          </foreignObject>
        </g>
      ))}

      {/* Particles flowing from center to destinations */}
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
              duration: 1,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M 28 30 Q 55 ${(30 + dest.y + 2) / 2}, 82 ${dest.y + 2}")`,
            }}
          />
        );
      })}
    </svg>
  );
};
