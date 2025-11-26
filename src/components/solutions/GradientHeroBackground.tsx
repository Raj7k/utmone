import { motion } from "framer-motion";

interface GradientHeroBackgroundProps {
  variant?: "orange-blue" | "blue-teal" | "orange-teal";
}

export const GradientHeroBackground = ({ variant = "orange-blue" }: GradientHeroBackgroundProps) => {
  const gradients = {
    "orange-blue": "from-[hsl(20,100%,51%)] via-[hsl(240,60%,40%)] to-[hsl(217,91%,50%)]",
    "blue-teal": "from-[hsl(217,91%,50%)] via-[hsl(200,70%,45%)] to-[hsl(184,100%,17.5%)]",
    "orange-teal": "from-[hsl(20,100%,51%)] via-[hsl(39,100%,50%)] to-[hsl(184,100%,17.5%)]",
  };

  return (
    <>
      {/* Main gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${gradients[variant]}`} />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "200px 200px",
        }}
      />
      
      {/* Animated glow orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30 blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </>
  );
};
