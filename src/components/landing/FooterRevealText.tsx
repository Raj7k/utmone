import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { DotPhilosophyModal } from "./DotPhilosophyModal";

interface FooterRevealTextProps {
  text?: string;
  className?: string;
}

export const FooterRevealText = ({ text = "utm.one", className = "" }: FooterRevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<SVGTextElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const [isDotHovered, setIsDotHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(false);

  // Split text into parts: "utm", ".", "one"
  const parts = [
    { text: "utm", isInteractive: false },
    { text: ".", isInteractive: true },
    { text: "one", isInteractive: false },
  ];

  const handleDotClick = (e: React.MouseEvent) => {
    const rect = (e.target as Element).getBoundingClientRect();
    setDotPosition({ 
      x: rect.left + rect.width / 2, 
      y: rect.top + rect.height / 2 
    });
    setIsModalOpen(true);
  };

  // Show hint after animation completes
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowHint(true), 2500);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Character positions for layout
  const getCharX = (partIndex: number) => {
    const baseX = 600; // Center of 1200 viewBox
    const totalWidth = 720; // Approximate total text width
    const startX = baseX - totalWidth / 2;
    
    if (partIndex === 0) return startX + 180; // "utm" center
    if (partIndex === 1) return startX + 380; // "." center
    return startX + 540; // "one" center
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`relative w-full cursor-default select-none py-16 ${className}`}
      >
        <svg
          viewBox="0 0 1200 400"
          className="w-full h-auto"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Glass gradient with platinum shimmer */}
            <linearGradient id="footerGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(228, 228, 231)" /> {/* zinc-200 */}
              <stop offset="25%" stopColor="rgb(244, 244, 245)" /> {/* zinc-100 */}
              <stop offset="50%" stopColor="rgb(255, 255, 255)" /> {/* white */}
              <stop offset="75%" stopColor="rgb(244, 244, 245)" /> {/* zinc-100 */}
              <stop offset="100%" stopColor="rgb(212, 212, 216)" /> {/* zinc-300 */}
            </linearGradient>

            {/* Animated shimmer gradient */}
            <linearGradient id="footerShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0)">
                <animate attributeName="offset" values="-1;2" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="50%" stopColor="rgba(255,255,255,0.5)">
                <animate attributeName="offset" values="-0.5;2.5" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="rgba(255,255,255,0)">
                <animate attributeName="offset" values="0;3" dur="3s" repeatCount="indefinite" />
              </stop>
            </linearGradient>

            {/* Reflection gradient (fades out) */}
            <linearGradient id="footerReflectionFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(161, 161, 170)" stopOpacity="0.4" />
              <stop offset="100%" stopColor="rgb(161, 161, 170)" stopOpacity="0" />
            </linearGradient>

            {/* Glow filter for dot */}
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Glass blur filter */}
            <filter id="glassBlur" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>

          {/* Main text group */}
          <g>
            {/* Background glow layer */}
            <text
              x="600"
              y="200"
              textAnchor="middle"
              className="font-display font-bold"
              style={{
                fontSize: "240px",
                fill: "rgba(255,255,255,0.1)",
                filter: "blur(30px)",
                letterSpacing: "-0.02em",
              }}
            >
              {text}
            </text>

            {/* Character-by-character animation */}
            {parts.map((part, partIndex) => (
              <motion.text
                key={partIndex}
                ref={part.isInteractive ? dotRef : undefined}
                x={getCharX(partIndex)}
                y="200"
                textAnchor="middle"
                className={`font-display font-bold ${part.isInteractive ? 'cursor-pointer' : ''}`}
                style={{
                  fontSize: "240px",
                  fill: "url(#footerGlassGradient)",
                  letterSpacing: "-0.02em",
                  filter: part.isInteractive && isDotHovered ? "url(#dotGlow)" : undefined,
                }}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { 
                  opacity: 1, 
                  y: 0,
                  scale: part.isInteractive && isDotHovered ? 1.2 : 1,
                } : {}}
                transition={{ 
                  duration: 0.8,
                  delay: partIndex * 0.2,
                  ease: [0.16, 1, 0.3, 1],
                  scale: { duration: 0.2 }
                }}
                onMouseEnter={() => part.isInteractive && setIsDotHovered(true)}
                onMouseLeave={() => part.isInteractive && setIsDotHovered(false)}
                onClick={part.isInteractive ? handleDotClick : undefined}
              >
                {part.text}
              </motion.text>
            ))}

            {/* Shimmer overlay */}
            <motion.text
              x="600"
              y="200"
              textAnchor="middle"
              className="font-display font-bold pointer-events-none"
              style={{
                fontSize: "240px",
                fill: "url(#footerShimmer)",
                letterSpacing: "-0.02em",
                mixBlendMode: "overlay",
              }}
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.5 } : {}}
              transition={{ duration: 1, delay: 0.8 }}
            >
              {text}
            </motion.text>

            {/* Reflection (flipped, below) */}
            <motion.g
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 1, delay: 1 }}
            >
              <text
                x="600"
                y="200"
                textAnchor="middle"
                className="font-display font-bold"
                style={{
                  fontSize: "240px",
                  fill: "url(#footerReflectionFade)",
                  letterSpacing: "-0.02em",
                  transform: "scaleY(-1) translateY(-400px)",
                  transformOrigin: "center 200px",
                }}
              >
                {text}
              </text>
            </motion.g>
          </g>

          {/* Interactive dot hint */}
          <AnimatePresence>
            {showHint && !isModalOpen && (
              <motion.g
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.text
                  x={getCharX(1)}
                  y="280"
                  textAnchor="middle"
                  className="font-sans"
                  style={{
                    fontSize: "14px",
                    fill: "rgb(161, 161, 170)",
                  }}
                  animate={{ 
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  click the dot
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Pulsing dot indicator */}
        <AnimatePresence>
          {isDotHovered && (
            <motion.div
              className="absolute pointer-events-none"
              style={{
                left: '50%',
                top: '45%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-16 h-16 rounded-full border-2 border-white/30" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Philosophy Modal */}
      <DotPhilosophyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        originPosition={dotPosition}
      />
    </>
  );
};
