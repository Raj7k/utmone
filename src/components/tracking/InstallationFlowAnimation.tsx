import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface Particle {
  id: number;
  pathIndex: number;
  progress: number;
  speed: number;
}

const InstallationFlowAnimation: React.FC<{ className?: string }> = ({ className }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pathLengths, setPathLengths] = useState<number[]>([]);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Path definitions for data flow
  const paths = [
    // Website → Pixel
    "M 60 80 Q 120 80 160 80",
    // Pixel → Pageview
    "M 200 70 Q 260 50 320 50",
    // Pixel → Identity
    "M 200 80 Q 260 80 320 80",
    // Pixel → Revenue
    "M 200 90 Q 260 110 320 110",
    // Pageview → Analytics
    "M 360 50 Q 420 65 480 80",
    // Identity → Analytics
    "M 360 80 Q 420 80 480 80",
    // Revenue → Analytics
    "M 360 110 Q 420 95 480 80",
  ];

  const nodes = [
    { x: 40, y: 80, label: "your website", icon: "🌐" },
    { x: 180, y: 80, label: "utm.one pixel", icon: "📍" },
    { x: 340, y: 50, label: "pageview", icon: "👁" },
    { x: 340, y: 80, label: "identity", icon: "👤" },
    { x: 340, y: 110, label: "revenue", icon: "💰" },
    { x: 500, y: 80, label: "analytics", icon: "📊" },
  ];

  useEffect(() => {
    if (!svgRef.current) return;

    // Calculate path lengths
    const lengths = paths.map((_, index) => {
      const path = svgRef.current?.querySelector(`#flow-path-${index}`) as SVGPathElement;
      return path?.getTotalLength() || 200;
    });
    setPathLengths(lengths);

    // Initialize particles
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 12; i++) {
      initialParticles.push({
        id: i,
        pathIndex: i % paths.length,
        progress: Math.random(),
        speed: 0.003 + Math.random() * 0.002,
      });
    }
    setParticles(initialParticles);
  }, []);

  useEffect(() => {
    if (pathLengths.length === 0) return;

    const animate = (time: number) => {
      // Throttle to ~30fps
      if (time - lastTimeRef.current < 33) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTimeRef.current = time;

      setParticles(prev => prev.map(particle => {
        let newProgress = particle.progress + particle.speed;
        if (newProgress > 1) {
          newProgress = 0;
          // Randomly assign new path
          return {
            ...particle,
            progress: 0,
            pathIndex: Math.floor(Math.random() * paths.length),
            speed: 0.003 + Math.random() * 0.002,
          };
        }
        return { ...particle, progress: newProgress };
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [pathLengths]);

  const getPointOnPath = (pathIndex: number, progress: number) => {
    if (!svgRef.current || pathLengths.length === 0) return { x: 0, y: 0 };
    const path = svgRef.current.querySelector(`#flow-path-${pathIndex}`) as SVGPathElement;
    if (!path) return { x: 0, y: 0 };
    const length = pathLengths[pathIndex];
    const point = path.getPointAtLength(progress * length);
    return { x: point.x, y: point.y };
  };

  return (
    <div className={cn(
      "relative w-full rounded-xl overflow-hidden border",
      // Light mode: light background with subtle border
      "bg-zinc-100 border-zinc-200",
      // Dark mode: dark background with subtle border
      "dark:bg-zinc-950/50 dark:border-white/5",
      className
    )}>
      <svg
        ref={svgRef}
        viewBox="0 0 540 160"
        className="w-full h-auto"
        style={{ minHeight: '140px' }}
      >
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          <linearGradient id="particleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0"/>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="1"/>
          </linearGradient>
        </defs>

        {/* Flow paths - theme-aware wire colors */}
        {paths.map((d, index) => (
          <path
            key={index}
            id={`flow-path-${index}`}
            d={d}
            fill="none"
            className="stroke-zinc-300 dark:stroke-white/[0.06]"
            strokeWidth="1.5"
          />
        ))}

        {/* Animated particles */}
        {particles.map(particle => {
          const point = getPointOnPath(particle.pathIndex, particle.progress);
          const prevPoint = getPointOnPath(particle.pathIndex, Math.max(0, particle.progress - 0.08));
          
          return (
            <g key={particle.id}>
              {/* Comet tail */}
              <line
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke="url(#particleGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Particle head */}
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill="hsl(var(--primary))"
                filter="url(#glow)"
              />
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, index) => (
          <g key={index}>
            {/* Outer ring - theme aware */}
            <circle
              cx={node.x}
              cy={node.y}
              r="16"
              className="fill-zinc-200 stroke-zinc-300 dark:fill-black/60 dark:stroke-white/10"
              strokeWidth="1"
            />
            {/* Inner dot - theme aware */}
            <circle
              cx={node.x}
              cy={node.y}
              r="10"
              className="fill-zinc-300/50 dark:fill-white/5"
            />
            {/* Icon */}
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fontSize="10"
            >
              {node.icon}
            </text>
            {/* Label - theme aware */}
            <text
              x={node.x}
              y={node.y + 30}
              textAnchor="middle"
              className="fill-zinc-500 dark:fill-white/50"
              fontSize="8"
              fontFamily="ui-monospace, monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Glass overlay - theme aware */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-zinc-100/50 dark:from-background/20 to-transparent" />
    </div>
  );
};

export default InstallationFlowAnimation;
