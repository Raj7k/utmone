import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWindowSize } from "@/hooks/useWindowSize";

interface RevenueStreamLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
  minDisplayTime?: number;
}

interface Particle {
  id: number;
  startTime: number;
  size: number;
}

const statusMessages = [
  "ingesting clickstream...",
  "resolving identity graph...",
  "calculating attribution lift...",
  "matching cross-device journeys...",
  "aggregating conversion paths...",
  "revenue verified.",
];

// Massive slot machine style number display
const SlotNumber = ({ value, isExiting }: { value: number; isExiting: boolean }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayValue) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayValue(value);
        setIsAnimating(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [value, displayValue]);

  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(displayValue);

  return (
    <motion.span
      className="font-mono tabular-nums text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold"
      animate={{
        scale: isExiting ? 1.3 : 1,
        filter: isAnimating ? "blur(8px)" : "blur(0px)",
      }}
      transition={{ duration: 0.3 }}
      style={{
        color: isExiting ? "rgba(255, 255, 255, 1)" : "rgba(140, 255, 140, 0.95)",
        textShadow: isExiting 
          ? "0 0 60px rgba(255, 255, 255, 0.8), 0 0 120px rgba(255, 255, 255, 0.4)"
          : "0 0 40px rgba(100, 255, 100, 0.6), 0 0 80px rgba(100, 255, 100, 0.3), 0 0 120px rgba(100, 255, 100, 0.15)",
      }}
    >
      {formattedValue}
    </motion.span>
  );
};

