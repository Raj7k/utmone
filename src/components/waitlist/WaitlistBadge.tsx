import { LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import { cn } from "@/lib/utils";

interface WaitlistBadgeProps {
  name: string;
  description: string;
  icon: string;
  color: string;
  tier: "bronze" | "silver" | "gold";
  awarded?: boolean;
  awardedAt?: string;
  className?: string;
}

export const WaitlistBadge = ({
  name,
  description,
  icon,
  color,
  tier,
  awarded = false,
  awardedAt,
  className,
}: WaitlistBadgeProps) => {
  const IconComponent = (Icons as any)[icon] as LucideIcon;

  const tierStyles = {
    bronze: "bg-amber-900/10 border-amber-900/20",
    silver: "bg-card border-border",
    gold: "bg-yellow-500/10 border-yellow-500/20",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-6 transition-all duration-300",
        awarded
          ? "bg-card backdrop-blur-xl shadow-sm hover:shadow-md border-border"
          : "bg-muted/30 border-border opacity-60",
        tierStyles[tier],
        className
      )}
    >
      {/* Badge Icon */}
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl"
        style={{ backgroundColor: awarded ? `${color}15` : undefined }}
      >
        {IconComponent && (
          <IconComponent
            className={cn("h-8 w-8", !awarded && "text-muted-foreground/30")}
            style={awarded ? { color } : undefined}
          />
        )}
      </div>

      {/* Badge Info */}
      <h3 className="text-lg font-semibold mb-1 text-foreground">{name}</h3>
      <p className="text-sm text-muted-foreground mb-3">{description}</p>

      {/* Tier Badge */}
      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/30 border border-border">
        <div
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
        <span className="text-xs font-medium text-muted-foreground">{tier}</span>
      </div>

      {/* Awarded Date */}
      {awarded && awardedAt && (
        <p className="mt-3 text-xs text-muted-foreground">
          earned {new Date(awardedAt).toLocaleDateString()}
        </p>
      )}

      {/* Locked Overlay with Lock Icon */}
      {!awarded && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-muted/20 pointer-events-none" />
          <Icons.Lock className="absolute top-4 right-4 h-5 w-5 text-muted-foreground/50" />
        </>
      )}
    </div>
  );
};
