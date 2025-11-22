import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
}

export const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0,
  direction = "up" 
}: AnimatedSectionProps) => {
  const directionVariants = {
    up: { y: 40, opacity: 0 },
    down: { y: -40, opacity: 0 },
    left: { x: 40, opacity: 0 },
    right: { x: -40, opacity: 0 },
    fade: { opacity: 0 }
  };

  return (
    <motion.div
      initial={directionVariants[direction]}
      whileInView={{ 
        x: 0, 
        y: 0, 
        opacity: 1 
      }}
      viewport={{ 
        once: true, 
        margin: "-100px",
        amount: 0.3
      }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
