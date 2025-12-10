import { useRef, useState, useEffect } from "react";
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
            {/* Apple Frosted Glass Gradient - 6 stops for depth */}
            <linearGradient id="appleGlass" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.95" />
              <stop offset="15%" stopColor="hsl(220, 10%, 95%)" stopOpacity="0.7" />
              <stop offset="40%" stopColor="hsl(220, 5%, 85%)" stopOpacity="0.3" />
              <stop offset="60%" stopColor="hsl(220, 5%, 80%)" stopOpacity="0.15" />
              <stop offset="85%" stopColor="hsl(220, 10%, 90%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.8" />
            </linearGradient>

            {/* Stroke gradient for outline */}
            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 40%)" />
              <stop offset="100%" stopColor="hsl(0, 0%, 20%)" />
            </linearGradient>

            {/* Corner Glow Gradients */}
            <radialGradient id="cornerGlowTL" cx="0%" cy="0%" r="50%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowTR" cx="100%" cy="0%" r="50%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowBL" cx="0%" cy="100%" r="50%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cornerGlowBR" cx="100%" cy="100%" r="50%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0" />
            </radialGradient>

            {/* Diagonal Shimmer Sweep */}
            <linearGradient id="shimmerSweep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0">
                <animate
                  attributeName="offset"
                  values="-0.5;1.5"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="15%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.5">
                <animate
                  attributeName="offset"
                  values="-0.35;1.65"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="30%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0">
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
                lightingColor="hsl(0, 0%, 100%)"
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
              <feFlood floodColor="hsl(0, 0%, 100%)" floodOpacity="0.4"/>
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
          </defs>

          {/* Particle dust following cursor */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.circle
                key={particle.id}
                cx={particle.x}
                cy={particle.y}
                r={particle.size}
                fill="hsl(0, 0%, 100%)"
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
            {/* Invisible larger hit area for easier hover */}
            <rect
              x="940"
              y="100"
              width="120"
              height="250"
              fill="transparent"
            />
            
            {/* Growing glow circle behind dot */}
            {isDotHovering && (
              <circle
                cx="1000"
                cy="220"
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
              x="1000"
              y="290"
              textAnchor="middle"
              className="font-display font-bold"
              style={{
                fontSize: "380px",
                fill: isDotHovering ? "hsl(45, 100%, 97%)" : "transparent",
                letterSpacing: "-0.05em",
                transform: isDotHovering ? `scale(${dotScale})` : "scale(1)",
                transformOrigin: "1000px 220px",
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
                  cx="1000"
                  cy="220"
                  r={50 * (dotScale * 0.5)}
                  fill="none"
                  stroke="hsl(0, 0%, 100%)"
                  strokeWidth={1 / dotScale}
                  style={{ opacity: 0.4 / dotScale }}
                />
                <circle
                  cx="1000"
                  cy="220"
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
                stroke: "hsl(0, 0%, 100%)",
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
