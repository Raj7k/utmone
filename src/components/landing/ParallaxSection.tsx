import { ReactNode } from "react";
import { useParallaxScroll } from "@/lib/cssScrollUtils";

interface ParallaxSectionProps {
  children: ReactNode;
  className?: string;
  speed?: number;
}

export const ParallaxSection = ({ 
  children, 
  className = "",
  speed = 0.5 
}: ParallaxSectionProps) => {
  const { ref, y } = useParallaxScroll(speed);

  return (
    <div ref={ref} className={className}>
      <div 
        style={{ 
          transform: `translateY(${y}px)`,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
};
