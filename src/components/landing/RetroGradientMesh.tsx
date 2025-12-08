import { motion } from "framer-motion";

export const RetroGradientMesh = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient layer - Obsidian dark */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom right, rgba(255,255,255,0.02), #050505, #050505)'
        }}
      />
      
      {/* Animated gradient orbs */}
      {/* Top-left: Primary blue orb */}
      <motion.div
        className="absolute -top-[20%] -left-[15%] w-[800px] h-[800px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(243 70% 24% / 0.4) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.15, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Bottom-right: Deep blue orb */}
      <motion.div
        className="absolute -bottom-[10%] -right-[10%] w-[700px] h-[700px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(217 91% 50% / 0.25) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -40, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Center-right: Platinum accent */}
      <motion.div
        className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full blur-[80px]"
        style={{
          background: "radial-gradient(circle, hsl(0 0% 90% / 0.08) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Top-right: Subtle platinum blend */}
      <motion.div
        className="absolute -top-[5%] right-[20%] w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, hsl(240 10% 70% / 0.1) 0%, transparent 70%)"
        }}
        animate={{
          scale: [1, 1.12, 1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Animated wave paths SVG layer */}
      <svg 
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Noise/grain filter */}
          <filter id="grain">
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.8" 
              numOctaves="4" 
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </defs>
        
        {/* Wave path 1 */}
        <motion.path
          d="M0,100 Q250,50 500,100 T1000,100 T1500,100 T2000,100"
          stroke="hsl(243 70% 24% / 0.04)"
          strokeWidth="2"
          fill="none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -1000 }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          strokeDasharray="10 20"
        />
        
        {/* Wave path 2 */}
        <motion.path
          d="M0,300 Q300,250 600,300 T1200,300 T1800,300"
          stroke="hsl(217 91% 50% / 0.025)"
          strokeWidth="2"
          fill="none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 1000 }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          strokeDasharray="15 25"
        />
        
        {/* Wave path 3 */}
        <motion.path
          d="M0,500 Q200,450 400,500 T800,500 T1200,500 T1600,500"
          stroke="hsl(0 0% 80% / 0.02)"
          strokeWidth="1.5"
          fill="none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -800 }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear"
          }}
          strokeDasharray="20 30"
        />
        
        {/* Grain texture overlay */}
        <rect 
          width="100%" 
          height="100%" 
          filter="url(#grain)" 
          opacity="0.04"
          style={{ mixBlendMode: 'overlay' }}
        />
      </svg>
      
      {/* Subtle vignette for depth - dark Obsidian fade */}
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(5, 5, 5, 0.3) 100%)"
        }}
      />
    </div>
  );
};
