import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

interface SonarVisualizationProps {
  haloVisitors: number;
  liftPercentage: number;
  city: string;
  isActive?: boolean;
}

export const SonarVisualization = ({
  haloVisitors,
  liftPercentage,
  city,
  isActive = true
}: SonarVisualizationProps) => {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
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
            width: [40, 220],
            height: [40, 220],
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
      {!isActive && [60, 100, 140, 180].map((size, i) => (
        <div
          key={size}
          className="absolute rounded-full border border-muted-foreground/20"
          style={{ width: size, height: size }}
        />
      ))}
      
      {/* Central Booth Dot */}
      <motion.div 
        className="absolute w-8 h-8 rounded-full bg-primary flex items-center justify-center"
        animate={isActive ? {
          boxShadow: [
            "0 0 20px rgba(255,255,255,0.3)",
            "0 0 40px rgba(255,255,255,0.5)",
            "0 0 20px rgba(255,255,255,0.3)",
          ]
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <MapPin className="w-4 h-4 text-primary-foreground" />
      </motion.div>
      
      {/* Stats Overlay */}
      <div className="absolute -bottom-4 text-center">
        <motion.p 
          className="text-3xl font-bold text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {haloVisitors.toLocaleString()}
        </motion.p>
        <motion.p 
          className="text-sm text-muted-foreground"
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
