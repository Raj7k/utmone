import { useRef, useState } from "react";
import { motion } from "framer-motion";

interface FooterRevealTextProps {
  text?: string;
  className?: string;
}

export const FooterRevealText = ({ text = "utm.one", className = "" }: FooterRevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fillPercent, setFillPercent] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setFillPercent(percent);
  };

  const handleMouseEnter = () => setIsHovering(true);
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
      className={`relative w-full cursor-pointer select-none ${className}`}
    >
      <svg
        viewBox="0 0 600 140"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Zinc fill gradient */}
          <linearGradient id="footerZincFill" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgb(161, 161, 170)" /> {/* zinc-400 */}
            <stop offset="100%" stopColor="rgb(113, 113, 122)" /> {/* zinc-500 */}
          </linearGradient>

          {/* Clip path for reveal animation */}
          <clipPath id="footerRevealClip">
            <motion.rect
              x="0"
              y="0"
              height="140"
              animate={{
                width: isHovering ? (fillPercent / 100) * 600 : 0,
              }}
              transition={{ duration: 0.1, ease: "easeOut" }}
            />
          </clipPath>
        </defs>

        {/* Stroke-only text (always visible) */}
        <text
          x="300"
          y="100"
          textAnchor="middle"
          className="font-display font-bold"
          style={{
            fontSize: "120px",
            fill: "transparent",
            stroke: "rgb(63, 63, 70)", // zinc-700
            strokeWidth: "1.5px",
            letterSpacing: "-0.02em",
          }}
        >
          {text}
        </text>

        {/* Filled text (revealed on hover) */}
        <text
          x="300"
          y="100"
          textAnchor="middle"
          className="font-display font-bold"
          clipPath="url(#footerRevealClip)"
          style={{
            fontSize: "120px",
            fill: "url(#footerZincFill)",
            stroke: "rgb(113, 113, 122)", // zinc-500
            strokeWidth: "0.5px",
            letterSpacing: "-0.02em",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};
