import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";

const loadingMessages = [
  "simplicity is loading…",
  "clarity is loading…",
  "discipline is loading…",
  "data you can trust is loading…",
  "the future of clean tracking is loading…",
  "every link is becoming meaningful…",
  "giving your URLs a language…",
  "making metadata trustworthy…",
  "bringing order to your tracking universe…",
  "your link governance starts here…",
  "initialising tracking architecture…",
  "standardising parameters and formats…",
  "loading naming rules…",
  "running UTM QA checks…",
  "mapping campaigns to analytics…",
  "optimising metadata for LLMs…",
];

interface LoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
  showProgress?: boolean;
}

export const LoadingScreen = ({ 
  onComplete, 
  duration = 40000,
  showProgress = true 
}: LoadingScreenProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messageInterval = duration / loadingMessages.length;

  useEffect(() => {
    const messageTimer = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % loadingMessages.length;
        if (next === 0 && onComplete) {
          onComplete();
        }
        return next;
      });
    }, messageInterval);

    return () => clearInterval(messageTimer);
  }, [messageInterval, onComplete]);

  useEffect(() => {
    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / duration) * 100;
        return prev >= 100 ? 0 : prev + increment;
      });
    }, 100);

    return () => clearInterval(progressTimer);
  }, [duration]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="hero-glow absolute inset-0 pointer-events-none" />
      
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-5xl px-6 space-y-16">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <UtmOneLogo size="lg" />
        </motion.div>

        {/* Animated Messages */}
        <div className="relative h-48 flex items-center justify-center w-full">
          <AnimatePresence mode="wait">
            <motion.h1
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.6,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center hero-gradient leading-tight"
            >
              {loadingMessages[currentIndex]}
            </motion.h1>
          </AnimatePresence>
        </div>

        {/* Progress Indicator */}
        {showProgress && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-full max-w-md space-y-3"
          >
            {/* Progress Dots */}
            <div className="flex items-center justify-center gap-2">
              {loadingMessages.map((_, index) => (
                <motion.div
                  key={index}
                  className="rounded-full"
                  animate={{
                    backgroundColor: index === currentIndex 
                      ? "hsl(217 91% 60%)" 
                      : "hsl(222 20% 80%)",
                    scale: index === currentIndex ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{
                    width: index === currentIndex ? "12px" : "8px",
                    height: index === currentIndex ? "12px" : "8px",
                  }}
                />
              ))}
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-muted/20 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[hsl(20_100%_51%)] via-[hsl(217_91%_60%)] to-[hsl(184_89%_18%)]"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
