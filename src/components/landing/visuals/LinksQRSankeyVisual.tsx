import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LinkedInIcon } from "@/components/icons/SocialIcons";
import { Mail, QrCode } from "lucide-react";

// Cinematic Links/QR Sankey: Fiber converge → UTM pulse → QR scanline
export const LinksQRSankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-0.6, 0, 0.6]; // 3 strands per source
  
  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.35,
    })));
  }, []);
  
  const sources = [
    { y: 15, color: "#0A66C2", label: "LinkedIn", icon: LinkedInIcon, isComponent: true },
    { y: 30, color: "#EA4335", label: "Email", icon: Mail, isComponent: false },
    { y: 45, color: "#8B5CF6", label: "QR", icon: QrCode, isComponent: false },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Bloom filter */}
        <filter id="linksBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="linksFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Per-source gradients with white-hot center */}
        {sources.map((src, i) => (
          <linearGradient key={i} id={`linksFiber-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={src.color} stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.5" />
          </linearGradient>
        ))}
        
        {/* UTM node gradient */}
        <radialGradient id="utmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.1" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="linksDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#linksDotGrid)" opacity="0.3" />
      
      {/* Source nodes with icons */}
      {sources.map((src, i) => {
        const IconComponent = src.icon;
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1, ease: appleEase }}
          >
            <rect
              x="6"
              y={src.y}
              width="16"
              height="6"
              rx="1"
              fill="rgba(63,63,70,0.3)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="0.4"
            />
            {/* Pulse glow */}
            <motion.rect
              x="6"
              y={src.y}
              width="16"
              height="6"
              rx="1"
              fill="none"
              stroke={src.color}
              strokeWidth="0.3"
              animate={{ strokeOpacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.3, ease: appleEase }}
            />
            {/* Icon */}
            <foreignObject x="7" y={src.y + 0.5} width="5" height="5">
              <div className="flex items-center justify-center w-full h-full">
                {src.isComponent ? (
                  <IconComponent className="w-1.5 h-1.5" style={{ color: src.color }} />
                ) : (
                  <IconComponent className="w-1.5 h-1.5" style={{ color: src.color }} strokeWidth={2} />
                )}
              </div>
            </foreignObject>
            <text x="17" y={src.y + 4.2} fill="white" fontSize="2.5" fontFamily="ui-monospace" opacity="0.7">{src.label}</text>
          </motion.g>
        );
      })}
      
      {/* Multi-strand fiber flows converging to UTM */}
      {sources.map((src, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 1;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 22 ${src.y + 3 + offset} Q 45 ${src.y + 3 + offset * 0.5}, 62 ${30 + offset * 0.2}`}
              fill="none"
              stroke={isCenter ? `url(#linksFiber-${srcIdx})` : src.color}
              strokeWidth={isCenter ? 1.0 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#linksFiberGlow)" : undefined}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}
      
      {/* UTM node with pulse */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, ease: appleEase }}>
        <rect x="60" y="23" width="20" height="14" rx="2" fill="url(#utmGlow)" />
        <rect x="60" y="23" width="20" height="14" rx="2" fill="none" stroke="#8B5CF6" strokeWidth="0.4" />
        {/* Pulse ring */}
        <motion.rect
          x="58"
          y="21"
          width="24"
          height="18"
          rx="3"
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.5"
          animate={{ 
            opacity: [0.4, 0.1, 0.4],
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
          style={{ transformOrigin: "70px 30px" }}
        />
        <text x="70" y="32" fill="white" fontSize="5" textAnchor="middle" fontFamily="ui-monospace" fontWeight="bold" opacity="0.9">UTM</text>
      </motion.g>
      
      {/* Output fiber to QR */}
      {fiberOffsets.map((offset, strandIdx) => {
        const isCenter = strandIdx === 1;
        return (
          <motion.path
            key={`output-${strandIdx}`}
            d={`M 80 ${30 + offset} L 96 ${30 + offset}`}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth={isCenter ? 1.0 : 0.3}
            strokeLinecap="round"
            strokeOpacity={isCenter ? 0.7 : 0.25}
            filter={isCenter ? "url(#linksFiberGlow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, ease: appleEase }}
          />
        );
      })}
      
      {/* QR code with scanline effect */}
      <motion.g
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, ease: appleEase }}
      >
        <rect x="96" y="22" width="18" height="16" rx="2" fill="rgba(63,63,70,0.3)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
        {/* QR pattern */}
        <g transform="translate(99, 24)">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 3}
                y={r * 3}
                width="2.5"
                height="2.5"
                fill="white"
                fillOpacity={(r + c) % 2 === 0 ? 0.7 : 0.2}
              />
            ))
          )}
        </g>
        {/* Scanline effect */}
        <motion.rect
          x="96"
          y="22"
          width="18"
          height="2"
          fill="rgba(139,92,246,0.3)"
          animate={{ y: [22, 36, 22] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.g>
      
      {/* Heartbeat particles */}
      {particles.map((p) => (
        <motion.circle
          key={p.id}
          r="1.2"
          fill={sources[p.path].color}
          filter="url(#linksFiberGlow)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            delay: p.delay,
            repeat: Infinity,
            repeatDelay: 1.5,
            ease: appleEase,
          }}
          style={{
            offsetPath: `path("M 22 ${sources[p.path].y + 3} Q 45 ${sources[p.path].y + 3}, 62 30")`,
          }}
        />
      ))}
      
      {/* Footer */}
      <motion.text
        x="60"
        y="56"
        fill="white"
        fontSize="2.5"
        fontFamily="ui-monospace"
        textAnchor="middle"
        fillOpacity="0.4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, ease: appleEase }}
      >
        100% UTM compliant
      </motion.text>
    </svg>
  );
};
