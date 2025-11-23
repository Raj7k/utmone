import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BrandQuoteProps {
  text: string;
  position?: 'left' | 'center' | 'right';
  opacity?: number;
  className?: string;
}

export const BrandQuote = ({ 
  text, 
  position = 'center',
  opacity = 0.08,
  className = ''
}: BrandQuoteProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect - moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.95]);
  const fadeOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, opacity, opacity, 0]);

  const getPositionClass = () => {
    switch (position) {
      case 'left':
        return 'text-left';
      case 'right':
        return 'text-right';
      case 'center':
      default:
        return 'text-center';
    }
  };

  return (
    <div ref={ref} className={`relative pointer-events-none select-none overflow-hidden py-16 ${className}`}>
      <motion.h2
        style={{ y, scale, opacity: fadeOpacity }}
        className={`text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-bold text-mirage uppercase tracking-tight leading-none ${getPositionClass()}`}
      >
        {text}
      </motion.h2>
    </div>
  );
};
