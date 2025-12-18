import { LucideIcon } from "lucide-react";
import { ReactNode, useRef, useEffect, useState } from "react";

interface AnalyticsFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  visual?: ReactNode;
  isActive?: boolean;
}

export const AnalyticsFeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  visual,
  isActive = false 
}: AnalyticsFeatureCardProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`
        group relative flex flex-col h-full min-h-[280px] p-5 rounded-2xl
        bg-zinc-900/40 backdrop-blur-xl
        border border-white/[0.08] border-t-white/[0.12]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
        transition-all duration-300 ease-out overflow-hidden
        hover:-translate-y-2 hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5),0_0_60px_-30px_rgba(255,255,255,0.15)]
        ${isActive ? 'scale-100 opacity-100' : 'scale-[0.95] opacity-70'}
      `}
    >
      {/* Animated shimmer border effect - CSS animation */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none animate-shimmer-slide"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
      />

      {/* Subtle pulse glow - CSS animation */}
      <div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Icon with hover effect */}
      <div 
        className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-white/[0.08] border border-white/[0.06] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg]"
      >
        <Icon className="w-4 h-4 text-white/80" />
      </div>

      {/* Title */}
      <h3 className="relative z-10 text-base font-semibold mb-1.5 text-white/90">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-xs leading-relaxed text-white/50 mb-3">
        {description}
      </p>

      {/* Visual Preview */}
      {visual && (
        <div 
          className={`relative z-10 mt-auto pt-2 transition-opacity duration-300 ${isInView ? 'opacity-100' : 'opacity-80'}`}
        >
          <div className="h-[80px] rounded-lg bg-white/[0.03] border border-white/[0.05] overflow-hidden flex items-center justify-center">
            {visual}
          </div>
        </div>
      )}

      {/* Hover gradient overlay */}
      <div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-300"
      />
    </div>
  );
};
