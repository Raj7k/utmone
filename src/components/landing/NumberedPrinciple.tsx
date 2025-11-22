import { useEffect, useRef, useState } from "react";

interface NumberedPrincipleProps {
  number: string;
  title: string;
  children?: React.ReactNode;
}

export const NumberedPrinciple = ({ number, title, children }: NumberedPrincipleProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="space-y-8">
      {/* Number badge */}
      <div 
        className={`text-[14px] font-medium text-muted-foreground text-center transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
        }`}
      >
        {number}. {title}
      </div>
      
      {children}
    </div>
  );
};
