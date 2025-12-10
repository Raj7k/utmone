import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface DotPhilosophyModalProps {
  isOpen: boolean;
  onClose: () => void;
  dotPosition: { x: number; y: number };
}

// Ancient scroll content - all H1 and H2 with serif font
const scrollLines = [
  { text: "the world is made of dots.", tag: "h1" as const },
  { text: "pixels on your screen.", tag: "h2" as const },
  { text: "stars in the sky.", tag: "h2" as const },
  { text: "data points in your analytics.", tag: "h2" as const },
  { text: "connections between people.", tag: "h2" as const },
  { text: "every conversion started as a dot.", tag: "h2" as const },
  { text: "every customer journey, a line of dots.", tag: "h2" as const },
  { text: "every revenue milestone, dots connected.", tag: "h2" as const },
  { text: "utm.one connects all your dots.", tag: "h1" as const },
];

interface Dot {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

// Word-by-word illumination component for ancient scroll effect
const ScrollWord = ({ 
  word, 
  delay,
  isH1,
  isVisible 
}: { 
  word: string; 
  delay: number;
  isH1: boolean;
  isVisible: boolean;
}) => {
  return (
    <motion.span
      className="inline-block mr-[0.35em]"
      initial={{ 
        opacity: 0.08, 
        filter: "blur(2px)",
        color: "rgba(255, 248, 230, 0.08)",
      }}
      animate={isVisible ? { 
        opacity: 1, 
        filter: "blur(0px)",
        color: isH1 ? "rgba(255, 252, 245, 1)" : "rgba(255, 248, 230, 0.85)",
      } : {
        opacity: 0.08, 
        filter: "blur(2px)",
        color: "rgba(255, 248, 230, 0.08)",
      }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{
        textShadow: isVisible && isH1 
          ? "0 0 40px rgba(255, 240, 200, 0.4), 0 0 80px rgba(255, 230, 180, 0.2)" 
          : isVisible 
            ? "0 0 20px rgba(255, 240, 200, 0.15)"
            : "none",
      }}
    >
      {word}
    </motion.span>
  );
};

// Component for a single scroll line
const ScrollLine = ({ 
  text, 
  tag, 
  startDelay, 
  isVisible 
}: { 
  text: string; 
  tag: "h1" | "h2"; 
  startDelay: number;
  isVisible: boolean;
}) => {
  const words = text.split(' ');
  const wordDelay = 0.1; // 100ms per word for reading pace
  
  const content = (
    <>
      {words.map((word, index) => (
        <ScrollWord
          key={index}
          word={word}
          delay={startDelay + (index * wordDelay)}
          isH1={tag === "h1"}
          isVisible={isVisible}
        />
      ))}
    </>
  );

  if (tag === "h1") {
    return (
      <h1 
        className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight"
        style={{ 
          letterSpacing: "-0.02em",
          fontWeight: 400,
        }}
      >
        {content}
      </h1>
    );
  }

  return (
    <h2 
      className="font-serif text-lg sm:text-xl md:text-2xl lg:text-3xl tracking-normal leading-relaxed"
      style={{ 
        letterSpacing: "0.01em",
        fontWeight: 300,
      }}
    >
      {content}
    </h2>
  );
};

const ConstellationCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize dots
    const numDots = 60;
    dotsRef.current = Array.from({ length: numDots }, (_, i) => ({
      id: i,
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dots = dotsRef.current;
      const mouse = mouseRef.current;

      // Update and draw dots
      dots.forEach((dot) => {
        // Parallax effect based on mouse
        const parallaxX = (mouse.x - canvas.width / 2) * 0.01;
        const parallaxY = (mouse.y - canvas.height / 2) * 0.01;

        dot.x += dot.vx + parallaxX * 0.1;
        dot.y += dot.vy + parallaxY * 0.1;

        // Wrap around edges
        if (dot.x < 0) dot.x = canvas.width;
        if (dot.x > canvas.width) dot.x = 0;
        if (dot.y < 0) dot.y = canvas.height;
        if (dot.y > canvas.height) dot.y = 0;

        // Draw dot with warm sepia tint
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 248, 230, ${dot.opacity * 0.8})`;
        ctx.fill();
      });

      // Draw connections with warm tint
      const connectionDistance = 120;
      ctx.lineWidth = 0.5;

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.12;
            ctx.strokeStyle = `rgba(255, 248, 230, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[j].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
};

export const DotPhilosophyModal = ({
  isOpen,
  onClose,
  dotPosition,
}: DotPhilosophyModalProps) => {
  const navigate = useNavigate();
  const [startReading, setStartReading] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStartReading(false);
      setShowCTA(false);

      // Start reading animation after bloom completes
      setTimeout(() => setStartReading(true), 800);

      // Calculate total reading time based on word counts
      // Each line's words × 0.1s per word + 0.15s pause between lines
      // Total: ~8 seconds for all content
      setTimeout(() => setShowCTA(true), 9000);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  const handleCTAClick = () => {
    onClose();
    navigate("/early-access");
  };

  // Calculate cumulative delays for each line
  const getLineDelay = (lineIndex: number): number => {
    const wordCounts = scrollLines.map(line => line.text.split(' ').length);
    const wordDelay = 0.1;
    const linePause = 0.15; // Shorter pause for scroll feel
    
    let delay = 0;
    for (let i = 0; i < lineIndex; i++) {
      delay += (wordCounts[i] * wordDelay) + linePause;
    }
    return delay;
  };

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Bloom circle expanding from dot - dream portal effect with sepia tint */}
          <motion.div
            className="absolute"
            style={{
              background: "radial-gradient(circle, hsl(35, 15%, 8%) 0%, hsl(30, 20%, 4%) 100%)",
            }}
            initial={{
              left: dotPosition.x,
              top: dotPosition.y,
              width: 0,
              height: 0,
              borderRadius: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              width: "300vmax",
              height: "300vmax",
              borderRadius: "0%",
            }}
            exit={{
              width: 0,
              height: 0,
              borderRadius: "50%",
              opacity: 0,
            }}
            transition={{
              duration: 1,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          />

          {/* Constellation background */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <ConstellationCanvas />
          </motion.div>

          {/* Parchment texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, transparent 0%, rgba(20, 15, 10, 0.4) 100%)",
            }}
          />

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-8 right-8 text-amber-100/30 hover:text-amber-100/60 transition-colors z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Ancient Scroll Content Container */}
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto px-6 md:px-12 py-8 overflow-y-auto max-h-[90vh]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            {/* Parchment-style container */}
            <div 
              className="relative rounded-2xl p-8 md:p-12 lg:p-16 text-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255, 248, 230, 0.06) 0%, rgba(255, 240, 210, 0.02) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255, 240, 200, 0.08)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255, 248, 230, 0.08)",
              }}
            >
              {/* Top edge candlelight reflection */}
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255, 240, 200, 0.25) 50%, transparent 100%)",
                }}
              />
              
              {/* Inner warm glow like candlelight */}
              <div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 50% 20%, rgba(255, 240, 200, 0.04) 0%, transparent 60%)",
                }}
              />

              {/* Vertical shimmer like candlelight flicker */}
              <motion.div 
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background: "linear-gradient(180deg, rgba(255, 240, 200, 0.03) 0%, transparent 30%, transparent 70%, rgba(255, 240, 200, 0.02) 100%)",
                }}
                animate={{
                  opacity: [0.5, 1, 0.7, 1, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Ancient scroll text with word-by-word illumination */}
              <div className="relative space-y-5 md:space-y-6">
                {scrollLines.map((line, index) => (
                  <div 
                    key={index} 
                    className={line.tag === "h1" && index > 0 ? "pt-6 md:pt-8" : ""}
                  >
                    <ScrollLine 
                      text={line.text}
                      tag={line.tag}
                      startDelay={getLineDelay(index)}
                      isVisible={startReading}
                    />
                  </div>
                ))}
              </div>

              {/* Premium CTA Button with parchment styling */}
              <motion.button
                onClick={handleCTAClick}
                className="mt-12 md:mt-16 relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h2 className="sr-only">Call to action</h2>
                <div 
                  className="px-10 py-5 rounded-full font-serif text-lg relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(255, 248, 230, 0.12) 0%, rgba(255, 240, 210, 0.04) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 240, 200, 0.15)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255, 248, 230, 0.1)",
                    color: "rgba(255, 252, 245, 0.9)",
                  }}
                >
                  {/* Shimmer effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255, 240, 200, 0.08) 50%, transparent 100%)",
                    }}
                  />
                  
                  {/* Warm glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: "0 0 40px rgba(255, 240, 200, 0.12)",
                    }}
                  />
                  
                  <span className="relative flex items-center gap-3 font-serif tracking-wide">
                    start connecting yours
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </div>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
