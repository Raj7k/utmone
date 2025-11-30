import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export const AnimatedCard = ({ children, className = '' }: AnimatedCardProps) => {
  return (
    <div className={`animated-border-card ${className}`}>
      {children}
    </div>
  );
};
