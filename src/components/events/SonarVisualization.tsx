import { motion } from "framer-motion";
import { MapPin, Waves } from "lucide-react";

interface SonarVisualizationProps {
  haloVisitors: number;
  liftPercentage: number;
  city: string;
  isActive?: boolean;
  size?: "sm" | "md" | "lg";
}

export const SonarVisualization = ({
  haloVisitors,
  liftPercentage,
  city,
  isActive = true,
  size = "md"
}: SonarVisualizationProps) => {
  const sizeConfig = {
    sm: { container: "w-32 h-32", center: "w-6 h-6", icon: "w-3 h-3", maxRing: 100, text: "text-xl", subtext: "text-xs" },
    md: { container: "w-64 h-64", center: "w-8 h-8", icon: "w-4 h-4", maxRing: 220, text: "text-3xl", subtext: "text-sm" },
    lg: { container: "w-80 h-80", center: "w-10 h-10", icon: "w-5 h-5", maxRing: 280, text: "text-4xl", subtext: "text-base" },
  };

  const config = sizeConfig[size];

  return (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Background glow */}
      <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl" />
      
      {/* Ripple Waves */}
      {isActive && [1, 2, 3, 4].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border border-primary/30"
          style={{
            width: 40,
            height: 40,
          }}
          animate={{
            width: [40, config.maxRing],
            height: [40, config.maxRing],
            opacity: [0.6, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: ring * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
      
      {/* Static rings for inactive state */}
      {!isActive && [60, 100, 140, 180].map((ringSize, i) => (
        <div
          key={ringSize}
          className="absolute rounded-full border border-muted-foreground/20"
          style={{ width: Math.min(ringSize, config.maxRing * 0.8), height: Math.min(ringSize, config.maxRing * 0.8) }}
        />
      ))}
      
      {/* Central Booth Dot */}
      <motion.div 
        className={`absolute ${config.center} rounded-full bg-primary flex items-center justify-center`}
        animate={isActive ? {
          boxShadow: [
            "0 0 20px hsl(var(--primary) / 0.3)",
            "0 0 40px hsl(var(--primary) / 0.5)",
            "0 0 20px hsl(var(--primary) / 0.3)",
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Waves className={`${config.icon} text-primary-foreground`} />
      </motion.div>
      
      {/* Stats Overlay */}
      <div className="absolute -bottom-4 text-center">
        <motion.p 
          className={`${config.text} font-bold text-foreground`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {haloVisitors.toLocaleString()}
        </motion.p>
        <motion.p 
          className={`${config.subtext} text-muted-foreground`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {city} • <span className="text-primary">+{liftPercentage}% lift</span>
        </motion.p>
      </div>
    </div>
  );
};
