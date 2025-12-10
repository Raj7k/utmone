import { motion } from "framer-motion";
import { BarChart3, Megaphone, Calendar, DollarSign, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export type IntelligenceContext = "all" | "campaigns" | "events" | "sales" | "customers";

interface ContextSwitcherProps {
  value: IntelligenceContext;
  onChange: (context: IntelligenceContext) => void;
}

const contexts: { id: IntelligenceContext; label: string; icon: typeof BarChart3 }[] = [
  { id: "all", label: "all analytics", icon: BarChart3 },
  { id: "campaigns", label: "campaigns", icon: Megaphone },
  { id: "events", label: "events", icon: Calendar },
  { id: "sales", label: "sales", icon: DollarSign },
  { id: "customers", label: "customers", icon: Users },
];

export default function ContextSwitcher({ value, onChange }: ContextSwitcherProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
      {contexts.map((ctx) => {
        const Icon = ctx.icon;
        const isActive = value === ctx.id;

        return (
          <button
            key={ctx.id}
            onClick={() => onChange(ctx.id)}
            className={cn(
              "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
              "transition-colors duration-200 whitespace-nowrap",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="context-bg"
                className="absolute inset-0 rounded-xl bg-card border border-border shadow-sm"
                transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              {ctx.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
