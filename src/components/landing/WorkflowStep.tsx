import { LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface WorkflowStepProps {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor?: string;
  iconColor?: string;
  delay?: number;
}

export const WorkflowStep = ({
  icon: Icon,
  title,
  description,
  bgColor = "bg-muted",
  iconColor = "text-foreground",
  delay = 0,
}: WorkflowStepProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={stepRef}
      className={`flex flex-col items-center text-center transition-all duration-600 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Icon Circle */}
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${bgColor} flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-105`}
      >
        <Icon className={`w-7 h-7 md:w-8 md:h-8 ${iconColor}`} strokeWidth={2} />
      </div>

      {/* Title */}
      <h3 className="text-headline font-display font-semibold text-label mb-2 lowercase">{title}</h3>

      {/* Description */}
      <p className="text-body-apple text-secondary-label leading-relaxed max-w-[200px]">
        {description}
      </p>
    </div>
  );
};
