import { ReactNode, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  className?: string;
}

export const ScrollReveal = ({ 
  children, 
  delay = 0, 
  direction = "up",
  className = ""
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Optionally unobserve after first trigger
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getInitialState = () => {
    switch (direction) {
      case "up":
        return { opacity: 0, y: 40 };
      case "down":
        return { opacity: 0, y: -40 };
      case "left":
        return { opacity: 0, x: 40 };
      case "right":
        return { opacity: 0, x: -40 };
      default:
        return { opacity: 0, y: 40 };
    }
  };

  const getAnimateState = () => {
    switch (direction) {
      case "up":
        return { opacity: 1, y: 0 };
      case "down":
        return { opacity: 1, y: 0 };
      case "left":
        return { opacity: 1, x: 0 };
      case "right":
        return { opacity: 1, x: 0 };
      default:
        return { opacity: 1, y: 0 };
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={getInitialState()}
      animate={isVisible ? getAnimateState() : getInitialState()}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: [0.4, 0, 0.2, 1] // Apple-style easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
