import { motion } from "framer-motion";

// Cinematic Journey Sankey with fiber-optic bundles and liquid motion
export const JourneySankeyVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;

  // Create layered fiber bundle (20+ strands)
  const FiberBundle = ({ 
    path, color, delay = 0 
  }: { 
    path: string; color: string; delay?: number 
  }) => {
    const layers = [
      { count: 3, opacity: 0.95, width: 1.4 },   // Core - white hot
      { count: 5, opacity: 0.4, width: 0.7 },    // Mid glow
      { count: 10, opacity: 0.12, width: 0.3 },  // Outer diffuse
    ];

    return (
      <g style={{ mixBlendMode: "screen" }}>
        {layers.flatMap((layer, li) =>
          Array.from({ length: layer.count }, (_, i) => {
            const offset = (i - layer.count / 2) * 0.8;
            // Modify path with offset
            const modPath = path.replace(/(\d+\.?\d*)/g, (match, num, index) => {
              if (path.indexOf(match) > path.indexOf('Q')) {
                return String(parseFloat(num) + offset * 0.3);
              }
              return match;
            });
            return (
              <motion.path
                key={`${li}-${i}`}
                d={path}
                fill="none"
                stroke={li === 0 ? "white" : color}
                strokeWidth={layer.width}
                strokeLinecap="round"
                opacity={layer.opacity}
                transform={`translate(0, ${offset * 0.5})`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: layer.opacity }}
                transition={{ duration: 1.2, delay: delay + li * 0.08, ease: appleEase }}
              />
            );
          })
        )}
      </g>
    );
  };

  // 60bpm particle stream
  const ParticleStream = ({ path, count = 6, color }: { path: string; count?: number; color: string }) => (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.circle
          key={i}
          r={1.5}
          fill="white"
          filter="url(#jParticleGlow)"
          style={{ mixBlendMode: "screen" }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.0, delay: (i / count), repeat: Infinity, ease: appleEase }}
        >
          <animateMotion dur="1s" repeatCount="indefinite" begin={`${i / count}s`} path={path} />
        </motion.circle>
      ))}
    </>
  );

  // Frosted glass node
  const FrostedNode = ({ x, y, width, icon, glowColor }: { x: number; y: number; width: number; icon: string; glowColor: string }) => (
    <g>
      <rect x={x} y={y} width={width} height={10} rx={2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
      <rect x={x + 0.5} y={y + 0.5} width={width - 1} height={9} rx={1.5} fill="url(#jInnerGlow)" opacity={0.3} />
      <motion.rect
        x={x} y={y} width={width} height={10} rx={2}
        fill="none" stroke={glowColor} strokeWidth={0.8}
        animate={{ strokeOpacity: [0.1, 0.4, 0.1] }}
        transition={{ duration: 1.0, repeat: Infinity }}
      />
      <text x={x + width / 2} y={y + 6.5} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={5} fontFamily="'SF Mono', monospace">{icon}</text>
    </g>
  );

  return (
    <svg viewBox="0 0 160 80" className="w-full h-full">
      <defs>
        <filter id="jBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="jParticleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="jInnerGlow">
          <stop offset="0%" stopColor="white" stopOpacity="0.15" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="jAmber" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#22C55E" />
        </linearGradient>
        <pattern id="jGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.2" fill="rgba(255,255,255,0.04)" />
        </pattern>
      </defs>

      <rect width="160" height="80" fill="url(#jGrid)" />

      {/* Source nodes - Frosted glass */}
      <FrostedNode x={6} y={10} width={22} icon="G" glowColor="#F59E0B" />
      <FrostedNode x={6} y={26} width={22} icon="📄" glowColor="#F59E0B" />
      <FrostedNode x={6} y={42} width={22} icon="📱" glowColor="#F59E0B" />
      <FrostedNode x={6} y={58} width={22} icon="✉️" glowColor="#F59E0B" />

      {/* Fiber bundles to halo */}
      <g filter="url(#jBloom)">
        <FiberBundle path="M 28 15 Q 55 25, 70 38" color="#F59E0B" delay={0} />
        <FiberBundle path="M 28 31 Q 55 33, 70 40" color="#FBBF24" delay={0.1} />
        <FiberBundle path="M 28 47 Q 55 45, 70 42" color="#F59E0B" delay={0.2} />
        <FiberBundle path="M 28 63 Q 55 55, 70 44" color="#FBBF24" delay={0.3} />
      </g>

      {/* Particle streams */}
      <ParticleStream path="M 28 15 Q 55 25, 70 38" color="#F59E0B" />
      <ParticleStream path="M 28 31 Q 55 33, 70 40" color="#FBBF24" />
      <ParticleStream path="M 28 47 Q 55 45, 70 42" color="#F59E0B" />
      <ParticleStream path="M 28 63 Q 55 55, 70 44" color="#FBBF24" />

      {/* Central Halo - rotating rings */}
      <g transform="translate(80, 40)">
        {/* Radiating light rays */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.line
            key={i}
            x1={0} y1={0}
            x2={Math.cos((i * 45) * Math.PI / 180) * 22}
            y2={Math.sin((i * 45) * Math.PI / 180) * 22}
            stroke="rgba(251,191,36,0.15)"
            strokeWidth={0.3}
            animate={{ opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 2, delay: i * 0.1, repeat: Infinity }}
          />
        ))}
        
        {/* Outer ring - slow */}
        <motion.circle r={18} fill="none" stroke="rgba(245,158,11,0.2)" strokeWidth={0.4} strokeDasharray="4 8"
          animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
        {/* Middle ring - counter */}
        <motion.circle r={13} fill="none" stroke="rgba(251,191,36,0.35)" strokeWidth={0.6} strokeDasharray="6 4"
          animate={{ rotate: -360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
        {/* Inner ring - fast */}
        <motion.circle r={8} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} strokeDasharray="3 5"
          animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} />
        
        {/* Core energy */}
        <motion.circle r={5} fill="url(#jAmber)" opacity={0.6}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.85, 0.6] }}
          transition={{ duration: 1.0, repeat: Infinity }} />
        <circle r={2.5} fill="white" opacity={0.95} />
      </g>

      {/* Output fiber bundles */}
      <g filter="url(#jBloom)">
        <FiberBundle path="M 90 38 Q 110 28, 128 18" color="#22C55E" delay={0.5} />
        <FiberBundle path="M 90 40 Q 110 40, 128 40" color="#22C55E" delay={0.55} />
        <FiberBundle path="M 90 42 Q 110 52, 128 62" color="#22C55E" delay={0.6} />
      </g>

      <ParticleStream path="M 90 38 Q 110 28, 128 18" color="#22C55E" count={5} />
      <ParticleStream path="M 90 40 Q 110 40, 128 40" color="#22C55E" count={5} />
      <ParticleStream path="M 90 42 Q 110 52, 128 62" color="#22C55E" count={5} />

      {/* Destination nodes */}
      <FrostedNode x={132} y={12} width={22} icon="🛒" glowColor="#22C55E" />
      <FrostedNode x={132} y={34} width={22} icon="📝" glowColor="#22C55E" />
      <FrostedNode x={132} y={56} width={22} icon="💰" glowColor="#FFB800" />

      {/* Labels */}
      <text x={14} y={6} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">SOURCES</text>
      <text x={72} y={6} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">JOURNEY</text>
      <text x={134} y={6} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">CONVERT</text>
    </svg>
  );
};
