import { useRef, useState, useEffect } from "react";
import { DotPhilosophyModal } from "./DotPhilosophyModal";

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
  createdAt: number;
}

interface FooterRevealTextLightProps {
  className?: string;
}

// Time-based theme hook with inverted colors for light backgrounds
const useTimeBasedThemeLight = () => {
  const [theme, setTheme] = useState(() => getTimeBasedColorsLight());

  useEffect(() => {
    const interval = setInterval(() => {
      setTheme(getTimeBasedColorsLight());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return theme;
};

// Get time-based colors for light theme (inverted from dark version)
const getTimeBasedColorsLight = () => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 7) {
    // Dawn - warm orange/amber on light
    return {
      primary: "hsl(30, 60%, 25%)",
      secondary: "hsl(350, 50%, 30%)",
      highlight: "hsl(45, 70%, 20%)",
      glowOpacity: 0.3,
      glowColor: "hsl(30, 60%, 40%)",
      period: "dawn",
    };
  } else if (hour >= 7 && hour < 10) {
    // Morning - cool blue-gray
    return {
      primary: "hsl(210, 30%, 20%)",
      secondary: "hsl(200, 25%, 30%)",
      highlight: "hsl(0, 0%, 15%)",
      glowOpacity: 0.25,
      glowColor: "hsl(210, 30%, 35%)",
      period: "morning",
    };
  } else if (hour >= 10 && hour < 16) {
    // Midday - pure dark gray/charcoal
    return {
      primary: "hsl(0, 0%, 18%)",
      secondary: "hsl(0, 0%, 25%)",
      highlight: "hsl(0, 0%, 12%)",
      glowOpacity: 0.2,
      glowColor: "hsl(0, 0%, 30%)",
      period: "midday",
    };
  } else if (hour >= 16 && hour < 19) {
    // Golden Hour - warm amber/brown
    return {
      primary: "hsl(35, 50%, 25%)",
      secondary: "hsl(45, 60%, 30%)",
      highlight: "hsl(40, 70%, 18%)",
      glowOpacity: 0.35,
      glowColor: "hsl(40, 50%, 35%)",
      period: "golden",
    };
  } else if (hour >= 19 && hour < 21) {
    // Dusk - purple/indigo
    return {
      primary: "hsl(270, 35%, 30%)",
      secondary: "hsl(260, 40%, 35%)",
      highlight: "hsl(280, 30%, 25%)",
      glowOpacity: 0.3,
      glowColor: "hsl(270, 35%, 40%)",
      period: "dusk",
    };
  } else {
    // Night - deep blue
    return {
      primary: "hsl(220, 35%, 25%)",
      secondary: "hsl(230, 30%, 30%)",
      highlight: "hsl(220, 40%, 20%)",
      glowOpacity: 0.25,
      glowColor: "hsl(220, 35%, 35%)",
      period: "night",
    };
  }
};

export const FooterRevealTextLight = ({ className = "" }: FooterRevealTextLightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGTextElement>(null);
  const [fillPercent, setFillPercent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDotHovering, setIsDotHovering] = useState(false);
  const [dotScale, setDotScale] = useState(1);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 900, y: 200 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [cornerGlowOpacity, setCornerGlowOpacity] = useState([0, 0, 0, 0]);
  const [outerGlowOpacity, setOuterGlowOpacity] = useState(0);
  const dotHoverTimer = useRef<NodeJS.Timeout | null>(null);
  const dotScaleAnimation = useRef<number | null>(null);
  const particleIdRef = useRef(0);

  const timeTheme = useTimeBasedThemeLight();

  const DOT_X = 930;
  const DOT_Y = 220;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setFillPercent(percent);
    setMousePos({ x: (x / rect.width) * 1800, y: (y / rect.height) * 400 });

    if (Math.random() > 0.7) {
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: (x / rect.width) * 1800,
        y: (y / rect.height) * 400,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 3 + 1,
        createdAt: Date.now(),
      };
      setParticles((prev) => [...prev.slice(-12), newParticle]);
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    // Animate corner glows with staggered delays
    setTimeout(() => setCornerGlowOpacity(prev => [1, prev[1], prev[2], prev[3]]), 0);
    setTimeout(() => setCornerGlowOpacity(prev => [prev[0], 0.8, prev[2], prev[3]]), 100);
    setTimeout(() => setCornerGlowOpacity(prev => [prev[0], prev[1], 0.6, prev[3]]), 150);
    setTimeout(() => setCornerGlowOpacity(prev => [prev[0], prev[1], prev[2], 0.9]), 200);
    setTimeout(() => setOuterGlowOpacity(0.3), 0);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsDotHovering(false);
    setFillPercent(0);
    setParticles([]);
    setCornerGlowOpacity([0, 0, 0, 0]);
    setOuterGlowOpacity(0);
    if (dotHoverTimer.current) {
      clearTimeout(dotHoverTimer.current);
      dotHoverTimer.current = null;
    }
  };

  const handleDotHover = () => {
    setIsDotHovering(true);
    setDotScale(1);
    
    const startTime = Date.now();
    const duration = 1500;
    const maxScale = 8;
    
    const animateScale = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress * progress * progress;
      const newScale = 1 + (maxScale - 1) * eased;
      setDotScale(newScale);
      
      if (progress < 1) {
        dotScaleAnimation.current = requestAnimationFrame(animateScale);
      } else {
        openModal();
      }
    };
    
    dotScaleAnimation.current = requestAnimationFrame(animateScale);
  };

  const handleDotLeave = () => {
    setIsDotHovering(false);
    setDotScale(1);
    if (dotHoverTimer.current) {
      clearTimeout(dotHoverTimer.current);
      dotHoverTimer.current = null;
    }
    if (dotScaleAnimation.current) {
      cancelAnimationFrame(dotScaleAnimation.current);
      dotScaleAnimation.current = null;
    }
  };

  const openModal = () => {
    if (dotRef.current) {
      const rect = dotRef.current.getBoundingClientRect();
      setDotPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    }
    setIsModalOpen(true);
  };

  const handleDotClick = () => {
    if (dotHoverTimer.current) {
      clearTimeout(dotHoverTimer.current);
      dotHoverTimer.current = null;
    }
    if (dotScaleAnimation.current) {
      cancelAnimationFrame(dotScaleAnimation.current);
      dotScaleAnimation.current = null;
    }
    openModal();
  };

  // Particle cleanup with CSS-based fade out
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  // Calculate clip width for reveal animation
  const clipWidth = isHovering ? (fillPercent / 100) * 1800 : 0;

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full cursor-crosshair select-none overflow-visible ${className}`}
      >
        <svg
          viewBox="0 0 1800 400"
          className="w-full h-auto transition-transform duration-400 ease-out"
          preserveAspectRatio="xMidYMid meet"
          style={{ 
            overflow: "visible",
            transform: isHovering ? "scale(1.05)" : "scale(1)"
          }}
        >
          <defs>
            {/* Light theme glass gradient - dark fill */}
            <linearGradient id="appleGlassLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={timeTheme.highlight} stopOpacity="0.95" />
              <stop offset="15%" stopColor={timeTheme.primary} stopOpacity="0.8" />
              <stop offset="40%" stopColor={timeTheme.secondary} stopOpacity="0.5" />
              <stop offset="60%" stopColor={timeTheme.secondary} stopOpacity="0.4" />
              <stop offset="85%" stopColor={timeTheme.primary} stopOpacity="0.7" />
              <stop offset="100%" stopColor={timeTheme.highlight} stopOpacity="0.9" />
            </linearGradient>

            {/* Stroke gradient for outline - light theme */}
            <linearGradient id="strokeGradientLight" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 70%)" />
              <stop offset="100%" stopColor="hsl(0, 0%, 80%)" />
            </linearGradient>

            {/* Corner glow gradients - darker for light bg */}
            <radialGradient id="cornerGlowTLLight" cx="0%" cy="0%" r="50%">
              <stop offset="0%" stopColor={timeTheme.glowColor} stopOpacity={timeTheme.glowOpacity} />
              <stop offset="100%" stopColor={timeTheme.glowColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowTRLight" cx="100%" cy="0%" r="50%">
              <stop offset="0%" stopColor={timeTheme.highlight} stopOpacity={timeTheme.glowOpacity * 0.7} />
              <stop offset="100%" stopColor={timeTheme.highlight} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowBLLight" cx="0%" cy="100%" r="50%">
              <stop offset="0%" stopColor={timeTheme.secondary} stopOpacity={timeTheme.glowOpacity * 0.5} />
              <stop offset="100%" stopColor={timeTheme.secondary} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowBRLight" cx="100%" cy="100%" r="50%">
              <stop offset="0%" stopColor={timeTheme.primary} stopOpacity={timeTheme.glowOpacity * 0.8} />
              <stop offset="100%" stopColor={timeTheme.primary} stopOpacity="0" />
            </radialGradient>

            {/* Shimmer sweep - darker */}
            <linearGradient id="shimmerSweepLight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={timeTheme.highlight} stopOpacity="0">
                <animate attributeName="offset" values="-0.5;1.5" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="15%" stopColor={timeTheme.highlight} stopOpacity="0.4">
                <animate attributeName="offset" values="-0.35;1.65" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="30%" stopColor={timeTheme.highlight} stopOpacity="0">
                <animate attributeName="offset" values="-0.2;1.8" dur="2s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Glass depth filter */}
            <filter id="glassDepthLight" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
              <feSpecularLighting 
                in="blur" 
                surfaceScale={isHovering ? 5 : 3}
                specularConstant="0.8" 
                specularExponent="25" 
                lightingColor="hsl(0, 0%, 40%)"
                result="specular"
              >
                <fePointLight x={mousePos.x} y={mousePos.y - 200} z="600"/>
              </feSpecularLighting>
              <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularClipped"/>
              <feComposite in="SourceGraphic" in2="specularClipped" operator="arithmetic" k1="0" k2="1" k3="0.4" k4="0"/>
            </filter>

            {/* Outer glow filter */}
            <filter id="outerGlowLight" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
              <feFlood floodColor={timeTheme.glowColor} floodOpacity="0.3"/>
              <feComposite in2="coloredBlur" operator="in" result="glow"/>
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Dot glow - golden for light theme */}
            <filter id="dotGlowLight" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation={isDotHovering ? Math.min(dotScale * 8, 60) : 15} result="blur" />
              <feFlood floodColor="hsl(45, 80%, 35%)" floodOpacity={Math.min(dotScale * 0.15, 0.9)} result="flood" />
              <feComposite in="flood" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            <radialGradient id="dotZoomGlowLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(45, 80%, 30%)" stopOpacity="1" />
              <stop offset="40%" stopColor="hsl(45, 60%, 40%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(45, 40%, 50%)" stopOpacity="0" />
            </radialGradient>

            {/* Clip path for reveal animation - using CSS transition */}
            <clipPath id="footerRevealClipLight">
              <rect
                x="0"
                y="0"
                height="400"
                width={clipWidth}
                style={{ transition: "width 0.08s ease-out" }}
              />
            </clipPath>

            {/* Text clip path for corner glows */}
            <clipPath id="textClipLight">
              <text
                x="900"
                y="290"
                textAnchor="middle"
                className="font-display font-bold"
                style={{
                  fontSize: "380px",
                  letterSpacing: "-0.05em",
                }}
              >
                utm.one
              </text>
            </clipPath>
          </defs>

          {/* Particle dust - CSS transitions */}
          {particles.map((particle) => {
            const age = Date.now() - particle.createdAt;
            const fadeProgress = Math.min(age / 800, 1);
            return (
              <circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y - (fadeProgress * 40)}
                r={particle.size * (1 - fadeProgress)}
                fill={timeTheme.secondary}
                style={{
                  opacity: particle.opacity * (1 - fadeProgress),
                  transition: "opacity 0.8s ease-out, cy 0.8s ease-out, r 0.8s ease-out"
                }}
              />
            );
          })}

          {/* Stroke-only text (always visible) - light gray on light bg */}
          <text
            x="900"
            y="290"
            textAnchor="middle"
            className="font-display font-bold"
            style={{
              fontSize: "380px",
              fill: "transparent",
              stroke: "hsl(0, 0%, 82%)",
              strokeWidth: "2px",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              letterSpacing: "-0.05em",
            }}
          >
            utm.one
          </text>

          {/* Glass filled text (revealed on hover) - dark fill */}
          <g clipPath="url(#footerRevealClipLight)">
            <text
              x="900"
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              filter={isHovering ? "url(#glassDepthLight)" : undefined}
              style={{
                fontSize: "380px",
                fill: "url(#appleGlassLight)",
                stroke: "url(#strokeGradientLight)",
                strokeWidth: "1.5px",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                letterSpacing: "-0.05em",
              }}
            >
              utm.one
            </text>

            {/* Corner glow overlays - CSS transitions */}
            {isHovering && (
              <g clipPath="url(#textClipLight)">
                <rect
                  x="0" y="0" width="900" height="200"
                  fill="url(#cornerGlowTLLight)"
                  style={{ 
                    opacity: cornerGlowOpacity[0],
                    transition: "opacity 0.4s ease-out"
                  }}
                />
                <rect
                  x="900" y="0" width="900" height="200"
                  fill="url(#cornerGlowTRLight)"
                  style={{ 
                    opacity: cornerGlowOpacity[1],
                    transition: "opacity 0.4s ease-out"
                  }}
                />
                <rect
                  x="0" y="200" width="900" height="200"
                  fill="url(#cornerGlowBLLight)"
                  style={{ 
                    opacity: cornerGlowOpacity[2],
                    transition: "opacity 0.4s ease-out"
                  }}
                />
                <rect
                  x="900" y="200" width="900" height="200"
                  fill="url(#cornerGlowBRLight)"
                  style={{ 
                    opacity: cornerGlowOpacity[3],
                    transition: "opacity 0.4s ease-out"
                  }}
                />
              </g>
            )}

            {/* Shimmer sweep overlay */}
            {isHovering && (
              <text
                x="900"
                y="290"
                textAnchor="middle"
                className="font-display font-bold"
                style={{
                  fontSize: "380px",
                  fill: "url(#shimmerSweepLight)",
                  letterSpacing: "-0.05em",
                  pointerEvents: "none",
                }}
              >
                utm.one
              </text>
            )}
          </g>

          {/* Interactive dot overlay */}
          <g
            style={{ cursor: "pointer" }}
            onMouseEnter={handleDotHover}
            onMouseLeave={handleDotLeave}
            onClick={handleDotClick}
          >
            <rect
              x={DOT_X - 60}
              y="80"
              width="120"
              height="280"
              fill="transparent"
            />
            
            {isDotHovering && (
              <circle
                cx={DOT_X}
                cy={DOT_Y}
                r={30 * dotScale}
                fill="url(#dotZoomGlowLight)"
                style={{
                  opacity: Math.min(dotScale * 0.2, 1),
                  filter: `blur(${dotScale * 2}px)`,
                }}
              />
            )}
            
            <text
              ref={dotRef}
              x={DOT_X}
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              style={{
                fontSize: "380px",
                fill: isDotHovering ? "hsl(45, 80%, 30%)" : "transparent",
                letterSpacing: "-0.05em",
                transform: isDotHovering ? `scale(${dotScale})` : "scale(1)",
                transformOrigin: `${DOT_X}px ${DOT_Y}px`,
                transition: "fill 0.2s ease",
                filter: isDotHovering ? "url(#dotGlowLight)" : undefined,
              }}
            >
              .
            </text>
            
            {isDotHovering && dotScale > 1.5 && (
              <>
                <circle
                  cx={DOT_X}
                  cy={DOT_Y}
                  r={50 * (dotScale * 0.5)}
                  fill="none"
                  stroke="hsl(0, 0%, 30%)"
                  strokeWidth={1 / dotScale}
                  style={{ opacity: 0.4 / dotScale }}
                />
                <circle
                  cx={DOT_X}
                  cy={DOT_Y}
                  r={80 * (dotScale * 0.4)}
                  fill="none"
                  stroke="hsl(0, 0%, 30%)"
                  strokeWidth={0.5 / dotScale}
                  style={{ opacity: 0.2 / dotScale }}
                />
              </>
            )}
          </g>

          {/* Outer glow on hover - CSS transition */}
          {isHovering && (
            <text
              x="900"
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              clipPath="url(#footerRevealClipLight)"
              filter="url(#outerGlowLight)"
              style={{
                fontSize: "380px",
                fill: "transparent",
                stroke: timeTheme.highlight,
                strokeWidth: "1px",
                letterSpacing: "-0.05em",
                pointerEvents: "none",
                opacity: outerGlowOpacity,
                transition: "opacity 0.3s ease-out"
              }}
            >
              utm.one
            </text>
          )}
        </svg>
      </div>

      <DotPhilosophyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dotPosition={dotPosition}
      />
    </>
  );
};
