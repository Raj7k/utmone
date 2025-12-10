import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { DotPhilosophyModal } from "./DotPhilosophyModal";

export const FooterRevealText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [isDotHovered, setIsDotHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
  const [showHint, setShowHint] = useState(false);

  const handleDotClick = (e: React.MouseEvent) => {
    const rect = (e.target as Element).getBoundingClientRect();
    setDotPosition({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowHint(true), 2000);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const getDelay = (i: number) => i * 0.12;

  return (
    <>
      <div
        ref={containerRef}
        className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-background"
      >
        {/* Ambient glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[900px] h-[500px] bg-white/[0.03] rounded-full blur-[150px]" />
        </div>

        <div className="relative w-full max-w-[1400px] mx-auto px-4">
          <svg viewBox="0 0 1000 350" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(0,0%,100%)" />
                <stop offset="50%" stopColor="hsl(0,0%,88%)" />
                <stop offset="100%" stopColor="hsl(0,0%,95%)" />
              </linearGradient>
              <linearGradient id="shimmer" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(0,0%,100%)" stopOpacity="0">
                  <animate attributeName="offset" values="-1;2" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="50%" stopColor="hsl(0,0%,100%)" stopOpacity="0.6">
                  <animate attributeName="offset" values="-0.5;2.5" dur="3s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" stopColor="hsl(0,0%,100%)" stopOpacity="0">
                  <animate attributeName="offset" values="0;3" dur="3s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
              <linearGradient id="reflectGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(0,0%,70%)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="hsl(0,0%,70%)" stopOpacity="0" />
              </linearGradient>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
              <filter id="dotGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Main text */}
            <g filter="url(#glow)">
              {["u", "t", "m"].map((c, i) => (
                <motion.text key={c} x={150 + i * 115} y="160" textAnchor="middle" fill="url(#glassGrad)" fontSize="180" fontFamily="serif" initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: getDelay(i), duration: 0.8, ease: "easeOut" }}>{c}</motion.text>
              ))}
              {["u", "t", "m"].map((c, i) => (
                <motion.text key={`s${c}`} x={150 + i * 115} y="160" textAnchor="middle" fill="url(#shimmer)" fontSize="180" fontFamily="serif" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: getDelay(i) + 0.3, duration: 0.5 }}>{c}</motion.text>
              ))}

              {/* Interactive DOT */}
              <motion.circle
                cx="495"
                cy="145"
                r="20"
                fill="url(#glassGrad)"
                filter={isDotHovered ? "url(#dotGlow)" : "none"}
                className="cursor-pointer"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: getDelay(3), duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.4 }}
                onMouseEnter={() => setIsDotHovered(true)}
                onMouseLeave={() => setIsDotHovered(false)}
                onClick={handleDotClick}
              />

              {["o", "n", "e"].map((c, i) => (
                <motion.text key={`o${c}`} x={590 + i * 115} y="160" textAnchor="middle" fill="url(#glassGrad)" fontSize="180" fontFamily="serif" initial={{ opacity: 0, y: 60 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: getDelay(i + 4), duration: 0.8, ease: "easeOut" }}>{c}</motion.text>
              ))}
              {["o", "n", "e"].map((c, i) => (
                <motion.text key={`so${c}`} x={590 + i * 115} y="160" textAnchor="middle" fill="url(#shimmer)" fontSize="180" fontFamily="serif" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: getDelay(i + 4) + 0.3, duration: 0.5 }}>{c}</motion.text>
              ))}
            </g>

            {/* Reflection */}
            <g transform="translate(0, 200) scale(1, -0.35)" opacity="0.2">
              {["u", "t", "m"].map((c, i) => (
                <motion.text key={`r${c}`} x={150 + i * 115} y="160" textAnchor="middle" fill="url(#reflectGrad)" fontSize="180" fontFamily="serif" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: getDelay(i) + 0.5, duration: 0.8 }}>{c}</motion.text>
              ))}
              <motion.circle cx="495" cy="145" r="20" fill="url(#reflectGrad)" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: getDelay(3) + 0.5, duration: 0.5 }} />
              {["o", "n", "e"].map((c, i) => (
                <motion.text key={`ro${c}`} x={590 + i * 115} y="160" textAnchor="middle" fill="url(#reflectGrad)" fontSize="180" fontFamily="serif" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: getDelay(i + 4) + 0.5, duration: 0.8 }}>{c}</motion.text>
              ))}
            </g>
          </svg>

          {/* Hint */}
          <AnimatePresence>
            {showHint && !isModalOpen && (
              <motion.p
                className="text-center text-muted-foreground/50 text-sm mt-8 font-mono tracking-widest"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                click the dot
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <DotPhilosophyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} originPosition={dotPosition} />
    </>
  );
};
