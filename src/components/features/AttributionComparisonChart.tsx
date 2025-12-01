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
        className="bg-destructive/5 border-2 border-destructive/20 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-display font-bold text-foreground lowercase">
            ga4 last-click attribution
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">Google Ads</div>
              <div className="text-xs text-muted-foreground">Last touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">$15,000</div>
              <div className="text-xs text-muted-foreground">100% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg opacity-50">
            <div>
              <div className="text-sm font-medium text-foreground">LinkedIn</div>
              <div className="text-xs text-muted-foreground">First touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-muted-foreground line-through">$0</div>
              <div className="text-xs text-muted-foreground">0% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg opacity-50">
            <div>
              <div className="text-sm font-medium text-foreground">Email</div>
              <div className="text-xs text-muted-foreground">Middle touchpoint</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-muted-foreground line-through">$0</div>
              <div className="text-xs text-muted-foreground">0% credit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
          <p className="text-xs text-destructive font-medium">
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
        className="bg-primary/5 border-2 border-primary/30 rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-display font-bold text-foreground lowercase">
            utm.one true attribution
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">LinkedIn</div>
              <div className="text-xs text-primary font-medium">First touchpoint (discovery)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">$6,000</div>
              <div className="text-xs text-primary">40% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">Email</div>
              <div className="text-xs text-primary font-medium">Middle touchpoint (nurture)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">$4,500</div>
              <div className="text-xs text-primary">30% credit</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div>
              <div className="text-sm font-medium text-foreground">Google Ads</div>
              <div className="text-xs text-primary font-medium">Last touchpoint (conversion)</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary">$4,500</div>
              <div className="text-xs text-primary">30% credit</div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-primary/10 rounded-lg">
          <p className="text-xs text-primary font-medium">
            ✅ All channels get proportional credit. You optimize the full funnel. Sales grows 25%.
          </p>
        </div>
      </motion.div>
    </div>
  );
};
