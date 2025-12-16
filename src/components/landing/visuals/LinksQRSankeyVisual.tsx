import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, QrCode, Globe, Smartphone } from "lucide-react";
import { TwitterIcon, SalesforceIcon } from "@/components/icons/SocialIcons";

// Cinematic Links/QR Sankey: Fiber-optic bundles → hub → destinations
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
    { y: 12, width: 32, icon: Link, color: "#3B82F6", label: "UTM" },
    { y: 24, width: 28, icon: QrCode, color: "#8B5CF6", label: "QR" },
    { y: 36, width: 35, Icon: TwitterIcon, color: "#1DA1F2", label: null },
    { y: 48, width: 25, icon: Globe, color: "#10B981", label: "Web" },
  ];

  const destinations = [
    { y: 15, Icon: Globe, color: "#10B981" },
    { y: 30, Icon: Smartphone, color: "#F59E0B" },
    { y: 45, Icon: SalesforceIcon, color: "#00A1E0" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full transform-gpu">
      <defs>
        {/* Bloom effect filter */}
        <filter id="linksBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="linksFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Per-source fiber gradients with white-hot center */}
        {sources.map((source, i) => (
          <linearGradient key={`linksFlow-${i}`} id={`linksFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={source.color} stopOpacity="0.7" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
          </linearGradient>
        ))}
        
        {/* Hub gradient */}
        <radialGradient id="linksHubGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#3B82F6" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="linksDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#linksDotGrid)" opacity="0.3" />

      {/* Source bars with frosted glass effect */}
      {sources.map((source, i) => (
        <g key={i}>
          <motion.rect
            x="8"
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
            x="8"
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
          <foreignObject x="1" y={source.y - 1} width="6" height="8">
            <div className="flex items-center justify-center w-full h-full">
              {source.Icon ? (
                <source.Icon className="w-1.5 h-1.5" style={{ color: source.color }} />
              ) : source.icon ? (
                <source.icon className="w-1.5 h-1.5" style={{ color: source.color }} />
              ) : null}
            </div>
          </foreignObject>
        </g>
      ))}

      {/* Fiber flows to hub */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 3;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M ${8 + source.width} ${baseY + offset * 0.8} Q 45 ${baseY + offset * 0.4}, 54 30`}
              fill="none"
              stroke={isCenter ? `url(#linksFlow-${srcIdx})` : source.color}
              strokeWidth={isCenter ? 1 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#linksFiberGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Central hub with bloom */}
      <motion.circle
        cx="60"
        cy="30"
        r="8"
        fill="url(#linksHubGlow)"
        filter="url(#linksBloom)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
      />
      
      {/* Hub pulsing ring */}
      <motion.circle
        cx="60"
        cy="30"
        r="8"
        fill="none"
        stroke="#3B82F6"
        strokeWidth="0.5"
        animate={{ 
          r: [8, 11, 8],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: appleEase }}
      />
      
      {/* Hub inner core */}
      <circle cx="60" cy="30" r="5" fill="rgba(59,130,246,0.3)" stroke="#3B82F6" strokeWidth="0.5" />
      
      {/* Hub icon */}
      <foreignObject x="56" y="26" width="8" height="8">
        <div className="flex items-center justify-center w-full h-full">
          <Link className="w-2 h-2" style={{ color: 'white' }} />
        </div>
      </foreignObject>

      {/* Output fiber flows to destinations */}
      {destinations.map((dest, destIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          return (
            <motion.path
              key={`out-${destIdx}-${strandIdx}`}
              d={`M 68 ${30 + offset * 0.5} Q 85 ${(30 + dest.y) / 2 + offset * 0.3}, 100 ${dest.y}`}
              fill="none"
              stroke={isCenter ? dest.color : dest.color}
              strokeWidth={isCenter ? 0.8 : 0.2}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.7 : 0.15}
              filter={isCenter ? "url(#linksFiberGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 + destIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}

      {/* Destination nodes */}
      {destinations.map((dest, i) => (
        <g key={`dest-${i}`}>
          <motion.circle
            cx="105"
            cy={dest.y}
            r="5"
            fill={dest.color}
            fillOpacity={0.2}
            stroke={dest.color}
            strokeOpacity={0.5}
            strokeWidth="0.4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1, type: "spring", stiffness: 200 }}
          />
          {/* Pulsing edge */}
          <motion.circle
            cx="105"
            cy={dest.y}
            r="5"
            fill="none"
            stroke={dest.color}
            strokeWidth="0.3"
            animate={{ strokeOpacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: appleEase }}
          />
          <foreignObject x="101" y={dest.y - 4} width="8" height="8">
            <div className="flex items-center justify-center w-full h-full">
              <dest.Icon className="w-2 h-2" style={{ color: dest.color }} />
            </div>
          </foreignObject>
        </g>
      ))}

      {/* Particles on input fibers */}
      {particles.slice(0, 4).map((particle) => {
        const source = sources[particle.path];
        return (
          <motion.circle
            key={`in-${particle.id}`}
            r="2"
            fill={source.color}
            filter="url(#linksFiberGlow)"
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
              offsetPath: `path("M ${8 + source.width} ${source.y + 3} Q 45 ${source.y + 3}, 54 30")`,
            }}
          />
        );
      })}
    </svg>
  );
};
