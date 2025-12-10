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

const philosophyLines = [
  { text: "the world is made of dots.", isHeadline: true },
  { text: "pixels on your screen. stars in the sky. data points in your analytics. connections between people.", isHeadline: false },
  { text: "every conversion started as a dot. every customer journey, a line of dots. every revenue milestone, dots connected.", isHeadline: false },
  { text: "utm.one connects all your dots.", isHeadline: true },
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

// Word-by-word illumination component
const WordByWordText = ({ 
  text, 
  startDelay, 
  isHeadline,
  isVisible 
}: { 
  text: string; 
  startDelay: number; 
  isHeadline: boolean;
  isVisible: boolean;
}) => {
  const words = text.split(' ');
  const wordDelay = 0.12; // 120ms per word
  
  return (
    <span className="inline">
      {words.map((word, index) => (
        <motion.span
          key={index}
          className="inline-block mr-[0.3em]"
          initial={{ 
            opacity: 0.15, 
            color: isHeadline ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)",
            filter: "blur(1px)",
            scale: 1,
          }}
          animate={isVisible ? { 
            opacity: 1, 
            color: isHeadline ? "rgba(255,255,255,1)" : "rgba(255,255,255,0.75)",
            filter: "blur(0px)",
            scale: 1.0,
          } : {
            opacity: 0.15, 
            color: isHeadline ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.1)",
            filter: "blur(1px)",
            scale: 1,
          }}
          transition={{ 
            duration: 0.4, 
            delay: startDelay + (index * wordDelay),
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{
            textShadow: isVisible && isHeadline 
              ? "0 0 30px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)" 
              : "none",
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
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

        // Draw dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${dot.opacity})`;
        ctx.fill();
      });

      // Draw connections
      const connectionDistance = 120;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 0.5;

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            const opacity = (1 - distance / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
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
      style={{ opacity: 0.8 }}
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

      // Calculate total reading time: 4 lines with varying word counts
      // Line 1: 6 words × 0.12s = 0.72s
      // Line 2: 14 words × 0.12s = 1.68s  
      // Line 3: 16 words × 0.12s = 1.92s
      // Line 4: 5 words × 0.12s = 0.6s
      // Total with delays: ~6s
      setTimeout(() => setShowCTA(true), 6500);
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
    const wordCounts = [6, 14, 16, 5];
    const wordDelay = 0.12;
    const linePause = 0.3; // Pause between lines
    
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
          {/* Bloom circle expanding from dot - dream portal effect */}
          <motion.div
            className="absolute"
            style={{
              background: "radial-gradient(circle, hsl(240, 10%, 8%) 0%, hsl(240, 15%, 4%) 100%)",
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

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-8 right-8 text-white/30 hover:text-white/60 transition-colors z-10"
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

          {/* Premium Glass Content Container */}
          <motion.div 
            className="relative z-10 max-w-4xl mx-auto px-6 md:px-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
          >
            {/* Frosted glass card */}
            <div 
              className="relative rounded-3xl p-8 md:p-16 text-center overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              {/* Top edge light reflection */}
              <div 
                className="absolute top-0 left-0 right-0 h-px"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                }}
              />
              
              {/* Inner glow */}
              <div 
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.05) 0%, transparent 60%)",
                }}
              />

              {/* Philosophy text with word-by-word illumination */}
              <div className="relative space-y-8">
                {philosophyLines.map((line, index) => (
                  <div key={index}>
                    {line.isHeadline ? (
                      <h1
                        className={`font-serif tracking-tight ${
                          index === 0 
                            ? "text-3xl md:text-5xl lg:text-6xl" 
                            : "text-2xl md:text-4xl lg:text-5xl mt-12"
                        }`}
                        style={{
                          letterSpacing: "-0.02em",
                        }}
                      >
                        <WordByWordText 
                          text={line.text} 
                          startDelay={getLineDelay(index)} 
                          isHeadline={true}
                          isVisible={startReading}
                        />
                      </h1>
                    ) : (
                      <p
                        className="font-sans text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto"
                        style={{
                          letterSpacing: "0.01em",
                        }}
                      >
                        <WordByWordText 
                          text={line.text} 
                          startDelay={getLineDelay(index)} 
                          isHeadline={false}
                          isVisible={startReading}
                        />
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Premium CTA Button */}
              <motion.button
                onClick={handleCTAClick}
                className="mt-12 relative group"
                initial={{ opacity: 0, y: 20 }}
                animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div 
                  className="px-10 py-5 rounded-full text-white font-medium text-lg relative overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                  }}
                >
                  {/* Shimmer effect on hover */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                  
                  {/* Glow on hover */}
                  <div 
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      boxShadow: "0 0 40px rgba(255,255,255,0.15)",
                    }}
                  />
                  
                  <span className="relative flex items-center gap-3">
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