import { motion } from "framer-motion";
import { LinkShowcaseCard } from "./LinkShowcaseCard";
import { AnalyticsShowcaseCard } from "./AnalyticsShowcaseCard";
import { AttributionShowcaseCard } from "./AttributionShowcaseCard";
import { IntegrationsCard } from "./IntegrationsCard";
import { APICard } from "./APICard";
import { cn } from "@/lib/utils";

interface ProductMegaDropdownProps {
  variant?: "light" | "dark";
}

export function ProductMegaDropdown({ variant = "dark" }: ProductMegaDropdownProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-[900px] p-4 rounded-[20px] backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
        isLight 
          ? "bg-white/95 border border-zinc-200" 
          : "bg-zinc-950/95 border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
      )}
    >
      {/* Top Row - 3 Feature Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <LinkShowcaseCard variant={variant} />
        <AnalyticsShowcaseCard variant={variant} />
        <AttributionShowcaseCard variant={variant} />
      </div>

      {/* Bottom Row - Integrations & API */}
      <div className="grid grid-cols-2 gap-3">
        <IntegrationsCard variant={variant} />
        <APICard variant={variant} />
      </div>

      {/* Subtle divider */}
      <motion.div 
        className={cn(
          "mt-4 pt-3 border-t flex items-center justify-between",
          isLight ? "border-zinc-200" : "border-white/[0.05]"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className={cn("text-[10px]", isLight ? "text-zinc-400" : "text-white/30")}>
          Everything you need to measure, attribute, and grow.
        </p>
        <a 
          href="/product" 
          className={cn(
            "text-[10px] transition-colors flex items-center gap-1 group",
            isLight ? "text-zinc-500 hover:text-zinc-800" : "text-white/50 hover:text-white/80"
          )}
        >
          <span>Explore all features</span>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </a>
      </motion.div>
    </motion.div>
  );
}
