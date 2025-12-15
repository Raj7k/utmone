import { LucideIcon } from "lucide-react";
import { formatText } from "@/utils/textFormatter";
import { useEffect, useRef, useState } from "react";

interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const ProblemCard = ({ icon: Icon, title, description, delay = 0 }: ProblemCardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "-50px" }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-500 ease-out group bg-zinc-900/40 backdrop-blur-[40px] border border-white/8 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
      }`}
    >
      <div className="p-2.5 md:p-3 rounded-lg md:rounded-xl inline-flex mb-3 md:mb-4 transition-colors bg-white/10 text-white-80">
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 md:mb-3 text-white-90">
        {formatText(title)}
      </h3>
      <p className="text-sm md:text-base leading-relaxed text-white-50">
        {description}
      </p>
    </div>
  );
};
