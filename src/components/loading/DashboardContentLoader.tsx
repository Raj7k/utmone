import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const contextMessages: Record<string, string[]> = {
  dashboard: [
    "preparing your dashboard...",
    "loading recent activity...",
    "syncing your data...",
  ],
  links: [
    "loading your links...",
    "fetching analytics...",
    "almost there...",
  ],
  analytics: [
    "crunching your numbers...",
    "analyzing performance...",
    "preparing insights...",
  ],
  events: [
    "loading event data...",
    "syncing attendees...",
    "preparing reports...",
  ],
  sales: [
    "loading sales tools...",
    "syncing contacts...",
    "ready to close...",
  ],
  intelligence: [
    "analyzing patterns...",
    "processing insights...",
    "preparing intelligence...",
  ],
};

interface DashboardContentLoaderProps {
  context?: keyof typeof contextMessages;
  minHeight?: string;
}

export const DashboardContentLoader = ({ 
  context = "dashboard",
  minHeight = "60vh" 
}: DashboardContentLoaderProps) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = contextMessages[context] || contextMessages.dashboard;

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [messages.length]);

  return (
    <div 
      className="flex flex-col items-center justify-center"
      style={{ minHeight }}
    >
      {/* Breathing Pulse Bar */}
      <motion.div
        className="w-24 h-1 rounded-full bg-foreground/80"
        animate={{
          opacity: [0.3, 1, 0.3],
          scaleX: [1, 1.1, 1],
          boxShadow: [
            "0 0 4px hsl(var(--foreground) / 0.1)",
            "0 0 16px hsl(var(--foreground) / 0.3)",
            "0 0 4px hsl(var(--foreground) / 0.1)"
          ]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Contextual Message */}
      <div className="mt-6 h-5">
        <AnimatePresence mode="wait">
          <motion.p
            key={messageIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2 }}
            className="text-muted-foreground text-sm font-mono tracking-wide"
          >
            {messages[messageIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress Dots */}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30"
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1,
              delay: i * 0.2,
              repeat: Infinity,
            }}
          />
        ))}
      </div>
    </div>
  );
};
