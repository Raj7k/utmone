import { motion } from "framer-motion";
import { AlertTriangle, X, DollarSign } from "lucide-react";

export const WrongAttributionMockup = () => {
  const touchpoints = [
    { channel: "LinkedIn Ad", clicks: "10,234", revenue: "$0", status: "ignored" },
    { channel: "Email Newsletter", clicks: "3,421", revenue: "$0", status: "ignored" },
    { channel: "Webinar Signup", clicks: "892", revenue: "$0", status: "ignored" },
    { channel: "Google Search", clicks: "1,203", revenue: "$47,500", status: "winner" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      {/* Fake GA4-style dashboard */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl">
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">analytics.google.com</span>
          <div className="w-16" />
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Alert banner */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0" />
            <span className="text-sm text-destructive">Last-click attribution only • Cross-device tracking unavailable</span>
          </div>

          {/* Winner card */}
          <div className="p-4 rounded-xl bg-muted border-2 border-primary/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground uppercase tracking-wider">conversion winner</span>
              <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">100% credit</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-label">Google Search (Brand)</span>
              <span className="text-2xl font-bold text-primary">$47,500</span>
            </div>
          </div>

          {/* Ignored touchpoints */}
          <div className="space-y-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">prior touchpoints (ignored)</span>
            
            {touchpoints.slice(0, 3).map((tp, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50 relative overflow-hidden"
              >
                {/* Strikethrough line */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                  className="absolute inset-0 flex items-center"
                >
                  <div className="w-full h-px bg-destructive/40" />
                </motion.div>
                
                <div className="flex items-center gap-3 opacity-50">
                  <X className="w-4 h-4 text-destructive" />
                  <span className="text-sm text-muted-foreground">{tp.channel}</span>
                  <span className="text-xs text-muted-foreground/60">{tp.clicks} clicks</span>
                </div>
                <div className="flex items-center gap-2 opacity-50">
                  <DollarSign className="w-3 h-3 text-muted-foreground/40" />
                  <span className="text-sm text-muted-foreground">{tp.revenue}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom warning */}
          <div className="text-center pt-2">
            <span className="text-xs text-muted-foreground">
              ⚠️ 3 touchpoints received $0 credit despite driving awareness
            </span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-destructive/5 rounded-full blur-2xl" />
      <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-destructive/5 rounded-full blur-3xl" />
    </motion.div>
  );
};
