import { motion } from "framer-motion";
import { Link2, QrCode, Share2, Globe } from "lucide-react";

// Cinematic Links/QR Visual with fiber-optic bundles and liquid motion
export const LinksQRSankeyVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const accentColor = "#0A66C2";

  // Layered fiber bundle
  const FiberBundle = ({ path, delay = 0 }: { path: string; delay?: number }) => {
    const layers = [
      { count: 3, opacity: 0.95, width: 1.5 },
      { count: 5, opacity: 0.45, width: 0.8 },
      { count: 10, opacity: 0.15, width: 0.35 },
    ];

    return (
      <g style={{ mixBlendMode: "screen" }}>
        {layers.flatMap((layer, li) =>
          Array.from({ length: layer.count }, (_, i) => {
            const offset = (i - layer.count / 2) * 0.7;
            return (
              <motion.path
                key={`${li}-${i}`}
                d={path}
                fill="none"
                stroke={li === 0 ? "white" : accentColor}
                strokeWidth={layer.width}
                strokeLinecap="round"
                opacity={layer.opacity}
                transform={`translate(0, ${offset * 0.4})`}
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
  const ParticleStream = ({ path, count = 5 }: { path: string; count?: number }) => (
    <>
      {Array.from({ length: count }, (_, i) => (
        <motion.circle
          key={i}
          r={1.3}
          fill="white"
          filter="url(#lqParticleGlow)"
          style={{ mixBlendMode: "screen" }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.0, delay: i / count, repeat: Infinity, ease: appleEase }}
        >
          <animateMotion dur="1s" repeatCount="indefinite" begin={`${i / count}s`} path={path} />
        </motion.circle>
      ))}
    </>
  );

  // Frosted glass source node with icon
  const SourceNode = ({ x, y, icon: Icon, label }: { x: number; y: number; icon: any; label: string }) => (
    <g>
      <rect x={x} y={y} width={26} height={12} rx={2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
      <rect x={x + 0.5} y={y + 0.5} width={25} height={11} rx={1.5} fill="url(#lqInnerGlow)" opacity={0.25} />
      <motion.circle cx={x + 9} cy={y + 6} r={4} fill="none" stroke={accentColor} strokeWidth={0.4}
        animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }} />
      <foreignObject x={x + 4} y={y + 1} width={10} height={10}>
        <div className="flex items-center justify-center w-full h-full">
          <Icon className="w-2.5 h-2.5 text-[#0A66C2]" strokeWidth={2} />
        </div>
      </foreignObject>
      <text x={x + 18} y={y + 7.5} fill="rgba(255,255,255,0.7)" fontSize={3.5} fontFamily="'SF Mono', monospace" dominantBaseline="middle">{label}</text>
      <motion.rect x={x} y={y} width={26} height={12} rx={2} fill="none" stroke={accentColor} strokeWidth={0.7}
        animate={{ opacity: [0.1, 0.35, 0.1] }} transition={{ duration: 1, repeat: Infinity }} />
    </g>
  );

  return (
    <svg viewBox="0 0 160 80" className="w-full h-full">
      <defs>
        <filter id="lqBloom" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="lqParticleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.8" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <radialGradient id="lqInnerGlow">
          <stop offset="0%" stopColor="white" stopOpacity="0.12" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="lqBlue" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0A66C2" />
          <stop offset="50%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#0A66C2" />
        </linearGradient>
        <pattern id="lqGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.2" fill="rgba(10,102,194,0.06)" />
        </pattern>
      </defs>

      <rect width="160" height="80" fill="url(#lqGrid)" />

      {/* Source nodes */}
      <SourceNode x={4} y={8} icon={Link2} label="UTM" />
      <SourceNode x={4} y={26} icon={QrCode} label="QR" />
      <SourceNode x={4} y={44} icon={Share2} label="Social" />
      <SourceNode x={4} y={62} icon={Globe} label="Web" />

      {/* Fiber bundles to hub */}
      <g filter="url(#lqBloom)">
        <FiberBundle path="M 30 14 Q 52 24, 68 36" delay={0} />
        <FiberBundle path="M 30 32 Q 52 34, 68 39" delay={0.08} />
        <FiberBundle path="M 30 50 Q 52 46, 68 42" delay={0.16} />
        <FiberBundle path="M 30 68 Q 52 56, 68 45" delay={0.24} />
      </g>

      <ParticleStream path="M 30 14 Q 52 24, 68 36" />
      <ParticleStream path="M 30 32 Q 52 34, 68 39" />
      <ParticleStream path="M 30 50 Q 52 46, 68 42" />
      <ParticleStream path="M 30 68 Q 52 56, 68 45" />

      {/* Central hub - rotating rings */}
      <g transform="translate(80, 40)">
        <motion.circle r={16} fill="none" stroke="rgba(10,102,194,0.2)" strokeWidth={0.4} strokeDasharray="4 7"
          animate={{ rotate: 360 }} transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
        <motion.circle r={11} fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth={0.6} strokeDasharray="5 3"
          animate={{ rotate: -360 }} transition={{ duration: 11, repeat: Infinity, ease: "linear" }} />
        <motion.circle r={7} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth={0.8} strokeDasharray="2 4"
          animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
        
        <motion.circle r={4.5} fill="url(#lqBlue)" opacity={0.65}
          animate={{ scale: [1, 1.12, 1], opacity: [0.65, 0.9, 0.65] }}
          transition={{ duration: 1.0, repeat: Infinity }} />
        <circle r={2.2} fill="white" opacity={0.95} />
        
        <foreignObject x={-3.5} y={-3.5} width={7} height={7}>
          <div className="flex items-center justify-center w-full h-full">
            <QrCode className="w-2 h-2 text-[#0A66C2]" strokeWidth={2.5} />
          </div>
        </foreignObject>
      </g>

      {/* Output fiber bundles */}
      <g filter="url(#lqBloom)">
        <FiberBundle path="M 92 36 Q 112 26, 128 16" delay={0.5} />
        <FiberBundle path="M 92 40 Q 112 40, 128 40" delay={0.55} />
        <FiberBundle path="M 92 44 Q 112 54, 128 64" delay={0.6} />
      </g>

      <ParticleStream path="M 92 36 Q 112 26, 128 16" count={4} />
      <ParticleStream path="M 92 40 Q 112 40, 128 40" count={4} />
      <ParticleStream path="M 92 44 Q 112 54, 128 64" count={4} />

      {/* Destination nodes */}
      {[{ y: 10, label: "Mobile" }, { y: 34, label: "Desktop" }, { y: 58, label: "Tablet" }].map((node, i) => (
        <g key={i}>
          <rect x={132} y={node.y} width={24} height={12} rx={2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
          <motion.rect x={132} y={node.y} width={24} height={12} rx={2} fill="none" stroke="#38BDF8" strokeWidth={0.7}
            animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
          <text x={144} y={node.y + 7.5} textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize={3.5} fontFamily="'SF Mono', monospace">{node.label}</text>
        </g>
      ))}

      {/* Labels */}
      <text x={12} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">INPUT</text>
      <text x={72} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">TRACK</text>
      <text x={134} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">DEVICE</text>
    </svg>
  );
};
