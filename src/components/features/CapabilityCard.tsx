import { LucideIcon } from "lucide-react";
import { formatText } from "@/utils/textFormatter";
import { useIntersectionAnimation } from "@/components/landing/motion";

interface CapabilityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const CapabilityCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: CapabilityCardProps) => {
  const { ref, isVisible } = useIntersectionAnimation(0.2);

  return (
    <div
      ref={ref}
      className={`group p-8 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`}
      style={{ 
        transitionDelay: `${delay * 1000}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      <div className="mb-4 inline-flex p-3 rounded-xl bg-white/10 text-white group-hover:bg-white/20 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-3 text-white">
        {formatText(title)}
      </h3>
      <p className="text-sm text-white/60 leading-relaxed">
        {description}
      </p>
    </div>
  );
};
