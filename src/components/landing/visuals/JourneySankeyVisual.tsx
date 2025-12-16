import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Search, Mail, MousePointer, Users } from "lucide-react";

// Apple Pro aesthetic: hairline silver lines, frosted glass, pure black, no glow
export const JourneySankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleSpring = [0.16, 1, 0.3, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.4,
    })));
  }, []);

  const sources = [
    { y: 12, icon: Search, label: "Paid" },
    { y: 24, icon: Users, label: "Organic" },
    { y: 36, icon: Mail, label: "Email" },
    { y: 48, icon: MousePointer, label: "Referral" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Frosted glass gradient for destination node */}
        <radialGradient id="journeyLens" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(26,26,26,0.9)" />
          <stop offset="70%" stopColor="rgba(26,26,26,0.7)" />
          <stop offset="100%" stopColor="rgba(26,26,26,0.4)" />
        </radialGradient>
      </defs>
      
      {/* Pure black background - no dot grid */}
      <rect x="0" y="0" width="120" height="60" fill="#000000" />

      {/* Source icons + labels - monochrome zinc */}
      {sources.map((source, i) => (
        <g key={i}>
          <foreignObject x="2" y={source.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-1.5 h-1.5" style={{ color: 'rgba(161,161,170,0.6)' }} />
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
          
          {/* Small hollow circle connector - zinc stroke */}
          <motion.circle
            cx="28"
            cy={source.y + 2}
            r="1.5"
            fill="none"
            stroke="rgba(113,113,122,0.3)"
            strokeWidth="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.15, ease: appleSpring, duration: 0.6 }}
          />
        </g>
      ))}

      {/* Hairline silver fiber lines - NO glow */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 2;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 30 ${baseY + offset * 0.5} Q 70 ${baseY + offset * 0.25}, 98 30`}
              fill="none"
              stroke={isCenter ? "rgba(255,255,255,0.6)" : "rgba(113,113,122,0.12)"}
              strokeWidth={isCenter ? 0.5 : 0.2}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, delay: 0.3 + srcIdx * 0.15, ease: appleSpring }}
            />
          );
        })
      ))}

      {/* Tiny silver particles - no glow, smaller */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="0.6"
            fill="rgba(255,255,255,0.8)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: ["0%", "100%"],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 2,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1,
              ease: appleSpring,
            }}
            style={{
              offsetPath: `path("M 30 ${source.y + 2} Q 70 ${source.y + 2}, 98 30")`,
            }}
          />
        );
      })}

      {/* Destination node - frosted glass "black hole lens" effect */}
      <motion.circle
        cx="106"
        cy="30"
        r="8"
        fill="url(#journeyLens)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 100, damping: 15 }}
      />
      
      {/* Rim light - hairline white stroke */}
      <motion.circle
        cx="106"
        cy="30"
        r="8"
        fill="none"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1, ease: appleSpring, duration: 0.8 }}
      />
      
      {/* Subtle breathing pulse - no glow, just opacity */}
      <motion.circle
        cx="106"
        cy="30"
        r="8"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="0.2"
        animate={{ r: [8, 10, 8], opacity: [0.1, 0.02, 0.1] }}
        transition={{ duration: 3, repeat: Infinity, ease: appleSpring }}
      />
      
      {/* Revenue symbol */}
      <motion.text
        x="106"
        y="32"
        fill="rgba(255,255,255,0.7)"
        fontSize="4"
        textAnchor="middle"
        fontFamily="'SF Mono', ui-monospace"
        fontWeight="600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
      >
        $
      </motion.text>
    </svg>
  );
};
