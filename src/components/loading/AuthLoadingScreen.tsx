import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const processingSteps = [
  "Initializing Core...",
  "Verifying Identity...",
  "Securing Session...",
  "Ready."
];

interface AuthLoadingScreenProps {
  message?: string;
}

export const AuthLoadingScreen = ({ message }: AuthLoadingScreenProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    // If custom message provided, don't cycle through steps
    if (message) return;

    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= processingSteps.length) {
          return 0; // Loop back
        }
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [message]);

  const displayText = message || processingSteps[stepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* The Breathing Pulse */}
      <motion.div
        className="w-24 h-1 rounded-full bg-white shadow-[0_0_4px_hsl(0_0%_100%_/_0.2)]"
        animate={{
          opacity: [0.2, 1, 0.2],
          scaleX: [1, 1.1, 1],
          boxShadow: [
            "0 0 4px hsl(0 0% 100% / 0.2)",
            "0 0 12px hsl(0 0% 100% / 0.6)",
            "0 0 4px hsl(0 0% 100% / 0.2)"
          ]
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Typewriter Micro-Copy */}
      <div className="mt-8 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={displayText}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-500 text-xs font-mono tracking-wide"
          >
            {displayText}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
};
