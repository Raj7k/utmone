import { useState, useEffect } from "react";

const processingSteps = [
  "Initializing Core...",
  "Verifying Identity...",
  "Optimizing Route...",
  "Ready."
];

interface BreathingMonolithProps {
  onComplete?: () => void;
  duration?: number;
}

export const BreathingMonolith = ({ onComplete, duration = 3000 }: BreathingMonolithProps) => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next >= processingSteps.length) {
          clearInterval(interval);
          setTimeout(() => onComplete?.(), 400);
          return prev;
        }
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* The Breathing Pulse - CSS Animation */}
      <div className="w-24 h-1 rounded-full bg-white animate-breathing-pulse" />

      {/* Typewriter Micro-Copy - CSS Animation */}
      <div className="mt-8 h-5">
        <p
          key={stepIndex}
          className="text-zinc-500 text-xs font-mono tracking-wide animate-fade-in"
        >
          {processingSteps[stepIndex]}
        </p>
      </div>

      <style>{`
        @keyframes breathing-pulse {
          0%, 100% {
            opacity: 0.2;
            transform: scaleX(1);
            box-shadow: 0 0 4px hsl(0 0% 100% / 0.2);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.1);
            box-shadow: 0 0 12px hsl(0 0% 100% / 0.6);
          }
        }
        .animate-breathing-pulse {
          animation: breathing-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
