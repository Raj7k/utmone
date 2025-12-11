import { motion } from "framer-motion";
import { CleanTrackShowcaseCard } from "./CleanTrackShowcaseCard";
import { EventHaloShowcaseCard } from "./EventHaloShowcaseCard";
import { OneTapShowcaseCard } from "./OneTapShowcaseCard";
import { FeatureGridCard } from "./FeatureGridCard";
import { ComparePlansCard } from "./ComparePlansCard";

export function FeaturesMegaDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-[800px] p-4 rounded-[20px] bg-zinc-950/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
    >
      <div className="flex gap-4">
        {/* Left Column - Featured Cards */}
        <div className="w-[200px] flex flex-col gap-3">
          <CleanTrackShowcaseCard />
          <EventHaloShowcaseCard />
          <OneTapShowcaseCard />
        </div>

        {/* Right Column - Feature Grid */}
        <div className="flex-1">
          <FeatureGridCard />
        </div>
      </div>

      {/* Footer - Compare Plans */}
      <div className="mt-3">
        <ComparePlansCard />
      </div>

      {/* Subtle divider */}
      <motion.div 
        className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-[10px] text-white/30">
          Build better campaigns with intelligent tools.
        </p>
        <a 
          href="/features" 
          className="text-[10px] text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 group"
        >
          <span>View all features</span>
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
