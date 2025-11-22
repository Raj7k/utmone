import { useEffect, useRef, useState } from "react";

interface GlowingFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  glowColor: "teal" | "yellow-green" | "mint";
  delay?: number;
}

export const GlowingFeatureCard = ({ 
  icon, 
  title, 
  description, 
  glowColor,
  delay = 0 
}: GlowingFeatureCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const glowClasses = {
    teal: "shadow-[0_0_60px_rgba(7,102,83,0.3)] group-hover:shadow-[0_0_80px_rgba(7,102,83,0.5)]",
    "yellow-green": "shadow-[0_0_60px_rgba(227,239,38,0.3)] group-hover:shadow-[0_0_80px_rgba(227,239,38,0.5)]",
    mint: "shadow-[0_0_60px_rgba(226,251,206,0.3)] group-hover:shadow-[0_0_80px_rgba(226,251,206,0.5)]"
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={ref}
      className={`bg-[#0C342C] rounded-2xl p-12 relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {/* Radial glow behind icon */}
      <div className={`absolute top-8 left-8 w-32 h-32 rounded-full blur-3xl ${glowClasses[glowColor]} opacity-60 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative z-10 space-y-4">
        <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
          {icon}
        </div>
        <h3 className="text-h3 text-white font-semibold">{title}</h3>
        <p className="text-body text-white/70">{description}</p>
      </div>
    </div>
  );
};
