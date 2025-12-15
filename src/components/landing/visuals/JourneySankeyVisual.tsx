import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Mail, MousePointer, Users } from "lucide-react";

export const JourneySankeyVisual = () => {
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
    { y: 12, icon: Search, color: "#F59E0B", label: "Paid" },
    { y: 24, icon: Users, color: "#22C55E", label: "Organic" },
    { y: 36, icon: Mail, color: "#8B5CF6", label: "Email" },
    { y: 48, icon: MousePointer, color: "#EC4899", label: "Referral" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="journeyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="journeyRevenue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#22C55E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="journeyDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#journeyDotGrid)" opacity="0.3" />

      {/* Source icons + labels OUTSIDE, small hollow circles */}
      {sources.map((source, i) => (
        <g key={i}>
          {/* Icon outside */}
          <foreignObject x="2" y={source.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-1.5 h-1.5 text-zinc-400" />
            </div>
          </foreignObject>
          
          {/* Label text */}
          <text
            x="9"
            y={source.y + 3}
            fill="rgba(161,161,170,0.8)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {source.label}
          </text>
          
          {/* Small hollow circle connector */}
          <motion.circle
            cx="28"
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

      {/* Super thin grey fiber lines */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 2;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 30 ${baseY + offset * 0.6} Q 70 ${baseY + offset * 0.3}, 98 30`}
              fill="none"
              stroke={isCenter ? source.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#journeyGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Small particles */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1"
            fill={source.color}
            filter="url(#journeyGlow)"
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
              offsetPath: `path("M 30 ${source.y + 2} Q 70 ${source.y + 2}, 98 30")`,
            }}
          />
        );
      })}

      {/* Destination node */}
      <motion.circle
        cx="106"
        cy="30"
        r="8"
        fill="url(#journeyRevenue)"
        filter="url(#journeyGlow)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      />
      
      <motion.circle
        cx="106"
        cy="30"
        r="8"
        fill="none"
        stroke="#22C55E"
        strokeWidth="0.4"
        animate={{ r: [8, 11, 8], opacity: [0.5, 0.1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: appleEase }}
      />
      
      <motion.text
        x="106"
        y="32"
        fill="white"
        fontSize="4"
        textAnchor="middle"
        fontFamily="'SF Mono', ui-monospace"
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
