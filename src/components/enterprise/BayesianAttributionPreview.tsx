import { motion } from "framer-motion";
import { TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/card";
import { preserveAcronyms as p } from "@/utils/textFormatter";

export const BayesianAttributionPreview = () => {
  const channels = [
    { name: "LinkedIn Ads", influence: 92, revenue: 284000, color: "bg-[#0077B5]" },
    { name: "Google Search", influence: 78, revenue: 156000, color: "bg-[#4285F4]" },
    { name: "Email Campaign", influence: 65, revenue: 98000, color: "bg-blazeOrange" },
    { name: "Partner Links", influence: 54, revenue: 67000, color: "bg-primary" },
    { name: "Direct Traffic", influence: 32, revenue: 45000, color: "bg-muted-foreground" },
  ];

  return (
    <div className="relative">
      <Card className="p-8 md:p-12 bg-card border-2 border-border">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-white/5">
            <TrendingUp className="w-8 h-8 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-label">
              {p("bayesian influence graph")}
            </h3>
            <p className="text-sm text-secondary-label">
              know exactly where revenue comes from
            </p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {channels.map((channel, index) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-label">{channel.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-secondary-label">
                    Influence Score: {channel.influence}
                  </span>
                  <span className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                    ${(channel.revenue / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${channel.influence}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                  className={`h-full ${channel.color} rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 rounded-xl border bg-gradient-to-br from-white/10 to-white/5 border-white/20">
            <DollarSign className="w-6 h-6 mb-2 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <div className="text-3xl font-bold text-label mb-1">$650K</div>
            <div className="text-sm text-secondary-label">Total Attributed Revenue</div>
          </div>
          <div className="p-6 rounded-xl border bg-gradient-to-br from-blazeOrange/10 to-blazeOrange/5 border-blazeOrange/20">
            <TrendingUp className="w-6 h-6 text-blazeOrange mb-2" />
            <div className="text-3xl font-bold text-label mb-1">5.2x</div>
            <div className="text-sm text-secondary-label">{p("Average ROI")}</div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
          <p className="text-xs text-secondary-label">
            <span className="font-semibold text-label">Bayesian multi-touch attribution</span> gives 
            every channel credit based on its actual influence on conversions, not just last-click. 
            See the true impact of every touchpoint in the customer journey.
          </p>
        </div>
      </Card>
    </div>
  );
};
