import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface ParallaxTextProps {
  children: string;
  speed?: number;
  className?: string;
}

export const ParallaxText = ({ children, speed = 0.5, className = "" }: ParallaxTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50 * speed]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.5]);

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y, opacity }}>
        {children}
      </motion.div>
    </div>
  );
};
