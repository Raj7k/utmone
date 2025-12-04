import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MagneticCardProps {
  children: ReactNode;
  strength?: number;
  enableTilt?: boolean;
  enableGlow?: boolean;
  className?: string;
}

export const MagneticCard = ({
  children,
  strength = 0.3,
  enableTilt = true,
  enableGlow = true,
  className = '',
}: MagneticCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  // 3D tilt effect
  const rotateX = useTransform(springY, [-100, 100], enableTilt ? [8, -8] : [0, 0]);
  const rotateY = useTransform(springX, [-100, 100], enableTilt ? [-8, 8] : [0, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = (e.clientX - centerX) * strength;
    const distanceY = (e.clientY - centerY) * strength;

    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{
        x: springX,
        y: springY,
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={cn('relative', className)}
    >
      {enableGlow && (
        <motion.div
          className="absolute inset-0 rounded-2xl opacity-0 blur-xl pointer-events-none"
          style={{
            background: 'linear-gradient(to right, rgba(59,130,246,0.05), rgba(20,184,166,0.05), rgba(52,211,153,0.05))',
            opacity: useTransform(springX, [-50, 0, 50], [0.3, 0, 0.3]),
          }}
        />
      )}
      {children}
    </motion.div>
  );
};
