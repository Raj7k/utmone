import { motion } from 'framer-motion';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';
import { ReactNode } from 'react';

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  scale?: number;
  className?: string;
}

export const MagneticWrapper = ({
  children,
  strength = 0.3,
  scale = 1.02,
  className = '',
}: MagneticWrapperProps) => {
  const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagneticEffect({
    strength,
    damping: 20,
    stiffness: 200,
  });

  return (
    <motion.div
      ref={ref as any}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
