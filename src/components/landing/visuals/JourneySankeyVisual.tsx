import { useEffect, useRef, useState } from "react";
import { Search, Users, Mail, MousePointer } from "lucide-react";

interface Particle {
  id: number;
  pathIndex: number;
  progress: number;
  speed: number;
}

const SOURCES = [
  { id: "search", label: "Search", y: 25, icon: Search, color: "#A1A1AA" },
  { id: "social", label: "Social", y: 55, icon: Users, color: "#71717A" },
  { id: "email", label: "Email", y: 85, icon: Mail, color: "#D4D4D8" },
  { id: "direct", label: "Direct", y: 115, icon: MousePointer, color: "#52525B" },
];

export const JourneySankeyVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [conversionGlow, setConversionGlow] = useState(false);
  const particleIdRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const width = 360;
  const height = 140;
  const leftX = 70;
  const rightX = width - 40;
  const rightY = height / 2;

  const paths = SOURCES.map((source) => {
    const startX = leftX;
    const startY = source.y;
    const endX = rightX;
    const endY = rightY;
    const cp1x = startX + (endX - startX) * 0.5;
    const cp1y = startY;
    const cp2x = startX + (endX - startX) * 0.5;
    const cp2y = endY;
    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  });

  useEffect(() => {
    // Delay animation start to let skeleton hide first
    const timer = setTimeout(() => {
      setMounted(true);
    }, 500);
    
    return () => {
      clearTimeout(timer);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const spawnParticle = () => {
      const pathIndex = Math.floor(Math.random() * SOURCES.length);
      const newParticle: Particle = {
        id: particleIdRef.current++,
        pathIndex,
        progress: 0,
        speed: 0.008 + Math.random() * 0.004,
      };
      setParticles(prev => [...prev.slice(-12), newParticle]);
    };

    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnParticle(), i * 300);
    }

    const interval = setInterval(spawnParticle, 1200);
    return () => clearInterval(interval);
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const animate = (timestamp: number) => {
      if (timestamp - lastTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = timestamp;

      setParticles(prev => {
        const updated = prev
          .map(p => ({ ...p, progress: p.progress + p.speed }))
          .filter(p => p.progress <= 1.1);

        const hitting = prev.some(p => p.progress < 1 && p.progress + p.speed >= 1);
        if (hitting) {
          setConversionGlow(true);
          setTimeout(() => setConversionGlow(false), 150);
        }

        return updated;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [mounted]);

  const getPointOnPath = (pathIndex: number, progress: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const pathEl = svgRef.current.querySelector(`#journey-path-${pathIndex}`) as SVGPathElement;
    if (!pathEl) return { x: rightX, y: rightY };
    
    try {
      const length = pathEl.getTotalLength();
      const point = pathEl.getPointAtLength(length * Math.min(progress, 1));
      return { x: point.x, y: point.y };
    } catch {
      return { x: rightX, y: rightY };
    }
  };

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ overflow: 'visible' }}
      >
        <defs>
          <filter id="journey-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="journey-destination-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="journey-platinum-text" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>

        {/* Wire paths */}
        {paths.map((path, index) => (
          <path
            key={`wire-${index}`}
            id={`journey-path-${index}`}
            d={path}
            fill="none"
            className="stroke-white/[0.06]"
            strokeWidth="1"
          />
        ))}

        {/* Source nodes */}
        {SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <g key={source.id}>
              <circle
                cx={leftX}
                cy={source.y}
                r="3"
                fill={source.color}
                style={{ opacity: 0.8 }}
              />
              <circle
                cx={leftX}
                cy={source.y}
                r="6"
                fill="none"
                stroke={source.color}
                strokeWidth="1"
                style={{ opacity: 0.3 }}
              />
              <foreignObject x={leftX - 60} y={source.y - 8} width="50" height="16">
                <div className="flex items-center gap-1 justify-end h-full">
                  <Icon className="w-2.5 h-2.5" style={{ color: source.color }} />
                  <span className="text-[6px] text-white/40 font-mono">{source.label}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Destination node */}
        <g>
          <circle
            cx={rightX}
            cy={rightY}
            r="16"
            fill="none"
            className={`transition-all duration-100 ${conversionGlow ? "stroke-white/95" : "stroke-white/25"}`}
            strokeWidth="1.5"
            filter={conversionGlow ? "url(#journey-destination-glow)" : undefined}
            style={{ 
              transform: `scale(${conversionGlow ? 1.15 : 1})`,
              transformOrigin: `${rightX}px ${rightY}px`
            }}
          />
          <circle
            cx={rightX}
            cy={rightY}
            r="8"
            fill="none"
            className="stroke-white/[0.12]"
            strokeWidth="1"
          />
          <circle
            cx={rightX}
            cy={rightY}
            r="3"
            className="fill-white/80"
          />
        </g>

        <text
          x={rightX}
          y={rightY + 28}
          textAnchor="middle"
          className="text-[5px] fill-white/30 font-mono tracking-widest"
        >
          CONVERSION
        </text>

        <text
          x={rightX}
          y={rightY + 40}
          textAnchor="middle"
          className="text-[9px] font-semibold"
          fill="url(#journey-platinum-text)"
        >
          $54.2K
        </text>

        {/* Particles */}
        {particles.map((particle) => {
          const point = getPointOnPath(particle.pathIndex, particle.progress);
          const prevPoint = getPointOnPath(particle.pathIndex, Math.max(0, particle.progress - 0.12));
          
          if (particle.progress > 1.1) return null;
          
          const particleColor = SOURCES[particle.pathIndex]?.color || "white";
          
          return (
            <g key={particle.id}>
              <line
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke={particleColor}
                strokeWidth="1"
                strokeLinecap="round"
                style={{ opacity: 0.4 }}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="2"
                fill={particleColor}
                filter="url(#journey-particle-glow)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
