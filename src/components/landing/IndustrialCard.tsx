import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';

interface IndustrialCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  tiltEnabled?: boolean;
}

export const IndustrialCard = ({ 
  children, 
  className = '', 
  delay = 0,
  tiltEnabled = true 
}: IndustrialCardProps) => {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        delay,
        ease: [0.16, 1, 0.3, 1] // Apple ease curve
      }}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: 'rgba(17, 17, 17, 0.6)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderRadius: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderTop: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: `
          inset 0 1px 0 0 rgba(255, 255, 255, 0.05),
          0 25px 50px -12px rgba(0, 0, 0, 0.5),
          0 0 0 1px rgba(255, 255, 255, 0.05)
        `,
      }}
    >
      {children}
    </motion.div>
  );

  if (!tiltEnabled) return cardContent;

  return (
    <Tilt
      tiltMaxAngleX={15}
      tiltMaxAngleY={15}
      scale={1.02}
      transitionSpeed={1000}
      glareEnable={true}
      glareMaxOpacity={0.1}
      glareColor="rgba(255, 255, 255, 0.3)"
      glarePosition="all"
      glareBorderRadius="32px"
    >
      {cardContent}
    </Tilt>
  );
};
