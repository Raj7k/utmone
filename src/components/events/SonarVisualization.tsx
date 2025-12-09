import { motion } from "framer-motion";
import { Waves } from "lucide-react";

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
    sm: { container: "w-32 h-32", center: "w-6 h-6", icon: "w-3 h-3", maxRing: 100, text: "text-xl", subtext: "text-xs", particles: 6 },
    md: { container: "w-64 h-64", center: "w-8 h-8", icon: "w-4 h-4", maxRing: 220, text: "text-3xl", subtext: "text-sm", particles: 10 },
    lg: { container: "w-80 h-80", center: "w-10 h-10", icon: "w-5 h-5", maxRing: 280, text: "text-4xl", subtext: "text-base", particles: 14 },
  };

  const config = sizeConfig[size];

  // Generate random particle positions
  const particles = Array.from({ length: config.particles }).map((_, i) => ({
    id: i,
    angle: (360 / config.particles) * i + Math.random() * 20,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 1.5,
  }));

  return (
    <div className={`relative ${config.container} flex items-center justify-center`}>
      {/* Background glow */}
      <motion.div 
        className="absolute inset-0 bg-primary/10 rounded-full blur-3xl"
        animate={isActive ? {
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        } : {}}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Ripple Waves */}
      {isActive && [1, 2, 3, 4, 5].map((ring) => (
        <motion.div
          key={ring}
          className="absolute rounded-full border-2 border-primary/40"
          style={{
            width: 40,
            height: 40,
          }}
          animate={{
            width: [40, config.maxRing],
            height: [40, config.maxRing],
            opacity: [0.8, 0],
            borderWidth: [2, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: ring * 0.5,
            ease: "easeOut",
          }}
        />
      ))}

      {/* Floating Photon Particles */}
      {isActive && particles.map((particle) => {
        const radians = (particle.angle * Math.PI) / 180;
        const endX = Math.cos(radians) * (config.maxRing / 2);
        const endY = Math.sin(radians) * (config.maxRing / 2);
        
        return (
          <motion.div
            key={particle.id}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary"
            style={{
              boxShadow: "0 0 8px hsl(var(--primary)), 0 0 16px hsl(var(--primary) / 0.5)",
            }}
            animate={{
              x: [0, endX],
              y: [0, endY],
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeOut",
            }}
          />
        );
      })}
      
      {/* Static rings for inactive state */}
      {!isActive && [60, 100, 140, 180].map((ringSize) => (
        <div
          key={ringSize}
          className="absolute rounded-full border border-muted-foreground/20"
          style={{ width: Math.min(ringSize, config.maxRing * 0.8), height: Math.min(ringSize, config.maxRing * 0.8) }}
        />
      ))}
      
      {/* Central Booth Dot */}
      <motion.div 
        className={`absolute ${config.center} rounded-full bg-primary flex items-center justify-center z-10`}
        animate={isActive ? {
          boxShadow: [
            "0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2)",
            "0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary) / 0.3)",
            "0 0 20px hsl(var(--primary) / 0.4), 0 0 40px hsl(var(--primary) / 0.2)",
          ],
          scale: [1, 1.05, 1],
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
      <div className="absolute -bottom-4 text-center z-10">
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
          {city} • <span className="text-primary font-medium">+{liftPercentage}% lift</span>
        </motion.p>
      </div>
    </div>
  );
};
