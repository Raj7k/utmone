import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";

export const AttributionComparisonChart = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* GA4 Last-Click Attribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-xl p-6 bg-destructive/5 border-2 border-destructive/20"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-destructive/90" />
          <h3 className="text-lg font-display font-bold text-foreground">
            {p("GA4 last-click attribution")}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60">
            <div>
              <div className="text-sm font-medium text-foreground">Google Ads</div>
              <div className="text-xs text-white/50">Last touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white-90">$15,000</div>
              <div className="text-xs text-white/50">100% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg opacity-50 bg-white/5">
            <div>
              <div className="text-sm font-medium text-foreground">LinkedIn</div>
              <div className="text-xs text-white/50">First touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold line-through text-white/50">$0</div>
              <div className="text-xs text-white/50">0% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg opacity-50 bg-white/5">
            <div>
              <div className="text-sm font-medium text-foreground">Email</div>
              <div className="text-xs text-white/50">Middle touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold line-through text-white/50">$0</div>
              <div className="text-xs text-white/50">0% credit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-destructive/15">
          <p className="text-xs font-medium text-destructive/90">
            ❌ LinkedIn and Email get no credit. You cut those budgets. Sales drops 40%.
          </p>
        </div>
      </motion.div>

      {/* utm.one True Attribution */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="rounded-xl p-6 bg-success/5 border-2 border-success/30"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-success/90" />
          <h3 className="text-lg font-display font-bold text-foreground">
            {p("utm.one true attribution")}
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
            <div>
              <div className="text-sm font-medium text-foreground">LinkedIn</div>
              <div className="text-xs font-medium text-success/90">First touchpoint (discovery)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-success/90">$6,000</div>
              <div className="text-xs text-success/90">40% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
            <div>
              <div className="text-sm font-medium text-foreground">Email</div>
              <div className="text-xs font-medium text-success/90">Middle touchpoint (nurture)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-success/90">$4,500</div>
              <div className="text-xs text-success/90">30% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-success/10">
            <div>
              <div className="text-sm font-medium text-foreground">Google Ads</div>
              <div className="text-xs font-medium text-success/90">Last touchpoint (conversion)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-success/90">$4,500</div>
              <div className="text-xs text-success/90">30% credit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-success/15">
          <p className="text-xs font-medium text-success/90">
            ✅ All channels get proportional credit. You optimize the full funnel. Sales grows 25%.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
