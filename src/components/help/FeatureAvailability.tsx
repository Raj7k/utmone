import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type TierType = "free" | "starter" | "growth" | "business" | "enterprise";

interface SimpleTierProps {
  tier: TierType;
  feature?: never;
  availability?: never;
}

interface DetailedAvailabilityProps {
  tier?: never;
  feature: string;
  availability: {
    free?: boolean;
    starter?: boolean;
    growth?: boolean;
    business?: boolean;
    enterprise?: boolean;
  };
}

type FeatureAvailabilityProps = SimpleTierProps | DetailedAvailabilityProps;

const tierConfig: Record<TierType, { label: string; color: string }> = {
  free: { label: "Free", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  starter: { label: "Starter", color: "bg-blue-50 text-blue-700 border-blue-200" },
  growth: { label: "Growth", color: "bg-purple-50 text-purple-700 border-purple-200" },
  business: { label: "Business", color: "bg-amber-50 text-amber-700 border-amber-200" },
  enterprise: { label: "Enterprise", color: "bg-zinc-100 text-zinc-700 border-zinc-300" },
};

const tierOrder: TierType[] = ["free", "starter", "growth", "business", "enterprise"];

export const FeatureAvailability = (props: FeatureAvailabilityProps) => {
  // Simple tier display
  if ('tier' in props && props.tier) {
    const tier = props.tier;
    const tierIndex = tierOrder.indexOf(tier);
    const config = tierConfig[tier];
    
    return (
      <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border",
            config.color
          )}>
            <Check className="h-4 w-4" />
            {tier === "free" ? "Available on all plans" : `Available from ${config.label}`}
          </div>
          
          {tier !== "free" && (
            <div className="flex gap-1 flex-wrap">
              {tierOrder.slice(tierIndex).map((t) => (
                <span
                  key={t}
                  className="text-xs bg-zinc-200 text-zinc-600 px-2 py-0.5 rounded"
                >
                  {tierConfig[t].label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Detailed availability matrix
  const { availability } = props as DetailedAvailabilityProps;
  
  return (
    <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200">
      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
        Plan availability
      </p>
      <div className="flex flex-wrap gap-2">
        {tierOrder.map((tier) => {
          const isAvailable = availability[tier];
          return (
            <div
              key={tier}
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
              {tierConfig[tier].label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
