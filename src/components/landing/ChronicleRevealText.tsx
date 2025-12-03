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
      <svg
        className="w-full h-auto"
        viewBox="0 0 2000 400"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Blaze Orange stroke gradient */}
          <linearGradient id="blazeStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--blazeOrange))" />
            <stop offset="100%" stopColor="hsl(20 80% 45%)" />
          </linearGradient>
          
          {/* Retro fill gradient (orange → blue → deep purple) */}
          <linearGradient id="retroFillGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--blazeOrange))" />
            <stop offset="40%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--deepSea))" />
          </linearGradient>
          
          {/* 3D Shadow Filter */}
          <filter id="shadow3d" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="4" dy="4" stdDeviation="3" floodColor="hsl(var(--blazeOrange))" floodOpacity="0.3"/>
            <feDropShadow dx="8" dy="8" stdDeviation="6" floodColor="hsl(var(--primary))" floodOpacity="0.2"/>
            <feDropShadow dx="12" dy="12" stdDeviation="10" floodColor="hsl(var(--deepSea))" floodOpacity="0.1"/>
          </filter>
          
          {/* Clip path that reveals based on mouse position */}
          <clipPath id="revealClip">
            <motion.rect
              x="0"
              y="0"
              height="100%"
              animate={{ width: isHovering ? `${fillPercent}%` : "0%" }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </clipPath>
        </defs>
        
        {/* 3D Shadow layer (behind everything) */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-extrabold"
          filter="url(#shadow3d)"
          style={{
            fontSize: "400px",
            fill: "transparent",
            stroke: "url(#blazeStrokeGradient)",
            strokeWidth: "1.5px",
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </text>
        
        {/* Outline text (stroke only, no fill) - Blaze Orange */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-extrabold"
          style={{
            fontSize: "400px",
            fill: "transparent",
            stroke: "url(#blazeStrokeGradient)",
            strokeWidth: "1.5px",
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </text>
        
        {/* Fill text (revealed on hover) - Retro gradient */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-extrabold"
          clipPath="url(#revealClip)"
          style={{
            fontSize: "400px",
            fill: "url(#retroFillGradient)",
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
