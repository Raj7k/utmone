import { useEffect, useRef, useState } from "react";
import { MapPin, Calendar, Users, DollarSign } from "lucide-react";

interface Particle {
  id: number;
  pathIndex: number;
  progress: number;
  speed: number;
}

const SOURCES = [
  { id: "venue", label: "Venue", y: 25, icon: MapPin, color: "#A1A1AA" },
  { id: "event", label: "Event", y: 55, icon: Calendar, color: "#71717A" },
  { id: "attendees", label: "Leads", y: 85, icon: Users, color: "#D4D4D8" },
];

export const EventHaloVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [haloGlow, setHaloGlow] = useState(false);
  const particleIdRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const width = 360;
  const height = 110;
  const leftX = 70;
  const haloX = width / 2;
  const haloY = height / 2;
  const rightX = width - 50;

  const stage1Paths = SOURCES.map((source) => {
    const startX = leftX;
    const startY = source.y;
    const cp1x = startX + (haloX - startX) * 0.5;
    const cp1y = startY;
    const cp2x = startX + (haloX - startX) * 0.5;
    const cp2y = haloY;
    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${haloX} ${haloY}`;
  });

  const stage2Path = `M ${haloX} ${haloY} C ${haloX + 40} ${haloY}, ${rightX - 40} ${haloY}, ${rightX} ${haloY}`;

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
        speed: 0.01 + Math.random() * 0.005,
      };
      setParticles(prev => [...prev.slice(-10), newParticle]);
    };

    for (let i = 0; i < 2; i++) {
      setTimeout(() => spawnParticle(), i * 400);
    }

    const interval = setInterval(spawnParticle, 1100);
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
          setHaloGlow(true);
          setTimeout(() => setHaloGlow(false), 150);
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
    
    const pathEl = svgRef.current.querySelector(`#halo-path-${pathIndex}`) as SVGPathElement;
    if (!pathEl) return { x: haloX, y: haloY };
    
    try {
      const length = pathEl.getTotalLength();
      const point = pathEl.getPointAtLength(length * Math.min(progress, 1));
      return { x: point.x, y: point.y };
    } catch {
      return { x: haloX, y: haloY };
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
          <filter id="halo-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="halo-center-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="halo-platinum-text" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>

        {/* Stage 1 wire paths */}
        {stage1Paths.map((path, index) => (
          <path
            key={`stage1-wire-${index}`}
            id={`halo-path-${index}`}
            d={path}
            fill="none"
            className="stroke-white/[0.06]"
            strokeWidth="1"
          />
        ))}

        {/* Stage 2 wire path */}
        <path
          id="halo-path-output"
          d={stage2Path}
          fill="none"
          className="stroke-white/[0.06]"
          strokeWidth="1"
        />

        {/* Source nodes */}
        {SOURCES.map((source) => {
          const Icon = source.icon;
          return (
            <g key={source.id}>
              <circle cx={leftX} cy={source.y} r="3" fill={source.color} style={{ opacity: 0.8 }} />
              <circle cx={leftX} cy={source.y} r="6" fill="none" stroke={source.color} strokeWidth="1" style={{ opacity: 0.3 }} />
              <foreignObject x={leftX - 55} y={source.y - 8} width="45" height="16">
                <div className="flex items-center gap-1 justify-end h-full">
                  <Icon className="w-2.5 h-2.5" style={{ color: source.color }} />
                  <span className="text-[6px] text-white/40 font-mono">{source.label}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Halo center node */}
        <g>
          <circle
            cx={haloX}
            cy={haloY}
            r="18"
            fill="none"
            className={`transition-all duration-100 ${haloGlow ? "stroke-white/95" : "stroke-white/25"}`}
            strokeWidth="1.5"
            filter={haloGlow ? "url(#halo-center-glow)" : undefined}
            style={{ 
              transform: `scale(${haloGlow ? 1.15 : 1})`,
              transformOrigin: `${haloX}px ${haloY}px`
            }}
          />
          <circle cx={haloX} cy={haloY} r="10" fill="none" className="stroke-white/[0.15]" strokeWidth="1" />
          <circle cx={haloX} cy={haloY} r="4" className="fill-white/80" />
        </g>

        <text x={haloX} y={haloY + 32} textAnchor="middle" className="text-[5px] fill-white/30 font-mono tracking-widest">
          EVENT HALO
        </text>

        {/* Revenue destination */}
        <g>
          <circle cx={rightX} cy={haloY} r="14" fill="none" className="stroke-white/25" strokeWidth="1.5" />
          <circle cx={rightX} cy={haloY} r="7" fill="none" className="stroke-white/[0.12]" strokeWidth="1" />
          <circle cx={rightX} cy={haloY} r="3" className="fill-white/80" />
          <foreignObject x={rightX - 20} y={haloY + 18} width="40" height="25">
            <div className="flex flex-col items-center">
              <DollarSign className="w-2.5 h-2.5 text-white/50" />
              <span className="text-[5px] text-white/30 font-mono">Revenue</span>
            </div>
          </foreignObject>
        </g>

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
                filter="url(#halo-particle-glow)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
