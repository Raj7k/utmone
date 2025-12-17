import { ReactNode, useRef, useEffect, useState } from "react";

interface ProgressiveRevealProps {
  children: ReactNode;
  className?: string;
}

export const ProgressiveReveal = ({ children, className = "" }: ProgressiveRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [opacity, setOpacity] = useState(0.3);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate progress from when element enters viewport to when it reaches center
      const startY = windowHeight; // element enters at bottom
      const endY = windowHeight / 2; // element reaches center
      
      // Current position of element's top
      const currentY = rect.top;
      
      // Calculate progress (0 = at bottom, 1 = at center or above)
      let progress = 0;
      if (currentY <= startY && currentY >= endY) {
        progress = (startY - currentY) / (startY - endY);
      } else if (currentY < endY) {
        progress = 1;
      }
      
      // Map progress to opacity (0.3 to 1)
      const newOpacity = 0.3 + (progress * 0.7);
      setOpacity(Math.min(1, Math.max(0.3, newOpacity)));
    };

    // Run on mount
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={ref}
      style={{ 
        opacity,
        transition: 'opacity 0.1s ease-out'
      }}
      className={className}
    >
      {children}
    </div>
  );
};
