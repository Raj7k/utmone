import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleIcon, LinkedInIcon, HubSpotIcon } from "@/components/icons/SocialIcons";
import { Users } from "lucide-react";

interface Particle {
  id: number;
  pathIndex: number;
  progress: number;
  speed: number;
}

const SOURCES = [
  { id: "paid", label: "Paid", y: 30, icon: GoogleIcon, color: "#4285F4" },
  { id: "organic", label: "Organic", y: 70, icon: LinkedInIcon, color: "#0A66C2" },
  { id: "email", label: "Email", y: 110, icon: HubSpotIcon, color: "#FF7A59" },
  { id: "referral", label: "Referral", y: 150, icon: Users, color: "#8B5CF6" },
];

export const FiberOpticGraph = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [revenueGlow, setRevenueGlow] = useState(false);
  const particleIdRef = useRef(0);
  const [mounted, setMounted] = useState(false);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Dimensions - compact for first fold
  const width = 460;
  const height = 200;
  const leftX = 90;
  const rightX = width - 50;
  const rightY = height / 2;

  // Generate bezier path for each source - memoized
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

  // Spawn particles at intervals - reduced frequency
  useEffect(() => {
    if (!mounted) return;
    
    const spawnParticle = () => {
      const pathIndex = Math.floor(Math.random() * SOURCES.length);
      const newParticle: Particle = {
        id: particleIdRef.current++,
        pathIndex,
        progress: 0,
        speed: 0.008 + Math.random() * 0.004, // Slightly faster
      };
      setParticles(prev => [...prev.slice(-12), newParticle]); // Reduced max to 12
    };

    // Initial spawn - fewer particles
    for (let i = 0; i < 3; i++) {
      setTimeout(() => spawnParticle(), i * 300);
    }

    const interval = setInterval(spawnParticle, 1200); // Less frequent spawning
    return () => clearInterval(interval);
  }, [mounted]);

  // Throttled animation loop - 30fps instead of 60fps
  useEffect(() => {
    if (!mounted) return;
    
    const animate = (timestamp: number) => {
      // Throttle to ~30fps
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
          setRevenueGlow(true);
          setTimeout(() => setRevenueGlow(false), 150);
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

  // Get point on path at given progress
  const getPointOnPath = (pathIndex: number, progress: number) => {
    if (!svgRef.current) return { x: 0, y: 0 };
    
    const pathEl = svgRef.current.querySelector(`#fiber-path-${pathIndex}`) as SVGPathElement;
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
        {/* Definitions for filters */}
        <defs>
          {/* Particle glow */}
          <filter id="particle-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Revenue node glow */}
          <filter id="revenue-glow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Platinum gradient */}
          <linearGradient id="platinum-text" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A1A1AA" />
          </linearGradient>
        </defs>

        {/* Wire paths (thin, barely visible) */}
        {paths.map((path, index) => (
          <path
            key={`wire-${index}`}
            id={`fiber-path-${index}`}
            d={path}
            fill="none"
            className="stroke-white/[0.06]"
            strokeWidth="1"
          />
        ))}

        {/* Source nodes (left side) */}
        {SOURCES.map((source, index) => {
          const Icon = source.icon;
          return (
            <g key={source.id}>
              {/* Terminal dot with brand color */}
              <circle
                cx={leftX}
                cy={source.y}
                r="3"
                fill={source.color}
                style={{ opacity: 0.8 }}
              />
              {/* Outer ring with brand color */}
              <circle
                cx={leftX}
                cy={source.y}
                r="6"
                fill="none"
                stroke={source.color}
                strokeWidth="1"
                style={{ opacity: 0.3 }}
              />
              {/* Brand icon + label */}
              <foreignObject x={leftX - 75} y={source.y - 10} width="60" height="20">
                <div className="flex items-center gap-1.5 justify-end h-full">
                  <Icon className="w-3.5 h-3.5" style={{ color: source.color }} />
                  <span className="text-[9px] text-white/50 font-mono">{source.label}</span>
                </div>
              </foreignObject>
            </g>
          );
        })}

        {/* Destination node (Revenue) */}
        <g>
          {/* Outer ring with glow - CSS transition instead of framer-motion */}
          <circle
            cx={rightX}
            cy={rightY}
            r="18"
            fill="none"
            className={`transition-all duration-100 ${revenueGlow ? "stroke-white/95" : "stroke-white/25"}`}
            strokeWidth="1.5"
            filter={revenueGlow ? "url(#revenue-glow)" : undefined}
            style={{ 
              transform: `scale(${revenueGlow ? 1.15 : 1})`,
              transformOrigin: `${rightX}px ${rightY}px`
            }}
          />
          {/* Inner ring */}
          <circle
            cx={rightX}
            cy={rightY}
            r="10"
            fill="none"
            className="stroke-white/[0.12]"
            strokeWidth="1"
          />
          {/* Center dot */}
          <circle
            cx={rightX}
            cy={rightY}
            r="3"
            className="fill-white/80"
          />
        </g>

        {/* Revenue label */}
        <text
          x={rightX}
          y={rightY + 35}
          textAnchor="middle"
          className="text-[8px] fill-white/40 font-mono tracking-widest"
        >
          REVENUE
        </text>

        {/* Revenue amount */}
        <text
          x={rightX}
          y={rightY + 50}
          textAnchor="middle"
          className="text-[14px] font-semibold"
          fill="url(#platinum-text)"
        >
          $1.2M
        </text>

        {/* Animated particles */}
        {particles.map((particle) => {
          const point = getPointOnPath(particle.pathIndex, particle.progress);
          const prevPoint = getPointOnPath(particle.pathIndex, Math.max(0, particle.progress - 0.12));
          
          if (particle.progress > 1.1) return null;
          
            const particleColor = SOURCES[particle.pathIndex]?.color || "white";
          
            return (
            <g key={particle.id}>
              {/* Tail line with brand color */}
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
              {/* Particle head with brand color */}
              <circle
                cx={point.x}
                cy={point.y}
                r="2"
                fill={particleColor}
                filter="url(#particle-glow)"
              />
            </g>
          );
        })}
      </svg>

    </div>
  );
};
