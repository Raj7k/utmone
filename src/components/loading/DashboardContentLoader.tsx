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
  bulk: [
    "preparing bulk upload...",
    "loading templates...",
    "getting ready...",
  ],
  qr: [
    "loading QR codes...",
    "preparing preview...",
    "almost ready...",
  ],
  targeting: [
    "loading targeting rules...",
    "fetching geo data...",
    "preparing options...",
  ],
  experiments: [
    "loading experiments...",
    "preparing test data...",
    "analyzing results...",
  ],
  linkpages: [
    "loading link pages...",
    "preparing your pages...",
    "almost ready...",
  ],
};

interface DashboardContentLoaderProps {
  context?: keyof typeof contextMessages;
  minHeight?: string;
}

// PHASE 10: Pure CSS animations - no framer-motion import
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
      {/* Breathing Pulse Bar - Pure CSS */}
      <div className="w-24 h-1 rounded-full bg-foreground/80 animate-breathing-pulse" />

      {/* Contextual Message - CSS fade */}
      <div className="mt-6 h-5">
        <p
          key={messageIndex}
          className="text-muted-foreground text-sm font-mono tracking-wide animate-fade-in"
        >
          {messages[messageIndex]}
        </p>
      </div>

      {/* Progress Dots - Pure CSS */}
      <div className="mt-4 flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30 animate-dot-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
};
