import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";

export const LinkHealthDashboard = () => {
  const links = [
    { name: "utm.one/summer-sale", status: "healthy", uptime: "99.99%", checks: "1,247" },
    { name: "utm.one/webinar", status: "healthy", uptime: "100%", checks: "892" },
    { name: "utm.one/product-launch", status: "warning", uptime: "98.2%", checks: "2,104" },
    { name: "utm.one/campaign-2024", status: "down", uptime: "0%", checks: "45" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card border-2 border-border rounded-2xl p-8 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground lowercase mb-1">
            link health monitor
          </h3>
          <p className="text-sm text-muted-foreground">Real-time status of your top 100 links</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-semibold text-primary">Live</span>
        </div>
      </div>

      {/* Links Table */}
      <div className="space-y-2">
        {links.map((link, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`p-4 rounded-lg border-2 ${
              link.status === 'healthy' 
                ? 'bg-primary/5 border-primary/20' 
                : link.status === 'warning'
                ? 'bg-amber-500/5 border-amber-500/20'
                : 'bg-destructive/5 border-destructive/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {link.status === 'healthy' ? (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                ) : link.status === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <div className="text-sm font-semibold text-foreground">{link.name}</div>
                  <div className="text-xs text-muted-foreground">{link.checks} health checks</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm font-bold ${
                  link.status === 'healthy' 
                    ? 'text-primary' 
                    : link.status === 'warning'
                    ? 'text-amber-500'
                    : 'text-destructive'
                }`}>
                  {link.uptime} uptime
                </div>
                <div className="text-xs text-muted-foreground capitalize">{link.status}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Auto-Failover Badge */}
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border-2 border-primary/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-primary">Automatic Failover Active</span>
        </div>
        <p className="text-xs text-muted-foreground">
          When a link goes down, traffic automatically routes to fallback URL. No manual intervention needed.
        </p>
      </div>
    </motion.div>
  );
};
