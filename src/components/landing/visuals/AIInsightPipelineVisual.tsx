import { useEffect, useRef, useState } from "react";
import { Database, Cpu, Sparkles, Brain } from "lucide-react";

interface Particle {
  id: number;
  pathIndex: number;
  progress: number;
  speed: number;
}

const STAGES = [
  { id: "data", label: "Data", x: 50, icon: Database, color: "#3B82F6" },
  { id: "process", label: "AI", x: 140, icon: Cpu, color: "#8B5CF6" },
  { id: "insight", label: "Insight", x: 230, icon: Sparkles, color: "#10B981" },
  { id: "action", label: "Action", x: 320, icon: Brain, color: "#F59E0B" },
];

export const AIInsightPipelineVisual = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [glowStates, setGlowStates] = useState<Record<number, boolean>>({});
  const particleIdRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const width = 360;
  const height = 100;
  const centerY = height / 2;

  const paths = STAGES.slice(0, -1).map((stage, index) => {
    const nextStage = STAGES[index + 1];
    const startX = stage.x;
    const endX = nextStage.x;
    const cp1x = startX + (endX - startX) * 0.4;
    const cp2x = startX + (endX - startX) * 0.6;
    return `M ${startX} ${centerY} C ${cp1x} ${centerY - 15}, ${cp2x} ${centerY + 15}, ${endX} ${centerY}`;
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
      const pathIndex = Math.floor(Math.random() * paths.length);
      const newParticle: Particle = {
        id: particleIdRef.current++,
        pathIndex,
        progress: 0,
        speed: 0.012 + Math.random() * 0.006,
      };
      setParticles(prev => [...prev.slice(-10), newParticle]);
    };

    for (let i = 0; i < 2; i++) {
      setTimeout(() => spawnParticle(), i * 400);
    }

    const interval = setInterval(spawnParticle, 800);
    return () => clearInterval(interval);
  }, [mounted, paths.length]);

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

        prev.forEach(p => {
          if (p.progress < 1 && p.progress + p.speed >= 1) {
            const destIndex = p.pathIndex + 1;
            setGlowStates(g => ({ ...g, [destIndex]: true }));
            setTimeout(() => setGlowStates(g => ({ ...g, [destIndex]: false })), 150);
          }
        });

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
    
    const pathEl = svgRef.current.querySelector(`#ai-path-${pathIndex}`) as SVGPathElement;
    if (!pathEl) return { x: STAGES[pathIndex + 1]?.x || 0, y: centerY };
    
    try {
      const length = pathEl.getTotalLength();
      const point = pathEl.getPointAtLength(length * Math.min(progress, 1));
      return { x: point.x, y: point.y };
    } catch {
      return { x: STAGES[pathIndex + 1]?.x || 0, y: centerY };
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
          <filter id="ai-particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="ai-node-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wire paths */}
        {paths.map((path, index) => (
          <path
            key={`wire-${index}`}
            id={`ai-path-${index}`}
            d={path}
            fill="none"
            className="stroke-white/[0.06]"
            strokeWidth="1"
          />
        ))}

        {/* Stage nodes */}
        {STAGES.map((stage, index) => {
          const Icon = stage.icon;
          const isGlowing = glowStates[index];
          return (
            <g key={stage.id}>
              <circle
                cx={stage.x}
                cy={centerY}
                r="14"
                fill="none"
                className={`transition-all duration-100 ${isGlowing ? "stroke-white/95" : "stroke-white/25"}`}
                strokeWidth="1.5"
                filter={isGlowing ? "url(#ai-node-glow)" : undefined}
                style={{ 
                  transform: `scale(${isGlowing ? 1.15 : 1})`,
                  transformOrigin: `${stage.x}px ${centerY}px`
                }}
              />
              <circle cx={stage.x} cy={centerY} r="7" fill="none" className="stroke-white/[0.12]" strokeWidth="1" />
              <circle cx={stage.x} cy={centerY} r="3" fill={stage.color} style={{ opacity: 0.8 }} />
              
              <foreignObject x={stage.x - 20} y={centerY + 20} width="40" height="20">
                <div className="flex flex-col items-center">
                  <Icon className="w-3 h-3" style={{ color: stage.color }} />
                  <span className="text-[7px] text-white/50 font-mono mt-0.5">{stage.label}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Particles */}
        {particles.map((particle) => {
          const point = getPointOnPath(particle.pathIndex, particle.progress);
          const prevPoint = getPointOnPath(particle.pathIndex, Math.max(0, particle.progress - 0.15));
          
          if (particle.progress > 1.1) return null;
          
          const sourceStage = STAGES[particle.pathIndex];
          const particleColor = sourceStage?.color || "white";
          
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
                filter="url(#ai-particle-glow)"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};
