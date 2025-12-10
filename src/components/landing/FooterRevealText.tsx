import { useRef, useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DotPhilosophyModal } from "./DotPhilosophyModal";

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  size: number;
}

interface FooterRevealTextProps {
  className?: string;
}

// Time-based theme hook with moon phase calculation
const useTimeBasedTheme = () => {
  const [theme, setTheme] = useState(() => getTimeBasedColors());

  useEffect(() => {
    // Update every minute
    const interval = setInterval(() => {
      setTheme(getTimeBasedColors());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return theme;
};

// Calculate moon phase (0 = new moon, 0.5 = full moon, 1 = new moon again)
const getMoonPhase = (): number => {
  const now = new Date();
  // Known new moon: January 11, 2024
  const knownNewMoon = new Date(2024, 0, 11);
  const lunarCycle = 29.53059; // days
  const daysSinceNewMoon = (now.getTime() - knownNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const phase = (daysSinceNewMoon % lunarCycle) / lunarCycle;
  return phase;
};

// Get time-based colors for the glass effect
const getTimeBasedColors = () => {
  const hour = new Date().getHours();
  const moonPhase = getMoonPhase();
  
  // Calculate moon brightness (0 at new moon, 1 at full moon)
  const moonBrightness = 1 - Math.abs(moonPhase - 0.5) * 2;
  
  // Time periods with distinct color themes
  if (hour >= 5 && hour < 7) {
    // Dawn - warm pink/orange sunrise
    return {
      primary: "hsl(30, 80%, 85%)",
      secondary: "hsl(350, 60%, 80%)",
      highlight: "hsl(45, 90%, 90%)",
      glowOpacity: 0.6,
      glowColor: "hsl(30, 80%, 70%)",
      period: "dawn",
      moonBrightness: 0,
    };
  } else if (hour >= 7 && hour < 10) {
    // Morning - crisp bright white/light blue
    return {
      primary: "hsl(200, 30%, 95%)",
      secondary: "hsl(210, 40%, 90%)",
      highlight: "hsl(0, 0%, 100%)",
      glowOpacity: 0.5,
      glowColor: "hsl(200, 30%, 85%)",
      period: "morning",
      moonBrightness: 0,
    };
  } else if (hour >= 10 && hour < 16) {
    // Midday - pure silver/platinum
    return {
      primary: "hsl(0, 0%, 95%)",
      secondary: "hsl(0, 0%, 90%)",
      highlight: "hsl(0, 0%, 100%)",
      glowOpacity: 0.4,
      glowColor: "hsl(0, 0%, 95%)",
      period: "midday",
      moonBrightness: 0,
    };
  } else if (hour >= 16 && hour < 19) {
    // Golden Hour - warm amber/gold
    return {
      primary: "hsl(45, 70%, 85%)",
      secondary: "hsl(35, 80%, 75%)",
      highlight: "hsl(50, 90%, 90%)",
      glowOpacity: 0.7,
      glowColor: "hsl(45, 70%, 60%)",
      period: "golden",
      moonBrightness: 0,
    };
  } else if (hour >= 19 && hour < 21) {
    // Dusk - purple/magenta twilight
    return {
      primary: "hsl(280, 40%, 75%)",
      secondary: "hsl(260, 50%, 70%)",
      highlight: "hsl(300, 30%, 85%)",
      glowOpacity: 0.5,
      glowColor: "hsl(280, 40%, 60%)",
      period: "dusk",
      moonBrightness: moonBrightness * 0.3,
    };
  } else if (hour >= 21 || hour < 1) {
    // Night - cool blue moonlight
    const adjustedBrightness = 70 + moonBrightness * 20;
    return {
      primary: `hsl(220, 40%, ${adjustedBrightness}%)`,
      secondary: "hsl(230, 35%, 65%)",
      highlight: `hsl(0, 0%, ${85 + moonBrightness * 15}%)`,
      glowOpacity: 0.4 + moonBrightness * 0.3,
      glowColor: `hsl(220, 40%, ${60 + moonBrightness * 20}%)`,
      period: "night",
      moonBrightness,
    };
  } else {
    // Deep Night (1 AM - 5 AM) - deep blue with silver moon
    const adjustedBrightness = 60 + moonBrightness * 15;
    return {
      primary: `hsl(230, 30%, ${adjustedBrightness}%)`,
      secondary: "hsl(240, 25%, 55%)",
      highlight: `hsl(0, 0%, ${75 + moonBrightness * 25}%)`,
      glowOpacity: 0.3 + moonBrightness * 0.4,
      glowColor: `hsl(230, 30%, ${50 + moonBrightness * 25}%)`,
      period: "deepnight",
      moonBrightness,
    };
  }
};

export const FooterRevealText = ({ className = "" }: FooterRevealTextProps) => {
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
  const dotHoverTimer = useRef<NodeJS.Timeout | null>(null);
  const dotScaleAnimation = useRef<number | null>(null);
  const particleIdRef = useRef(0);

  // Get time-based theme colors
  const timeTheme = useTimeBasedTheme();

  // The dot is positioned at approximately x=930 in the "utm.one" text
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

    // Add particle dust (30% chance per move)
    if (Math.random() > 0.7) {
      const newParticle: Particle = {
        id: particleIdRef.current++,
        x: (x / rect.width) * 1800,
        y: (y / rect.height) * 400,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 3 + 1,
      };
      setParticles((prev) => [...prev.slice(-12), newParticle]);
    }
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setIsDotHovering(false);
    setFillPercent(0);
    setParticles([]);
    if (dotHoverTimer.current) {
      clearTimeout(dotHoverTimer.current);
      dotHoverTimer.current = null;
    }
  };

  const handleDotHover = () => {
    setIsDotHovering(true);
    setDotScale(1);
    
    // Smooth continuous scale growth animation
    const startTime = Date.now();
    const duration = 1500; // 1.5 seconds
    const maxScale = 8;
    
    const animateScale = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-in curve for accelerating growth
      const eased = progress * progress * progress;
      const newScale = 1 + (maxScale - 1) * eased;
      setDotScale(newScale);
      
      if (progress < 1) {
        dotScaleAnimation.current = requestAnimationFrame(animateScale);
      } else {
        // Animation complete, open modal
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

  // Remove particles after animation
  useEffect(() => {
    if (particles.length > 0) {
      const timer = setTimeout(() => {
        setParticles((prev) => prev.slice(1));
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [particles]);

  // Show subtle moon indicator during night hours
  const showMoon = timeTheme.period === "night" || timeTheme.period === "deepnight" || timeTheme.period === "dusk";

  return (
    <>
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`relative w-full cursor-crosshair select-none overflow-visible ${className}`}
      >
        <motion.svg
          viewBox="0 0 1800 400"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
          style={{ overflow: "visible" }}
          animate={{
            scale: isHovering ? 1.05 : 1,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <defs>
            {/* Time-Based Apple Frosted Glass Gradient */}
            <linearGradient id="appleGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={timeTheme.highlight} stopOpacity="0.95" />
              <stop offset="15%" stopColor={timeTheme.primary} stopOpacity="0.7" />
              <stop offset="40%" stopColor={timeTheme.secondary} stopOpacity="0.3" />
              <stop offset="60%" stopColor={timeTheme.secondary} stopOpacity="0.15" />
              <stop offset="85%" stopColor={timeTheme.primary} stopOpacity="0.4" />
              <stop offset="100%" stopColor={timeTheme.highlight} stopOpacity="0.8" />
            </linearGradient>

            {/* Stroke gradient for outline */}
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 40%)" />
              <stop offset="100%" stopColor="hsl(0, 0%, 20%)" />
            </linearGradient>

            {/* Time-Based Corner Glow Gradients */}
            <radialGradient id="cornerGlowTL" cx="0%" cy="0%" r="50%">
              <stop offset="0%" stopColor={timeTheme.glowColor} stopOpacity={timeTheme.glowOpacity} />
              <stop offset="100%" stopColor={timeTheme.glowColor} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowTR" cx="100%" cy="0%" r="50%">
              <stop offset="0%" stopColor={timeTheme.highlight} stopOpacity={timeTheme.glowOpacity * 0.7} />
              <stop offset="100%" stopColor={timeTheme.highlight} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowBL" cx="0%" cy="100%" r="50%">
              <stop offset="0%" stopColor={timeTheme.secondary} stopOpacity={timeTheme.glowOpacity * 0.5} />
              <stop offset="100%" stopColor={timeTheme.secondary} stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowBR" cx="100%" cy="100%" r="50%">
              <stop offset="0%" stopColor={timeTheme.primary} stopOpacity={timeTheme.glowOpacity * 0.8} />
              <stop offset="100%" stopColor={timeTheme.primary} stopOpacity="0" />
            </radialGradient>

            {/* Diagonal Shimmer Sweep */}
            <linearGradient id="shimmerSweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={timeTheme.highlight} stopOpacity="0">
                <animate
                  attributeName="offset"
                  values="-0.5;1.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="15%" stopColor={timeTheme.highlight} stopOpacity="0.5">
                <animate
                  attributeName="offset"
                  values="-0.35;1.65"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="30%" stopColor={timeTheme.highlight} stopOpacity="0">
                <animate
                  attributeName="offset"
                  values="-0.2;1.8"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Glass Depth Filter with Dynamic Specular Lighting */}
            <filter id="glassDepth" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
              <feSpecularLighting 
                in="blur" 
                surfaceScale={isHovering ? 5 : 3}
                specularConstant="1.2" 
                specularExponent="30" 
                lightingColor={timeTheme.highlight}
                result="specular"
              >
                <fePointLight x={mousePos.x} y={mousePos.y - 200} z="600"/>
              </feSpecularLighting>
              <feComposite in="specular" in2="SourceAlpha" operator="in" result="specularClipped"/>
              <feComposite in="SourceGraphic" in2="specularClipped" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0"/>
            </filter>

            {/* Outer Glow Filter */}
            <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="coloredBlur"/>
              <feFlood floodColor={timeTheme.glowColor} floodOpacity="0.4"/>
              <feComposite in2="coloredBlur" operator="in" result="glow"/>
              <feMerge>
                <feMergeNode in="glow"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Dot Zoom Glow - dynamic based on scale */}
            <filter id="dotGlow" x="-200%" y="-200%" width="500%" height="500%">
              <feGaussianBlur stdDeviation={isDotHovering ? Math.min(dotScale * 8, 60) : 15} result="blur" />
              <feFlood floodColor="hsl(45, 100%, 95%)" floodOpacity={Math.min(dotScale * 0.15, 0.9)} result="flood" />
              <feComposite in="flood" in2="blur" operator="in" result="glow" />
              <feMerge>
                <feMergeNode in="glow" />
                <feMergeNode in="glow" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            
            {/* Radial glow for zoom effect */}
            <radialGradient id="dotZoomGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(45, 100%, 98%)" stopOpacity="1" />
              <stop offset="40%" stopColor="hsl(45, 80%, 90%)" stopOpacity="0.8" />
              <stop offset="100%" stopColor="hsl(45, 60%, 80%)" stopOpacity="0" />
            </radialGradient>

            {/* Clip path for reveal animation */}
            <clipPath id="footerRevealClip">
              <motion.rect
                x="0"
                y="0"
                height="400"
                animate={{
                  width: isHovering ? (fillPercent / 100) * 1800 : 0,
                }}
                transition={{ duration: 0.08, ease: "easeOut" }}
              />
            </clipPath>

            {/* Text clip path for corner glows */}
            <clipPath id="textClip">
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

            {/* Moon glow for night hours */}
            <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity={0.9 * timeTheme.moonBrightness} />
              <stop offset="60%" stopColor="hsl(220, 30%, 90%)" stopOpacity={0.4 * timeTheme.moonBrightness} />
              <stop offset="100%" stopColor="hsl(220, 30%, 80%)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Subtle moon indicator during night (top right corner) */}
          {showMoon && timeTheme.moonBrightness > 0.1 && (
            <g>
              <circle
                cx="1700"
                cy="50"
                r={15 + timeTheme.moonBrightness * 5}
                fill="url(#moonGlow)"
                style={{ opacity: 0.6 }}
              />
              <circle
                cx="1700"
                cy="50"
                r={8 + timeTheme.moonBrightness * 4}
                fill="hsl(0, 0%, 95%)"
                style={{ opacity: 0.3 + timeTheme.moonBrightness * 0.5 }}
              />
            </g>
          )}

          {/* Particle dust following cursor */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y}
                r={particle.size}
                fill={timeTheme.highlight}
                initial={{ opacity: particle.opacity, scale: 1 }}
                animate={{ opacity: 0, scale: 0, cy: particle.y - 40 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          {/* Stroke-only text (always visible) */}
          <text
            x="900"
            y="290"
            textAnchor="middle"
            className="font-display font-bold"
            style={{
              fontSize: "380px",
              fill: "transparent",
              stroke: "hsl(0, 0%, 22%)",
              strokeWidth: "2px",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              letterSpacing: "-0.05em",
            }}
          >
            utm.one
          </text>

          {/* Apple Glass filled text (revealed on hover) */}
          <g clipPath="url(#footerRevealClip)">
            {/* Main glass fill */}
            <text
              x="900"
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              filter={isHovering ? "url(#glassDepth)" : undefined}
              style={{
                fontSize: "380px",
                fill: "url(#appleGlass)",
                stroke: "url(#strokeGradient)",
                strokeWidth: "1.5px",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                letterSpacing: "-0.05em",
              }}
            >
              utm.one
            </text>

            {/* Corner glow overlays - clipped to text shape */}
            {isHovering && (
              <g clipPath="url(#textClip)">
                <motion.rect
                  x="0"
                  y="0"
                  width="900"
                  height="200"
                  fill="url(#cornerGlowTL)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <motion.rect
                  x="900"
                  y="0"
                  width="900"
                  height="200"
                  fill="url(#cornerGlowTR)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                />
                <motion.rect
                  x="0"
                  y="200"
                  width="900"
                  height="200"
                  fill="url(#cornerGlowBL)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                />
                <motion.rect
                  x="900"
                  y="200"
                  width="900"
                  height="200"
                  fill="url(#cornerGlowBR)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.9 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
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
                  fill: "url(#shimmerSweep)",
                  letterSpacing: "-0.05em",
                  pointerEvents: "none",
                }}
              >
                utm.one
              </text>
            )}
          </g>

          {/* Interactive dot overlay - for click/hover detection with smooth zoom */}
          <g
            style={{ cursor: "pointer" }}
            onMouseEnter={handleDotHover}
            onMouseLeave={handleDotLeave}
            onClick={handleDotClick}
          >
            {/* Invisible larger hit area for easier hover - centered on dot */}
            <rect
              x={DOT_X - 60}
              y="80"
              width="120"
              height="280"
              fill="transparent"
            />
            
            {/* Growing glow circle behind dot */}
            {isDotHovering && (
              <circle
                cx={DOT_X}
                cy={DOT_Y}
                r={30 * dotScale}
                fill="url(#dotZoomGlow)"
                style={{
                  opacity: Math.min(dotScale * 0.2, 1),
                  filter: `blur(${dotScale * 2}px)`,
                }}
              />
            )}
            
            {/* The dot itself with smooth scale */}
            <text
              ref={dotRef}
              x={DOT_X}
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              style={{
                fontSize: "380px",
                fill: isDotHovering ? "hsl(45, 100%, 97%)" : "transparent",
                letterSpacing: "-0.05em",
                transform: isDotHovering ? `scale(${dotScale})` : "scale(1)",
                transformOrigin: `${DOT_X}px ${DOT_Y}px`,
                transition: "fill 0.2s ease",
                filter: isDotHovering ? "url(#dotGlow)" : undefined,
              }}
            >
              .
            </text>
            
            {/* Expanding ring waves */}
            {isDotHovering && dotScale > 1.5 && (
              <>
                <circle
                  cx={DOT_X}
                  cy={DOT_Y}
                  r={50 * (dotScale * 0.5)}
                  fill="none"
                  stroke="hsl(0, 0%, 100%)"
                  strokeWidth={1 / dotScale}
                  style={{ opacity: 0.4 / dotScale }}
                />
                <circle
                  cx={DOT_X}
                  cy={DOT_Y}
                  r={80 * (dotScale * 0.4)}
                  fill="none"
                  stroke="hsl(0, 0%, 100%)"
                  strokeWidth={0.5 / dotScale}
                  style={{ opacity: 0.2 / dotScale }}
                />
              </>
            )}
          </g>

          {/* Outer glow on hover */}
          {isHovering && (
            <motion.text
              x="900"
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              clipPath="url(#footerRevealClip)"
              filter="url(#outerGlow)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ duration: 0.3 }}
              style={{
                fontSize: "380px",
                fill: "transparent",
                stroke: timeTheme.highlight,
                strokeWidth: "1px",
                letterSpacing: "-0.05em",
                pointerEvents: "none",
              }}
            >
              utm.one
            </motion.text>
          )}
        </motion.svg>
      </div>

      <DotPhilosophyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dotPosition={dotPosition}
      />
    </>
  );
};
