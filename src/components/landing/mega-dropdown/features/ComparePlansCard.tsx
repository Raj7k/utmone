import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function ComparePlansCard() {
  return (
    <Link to="/pricing" className="block group">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative rounded-xl p-3 cursor-pointer
          bg-white/[0.02] border border-white/[0.08]
          hover:bg-white/[0.04] hover:border-white/[0.12]
          transition-all duration-300 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {/* Mini tier preview */}
          <div className="flex gap-1">
            {['Free', 'Pro', 'Biz'].map((tier, i) => (
              <div 
                key={tier}
                className="w-10 h-6 rounded bg-white/[0.05] flex items-center justify-center"
              >
                <span className="text-[8px] text-white/50">{tier}</span>
              </div>
            ))}
          </div>
          <span className="text-[11px] text-white/60">Compare all plans</span>
        </div>
        
        <ArrowUpRight className="w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-all duration-300" />
      </motion.div>
    </Link>
  );
}