// Particle with comet trail
const StreamParticle = ({ 
  onProcess, 
  onComplete,
  wireWidth,
  size,
}: { 
  onProcess: () => void;
  onComplete: () => void;
  wireWidth: number;
  size: number;
}) => {
  const [phase, setPhase] = useState<"traveling" | "processing" | "complete">("traveling");
  const duration = 1.8;

  useEffect(() => {
    const processTimer = setTimeout(() => {
      setPhase("processing");
      onProcess();
    }, (duration * 0.5) * 1000);

    const completeTimer = setTimeout(() => {
      setPhase("complete");
      onComplete();
    }, duration * 1000);

    return () => {
      clearTimeout(processTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onProcess, onComplete]);

  const particleSize = phase === "processing" ? size * 1.5 : size;

  return (
    <>
      {/* Comet trail */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size * 4,
          height: size * 0.6,
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 100%)`,
          filter: "blur(3px)",
        }}
        initial={{ left: -size * 4, opacity: 0 }}
        animate={{ 
          left: wireWidth + size, 
          opacity: [0, 0.6, 0.6, 0.3, 0],
        }}
        transition={{ 
          duration, 
          ease: "linear",
          opacity: { times: [0, 0.05, 0.7, 0.9, 1] }
        }}
      />
      
      {/* Main particle */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: particleSize,
          height: particleSize,
          background: phase === "processing" 
            ? "rgba(255, 255, 255, 1)" 
            : "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.4) 100%)",
          boxShadow: phase === "processing"
            ? `0 0 ${size * 3}px rgba(255, 255, 255, 0.9), 0 0 ${size * 6}px rgba(200, 200, 255, 0.5), 0 0 ${size * 10}px rgba(150, 150, 255, 0.3)`
            : `0 0 ${size * 2}px rgba(255, 255, 255, 0.8), 0 0 ${size * 4}px rgba(255, 255, 255, 0.4)`,
        }}
        initial={{ left: -particleSize, opacity: 0 }}
        animate={{ 
          left: wireWidth + particleSize, 
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{ 
          duration, 
          ease: "linear",
          opacity: { times: [0, 0.05, 0.8, 0.95, 1] }
        }}
      />
    </>
  );
};

export const RevenueStreamLoader = ({ 
  isLoading, 
  onComplete,
  minDisplayTime = 3000,
}: RevenueStreamLoaderProps) => {
  const { width: windowWidth } = useWindowSize();
  const [particles, setParticles] = useState<Particle[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const particleId = useRef(0);
  const startTime = useRef<number>(0);

  // Responsive wire width: 70vw, min 400px, max 1000px
  const wireWidth = Math.min(1000, Math.max(400, windowWidth * 0.7));
  const gateWidth = Math.min(80, Math.max(50, wireWidth * 0.08));
  const gateHeight = gateWidth * 1.3;

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      startTime.current = Date.now();
      setRevenue(0);
      setMessageIndex(0);
      setIsExiting(false);
      setParticles([]);
      particleId.current = 0;
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading && showLoader && !isExiting) {
      const elapsed = Date.now() - startTime.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShowLoader(false);
          onComplete?.();
        }, 800);
      }, remainingTime);
    }
  }, [isLoading, showLoader, isExiting, minDisplayTime, onComplete]);

  useEffect(() => {
    if (!showLoader || isExiting) return;

    const spawnParticle = () => {
      const id = particleId.current++;
      const size = 12 + Math.random() * 8; // 12-20px
      setParticles(prev => [...prev, { id, startTime: Date.now(), size }]);
    };

    spawnParticle();
    const interval = setInterval(spawnParticle, 350 + Math.random() * 250);
    return () => clearInterval(interval);
  }, [showLoader, isExiting]);

  useEffect(() => {
    if (!showLoader || isExiting) return;

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % statusMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showLoader, isExiting]);

  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.startTime < 3000));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  const handleProcess = useCallback(() => {}, []);

  const handleComplete = useCallback(() => {
    const increment = Math.floor(Math.random() * 250) + 100;
    setRevenue(prev => prev + increment);
  }, []);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      {showLoader && (
        <>
          {/* Top shutter */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[100]"
            style={{ background: "#030303" }}
            initial={{ height: "50%" }}
            animate={{ height: isExiting ? "0%" : "50%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />
          
          {/* Bottom shutter */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[100]"
            style={{ background: "#030303" }}
            initial={{ height: "50%" }}
            animate={{ height: isExiting ? "0%" : "50%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          />

          {/* Main content overlay */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Deep space background */}
            <div 
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse 80% 60% at 50% 50%, #0a0a0a 0%, #030303 100%)",
              }}
            />

            {/* Subtle grid overlay */}
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: "60px 60px",
              }}
            />

            {/* Scanning line effect */}
            <motion.div
              className="absolute left-0 right-0 h-[1px] opacity-20"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.5) 50%, transparent 100%)",
              }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Main container */}
            <div className="relative flex flex-col items-center w-full px-4">
              
              {/* utm.one branding */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-2xl md:text-3xl tracking-tight text-white/15 mb-8 md:mb-12"
              >
                utm.one
              </motion.div>

              {/* Revenue counter - CENTER STAGE */}
              <motion.div
                className="mb-12 md:mb-16"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <SlotNumber value={revenue} isExiting={isExiting} />
              </motion.div>

              {/* The Wire Pipeline */}
              <div className="relative" style={{ width: wireWidth, height: 80 }}>
                
                {/* Wire glow layer */}
                <motion.div 
                  className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
                  style={{
                    height: 6,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.08) 50%, rgba(100,255,100,0.15) 100%)",
                    filter: "blur(4px)",
                  }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* The wire itself */}
                <div 
                  className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
                  style={{
                    height: 2,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.25) 50%, rgba(100,255,100,0.35) 100%)",
                  }}
                />

                {/* Start node */}
                <motion.div
                  className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 rounded-full"
                  style={{
                    width: 16,
                    height: 16,
                    background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
                    border: "2px solid rgba(255,255,255,0.3)",
                  }}
                  animate={{ 
                    boxShadow: [
                      "0 0 10px rgba(255,255,255,0.2)",
                      "0 0 20px rgba(255,255,255,0.4)",
                      "0 0 10px rgba(255,255,255,0.2)",
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* End node */}
                <motion.div
                  className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 rounded-full"
                  style={{
                    width: 20,
                    height: 20,
                    background: "radial-gradient(circle, rgba(100,255,100,0.4) 0%, transparent 70%)",
                    border: "2px solid rgba(100,255,100,0.5)",
                  }}
                  animate={{ 
                    boxShadow: [
                      "0 0 15px rgba(100,255,100,0.3)",
                      "0 0 30px rgba(100,255,100,0.5)",
                      "0 0 15px rgba(100,255,100,0.3)",
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />

                {/* Glass Gate (center) */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: gateWidth,
                    height: gateHeight,
                    borderRadius: gateWidth / 2,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(12px)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 30px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.15)",
                      "0 0 50px rgba(200,220,255,0.2), inset 0 1px 0 rgba(255,255,255,0.25)",
                      "0 0 30px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.15)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  {/* Gate inner glow */}
                  <div 
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(200,220,255,0.15) 0%, transparent 70%)",
                    }}
                  />
                  {/* Gate processing indicator */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,255,255,0.2) 0%, transparent 50%)",
                    }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </motion.div>

                {/* Input label */}
                <motion.div
                  className="absolute -bottom-10 left-0 text-sm md:text-base font-mono text-zinc-500 tracking-widest"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  CLICKS
                </motion.div>

                {/* Output label */}
                <motion.div
                  className="absolute -bottom-10 right-0 text-sm md:text-base font-mono tracking-widest"
                  style={{ color: "rgba(100, 200, 100, 0.7)" }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  REVENUE
                </motion.div>

                {/* Particles */}
                <AnimatePresence>
                  {particles.map(particle => (
                    <StreamParticle
                      key={particle.id}
                      wireWidth={wireWidth}
                      size={particle.size}
                      onProcess={handleProcess}
                      onComplete={handleComplete}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Status message */}
              <motion.div
                className="h-8 flex items-center justify-center mt-20 md:mt-24"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={messageIndex}
                    className="font-mono text-base md:text-lg text-zinc-500 tracking-wide"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {statusMessages[messageIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Progress indicator */}
              <motion.div
                className="w-32 md:w-40 h-[3px] rounded-full overflow-hidden bg-white/5 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.4), rgba(100,255,100,0.6))",
                  }}
                  animate={{ x: ["-100%", "250%"] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
