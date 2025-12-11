import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureAvailabilityProps {
  feature: string;
  availability: {
    free?: boolean;
    starter?: boolean;
    growth?: boolean;
    business?: boolean;
    enterprise?: boolean;
  };
}

const tiers = [
  { key: "free", label: "Free" },
  { key: "starter", label: "Starter" },
  { key: "growth", label: "Growth" },
  { key: "business", label: "Business" },
  { key: "enterprise", label: "Enterprise" },
] as const;

export const FeatureAvailability = ({ feature, availability }: FeatureAvailabilityProps) => {
  return (
    <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Plan availability
      </p>
      <div className="flex flex-wrap gap-2">
        {tiers.map((tier) => {
          const isAvailable = availability[tier.key];
          return (
            <div
              key={tier.key}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm",
                isAvailable
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-zinc-100 text-zinc-400"
              )}
            >
              {isAvailable ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <X className="h-3.5 w-3.5" />
              )}
              {tier.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
