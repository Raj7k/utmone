import { Check, X } from "lucide-react";
import { useIntersectionAnimation } from "@/components/landing/motion";
import { cn } from "@/lib/utils";

interface ComparisonItem {
  feature: string;
  competitors: boolean;
  utmOne: boolean;
}

interface FeatureComparisonProps {
  title: string;
  items: ComparisonItem[];
}

export const FeatureComparison = ({ title, items }: FeatureComparisonProps) => {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <div ref={ref} className="w-full">
      <h3 className="font-display text-title-2 font-semibold mb-8 text-center text-white">
        {title}
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-6 font-display text-subheadline font-medium text-white/40">
                Feature
              </th>
              <th className="text-center py-4 px-6 font-display text-subheadline font-medium text-white/40">
                Competitors
              </th>
              <th className="text-center py-4 px-6 font-display text-subheadline font-medium text-white-90">
                utm.one
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr
                key={index}
                className={cn(
                  "border-b border-white/5 hover:bg-white/[0.02] transition-all duration-400 ease-out",
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <td className="py-4 px-6 text-body-apple text-white">{item.feature}</td>
                <td className="py-4 px-6 text-center">
                  {item.competitors ? (
                    <Check className="w-5 h-5 text-white/30 mx-auto" />
                  ) : (
                    <X className="w-5 h-5 text-white/10 mx-auto" />
                  )}
                </td>
                <td className="py-4 px-6 text-center">
                  {item.utmOne ? (
                    <Check className="w-5 h-5 mx-auto text-white-90" />
                  ) : (
                    <X className="w-5 h-5 text-white/10 mx-auto" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
