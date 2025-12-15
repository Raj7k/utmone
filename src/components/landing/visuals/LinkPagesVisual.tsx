import { motion } from "framer-motion";
import { Link, Instagram, Twitter, Youtube, Music, Globe } from "lucide-react";

// Link Pages Visual with central rotating portal and radiating fibers
export const LinkPagesVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const accentColor = "#F97316";

  // Layered fiber bundle
  const FiberBundle = ({ path, delay = 0 }: { path: string; delay?: number }) => {
    const layers = [
      { count: 2, opacity: 0.95, width: 1.5 },
      { count: 5, opacity: 0.4, width: 0.8 },
      { count: 9, opacity: 0.12, width: 0.35 },
    ];

    return (
      <g style={{ mixBlendMode: "screen" }}>
        {layers.flatMap((layer, li) =>
          Array.from({ length: layer.count }, (_, i) => {
            const offset = (i - layer.count / 2) * 0.6;
            return (
              <motion.path
                key={`${li}-${i}`}
                d={path}
                fill="none"
                stroke={li === 0 ? "white" : accentColor}
                strokeWidth={layer.width}
                strokeLinecap="round"
                opacity={layer.opacity}
                transform={`translate(0, ${offset * 0.35})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: layer.opacity }}
                transition={{ duration: 1.1, delay: delay + li * 0.07, ease: appleEase }}
              />
            );
          })
        )}
      </g>
    );
  };

  // 60bpm particle stream
  const ParticleStream = ({ path, count = 4 }: { path: string; count?: number }) => (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.circle
          key={i}
          r={1.2}
          fill="white"
          filter="url(#lpParticleGlow)"
          style={{ mixBlendMode: "screen" }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.0, delay: i / count, repeat: Infinity, ease: appleEase }}
        >
          <animateMotion dur="1s" repeatCount="indefinite" begin={`${i / count}s`} path={path} />
        </motion.circle>
      ))}
    </>
  );

  return (
    <svg viewBox="0 0 160 80" className="w-full h-full">
      <defs>
        <filter id="lpBloomF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="lpParticleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.6" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="lpOrange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#FB923C" />
          <stop offset="100%" stopColor="#F97316" />
        </linearGradient>
        <radialGradient id="portalGlow">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FB923C" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </radialGradient>
        <pattern id="lpGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.18" fill="rgba(249,115,22,0.04)" />
        </pattern>
      </defs>

      <rect width="160" height="80" fill="url(#lpGrid)" />

      {/* CENTRAL LINK PORTAL */}
      <g transform="translate(45, 40)">
        {/* Radiating light rays */}
        {Array.from({ length: 10 }, (_, i) => (
          <motion.line
            key={i}
            x1={0} y1={0}
            x2={Math.cos((i * 36) * Math.PI / 180) * 22}
            y2={Math.sin((i * 36) * Math.PI / 180) * 22}
            stroke="rgba(251,146,60,0.15)"
            strokeWidth={0.3}
            animate={{ opacity: [0.08, 0.25, 0.08] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}

        {/* Outer ring - slow */}
        <motion.circle r={18} fill="none" stroke="rgba(249,115,22,0.18)" strokeWidth={0.4} strokeDasharray="5 9"
          animate={{ rotate: 360 }} transition={{ duration: 22, repeat: Infinity, ease: "linear" }} />
        {/* Middle ring - counter */}
        <motion.circle r={13} fill="none" stroke="rgba(251,146,60,0.32)" strokeWidth={0.6} strokeDasharray="7 4"
          animate={{ rotate: -360 }} transition={{ duration: 13, repeat: Infinity, ease: "linear" }} />
        {/* Inner ring - fast */}
        <motion.circle r={8} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} strokeDasharray="3 5"
          animate={{ rotate: 360 }} transition={{ duration: 7, repeat: Infinity, ease: "linear" }} />

        {/* Portal core glow */}
        <circle r={7} fill="url(#portalGlow)" />

        {/* Pulsing energy core */}
        <motion.circle r={4.5} fill="url(#lpOrange)" opacity={0.65}
          animate={{ scale: [1, 1.15, 1], opacity: [0.65, 0.92, 0.65] }}
          transition={{ duration: 1.0, repeat: Infinity }} />
        <circle r={2.2} fill="white" opacity={0.95} />

        {/* Link icon */}
        <foreignObject x={-3.5} y={-3.5} width={7} height={7}>
          <div className="flex items-center justify-center w-full h-full">
            <Link className="w-2 h-2 text-orange-500" strokeWidth={2.5} />
          </div>
        </foreignObject>

        {/* "1" badge */}
        <motion.text
          x={0} y={-11}
          textAnchor="middle"
          fill="white"
          fontSize={5}
          fontFamily="'SF Mono', monospace"
          fontWeight="bold"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          1
        </motion.text>
      </g>

      {/* Fiber bundles radiating outward */}
      <g filter="url(#lpBloomF)">
        <FiberBundle path="M 60 32 Q 85 22, 110 12" delay={0} />
        <FiberBundle path="M 62 36 Q 88 30, 110 28" delay={0.08} />
        <FiberBundle path="M 63 40 Q 90 40, 110 40" delay={0.12} />
        <FiberBundle path="M 62 44 Q 88 50, 110 52" delay={0.16} />
        <FiberBundle path="M 60 48 Q 85 58, 110 68" delay={0.2} />
      </g>

      <ParticleStream path="M 60 32 Q 85 22, 110 12" count={3} />
      <ParticleStream path="M 62 36 Q 88 30, 110 28" count={3} />
      <ParticleStream path="M 63 40 Q 90 40, 110 40" count={3} />
      <ParticleStream path="M 62 44 Q 88 50, 110 52" count={3} />
      <ParticleStream path="M 60 48 Q 85 58, 110 68" count={3} />

      {/* Destination link nodes */}
      {[
        { y: 6, icon: Instagram, label: "Instagram" },
        { y: 22, icon: Twitter, label: "Twitter" },
        { y: 34, icon: Youtube, label: "YouTube" },
        { y: 46, icon: Music, label: "Spotify" },
        { y: 62, icon: Globe, label: "Website" },
      ].map((node, i) => (
        <g key={i}>
          <rect x={114} y={node.y} width={38} height={12} rx={2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
          <motion.rect x={114} y={node.y} width={38} height={12} rx={2} fill="none" stroke="#FB923C" strokeWidth={0.6}
            animate={{ opacity: [0.12, 0.38, 0.12] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.12 }} />
          <foreignObject x={117} y={node.y + 2} width={8} height={8}>
            <div className="flex items-center justify-center w-full h-full">
              <node.icon className="w-2 h-2 text-orange-400" strokeWidth={2} />
            </div>
          </foreignObject>
          <text x={130} y={node.y + 7.5} fill="rgba(255,255,255,0.7)" fontSize={3} fontFamily="'SF Mono', monospace" dominantBaseline="middle">{node.label}</text>
        </g>
      ))}

      {/* Labels */}
      <text x={38} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">PORTAL</text>
      <text x={124} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">LINKS</text>
    </svg>
  );
};
