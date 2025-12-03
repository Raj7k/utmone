import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface ChronicleRevealTextProps {
  text: string;
  className?: string;
}

export const ChronicleRevealText = ({ text, className = "" }: ChronicleRevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPercent, setFillPercent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const percent = ((e.clientX - rect.left) / rect.width) * 100;
      setFillPercent(Math.max(0, Math.min(100, percent)));
    }
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setFillPercent(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative cursor-default select-none ${className}`}
    >
      {/* Outline layer (always visible) - using SVG for true stroke */}
      <svg
        className="w-full h-auto"
        viewBox="0 0 400 80"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradient for stroke (outline) */}
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--blazeOrange))" />
          </linearGradient>
          
          {/* Gradient for fill */}
          <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--blazeOrange))" />
          </linearGradient>
          
          {/* Clip path that reveals based on mouse position */}
          <clipPath id="revealClip">
            <motion.rect
              x="0"
              y="0"
              height="100%"
              animate={{ width: isHovering ? `${fillPercent}%` : "0%" }}
              transition={{ duration: 0.05, ease: "linear" }}
            />
          </clipPath>
        </defs>
        
        {/* Outline text (stroke only, no fill) */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-bold"
          style={{
            fontSize: "64px",
            fill: "transparent",
            stroke: "url(#strokeGradient)",
            strokeWidth: "1.5px",
            letterSpacing: "-0.02em",
          }}
        >
          {text}
        </text>
        
        {/* Fill text (revealed on hover) */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-bold"
          clipPath="url(#revealClip)"
          style={{
            fontSize: "64px",
            fill: "url(#fillGradient)",
            letterSpacing: "-0.02em",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
