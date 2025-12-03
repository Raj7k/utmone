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
        viewBox="0 0 6000 1000"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Blaze Orange stroke gradient */}
          <linearGradient id="blazeStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(20, 100%, 51%)" />
            <stop offset="100%" stopColor="hsl(20, 80%, 45%)" />
          </linearGradient>
          
          {/* EXACT Hero fill gradient (warm rust → blaze orange → deep sea teal → mirage navy) */}
          <linearGradient id="heroFillGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(20, 80%, 45%)" />
            <stop offset="15%" stopColor="hsl(20, 100%, 51%)" />
            <stop offset="50%" stopColor="hsl(184, 89%, 18%)" />
            <stop offset="85%" stopColor="hsl(205, 29%, 13%)" />
            <stop offset="100%" stopColor="hsl(205, 29%, 13%)" />
          </linearGradient>
          
          {/* Outer Glow Filter - Orange glow around text */}
          <filter id="outerGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur"/>
            <feFlood floodColor="hsl(20, 100%, 51%)" floodOpacity="0.5"/>
            <feComposite in2="blur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          {/* Enhanced 3D Shadow Filter - Larger offsets, higher opacity */}
          <filter id="shadow3d" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="6" dy="6" stdDeviation="4" floodColor="hsl(20, 100%, 51%)" floodOpacity="0.5"/>
            <feDropShadow dx="12" dy="12" stdDeviation="8" floodColor="hsl(184, 89%, 18%)" floodOpacity="0.4"/>
            <feDropShadow dx="20" dy="20" stdDeviation="16" floodColor="hsl(205, 29%, 13%)" floodOpacity="0.3"/>
          </filter>
          
          {/* Combined glow + shadow for filled text */}
          <filter id="glowShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="15" result="blur"/>
            <feFlood floodColor="hsl(20, 100%, 51%)" floodOpacity="0.6"/>
            <feComposite in2="blur" operator="in" result="glow"/>
            <feDropShadow dx="8" dy="8" stdDeviation="6" floodColor="hsl(20, 100%, 51%)" floodOpacity="0.4"/>
            <feDropShadow dx="16" dy="16" stdDeviation="12" floodColor="hsl(184, 89%, 18%)" floodOpacity="0.3"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
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
            fontSize: "900px",
            fill: "transparent",
            stroke: "url(#blazeStrokeGradient)",
            strokeWidth: "2.5px",
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </text>
        
        {/* Outline text (stroke only, no fill) - Blaze Orange with glow */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-extrabold"
          filter="url(#outerGlow)"
          style={{
            fontSize: "900px",
            fill: "transparent",
            stroke: "url(#blazeStrokeGradient)",
            strokeWidth: "2.5px",
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </text>
        
        {/* Fill text (revealed on hover) - Hero gradient with enhanced glow */}
        <text
          x="50%"
          y="55%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="font-display font-extrabold"
          clipPath="url(#revealClip)"
          filter="url(#glowShadow)"
          style={{
            fontSize: "900px",
            fill: "url(#heroFillGradient)",
            letterSpacing: "-0.03em",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
