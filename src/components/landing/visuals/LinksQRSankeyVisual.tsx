import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LinkedInIcon } from "@/components/icons/SocialIcons";
import { Mail, QrCode } from "lucide-react";

// Cinematic Links/QR Sankey: Matching Attribution structure exactly
// Icons OUTSIDE boxes, grey base, single purple accent
export const LinksQRSankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1]; // 5 strands matching Attribution
  const fontStack = "'SF Mono', SFMono-Regular, ui-monospace, Menlo, monospace";
  const accentColor = "#8B5CF6"; // Single purple accent

  useEffect(() => {
    setParticles(Array.from({ length: 6 }, (_, i) => ({
      id: i,
      path: i % 3,
      delay: i * 0.3,
    })));
  }, []);

  // Sources with proportional widths like Attribution
  const sources = [
    { y: 15, width: 42, icon: LinkedInIcon, isComponent: true },
    { y: 30, width: 35, icon: Mail, isComponent: false },
    { y: 45, width: 28, icon: QrCode, isComponent: false },
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
        
        {/* Flow gradient - grey to white to purple */}
        <linearGradient id="linksFlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#71717A" stopOpacity="0.5" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.6" />
        </linearGradient>
        
        {/* UTM node gradient */}
        <radialGradient id="utmGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor={accentColor} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accentColor} stopOpacity="0.15" />
        </radialGradient>
        
        {/* Dot grid */}
        <pattern id="linksDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#linksDotGrid)" opacity="0.3" />
      
      {/* Source bars with icons OUTSIDE - matching Attribution exactly */}
      {sources.map((src, i) => {
        const IconComponent = src.icon;
        return (
          <g key={i}>
            <motion.rect
              x="16"
              y={src.y}
              width={src.width}
              height="6"
              rx="2"
              fill="#52525B"
              fillOpacity={0.2}
              stroke="#52525B"
              strokeOpacity={0.5}
              strokeWidth="0.4"
              initial={{ width: 0 }}
              animate={{ width: src.width }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: appleEase }}
            />
            {/* Pulse glow */}
            <motion.rect
              x="16"
              y={src.y}
              width={src.width}
              height="6"
              rx="2"
              fill="none"
              stroke="#71717A"
              strokeWidth="0.3"
              animate={{ strokeOpacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.25, ease: appleEase }}
            />
            {/* Icon OUTSIDE the bar - matching Attribution */}
            <foreignObject x="4" y={src.y - 1} width="10" height="8">
              <div className="flex items-center justify-center w-full h-full">
                {src.isComponent ? (
                  <IconComponent className="w-2 h-2" />
                ) : (
                  <IconComponent className="w-2 h-2 text-zinc-400" strokeWidth={2} />
                )}
              </div>
            </foreignObject>
          </g>
        );
      })}
      
      {/* Multi-strand fiber flows to UTM node - 5 strands */}
      {sources.map((src, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = src.y + 3;
          return (
            <motion.path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M ${16 + src.width} ${baseY + offset * 0.8} Q 55 ${baseY + offset * 0.4}, 68 30`}
              fill="none"
              stroke={isCenter ? "url(#linksFlow)" : "#52525B"}
              strokeWidth={isCenter ? 1.0 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#linksFiberGlow)" : undefined}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 + srcIdx * 0.1, ease: appleEase }}
            />
          );
        })
      ))}
      
      {/* UTM node with glow */}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, ease: appleEase }}>
        <circle cx="78" cy="30" r="10" fill="url(#utmGlow)" />
        <circle cx="78" cy="30" r="10" fill="none" stroke={accentColor} strokeWidth="0.4" strokeOpacity="0.6" />
        {/* Pulse ring */}
        <motion.circle
          cx="78"
          cy="30"
          r="10"
          fill="none"
          stroke={accentColor}
          strokeWidth="0.5"
          animate={{ 
            r: [10, 13, 10],
            opacity: [0.5, 0.1, 0.5],
          }}
          transition={{ duration: 1, repeat: Infinity, ease: appleEase }}
        />
        {/* Inner core */}
        <circle cx="78" cy="30" r="5" fill="rgba(139,92,246,0.2)" stroke={accentColor} strokeWidth="0.4" />
        <text 
          x="78" 
          y="32" 
          fill="white" 
          fontSize="5" 
          textAnchor="middle" 
          fontFamily={fontStack}
          fontWeight="bold"
          opacity="0.9"
        >
          UTM
        </text>
      </motion.g>
      
      {/* Output fiber to QR - 5 strands */}
      {fiberOffsets.map((offset, strandIdx) => {
        const isCenter = strandIdx === 2;
        return (
          <motion.path
            key={`output-${strandIdx}`}
            d={`M 88 ${30 + offset * 0.6} L 100 ${30 + offset * 0.6}`}
            fill="none"
            stroke={isCenter ? accentColor : "#52525B"}
            strokeWidth={isCenter ? 1.0 : 0.3}
            strokeLinecap="round"
            strokeOpacity={isCenter ? 0.7 : 0.2}
            filter={isCenter ? "url(#linksFiberGlow)" : undefined}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.8, ease: appleEase }}
          />
        );
      })}
      
      {/* QR output node */}
      <motion.g
        initial={{ opacity: 0, x: 5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, ease: appleEase }}
      >
        <rect x="100" y="22" width="16" height="16" rx="2" fill="rgba(63,63,70,0.3)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.4" />
        {/* QR pattern - 4x4 grid */}
        <g transform="translate(102, 24)">
          {[0, 1, 2, 3].map((r) =>
            [0, 1, 2, 3].map((c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 3}
                y={r * 3}
                width="2.5"
                height="2.5"
                fill="white"
                fillOpacity={(r + c) % 2 === 0 ? 0.6 : 0.15}
              />
            ))
          )}
        </g>
        {/* Scanline */}
        <motion.rect
          x="100"
          y="22"
          width="16"
          height="1.5"
          fill={accentColor}
          fillOpacity="0.3"
          animate={{ y: [22, 36, 22] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
      </motion.g>
      
      {/* Heartbeat particles */}
      {particles.map((p) => {
        const src = sources[p.path];
        return (
          <motion.circle
            key={p.id}
            r="1.5"
            fill={accentColor}
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
              repeatDelay: 0.5,
              ease: appleEase,
            }}
            style={{
              offsetPath: `path("M ${16 + src.width} ${src.y + 3} Q 55 ${src.y + 3}, 68 30")`,
            }}
          />
        );
      })}
    </svg>
  );
};