import { useRef, useState, useEffect, useMemo } from "react";

interface CharacterRevealTextProps {
  text: string;
  className?: string;
}

export const CharacterRevealText = ({ text, className = "" }: CharacterRevealTextProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number>();

  const characters = useMemo(() => text.split(""), [text]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (rafRef.current) return;
      
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = undefined;
        
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Progress: 0 when element enters at bottom, 1 when it reaches center
        const startPoint = viewportHeight;
        const endPoint = viewportHeight / 2;
        const scrollRange = startPoint - endPoint;
        const currentPosition = rect.top;
        
        const progress = Math.max(0, Math.min(1, (startPoint - currentPosition) / scrollRange));
        setScrollProgress(progress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className}`}>
      <div className="flex flex-wrap justify-center">
        {characters.map((char, index) => {
          const start = index / characters.length;
          const end = Math.min((index + 10) / characters.length, 1);
          
          // Calculate opacity and blur based on scroll progress
          const charProgress = Math.max(0, Math.min(1, (scrollProgress - start) / (end - start)));
          const opacity = 0.15 + (0.85 * charProgress);
          const blur = 4 * (1 - charProgress);
          
          return (
            <span
              key={index}
              style={{ 
                opacity,
                filter: blur > 0.1 ? `blur(${blur}px)` : 'none',
                transition: 'opacity 0.1s linear, filter 0.1s linear',
              }}
              className={char === " " ? "w-3 md:w-4" : ""}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          );
        })}
      </div>
    </div>
  );
};
