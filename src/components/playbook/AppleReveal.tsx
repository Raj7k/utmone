import { motion, Variants } from "framer-motion";
import { ReactNode } from "react";

interface AppleRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: boolean;
}

const getVariants = (direction: string, blur: boolean): Variants => {
  const offset = 60;
  const initial: any = { opacity: 0, scale: 0.95 };
  
  if (blur) initial.filter = "blur(10px)";
  
  switch (direction) {
    case "up": initial.y = offset; break;
    case "down": initial.y = -offset; break;
    case "left": initial.x = offset; break;
    case "right": initial.x = -offset; break;
  }
  
  return {
    hidden: initial,
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // Apple ease
      }
    }
  };
};

export const AppleReveal = ({ 
  children, 
  className = "", 
  delay = 0, 
  direction = "up",
  blur = false 
}: AppleRevealProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={getVariants(direction, blur)}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Staggered container for multiple items
interface StaggeredRevealProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggeredReveal = ({ 
  children, 
  className = "",
  staggerDelay = 0.1
}: StaggeredRevealProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggeredItem = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40, scale: 0.95 },
        visible: { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
