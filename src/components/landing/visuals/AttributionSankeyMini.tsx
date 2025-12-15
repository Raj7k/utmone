import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LinkedInIcon, GoogleIcon, MetaIcon, HubSpotIcon } from "@/components/icons/SocialIcons";

// Cinematic Attribution Sankey: Fiber-optic bundles → heartbeat pulse → bloom revenue
export const AttributionSankeyMini = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1]; // 5 strands per flow

  useEffect(() => {
    setParticles(Array.from({ length: 8 }, (_, i) => ({
      id: i,
      path: i % 4,
      delay: i * 0.25, // 60bpm rhythm
    })));
  }, []);

  const sources = [
    { y: 12, width: 50, icon: LinkedInIcon, color: "#0A66C2", label: "LinkedIn" },
    { y: 24, width: 38, icon: GoogleIcon, color: "#4285F4", label: "Google" },
    { y: 36, width: 55, icon: MetaIcon, color: "#0668E1", label: "Meta" },
    { y: 48, width: 30, icon: HubSpotIcon, color: "#FF7A59", label: "Email" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom effect filter */}
        <filter id="attrBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="attrFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Per-source fiber gradients with white-hot center */}
        {sources.map((source, i) => (
          <linearGradient key={`attrFlow-${i}`} id={`attrFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={source.color} stopOpacity="0.7" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFB800" stopOpacity="0.4" />
          </linearGradient>
        ))}
        
        {/* Gold revenue gradient */}
        <radialGradient id="goldRevenue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFB800" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB800" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="attrDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#attrDotGrid)" opacity="0.3" />

      {/* Source bars with frosted glass effect */}
      {sources.map((source, i) => (
        <g key={i}>
          <motion.rect
            x="16"
            y={source.y}
            width={source.width}
            height="6"
            rx="2"
            fill={source.color}
            fillOpacity={0.2}
            stroke={source.color}
            strokeOpacity={0.5}
            strokeWidth="0.4"
            initial={{ width: 0 }}
            animate={{ width: source.width }}
            transition={{ duration: 0.6, delay: i * 0.1, ease: appleEase }}
          />
          {/* Glowing edge pulse */}
          <motion.rect
            x="16"
            y={source.y}
            width={source.width}
            height="6"
            rx="2"
            fill="none"
            stroke={source.color}
            strokeWidth="0.3"
            animate={{ strokeOpacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: appleEase }}
          />
          <foreignObject x="4" y={source.y - 1} width="10" height="8">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-2 h-2" />
            </div>
          </foreignObject>
        </g>
      ))}

      {/* Multi-strand fiber-optic flows */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 3;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M ${16 + source.width} ${baseY + offset * 0.8} Q 80 ${baseY + offset * 0.4}, 100 30`}
              fill="none"
              stroke={isCenter ? `url(#attrFlow-${srcIdx})` : source.color}
              strokeWidth={isCenter ? 1 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#attrFiberGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Heartbeat pulse particles - 60bpm rhythm */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={particle.id}
            r="2"
            fill={source.color}
            filter="url(#attrFiberGlow)"
            initial={{ offsetDistance: "0%", opacity: 0 }}
            animate={{ 
              offsetDistance: ["0%", "100%"],
              opacity: [0, 1, 1, 0],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 1, // 60bpm
              delay: particle.delay,
              repeat: Infinity,
              repeatDelay: 0.5,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M ${16 + source.width} ${source.y + 3} Q 80 ${source.y + 3}, 100 30")`,
            }}
          />
        );
      })}

      {/* Revenue node with bloom and gold glow */}
      <motion.circle
        cx="108"
        cy="30"
        r="10"
        fill="url(#goldRevenue)"
        filter="url(#attrBloom)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      />
      
      {/* Pulsing outer ring */}
      <motion.circle
        cx="108"
        cy="30"
        r="10"
        fill="none"
        stroke="#FFB800"
        strokeWidth="0.5"
        animate={{ 
          r: [10, 14, 10],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
      />
      
      {/* Inner core */}
      <circle cx="108" cy="30" r="6" fill="rgba(255,184,0,0.3)" stroke="#FFB800" strokeWidth="0.5" />
      
      <motion.text
        x="108"
        y="32"
        fill="white"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
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
