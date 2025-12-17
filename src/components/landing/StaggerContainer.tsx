import { ReactNode, createContext, useContext, useEffect, useState, useRef } from "react";

interface StaggerContextValue {
  isVisible: boolean;
  staggerDelay: number;
}

const StaggerContext = createContext<StaggerContextValue>({ isVisible: false, staggerDelay: 0.1 });

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer = ({ 
  children, 
  className = "",
  staggerDelay = 0.1 
}: StaggerContainerProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.2,
        rootMargin: "-100px"
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <StaggerContext.Provider value={{ isVisible, staggerDelay }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StaggerContext.Provider>
  );
};

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

export const StaggerItem = ({ children, className = "", index = 0 }: StaggerItemProps) => {
  const { isVisible, staggerDelay } = useContext(StaggerContext);
  
  return (
    <div
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
        transitionDelay: isVisible ? `${index * staggerDelay * 1000}ms` : '0ms',
      }}
    >
      {children}
    </div>
  );
};
