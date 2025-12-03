import { useEffect, useRef, useState } from "react";

interface FeatureCardProps {
  number: string;
  title: string;
  description: string;
  delay?: number;
}

export const FeatureCard = ({ number, title, description, delay = 0 }: FeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-12 transition-all duration-500 relative overflow-hidden group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{
        background: 'rgba(24,24,27,0.4)',
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.5)'
      }}
    >
      {/* Background number watermark */}
      <span 
        className="absolute top-4 right-4 md:top-8 md:right-8 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold pointer-events-none select-none"
        style={{ color: 'rgba(255,255,255,0.03)' }}
      >
        {number}
      </span>

      {/* Content */}
      <div className="relative z-10">
        <div 
          className="text-xs md:text-sm font-medium mb-2 md:mb-3"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {number}
        </div>
        <h3 
          className="text-xl sm:text-2xl md:text-3xl font-display font-semibold mb-3 md:mb-4 lowercase"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {title}
        </h3>
        <div 
          className="text-sm sm:text-base md:text-lg leading-relaxed lowercase"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};
