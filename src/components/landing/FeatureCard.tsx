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
      className={`bg-background rounded-2xl p-8 md:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] transition-all duration-500 relative overflow-hidden group ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Background number watermark */}
      <span className="absolute top-8 right-8 text-7xl md:text-8xl font-extrabold text-foreground/5 pointer-events-none select-none">
        {number}
      </span>

      {/* Content */}
      <div className="relative z-10">
        <div className="text-sm font-medium text-muted-foreground mb-3">{number}</div>
        <h3 className="text-2xl md:text-3xl font-display font-semibold text-foreground mb-4 lowercase">
          {title}
        </h3>
        <div className="text-base md:text-lg text-muted-foreground leading-relaxed lowercase">
          {description}
        </div>
      </div>
    </div>
  );
};
