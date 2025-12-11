import { motion } from "framer-motion";
import { EnterpriseShowcaseCard } from "./EnterpriseShowcaseCard";
import { StartupsShowcaseCard } from "./StartupsShowcaseCard";
import { AgenciesShowcaseCard } from "./AgenciesShowcaseCard";
import { RoleGridCard } from "./RoleGridCard";
import { TestimonialMiniCard } from "./TestimonialMiniCard";

export function SolutionsMegaDropdown() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="w-[750px] p-4 rounded-[20px] bg-zinc-950/95 backdrop-blur-xl border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
    >
      <div className="flex gap-4">
        {/* Left Column - Segment Cards */}
        <div className="w-[200px] flex flex-col gap-3">
          <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider px-1">By Segment</p>
          <EnterpriseShowcaseCard />
          <StartupsShowcaseCard />
          <AgenciesShowcaseCard />
        </div>

        {/* Right Column - Role Grid */}
        <div className="flex-1">
          <RoleGridCard />
        </div>
      </div>

      {/* Footer - Testimonial */}
      <div className="mt-3">
        <TestimonialMiniCard />
      </div>

      {/* Subtle divider */}
      <motion.div 
        className="mt-3 pt-3 border-t border-white/[0.05] flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-[10px] text-white/30">
          Solutions tailored to how you work.
        </p>
        <a 
          href="/solutions" 
          className="text-[10px] text-white/50 hover:text-white/80 transition-colors flex items-center gap-1 group"
        >
          <span>Explore all solutions</span>
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
