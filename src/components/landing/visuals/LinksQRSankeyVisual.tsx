import { useEffect, useRef, useState } from "react";
import { Link, QrCode, Globe, Smartphone, Monitor } from "lucide-react";

interface Particle {
  id: number;
  pathIndex: number;
  progress: number;
  speed: number;
  stage: 1 | 2;
}

const SOURCES = [
  { id: "link", label: "Links", y: 30, icon: Link, color: "#A1A1AA" },
  { id: "qr", label: "QR", y: 70, icon: QrCode, color: "#71717A" },
  { id: "bio", label: "Bio", y: 110, icon: Globe, color: "#D4D4D8" },
];

const DESTINATIONS = [
  { id: "web", label: "Web", y: 30, icon: Globe, color: "#52525B" },
  { id: "mobile", label: "Mobile", y: 70, icon: Smartphone, color: "#A1A1AA" },
  { id: "app", label: "App", y: 110, icon: Monitor, color: "#71717A" },
];

export const LinksQRSankeyVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [hubGlow, setHubGlow] = useState(false);
  const particleIdRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const width = 360;
  const height = 140;
  const leftX = 70;
  const hubX = width / 2;
  const hubY = height / 2;
  const rightX = width - 40;

  const stage1Paths = SOURCES.map((source) => {
    const startX = leftX;
    const startY = source.y;
    const cp1x = startX + (hubX - startX) * 0.5;
    const cp1y = startY;
    const cp2x = startX + (hubX - startX) * 0.5;
    const cp2y = hubY;
    return `M ${startX} ${startY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${hubX} ${hubY}`;
  });

  const stage2Paths = DESTINATIONS.map((dest) => {
    const endX = rightX;
    const endY = dest.y;
    const cp1x = hubX + (endX - hubX) * 0.5;
    const cp1y = hubY;
    const cp2x = hubX + (endX - hubX) * 0.5;
    const cp2y = endY;
    return `M ${hubX} ${hubY} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${endX} ${endY}`;
  });

  useEffect(() => {
    setMounted(true);
    return () => {
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
        stage: 1,
      };
      setParticles(prev => [...prev.slice(-12), newParticle]);
    };

    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnParticle(), i * 300);
    }

    const interval = setInterval(spawnParticle, 1000);
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
        const updated: Particle[] = [];
        let glowTriggered = false;

        for (const p of prev) {
          const newProgress = p.progress + p.speed;
          
          if (p.stage === 1 && newProgress >= 1) {
            glowTriggered = true;
            updated.push({
              ...p,
              stage: 2,
              progress: 0,
              pathIndex: Math.floor(Math.random() * DESTINATIONS.length),
            });
          } else if (p.stage === 2 && newProgress > 1.1) {
            // Remove particle
          } else {
            updated.push({ ...p, progress: newProgress });
          }
        }

        if (glowTriggered) {
          setHubGlow(true);
          setTimeout(() => setHubGlow(false), 150);
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

  const getPointOnPath = (pathIndex: number, progress: number, stage: 1 | 2) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const pathId = stage === 1 ? `links-stage1-path-${pathIndex}` : `links-stage2-path-${pathIndex}`;
    const pathEl = svgRef.current.querySelector(`#${pathId}`) as SVGPathElement;
    if (!pathEl) return { x: hubX, y: hubY };
    
    try {
      const length = pathEl.getTotalLength();
      const point = pathEl.getPointAtLength(length * Math.min(progress, 1));
      return { x: point.x, y: point.y };
    } catch {
      return { x: hubX, y: hubY };
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
          <filter id="links-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="links-hub-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="links-platinum-text" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>

        {/* Stage 1 wire paths */}
        {stage1Paths.map((path, index) => (
          <path
            key={`stage1-wire-${index}`}
            id={`links-stage1-path-${index}`}
            d={path}
            fill="none"
            className="stroke-white/[0.06]"
            strokeWidth="1"
          />
        ))}

        {/* Stage 2 wire paths */}
        {stage2Paths.map((path, index) => (
          <path
            key={`stage2-wire-${index}`}
            id={`links-stage2-path-${index}`}
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

        {/* Hub node */}
        <g>
          <circle
            cx={hubX}
            cy={hubY}
            r="16"
            fill="none"
            className={`transition-all duration-100 ${hubGlow ? "stroke-white/95" : "stroke-white/25"}`}
            strokeWidth="1.5"
            filter={hubGlow ? "url(#links-hub-glow)" : undefined}
            style={{ 
              transform: `scale(${hubGlow ? 1.15 : 1})`,
              transformOrigin: `${hubX}px ${hubY}px`
            }}
          />
          <circle cx={hubX} cy={hubY} r="8" fill="none" className="stroke-white/[0.12]" strokeWidth="1" />
          <circle cx={hubX} cy={hubY} r="3" className="fill-white/80" />
        </g>

        <text x={hubX} y={hubY + 28} textAnchor="middle" className="text-[5px] fill-white/30 font-mono tracking-widest">
          utm.one
        </text>

        {/* Destination nodes */}
        {DESTINATIONS.map((dest) => {
          const Icon = dest.icon;
          return (
            <g key={dest.id}>
              <circle cx={rightX} cy={dest.y} r="3" fill={dest.color} style={{ opacity: 0.8 }} />
              <circle cx={rightX} cy={dest.y} r="6" fill="none" stroke={dest.color} strokeWidth="1" style={{ opacity: 0.3 }} />
              <foreignObject x={rightX + 10} y={dest.y - 8} width="45" height="16">
                <div className="flex items-center gap-1 h-full">
                  <Icon className="w-2.5 h-2.5" style={{ color: dest.color }} />
                  <span className="text-[6px] text-white/40 font-mono">{dest.label}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Particles */}
        {particles.map((particle) => {
          const point = getPointOnPath(particle.pathIndex, particle.progress, particle.stage);
          const prevPoint = getPointOnPath(particle.pathIndex, Math.max(0, particle.progress - 0.12), particle.stage);
          
          if (particle.progress > 1.1) return null;
          
          const sourceColor = particle.stage === 1 
            ? SOURCES[particle.pathIndex]?.color 
            : DESTINATIONS[particle.pathIndex]?.color;
          const particleColor = sourceColor || "white";
          
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
                filter="url(#links-particle-glow)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
