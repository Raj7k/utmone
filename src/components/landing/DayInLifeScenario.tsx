import { useRef, useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface TimelineStep {
  time: string;
  action: string;
  icon: LucideIcon;
}

interface DayInLifeScenarioProps {
  title: string;
  description: string;
  timeline: TimelineStep[];
  visualElement: React.ReactNode;
}

export const DayInLifeScenario = ({ title, description, timeline, visualElement }: DayInLifeScenarioProps) => {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const [leftVisible, setLeftVisible] = useState(false);
  const [rightVisible, setRightVisible] = useState(false);

  useEffect(() => {
    const leftObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLeftVisible(true);
          leftObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const rightObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRightVisible(true);
          rightObserver.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (leftRef.current) leftObserver.observe(leftRef.current);
    if (rightRef.current) rightObserver.observe(rightRef.current);

    return () => {
      leftObserver.disconnect();
      rightObserver.disconnect();
    };
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      {/* Left: Timeline */}
      <div
        ref={leftRef}
        className={`space-y-6 transition-all duration-600 ease-out ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
      >
        <div className="space-y-3">
          <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
            {title}
          </h3>
          <p className="text-lg text-white/60">
            {description}
          </p>
        </div>
        
        <div className="space-y-4">
          {timeline.map((step, index) => (
            <div
              key={index}
              className={`flex items-start gap-4 transition-all duration-400 ease-out ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
              style={{ transitionDelay: leftVisible ? `${index * 100}ms` : '0ms' }}
            >
              <div className="flex flex-col items-center">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-white/10"
                >
                  <step.icon className="w-5 h-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
                </div>
                {index < timeline.length - 1 && (
                  <div className="w-0.5 h-8 mt-2 bg-white/20" />
                )}
              </div>
              <div className="pt-2">
                <div className="text-xs font-semibold uppercase tracking-wide mb-1 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {step.time}
                </div>
                <div className="text-sm text-white/80">
                  {step.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Visual */}
      <div
        ref={rightRef}
        className={`transition-all duration-600 ease-out ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
        style={{ transitionDelay: rightVisible ? '200ms' : '0ms' }}
      >
        {visualElement}
      </div>
    </div>
  );
};
