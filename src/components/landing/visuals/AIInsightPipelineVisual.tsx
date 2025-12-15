import { motion } from "framer-motion";
import { Brain, TrendingUp, Zap, Target } from "lucide-react";

// AI Intelligence Visual with Icosahedron Nexus and prediction beam
export const AIInsightPipelineVisual = () => {
  const appleEase = [0.4, 0.0, 0.2, 1] as const;
  const accentColor = "#10B981";

  // Icosahedron wireframe edges (2D projection)
  const icosahedronEdges = [
    [[0, -11], [10.5, -3.4]], [[10.5, -3.4], [6.5, 8.9]], [[6.5, 8.9], [-6.5, 8.9]],
    [[-6.5, 8.9], [-10.5, -3.4]], [[-10.5, -3.4], [0, -11]],
    [[0, -11], [0, 4]], [[10.5, -3.4], [-4.5, -1.8]], [[6.5, 8.9], [-2.8, -5.5]],
    [[-6.5, 8.9], [4.5, -1.8]], [[-10.5, -3.4], [2.8, -5.5]],
    [[0, 4], [4.5, -1.8]], [[0, 4], [-4.5, -1.8]], [[4.5, -1.8], [2.8, -5.5]],
    [[-4.5, -1.8], [-2.8, -5.5]], [[2.8, -5.5], [-2.8, -5.5]],
  ];

  // Layered fiber bundle
  const FiberBundle = ({ path, delay = 0 }: { path: string; delay?: number }) => {
    const layers = [
      { count: 2, opacity: 0.95, width: 1.4 },
      { count: 4, opacity: 0.4, width: 0.7 },
      { count: 8, opacity: 0.12, width: 0.3 },
    ];

    return (
      <g style={{ mixBlendMode: "screen" }}>
        {layers.flatMap((layer, li) =>
          Array.from({ length: layer.count }, (_, i) => {
            const offset = (i - layer.count / 2) * 0.65;
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
                transition={{ duration: 1.1, delay: delay + li * 0.08, ease: appleEase }}
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
          filter="url(#aiParticleGlow)"
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
        <filter id="aiBloomF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="aiParticleGlow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="1.5" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="aiEmerald" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="50%" stopColor="#34D399" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
        <pattern id="aiGrid" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="0.18" fill="rgba(16,185,129,0.05)" />
        </pattern>
      </defs>

      <rect width="160" height="80" fill="url(#aiGrid)" />

      {/* Input nodes */}
      {[
        { y: 10, icon: Brain, label: "Data" },
        { y: 26, icon: TrendingUp, label: "Trends" },
        { y: 42, icon: Zap, label: "Events" },
        { y: 58, icon: Target, label: "Goals" },
      ].map((node, i) => (
        <g key={i}>
          <rect x={6} y={node.y} width={24} height={10} rx={2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
          <motion.rect x={6} y={node.y} width={24} height={10} rx={2} fill="none" stroke={accentColor} strokeWidth={0.7}
            animate={{ opacity: [0.1, 0.35, 0.1] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
          <foreignObject x={9} y={node.y + 1} width={8} height={8}>
            <div className="flex items-center justify-center w-full h-full">
              <node.icon className="w-2 h-2 text-emerald-400" strokeWidth={2} />
            </div>
          </foreignObject>
          <text x={21} y={node.y + 6.5} fill="rgba(255,255,255,0.65)" fontSize={3} fontFamily="'SF Mono', monospace" dominantBaseline="middle">{node.label}</text>
        </g>
      ))}

      {/* Fiber bundles to nexus */}
      <g filter="url(#aiBloomF)">
        <FiberBundle path="M 30 15 Q 50 24, 62 36" delay={0} />
        <FiberBundle path="M 30 31 Q 50 33, 62 39" delay={0.08} />
        <FiberBundle path="M 30 47 Q 50 44, 62 42" delay={0.16} />
        <FiberBundle path="M 30 63 Q 50 53, 62 45" delay={0.24} />
      </g>

      <ParticleStream path="M 30 15 Q 50 24, 62 36" />
      <ParticleStream path="M 30 31 Q 50 33, 62 39" />
      <ParticleStream path="M 30 47 Q 50 44, 62 42" />
      <ParticleStream path="M 30 63 Q 50 53, 62 45" />

      {/* AI NEXUS - Icosahedron wireframe */}
      <g transform="translate(75, 40)">
        {/* Rotating wireframe */}
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}>
          {icosahedronEdges.map((edge, i) => (
            <motion.line
              key={i}
              x1={edge[0][0]} y1={edge[0][1]}
              x2={edge[1][0]} y2={edge[1][1]}
              stroke="rgba(16,185,129,0.35)"
              strokeWidth={0.35}
              animate={{ opacity: [0.15, 0.45, 0.15] }}
              transition={{ duration: 2.5, delay: i * 0.12, repeat: Infinity }}
            />
          ))}
        </motion.g>

        {/* Core energy ball */}
        <motion.circle r={5.5} fill="url(#aiEmerald)" opacity={0.5}
          animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.0, repeat: Infinity }} />
        <motion.circle r={2.8} fill="white" opacity={0.9}
          animate={{ opacity: [0.85, 1, 0.85] }}
          transition={{ duration: 0.5, repeat: Infinity }} />

        {/* Pulsing "thinking" ring */}
        <motion.circle r={7} fill="none" stroke="rgba(52,211,153,0.5)" strokeWidth={0.4}
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 1.0, repeat: Infinity }} />
      </g>

      {/* Prediction beam */}
      <g transform="translate(90, 40)">
        <motion.path
          d="M 0 0 Q 18 -14 45 -18"
          fill="none"
          stroke="rgba(52,211,153,0.55)"
          strokeWidth={0.9}
          strokeDasharray="3 3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: [0, 1, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.g
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, 45, 45, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <text x={38} y={-20} fill="rgba(52,211,153,0.85)" fontSize={4} fontFamily="'SF Mono', monospace" fontWeight="500">+24%</text>
        </motion.g>
      </g>

      {/* Output fiber bundles */}
      <g filter="url(#aiBloomF)">
        <FiberBundle path="M 90 36 Q 108 26, 126 18" delay={0.5} />
        <FiberBundle path="M 90 40 Q 108 40, 126 40" delay={0.55} />
        <FiberBundle path="M 90 44 Q 108 54, 126 62" delay={0.6} />
      </g>

      {/* Output nodes */}
      {[
        { y: 12, label: "Predict", color: "#34D399" },
        { y: 34, label: "Route", color: "#10B981" },
        { y: 56, label: "Optimize", color: "#059669" },
      ].map((node, i) => (
        <g key={i}>
          <rect x={130} y={node.y} width={24} height={12} rx={2} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth={0.4} />
          <motion.rect x={130} y={node.y} width={24} height={12} rx={2} fill="none" stroke={node.color} strokeWidth={0.7}
            animate={{ opacity: [0.15, 0.45, 0.15] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }} />
          <text x={142} y={node.y + 7.5} textAnchor="middle" fill="rgba(255,255,255,0.75)" fontSize={3.5} fontFamily="'SF Mono', monospace">{node.label}</text>
        </g>
      ))}

      {/* Labels */}
      <text x={12} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">INPUT</text>
      <text x={68} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">NEXUS</text>
      <text x={132} y={5} fill="rgba(255,255,255,0.4)" fontSize={3.5} fontFamily="'SF Mono', monospace">OUTPUT</text>
    </svg>
  );
};
