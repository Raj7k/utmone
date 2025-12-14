import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SalesStatCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  variant?: "default" | "hot" | "primary" | "amber";
  pulse?: boolean;
}

export const SalesStatCard = ({ 
  icon: Icon, 
  label, 
  value, 
  variant = "default",
  pulse = false 
}: SalesStatCardProps) => {
  const variantStyles = {
    default: {
      bg: "bg-muted/50",
      icon: "text-muted-foreground",
    },
    hot: {
      bg: "bg-emerald-500/10",
      icon: "text-emerald-500",
    },
    primary: {
      bg: "bg-primary/10",
      icon: "text-primary",
    },
    amber: {
      bg: "bg-amber-500/10",
      icon: "text-amber-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="bg-card border border-border rounded-2xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-shadow duration-300 animate-fade-in">
      <div className="flex items-center gap-4">
        <div className={cn(
          "p-3 rounded-xl transition-all duration-300",
          styles.bg,
          pulse && "animate-pulse"
        )}>
          <Icon className={cn("h-5 w-5", styles.icon)} />
        </div>
        <div>
          <p className="text-3xl font-bold text-foreground tabular-nums">
            {value}
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
};
