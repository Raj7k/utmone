import { motion } from 'framer-motion';
import { useMagneticEffect } from '@/hooks/useMagneticEffect';
import { Button, ButtonProps } from '@/components/ui/button';
import { forwardRef } from 'react';

interface MagneticButtonProps extends ButtonProps {
  strength?: number;
}

export const MagneticButton = forwardRef<HTMLButtonElement, MagneticButtonProps>(
  ({ children, strength = 0.2, className, ...props }, forwardedRef) => {
    const { ref, x, y, handleMouseMove, handleMouseLeave } = useMagneticEffect({
      strength,
      damping: 15,
      stiffness: 200,
    });

    return (
      <motion.div
        ref={ref as any}
        style={{ x, y }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      >
        <Button ref={forwardedRef} className={className} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

MagneticButton.displayName = 'MagneticButton';
