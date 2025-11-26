import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface AnimatedConnectingLineProps {
  index: number;
  total: number;
}

export const AnimatedConnectingLine = ({ index, total }: AnimatedConnectingLineProps) => {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Don't render line after last card
  if (index >= total - 1) return null;

  return (
    <svg
      ref={ref}
      className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+1rem)] w-16 h-2 z-0 hidden lg:block"
      viewBox="0 0 64 8"
      fill="none"
    >
      <motion.path
        d="M 0 4 L 64 4"
        stroke="url(#gradient)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: index * 0.2 + 0.5, ease: "easeOut" }}
      />
      
      {/* Animated pulse particle */}
      <motion.circle
        r="3"
        fill="hsl(var(--blazeOrange))"
        initial={{ cx: 0, opacity: 0 }}
        animate={isInView ? { 
          cx: 64,
          opacity: [0, 1, 1, 0],
        } : { cx: 0, opacity: 0 }}
        transition={{
          duration: 1.5,
          delay: index * 0.2 + 1.2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 2,
        }}
        cy="4"
      />

      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--blazeOrange))" />
          <stop offset="50%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--deepSea))" />
        </linearGradient>
      </defs>
    </svg>
  );
};
