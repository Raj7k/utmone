import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RevenueStreamLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
  minDisplayTime?: number; // Minimum time to show loader in ms
}

interface Particle {
  id: number;
  startTime: number;
  processed: boolean;
}

// System status messages
const statusMessages = [
  "ingesting clickstream...",
  "resolving identity graph...",
  "calculating attribution lift...",
  "matching cross-device journeys...",
  "aggregating conversion paths...",
  "revenue verified.",
];

// Slot machine style number display
const SlotNumber = ({ value, size = "lg" }: { value: number; size?: "sm" | "lg" }) => {
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
      className={`font-mono tabular-nums ${size === "lg" ? "text-2xl md:text-3xl" : "text-lg"}`}
      style={{
        filter: isAnimating ? "blur(4px)" : "blur(0px)",
        transition: "filter 0.1s ease",
        color: "rgba(180, 255, 180, 0.9)",
        textShadow: "0 0 20px rgba(100, 255, 100, 0.4), 0 0 40px rgba(100, 255, 100, 0.2)",
      }}
    >
      {formattedValue}
    </motion.span>
  );
};

// Single particle component
const StreamParticle = ({ 
  onProcess, 
  onComplete,
  wireWidth,
}: { 
  onProcess: () => void;
  onComplete: () => void;
  wireWidth: number;
}) => {
  const [phase, setPhase] = useState<"traveling" | "processing" | "complete">("traveling");
  const gatePosition = wireWidth * 0.5; // Center
  const duration = 1.2; // seconds for full journey

  useEffect(() => {
    // Trigger processing flash at gate (halfway through)
    const processTimer = setTimeout(() => {
      setPhase("processing");
      onProcess();
    }, (duration * 0.5) * 1000);

    // Trigger complete at end
    const completeTimer = setTimeout(() => {
      setPhase("complete");
      onComplete();
    }, duration * 1000);

    return () => {
      clearTimeout(processTimer);
      clearTimeout(completeTimer);
    };
  }, [duration, onProcess, onComplete]);

  return (
    <motion.div
      className="absolute top-1/2 -translate-y-1/2 rounded-full"
      style={{
        width: phase === "processing" ? 8 : 4,
        height: phase === "processing" ? 8 : 4,
        background: phase === "processing" 
          ? "rgba(255, 255, 255, 1)" 
          : "rgba(255, 255, 255, 0.9)",
        boxShadow: phase === "processing"
          ? "0 0 20px rgba(255, 255, 255, 0.8), 0 0 40px rgba(200, 200, 255, 0.4)"
          : "0 0 8px rgba(255, 255, 255, 0.5)",
      }}
      initial={{ left: -4, opacity: 0 }}
      animate={{ 
        left: wireWidth + 4, 
        opacity: [0, 1, 1, 1, 0],
      }}
      transition={{ 
        duration, 
        ease: "linear",
        opacity: { times: [0, 0.05, 0.8, 0.95, 1] }
      }}
    />
  );
};

