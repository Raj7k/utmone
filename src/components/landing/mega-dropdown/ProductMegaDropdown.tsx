import { motion } from "framer-motion";
import { LinkShowcaseCard } from "./LinkShowcaseCard";
import { AnalyticsShowcaseCard } from "./AnalyticsShowcaseCard";
import { AttributionShowcaseCard } from "./AttributionShowcaseCard";
import { IntegrationsCard } from "./IntegrationsCard";
import { APICard } from "./APICard";

export function ProductMegaDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-[900px] p-4 rounded-[20px] bg-zinc-950/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
    >
      {/* Top Row - 3 Feature Cards */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        <LinkShowcaseCard />
        <AnalyticsShowcaseCard />
        <AttributionShowcaseCard />
      </div>

      {/* Bottom Row - Integrations & API */}
      <div className="grid grid-cols-2 gap-3">
        <IntegrationsCard />
        <APICard />
      </div>

      {/* Subtle divider */}
      <motion.div 
        className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-[10px] text-white/30">
          Everything you need to measure, attribute, and grow.
        </p>
        <a 
          href="/product" 
          className="text-[10px] text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 group"
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
