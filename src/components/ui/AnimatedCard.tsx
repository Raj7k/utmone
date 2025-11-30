import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ReactNode, useRef } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedCard = ({ children, className = '' }: AnimatedCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 30 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(springY, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(springX, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {/* Animated rotating border */}
      <div className="absolute inset-0 rounded-2xl animated-border-wrapper p-[2px]">
        <div className="absolute inset-0 rounded-2xl animated-border" />
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br from-primary/20 via-blazeOrange/20 to-deepSea/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-glow-pulse" />

      {/* Inner card with glassmorphism */}
      <div className="relative rounded-2xl bg-background/95 backdrop-blur-sm">
        {children}
      </div>
    </motion.div>
  );
};
