import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { DotPhilosophyModal } from "./DotPhilosophyModal";

export const FooterRevealText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [isDotHovered, setIsDotHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(false);
  const [mouseX, setMouseX] = useState(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setMouseX(Math.max(0, Math.min(100, x)));
  };

  const handleDotClick = (e: React.MouseEvent) => {
    const rect = (e.target as Element).getBoundingClientRect();
    setDotPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowHint(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background"
        onMouseMove={handleMouseMove}
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[1000px] h-[600px] bg-white/[0.02] rounded-full blur-[180px]" />
        </div>

        <div className="relative w-full max-w-[1600px] mx-auto px-4">
          <svg 
            ref={svgRef}
            viewBox="0 0 900 280" 
            className="w-full h-auto" 
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Main platinum gradient */}
              <linearGradient id="platinumGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(0,0%,95%)" />
                <stop offset="50%" stopColor="hsl(0,0%,80%)" />
                <stop offset="100%" stopColor="hsl(0,0%,90%)" />
              </linearGradient>

              {/* Mouse reveal gradient */}
              <linearGradient id="revealGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0,0%,100%)" stopOpacity={mouseX > 10 ? 1 : 0.3} />
                <stop offset={`${Math.max(0, mouseX - 15)}%`} stopColor="hsl(0,0%,100%)" stopOpacity={0.3} />
                <stop offset={`${mouseX}%`} stopColor="hsl(0,0%,100%)" stopOpacity="1" />
                <stop offset={`${Math.min(100, mouseX + 15)}%`} stopColor="hsl(0,0%,100%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(0,0%,100%)" stopOpacity={mouseX < 90 ? 0.3 : 1} />
              </linearGradient>

              {/* Shimmer animation */}
              <linearGradient id="shimmerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0,0%,100%)" stopOpacity="0">
                  <animate attributeName="offset" values="-0.5;1.5" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="hsl(0,0%,100%)" stopOpacity="0.4">
                  <animate attributeName="offset" values="0;2" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(0,0%,100%)" stopOpacity="0">
                  <animate attributeName="offset" values="0.5;2.5" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>

              {/* Reflection gradient */}
              <linearGradient id="reflectionGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(0,0%,60%)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="hsl(0,0%,60%)" stopOpacity="0" />
              </linearGradient>

              {/* Glow filter */}
              <filter id="textGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Dot glow filter */}
              <filter id="dotGlowFilter" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Main text - single text element with bold weight */}
            <motion.g
              filter="url(#textGlow)"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Base text layer */}
              <text
                x="450"
                y="140"
                textAnchor="middle"
                fill="url(#platinumGrad)"
                fontSize="180"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="700"
                letterSpacing="-0.02em"
              >
                utm.one
              </text>

              {/* Mouse reveal layer */}
              <text
                x="450"
                y="140"
                textAnchor="middle"
                fill="url(#revealGrad)"
                fontSize="180"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="700"
                letterSpacing="-0.02em"
                style={{ transition: 'fill 0.1s ease' }}
              >
                utm.one
              </text>

              {/* Shimmer layer */}
              <motion.text
                x="450"
                y="140"
                textAnchor="middle"
                fill="url(#shimmerGrad)"
                fontSize="180"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="700"
                letterSpacing="-0.02em"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                utm.one
              </motion.text>
            </motion.g>

            {/* Interactive dot overlay - invisible hit area */}
            <motion.rect
              x="395"
              y="95"
              width="50"
              height="60"
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setIsDotHovered(true)}
              onMouseLeave={() => setIsDotHovered(false)}
              onClick={handleDotClick}
              whileHover={{ scale: 1.1 }}
            />

            {/* Dot glow effect when hovered */}
            <AnimatePresence>
              {isDotHovered && (
                <motion.circle
                  cx="420"
                  cy="125"
                  r="25"
                  fill="white"
                  filter="url(#dotGlowFilter)"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 0.6, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                  style={{ pointerEvents: 'none' }}
                />
              )}
            </AnimatePresence>

            {/* Reflection */}
            <motion.g
              transform="translate(0, 160) scale(1, -0.3)"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.15 } : {}}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <text
                x="450"
                y="140"
                textAnchor="middle"
                fill="url(#reflectionGrad)"
                fontSize="180"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontWeight="700"
                letterSpacing="-0.02em"
              >
                utm.one
              </text>
            </motion.g>
          </svg>

          {/* Hint */}
          <AnimatePresence>
            {showHint && !isModalOpen && (
              <motion.p
                className="text-center text-muted-foreground/40 text-sm mt-6 font-mono tracking-[0.3em] uppercase"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.3, 0.7, 0.3] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                click the dot
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DotPhilosophyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        originPosition={dotPosition} 
      />
    </>
  );
};
