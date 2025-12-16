import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Briefcase, Mail } from "lucide-react";
import { TwitterIcon, YouTubeIcon } from "@/components/icons/SocialIcons";

// Cinematic Link Pages: One Link → Multiple Destinations with fiber-optic flows
export const LinkPagesVisual = () => {
  const [expanded, setExpanded] = useState(true);
  const appleEase = [0.4, 0.0, 0.2, 1] as const;

  useEffect(() => {
    const interval = setInterval(() => {
      setExpanded(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const destinations = [
    { y: 10, Icon: Briefcase, color: "#3B82F6" },
    { y: 22, Icon: TwitterIcon, color: "#1DA1F2" },
    { y: 34, Icon: YouTubeIcon, color: "#FF0000" },
    { y: 46, Icon: Mail, color: "#10B981" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full transform-gpu">
      <defs>
        {/* Bloom effect filter */}
        <filter id="lpBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="lpFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Source node gradient */}
        <radialGradient id="lpSourceGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#8B5CF6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.2" />
        </radialGradient>
        
        {/* Per-destination flow gradients */}
        {destinations.map((dest, i) => (
          <linearGradient key={`lpFlow-${i}`} id={`lpFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor={dest.color} stopOpacity="0.6" />
          </linearGradient>
        ))}
        
        {/* Dot grid */}
        <pattern id="lpDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      {/* Background */}
      <rect x="0" y="0" width="120" height="60" fill="url(#lpDotGrid)" opacity="0.3" />

      {/* The single input thread - descending from top */}
      <motion.line
        x1="20"
        y1="0"
        x2="20"
        y2="25"
        stroke="#8B5CF6"
        strokeWidth="1"
        strokeLinecap="round"
        filter="url(#lpFiberGlow)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: appleEase }}
      />

      {/* Central split node with bloom */}
      <motion.circle
        cx="20"
        cy="30"
        r="6"
        fill="url(#lpSourceGradient)"
        filter="url(#lpBloom)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
      />
      
      {/* Pulsing ring on source */}
      <motion.circle
        cx="20"
        cy="30"
        r="6"
        fill="none"
        stroke="#8B5CF6"
        strokeWidth="0.5"
        animate={{ 
          r: [6, 9, 6],
          opacity: [0.6, 0.1, 0.6],
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: appleEase }}
      />
      
      {/* "1" indicator */}
      <motion.text
        x="20"
        y="33"
        fill="white"
        fontSize="5"
        fontFamily="ui-monospace"
        fontWeight="bold"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        1
      </motion.text>

      {/* Fiber-optic flows to destinations */}
      {destinations.map((dest, i) => (
        <motion.g key={`branch-${i}`}>
          {/* Main fiber with gradient */}
          <motion.path
            d={`M 26 30 Q ${45 + i * 5} ${30 + (dest.y - 28) * 0.3}, 70 ${dest.y + 4}`}
            fill="none"
            stroke={`url(#lpFlow-${i})`}
            strokeWidth="1"
            strokeLinecap="round"
            filter="url(#lpFiberGlow)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: expanded ? 1 : 0 }}
            transition={{ 
              duration: 0.8, 
              delay: expanded ? 1 + i * 0.1 : 0.4 - i * 0.05,
              ease: appleEase
            }}
          />
          
          {/* Secondary strands */}
          {[-0.5, 0.5].map((offset, j) => (
            <motion.path
              key={`strand-${i}-${j}`}
              d={`M 26 ${30 + offset} Q ${45 + i * 5} ${30 + (dest.y - 28) * 0.3 + offset}, 70 ${dest.y + 4 + offset}`}
              fill="none"
              stroke={dest.color}
              strokeWidth="0.2"
              strokeLinecap="round"
              strokeOpacity="0.2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: expanded ? 1 : 0 }}
              transition={{ 
                duration: 0.8, 
                delay: expanded ? 1.1 + i * 0.1 : 0.3 - i * 0.05,
                ease: appleEase
              }}
            />
          ))}
        </motion.g>
      ))}

      {/* Destination cards with brand colors */}
      {destinations.map((dest, i) => (
        <motion.g key={`card-${i}`}>
          {/* Card background */}
          <motion.rect
            x="72"
            y={dest.y}
            width="42"
            height="10"
            rx="3"
            fill={dest.color}
            fillOpacity={0.15}
            stroke={dest.color}
            strokeOpacity={0.4}
            strokeWidth="0.4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ 
              opacity: expanded ? 1 : 0, 
              x: expanded ? 0 : 10 
            }}
            transition={{ 
              duration: 0.8, 
              delay: expanded ? 1.5 + i * 0.12 : 0,
              ease: appleEase 
            }}
          />
          
          {/* Pulsing edge */}
          <motion.rect
            x="72"
            y={dest.y}
            width="42"
            height="10"
            rx="3"
            fill="none"
            stroke={dest.color}
            strokeWidth="0.3"
            animate={{ strokeOpacity: expanded ? [0.3, 0.6, 0.3] : 0 }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: appleEase }}
          />
          
          {/* Card icon */}
          <foreignObject x="75" y={dest.y + 1} width="10" height="10">
            <motion.div 
              className="flex items-center justify-center w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: expanded ? 1 : 0 }}
              transition={{ 
                duration: 0.5, 
                delay: expanded ? 1.7 + i * 0.12 : 0,
                ease: appleEase 
              }}
            >
              <dest.Icon className="w-2.5 h-2.5" style={{ color: dest.color }} />
            </motion.div>
          </foreignObject>
          
          {/* Arrow indicator */}
          <motion.path
            d={`M 108 ${dest.y + 5} l 3 0 l -1.5 -1.5 M 111 ${dest.y + 5} l -1.5 1.5`}
            fill="none"
            stroke={dest.color}
            strokeWidth="0.4"
            strokeLinecap="round"
            strokeOpacity={0.6}
            initial={{ opacity: 0 }}
            animate={{ opacity: expanded ? 1 : 0 }}
            transition={{ delay: expanded ? 1.9 + i * 0.1 : 0 }}
          />
        </motion.g>
      ))}

      {/* Particles flowing to destinations */}
      {destinations.map((dest, i) => (
        <motion.circle
          key={`particle-${i}`}
          r="2"
          fill={dest.color}
          filter="url(#lpFiberGlow)"
          initial={{ offsetDistance: "0%", opacity: 0 }}
          animate={{ 
            offsetDistance: expanded ? ["0%", "100%"] : "0%",
            opacity: expanded ? [0, 1, 1, 0] : 0,
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1,
            delay: 1.2 + i * 0.25,
            repeat: Infinity,
            repeatDelay: 1,
            ease: appleEase,
          }}
          style={{
            offsetPath: `path("M 26 30 Q ${45 + i * 5} ${30 + (dest.y - 28) * 0.3}, 70 ${dest.y + 4}")`,
          }}
        />
      ))}

      {/* Label */}
      <motion.text
        x="92"
        y="57"
        fill="rgba(139,92,246,0.8)"
        fontSize="4.5"
        fontFamily="'SF Mono', ui-monospace, monospace"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: expanded ? 1 : 0.4 }}
        transition={{ delay: 2 }}
      >
        one link · all destinations
      </motion.text>
    </svg>
  );
};
