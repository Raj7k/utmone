import { motion } from "framer-motion";
import { useEffect, useState } from "react";

// Apple Pro aesthetic: "One Link, All Destinations"
// Single thread unraveling into organized cards with mechanical precision
export const LinkPagesVisual = () => {
  const [expanded, setExpanded] = useState(true);
  const appleSpring = [0.16, 1, 0.3, 1] as const;

  useEffect(() => {
    // Loop animation: expand → hold → collapse → hold
    const interval = setInterval(() => {
      setExpanded(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const destinations = [
    { y: 10, label: "Portfolio" },
    { y: 22, label: "Twitter" },
    { y: 34, label: "YouTube" },
    { y: 46, label: "Contact" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {/* Frosted glass card gradient */}
        <linearGradient id="lpCardGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(26,26,26,0.9)" />
          <stop offset="100%" stopColor="rgba(26,26,26,0.7)" />
        </linearGradient>
      </defs>
      
      {/* Transparent background */}

      {/* The single input thread - descending from top */}
      <motion.line
        x1="20"
        y1="0"
        x2="20"
        y2="30"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="0.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: appleSpring }}
      />

      {/* Central split point - tiny node */}
      <motion.circle
        cx="20"
        cy="30"
        r="2"
        fill="rgba(26,26,26,0.9)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="0.3"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200, damping: 15 }}
      />

      {/* Branching lines - 90° mechanical turns */}
      {destinations.map((dest, i) => {
        const midX = 20 + (i + 1) * 8;
        const isTop = dest.y < 30;
        
        return (
          <motion.g key={`branch-${i}`}>
            {/* Horizontal segment from center */}
            <motion.line
              x1="22"
              y1="30"
              x2={midX}
              y2="30"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: expanded ? 1 : 0 }}
              transition={{ 
                duration: 0.6, 
                delay: expanded ? 1 + i * 0.1 : 0.4 - i * 0.05,
                ease: appleSpring 
              }}
            />
            
            {/* Vertical segment to destination */}
            <motion.line
              x1={midX}
              y1="30"
              x2={midX}
              y2={dest.y + 4}
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.4"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: expanded ? 1 : 0 }}
              transition={{ 
                duration: 0.5, 
                delay: expanded ? 1.3 + i * 0.1 : 0.2 - i * 0.03,
                ease: appleSpring 
              }}
            />
            
            {/* Horizontal to card */}
            <motion.line
              x1={midX}
              y1={dest.y + 4}
              x2="70"
              y2={dest.y + 4}
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="0.3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: expanded ? 1 : 0 }}
              transition={{ 
                duration: 0.7, 
                delay: expanded ? 1.5 + i * 0.1 : 0,
                ease: appleSpring 
              }}
            />
          </motion.g>
        );
      })}

      {/* Destination cards - frosted glass with Apple radius */}
      {destinations.map((dest, i) => (
        <motion.g key={`card-${i}`}>
          {/* Card background */}
          <motion.rect
            x="72"
            y={dest.y}
            width="40"
            height="8"
            rx="2"
            fill="url(#lpCardGlass)"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: expanded ? 1 : 0, 
              x: expanded ? 0 : 10 
            }}
            transition={{ 
              duration: 0.8, 
              delay: expanded ? 1.8 + i * 0.12 : 0,
              ease: appleSpring 
            }}
          />
          
          {/* Card label */}
          <motion.text
            x="76"
            y={dest.y + 5.5}
            fill="rgba(255,255,255,0.7)"
            fontSize="3.5"
            fontFamily="'SF Mono', ui-monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ 
              duration: 0.5, 
              delay: expanded ? 2 + i * 0.12 : 0,
              ease: appleSpring 
            }}
          >
            {dest.label}
          </motion.text>
          
          {/* Arrow indicator */}
          <motion.path
            d={`M 106 ${dest.y + 4} l 3 0 l -1.5 -1.5 M 109 ${dest.y + 4} l -1.5 1.5`}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="0.3"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ delay: expanded ? 2.2 + i * 0.1 : 0 }}
          />
        </motion.g>
      ))}

      {/* "1" indicator on source thread */}
      <motion.text
        x="20"
        y="8"
        fill="rgba(255,255,255,0.6)"
        fontSize="4"
        fontFamily="'SF Mono', ui-monospace"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        1
      </motion.text>

      {/* Label */}
      <motion.text
        x="92"
        y="57"
        fill="rgba(113,113,122,0.6)"
        fontSize="3.5"
        fontFamily="'SF Mono', ui-monospace"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded ? 1 : 0.3 }}
        transition={{ delay: 2.5 }}
      >
        one link · all destinations
      </motion.text>
    </svg>
  );
};
