import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LinkedInIcon, GoogleIcon, MetaIcon } from "@/components/icons/SocialIcons";

// Links & QR: UTM enforcement flow with Sankey paths
export const LinksQRSankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.6,
    }));
    setParticles(newParticles);
  }, []);

  const sources = [
    { y: 12, icon: LinkedInIcon, color: "#0A66C2", label: "LinkedIn" },
    { y: 30, icon: GoogleIcon, color: "#4285F4", label: "Email" },
    { y: 48, icon: MetaIcon, color: "#0668E1", label: "QR Scan" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {sources.map((source, i) => (
          <linearGradient key={`gradient-${i}`} id={`linksFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={source.color} stopOpacity="0.7" />
            <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
          </linearGradient>
        ))}
        <filter id="linksGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Source nodes with icons */}
      {sources.map((source, i) => (
        <g key={i}>
          <motion.rect
            x="4"
            y={source.y}
            width="22"
            height="10"
            rx="2"
            fill={source.color}
            fillOpacity={0.15}
            stroke={source.color}
            strokeOpacity={0.4}
            strokeWidth="0.5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
          <foreignObject x="6" y={source.y + 1} width="8" height="8">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-2.5 h-2.5" />
            </div>
          </foreignObject>
          <motion.text
            x="17"
            y={source.y + 6.5}
            fill="white"
            fontSize="2.5"
            fontFamily="ui-sans-serif"
            fillOpacity="0.7"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1 }}
          >
            {source.label}
          </motion.text>
        </g>
      ))}

      {/* Flow curves converging to UTM builder */}
      {sources.map((source, i) => (
        <motion.path
          key={`flow-${i}`}
          d={`M 28 ${source.y + 5} Q 45 ${source.y + 5}, 55 30`}
          fill="none"
          stroke={`url(#linksFlow-${i})`}
          strokeWidth="1.5"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 + i * 0.1 }}
        />
      ))}

      {/* UTM Builder node (center) */}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <rect x="52" y="22" width="16" height="16" rx="2" fill="#8B5CF6" fillOpacity="0.2" stroke="#8B5CF6" strokeWidth="0.8" />
        <text x="60" y="28" fill="#8B5CF6" fontSize="3" textAnchor="middle" fontFamily="ui-monospace">UTM</text>
        <text x="60" y="34" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-sans-serif" fillOpacity="0.6">builder</text>
      </motion.g>

      {/* Output flow to clean link */}
      <motion.path
        d="M 68 30 Q 80 30, 88 30"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      />

      {/* Output: Clean tracked link with QR preview */}
      <motion.g
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
      >
        {/* Link output */}
        <rect x="90" y="20" width="26" height="20" rx="2" fill="none" stroke="#8B5CF6" strokeWidth="0.8" />
        
        {/* Mini QR code */}
        <g transform="translate(92, 22)">
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 2.5}
                y={row * 2.5}
                width="2"
                height="2"
                fill="#8B5CF6"
                fillOpacity={(row + col) % 2 === 0 ? 0.8 : 0.3}
              />
            ))
          )}
        </g>
        
        {/* Link text */}
        <text x="106" y="27" fill="white" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" fillOpacity="0.8">utm.one</text>
        <text x="106" y="32" fill="white" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" fillOpacity="0.5">/abc123</text>
        <text x="106" y="37" fill="#8B5CF6" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" fillOpacity="0.6">+UTM ✓</text>
      </motion.g>

      {/* Animated particles */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="1.5"
            fill={source.color}
            filter="url(#linksGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "linear",
            }}
            style={{
              offsetPath: `path("M 28 ${source.y + 5} Q 45 ${source.y + 5}, 55 30")`,
            }}
          />
        );
      })}

      {/* Stats */}
      <motion.text
        x="60"
        y="56"
        fill="white"
        fontSize="3"
        textAnchor="middle"
        fontFamily="ui-monospace"
        fillOpacity="0.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        100% UTM compliant
      </motion.text>
    </svg>
  );
};
