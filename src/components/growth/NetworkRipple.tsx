import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface NetworkRippleProps {
  isActive: boolean;
  onComplete?: () => void;
  centerElement?: React.ReactNode;
}

export const NetworkRipple = ({ isActive, onComplete, centerElement }: NetworkRippleProps) => {
  const [showNodes, setShowNodes] = useState(false);

  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => setShowNodes(true), 300);
      const completeTimer = setTimeout(() => {
        onComplete?.();
      }, 2000);
      return () => {
        clearTimeout(timer);
        clearTimeout(completeTimer);
      };
    } else {
      setShowNodes(false);
    }
  }, [isActive, onComplete]);

  // Node positions around the circle (6 nodes)
  const nodePositions = [
    { x: 0, y: -60 },
    { x: 52, y: -30 },
    { x: 52, y: 30 },
    { x: 0, y: 60 },
    { x: -52, y: 30 },
    { x: -52, y: -30 },
  ];

  return (
    <AnimatePresence>
      {isActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/90 backdrop-blur-sm">
          {/* Noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />

          <div className="relative">
            {/* Center Element (Avatar or Logo) */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="relative z-10 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center"
              style={{
                boxShadow: "0 0 20px rgba(255,255,255,0.3)"
              }}
            >
              {centerElement || (
                <div className="w-6 h-6 rounded-full bg-white/80" />
              )}
            </motion.div>

            {/* Ripple Circles */}
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="absolute inset-0 rounded-full border border-white/20"
                style={{
                  width: 48,
                  height: 48,
                  left: 0,
                  top: 0,
                }}
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 3, opacity: 0 }}
                transition={{
                  duration: 1.5,
                  delay: index * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Connection Nodes */}
            {showNodes && nodePositions.map((pos, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 rounded-full bg-white"
                style={{
                  left: 24 + pos.x - 4,
                  top: 24 + pos.y - 4,
                  boxShadow: "0 0 8px rgba(255,255,255,0.5)"
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Connection Lines */}
            {showNodes && nodePositions.map((pos, index) => (
              <motion.div
                key={`line-${index}`}
                className="absolute bg-white/10"
                style={{
                  width: 1,
                  height: Math.sqrt(pos.x * pos.x + pos.y * pos.y),
                  left: 24,
                  top: 24,
                  transformOrigin: "top center",
                  transform: `rotate(${Math.atan2(pos.x, -pos.y) * (180 / Math.PI)}deg)`,
                }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 0.2 + index * 0.08,
                  ease: "easeOut",
                }}
              />
            ))}
          </div>

          {/* Feedback Text */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            className="absolute bottom-1/3 text-zinc-500 text-xs font-mono tracking-wide"
          >
            Signal Sent. Tracking active.
          </motion.p>
        </div>
      )}
    </AnimatePresence>
  );
};
