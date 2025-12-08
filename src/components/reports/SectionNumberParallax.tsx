import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface SectionNumberParallaxProps {
  number: string;
  className?: string;
}

export const SectionNumberParallax = ({ number, className = '' }: SectionNumberParallaxProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className={`absolute left-0 top-0 pointer-events-none ${className}`}>
      <motion.div
        style={{ y, opacity }}
        className="text-[200px] md:text-[300px] font-display font-bold text-foreground/5 leading-none"
      >
        {number}
      </motion.div>
    </div>
  );
};
