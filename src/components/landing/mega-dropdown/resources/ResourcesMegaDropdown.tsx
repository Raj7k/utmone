import { motion } from "framer-motion";
import { FeaturedResourceCard } from "./FeaturedResourceCard";
import { ResourceCategoryGrid } from "./ResourceCategoryGrid";
import { ResourceSearchCard } from "./ResourceSearchCard";

export function ResourcesMegaDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-[700px] p-4 rounded-[20px] bg-zinc-950/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
    >
      <div className="flex gap-4">
        {/* Left Column - Featured Resources */}
        <div className="w-[260px]">
          <FeaturedResourceCard />
        </div>

        {/* Right Column - Category Grid */}
        <div className="flex-1">
          <ResourceCategoryGrid />
        </div>
      </div>

      {/* Footer - Search */}
      <div className="mt-3">
        <ResourceSearchCard />
      </div>

      {/* Subtle divider */}
      <motion.div 
        className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-[10px] text-white/30">
          Learn, implement, and grow.
        </p>
        <a 
          href="/resources" 
          className="text-[10px] text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 group"
        >
          <span>Browse all resources</span>
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
