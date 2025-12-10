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
  "the world is made of dots.",
  "pixels on your screen. stars in the sky. data points in your analytics. connections between people.",
  "every conversion started as a dot. every customer journey, a line of dots. every revenue milestone, dots connected.",
  "utm.one connects all your dots.",
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
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showCTA, setShowCTA] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVisibleLines([]);
      setShowCTA(false);

      // Line-by-line reveal
      const delays = [500, 1300, 2100, 2900];
      delays.forEach((delay, index) => {
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, index]);
        }, delay);
      });

      // Show CTA after all lines
      setTimeout(() => setShowCTA(true), 3500);
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
          {/* Bloom circle expanding from dot */}
          <motion.div
            className="absolute bg-black"
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
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
            }}
          />

          {/* Constellation background */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <ConstellationCanvas />
          </motion.div>

          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-8 right-8 text-white/40 hover:text-white/80 transition-colors z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            aria-label="Close"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>

          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto px-8 text-center">
            {philosophyLines.map((line, index) => (
              <motion.p
                key={index}
                className={`mb-8 ${
                  index === 0
                    ? "font-serif text-3xl md:text-5xl text-white"
                    : index === philosophyLines.length - 1
                    ? "font-serif text-2xl md:text-4xl text-white mt-12"
                    : "font-sans text-lg md:text-xl text-white/70 leading-relaxed"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={
                  visibleLines.includes(index)
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 20 }
                }
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {line}
              </motion.p>
            ))}

            {/* CTA Button */}
            <motion.button
              onClick={handleCTAClick}
              className="mt-8 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-medium hover:bg-white/20 hover:border-white/30 transition-all group"
              initial={{ opacity: 0, y: 20 }}
              animate={showCTA ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex items-center gap-3">
                start connecting yours
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};