export const RevenueStreamLoader = ({ 
  isLoading, 
  onComplete,
  minDisplayTime = 3000,
}: RevenueStreamLoaderProps) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [revenue, setRevenue] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const particleId = useRef(0);
  const startTime = useRef<number>(0);
  const wireWidth = 300;

  // Start showing loader
  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      startTime.current = Date.now();
      setRevenue(0);
      setMessageIndex(0);
      setIsExiting(false);
    }
  }, [isLoading]);

  // Handle exit
  useEffect(() => {
    if (!isLoading && showLoader && !isExiting) {
      const elapsed = Date.now() - startTime.current;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      setTimeout(() => {
        setIsExiting(true);
        // Wait for exit animation then call onComplete
        setTimeout(() => {
          setShowLoader(false);
          onComplete?.();
        }, 800);
      }, remainingTime);
    }
  }, [isLoading, showLoader, isExiting, minDisplayTime, onComplete]);

  // Spawn particles
  useEffect(() => {
    if (!showLoader || isExiting) return;

    const spawnParticle = () => {
      const id = particleId.current++;
      setParticles(prev => [...prev, { id, startTime: Date.now(), processed: false }]);
    };

    // Initial burst
    spawnParticle();
    
    // Continuous spawning
    const interval = setInterval(spawnParticle, 400 + Math.random() * 300);
    return () => clearInterval(interval);
  }, [showLoader, isExiting]);

  // Cycle messages
  useEffect(() => {
    if (!showLoader || isExiting) return;

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % statusMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showLoader, isExiting]);

  // Clean up old particles
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      setParticles(prev => prev.filter(p => now - p.startTime < 2000));
    }, 500);
    return () => clearInterval(cleanup);
  }, []);

  const handleProcess = useCallback(() => {
    // Flash effect handled by particle
  }, []);

  const handleComplete = useCallback(() => {
    // Add revenue when particle completes journey
    const increment = Math.floor(Math.random() * 150) + 50;
    setRevenue(prev => prev + increment);
  }, []);

  if (!showLoader) return null;

  return (
    <AnimatePresence>
      {showLoader && (
        <>
          {/* Top shutter */}
          <motion.div
            className="fixed top-0 left-0 right-0 z-[100] bg-[#050505]"
            initial={{ height: "50%" }}
            animate={{ height: isExiting ? "0%" : "50%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "top" }}
          />
          
          {/* Bottom shutter */}
          <motion.div
            className="fixed bottom-0 left-0 right-0 z-[100] bg-[#050505]"
            initial={{ height: "50%" }}
            animate={{ height: isExiting ? "0%" : "50%" }}
            exit={{ height: "0%" }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            style={{ transformOrigin: "bottom" }}
          />

          {/* Main content overlay */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center"
            initial={{ opacity: 1 }}
            animate={{ opacity: isExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Background with subtle gradient */}
            <div 
              className="absolute inset-0"
              style={{
                background: "radial-gradient(ellipse at center, #0a0a0a 0%, #050505 100%)",
              }}
            />

            {/* Main container */}
            <div className="relative flex flex-col items-center gap-8">
              
              {/* utm.one branding */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-xl tracking-tight text-white/20"
              >
                utm.one
              </motion.div>

              {/* The Wire Pipeline */}
              <div className="relative" style={{ width: wireWidth, height: 60 }}>
                
                {/* Revenue counter (above right end) */}
                <motion.div
                  className="absolute -top-2 right-0 translate-x-1/2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: isExiting ? 1.2 : 1,
                  }}
                  transition={{ delay: 0.3 }}
                >
                  <SlotNumber value={revenue} />
                </motion.div>

                {/* The wire itself */}
                <div 
                  className="absolute top-1/2 left-0 right-0 -translate-y-1/2"
                  style={{
                    height: 1,
                    background: "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.15) 50%, rgba(100,255,100,0.2) 100%)",
                  }}
                />

                {/* Glass Gate (center) */}
                <motion.div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    width: 24,
                    height: 32,
                    borderRadius: 12,
                    background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    boxShadow: "0 0 20px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
                  }}
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
                      "0 0 30px rgba(200,220,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)",
                      "0 0 20px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {/* Gate inner glow */}
                  <div 
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "radial-gradient(ellipse at center, rgba(200,220,255,0.1) 0%, transparent 70%)",
                    }}
                  />
                </motion.div>

                {/* Input label */}
                <motion.div
                  className="absolute -bottom-6 left-0 text-[10px] font-mono text-zinc-600 tracking-wider"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  CLICKS
                </motion.div>

                {/* Output label */}
                <motion.div
                  className="absolute -bottom-6 right-0 text-[10px] font-mono tracking-wider"
                  style={{ color: "rgba(100, 200, 100, 0.6)" }}
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
                      onProcess={handleProcess}
                      onComplete={handleComplete}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Status message */}
              <motion.div
                className="h-6 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={messageIndex}
                    className="font-mono text-xs text-zinc-500 tracking-wide"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    {statusMessages[messageIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* Subtle progress indicator */}
              <motion.div
                className="w-20 h-[2px] rounded-full overflow-hidden bg-white/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: "linear-gradient(90deg, rgba(255,255,255,0.3), rgba(100,255,100,0.5))",
                  }}
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
