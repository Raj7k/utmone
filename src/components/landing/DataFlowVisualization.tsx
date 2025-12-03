import { useEffect, useRef, useState } from "react";

export const DataFlowVisualization = () => {
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
    <div 
      ref={ref}
      className={`relative w-full max-w-[900px] mx-auto transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* SVG Flow Chart */}
      <svg 
        className="w-full h-auto" 
        viewBox="0 0 800 400" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Gradient definitions */}
          <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E3EF26" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#076653" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0C342C" stopOpacity="0.4" />
          </linearGradient>
          
          <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E2FBCE" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#076653" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="flowGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#076653" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#06231D" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Flow paths */}
        <path
          d="M 50 100 Q 200 80, 350 100 T 750 100"
          stroke="url(#flowGradient1)"
          strokeWidth="40"
          fill="none"
          opacity={isVisible ? 1 : 0}
          className="transition-opacity duration-1000 delay-200"
        />
        
        <path
          d="M 50 200 Q 200 180, 350 200 T 750 200"
          stroke="url(#flowGradient2)"
          strokeWidth="32"
          fill="none"
          opacity={isVisible ? 1 : 0}
          className="transition-opacity duration-1000 delay-400"
        />
        
        <path
          d="M 50 300 Q 200 280, 350 300 T 750 300"
          stroke="url(#flowGradient3)"
          strokeWidth="24"
          fill="none"
          opacity={isVisible ? 1 : 0}
          className="transition-opacity duration-1000 delay-600"
        />

        {/* Data points */}
        <circle cx="50" cy="100" r="8" fill="#E3EF26" opacity={isVisible ? 1 : 0} className="transition-opacity duration-500 delay-800" />
        <circle cx="750" cy="100" r="8" fill="#0C342C" opacity={isVisible ? 1 : 0} className="transition-opacity duration-500 delay-800" />
        
        <circle cx="50" cy="200" r="6" fill="#E2FBCE" opacity={isVisible ? 1 : 0} className="transition-opacity duration-500 delay-1000" />
        <circle cx="750" cy="200" r="6" fill="#076653" opacity={isVisible ? 1 : 0} className="transition-opacity duration-500 delay-1000" />
        
        <circle cx="50" cy="300" r="5" fill="#076653" opacity={isVisible ? 1 : 0} className="transition-opacity duration-500 delay-1200" />
        <circle cx="750" cy="300" r="5" fill="#06231D" opacity={isVisible ? 1 : 0} className="transition-opacity duration-500 delay-1200" />
      </svg>

      {/* Labels */}
      <div className="flex justify-between mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
        <span className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          link created
        </span>
        <span className={`transition-opacity duration-500 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          clicks tracked
        </span>
        <span className={`transition-opacity duration-500 delay-400 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          data analyzed
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          <span>flow strength</span>
          <span className={`transition-opacity duration-500 delay-600 ${isVisible ? "opacity-100" : "opacity-0"}`}>
            94%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <div 
            className="h-full rounded-full transition-all duration-1500 delay-800"
            style={{ 
              width: isVisible ? "94%" : "0%",
              background: 'linear-gradient(90deg, rgba(255,255,255,0.3), rgba(255,255,255,0.6))'
            }}
          />
        </div>
      </div>
    </div>
  );
};
