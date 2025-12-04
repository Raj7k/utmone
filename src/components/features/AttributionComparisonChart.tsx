import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export const AttributionComparisonChart = () => {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* GA4 Last-Click Attribution */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="rounded-xl p-6"
        style={{
          background: 'rgba(239,68,68,0.05)',
          border: '2px solid rgba(239,68,68,0.2)'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5" style={{ color: 'rgba(239,68,68,0.9)' }} />
          <h3 className="text-lg font-display font-bold text-foreground lowercase">
            ga4 last-click attribution
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(24,24,27,0.6)' }}>
            <div>
              <div className="text-sm font-medium text-foreground">Google Ads</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Last touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>$15,000</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>100% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg opacity-50" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div>
              <div className="text-sm font-medium text-foreground">LinkedIn</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>First touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold line-through" style={{ color: 'rgba(255,255,255,0.5)' }}>$0</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>0% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg opacity-50" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div>
              <div className="text-sm font-medium text-foreground">Email</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>Middle touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold line-through" style={{ color: 'rgba(255,255,255,0.5)' }}>$0</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>0% credit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)' }}>
          <p className="text-xs font-medium" style={{ color: 'rgba(239,68,68,0.9)' }}>
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
        className="rounded-xl p-6"
        style={{
          background: 'rgba(34,197,94,0.05)',
          border: '2px solid rgba(34,197,94,0.3)'
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5" style={{ color: 'rgba(34,197,94,0.9)' }} />
          <h3 className="text-lg font-display font-bold text-foreground lowercase">
            utm.one true attribution
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <div>
              <div className="text-sm font-medium text-foreground">LinkedIn</div>
              <div className="text-xs font-medium" style={{ color: 'rgba(34,197,94,0.9)' }}>First touchpoint (discovery)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: 'rgba(34,197,94,0.9)' }}>$6,000</div>
              <div className="text-xs" style={{ color: 'rgba(34,197,94,0.9)' }}>40% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <div>
              <div className="text-sm font-medium text-foreground">Email</div>
              <div className="text-xs font-medium" style={{ color: 'rgba(34,197,94,0.9)' }}>Middle touchpoint (nurture)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: 'rgba(34,197,94,0.9)' }}>$4,500</div>
              <div className="text-xs" style={{ color: 'rgba(34,197,94,0.9)' }}>30% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
            <div>
              <div className="text-sm font-medium text-foreground">Google Ads</div>
              <div className="text-xs font-medium" style={{ color: 'rgba(34,197,94,0.9)' }}>Last touchpoint (conversion)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold" style={{ color: 'rgba(34,197,94,0.9)' }}>$4,500</div>
              <div className="text-xs" style={{ color: 'rgba(34,197,94,0.9)' }}>30% credit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(34,197,94,0.15)' }}>
          <p className="text-xs font-medium" style={{ color: 'rgba(34,197,94,0.9)' }}>
            ✅ All channels get proportional credit. You optimize the full funnel. Sales grows 25%.
          </p>
        </div>
      </motion.div>
    </div>
  );
};