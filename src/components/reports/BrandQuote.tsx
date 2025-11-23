import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BrandQuoteProps {
  text: string;
  position?: 'left' | 'center' | 'right';
  className?: string;
}

export const BrandQuote = ({ 
  text, 
  position = 'center',
  className = ''
}: BrandQuoteProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Parallax effect - moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

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
    <div ref={ref} className={`relative select-none overflow-hidden py-8 ${className}`}>
      <div className="hero-glow">
        <motion.h2
          style={{ y, scale }}
          className={`text-foreground text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-display font-extrabold uppercase tracking-tight leading-none ${getPositionClass()}`}
        >
          {text}
        </motion.h2>
      </div>
    </div>
  );
};
