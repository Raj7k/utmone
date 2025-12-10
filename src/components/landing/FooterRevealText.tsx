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
      <motion.svg
        viewBox="0 0 1200 280"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        animate={{
          scale: isHovering ? 1.01 : 1,
        }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        <defs>
          {/* Premium 5-stop platinum/chrome metallic gradient */}
          <linearGradient id="platinumMetallic" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(0, 0%, 100%)" />
            <stop offset="25%" stopColor="hsl(240, 5%, 89%)" />
            <stop offset="50%" stopColor="hsl(240, 4%, 65%)" />
            <stop offset="75%" stopColor="hsl(240, 5%, 84%)" />
            <stop offset="100%" stopColor="hsl(0, 0%, 98%)" />
          </linearGradient>

          {/* Stroke gradient for depth */}
          <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(240, 4%, 46%)" />
            <stop offset="100%" stopColor="hsl(240, 5%, 26%)" />
          </linearGradient>

          {/* Shimmer gradient for animation */}
          <linearGradient id="shimmerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0" />
            <stop offset="50%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="hsl(0, 0%, 100%)" stopOpacity="0" />
            <animate
              attributeName="x1"
              values="-100%;100%"
              dur="2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="x2"
              values="0%;200%"
              dur="2s"
              repeatCount="indefinite"
            />
          </linearGradient>

          {/* Metallic glow filter */}
          <filter id="metalGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
            <feFlood floodColor="hsl(0, 0%, 100%)" floodOpacity="0.35"/>
            <feComposite in2="coloredBlur" operator="in" result="glow"/>
            <feMerge>
              <feMergeNode in="glow"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          {/* Glass reflection filter */}
          <filter id="glassReflection" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur stdDeviation="1" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1" specularExponent="20" result="specular">
              <fePointLight x="600" y="-100" z="400"/>
            </feSpecularLighting>
            <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>

          {/* Clip path for reveal animation */}
          <clipPath id="footerRevealClip">
            <motion.rect
              x="0"
              y="0"
              height="280"
              animate={{
                width: isHovering ? (fillPercent / 100) * 1200 : 0,
              }}
              transition={{ duration: 0.08, ease: "easeOut" }}
            />
          </clipPath>
        </defs>

        {/* Stroke-only text (always visible) - sharper with tighter tracking */}
        <text
          x="600"
          y="200"
          textAnchor="middle"
          className="font-display font-bold"
          style={{
            fontSize: "240px",
            fill: "transparent",
            stroke: "hsl(240, 4%, 26%)",
            strokeWidth: "2px",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            letterSpacing: "-0.04em",
          }}
        >
          {text}
        </text>

        {/* Filled text with metallic gradient (revealed on hover) */}
        <text
          x="600"
          y="200"
          textAnchor="middle"
          className="font-display font-bold"
          clipPath="url(#footerRevealClip)"
          filter={isHovering ? "url(#metalGlow)" : undefined}
          style={{
            fontSize: "240px",
            fill: "url(#platinumMetallic)",
            stroke: "url(#strokeGradient)",
            strokeWidth: "1px",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            letterSpacing: "-0.04em",
            transition: "filter 0.2s ease-out",
          }}
        >
          {text}
        </text>

        {/* Shimmer overlay (only visible on hover) */}
        {isHovering && (
          <text
            x="600"
            y="200"
            textAnchor="middle"
            className="font-display font-bold"
            clipPath="url(#footerRevealClip)"
            style={{
              fontSize: "240px",
              fill: "url(#shimmerGradient)",
              letterSpacing: "-0.04em",
              pointerEvents: "none",
            }}
          >
            {text}
          </text>
        )}
      </motion.svg>
    </div>
  );
};
