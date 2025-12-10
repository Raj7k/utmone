import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Activity } from "lucide-react";

export const LinkHealthDashboard = () => {
  const links = [
    { name: "utm.one/summer-sale", status: "healthy", uptime: "99.99%", checks: "1,247" },
    { name: "utm.one/webinar", status: "healthy", uptime: "100%", checks: "892" },
    { name: "utm.one/product-launch", status: "warning", uptime: "98.2%", checks: "2,104" },
    { name: "utm.one/campaign-2024", status: "down", uptime: "0%", checks: "45" }
  ];

  const getStatusStyles = (status: string) => {
    if (status === 'healthy') {
      return {
        bgClass: 'bg-green-500/10',
        borderClass: 'border-green-500/20',
        textClass: 'text-green-500'
      };
    } else if (status === 'warning') {
      return {
        bgClass: 'bg-amber-500/10',
        borderClass: 'border-amber-500/20',
        textClass: 'text-amber-500'
      };
    }
    return {
      bgClass: 'bg-destructive/10',
      borderClass: 'border-destructive/20',
      textClass: 'text-destructive'
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="obsidian-glass rounded-2xl p-8 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-white mb-1">
            link health monitor
          </h3>
          <p className="text-sm text-white/60 font-sans">Real-time status of your top 100 links</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/15 border border-green-500/25">
          <Activity className="w-4 h-4 animate-pulse text-green-500" />
          <span className="text-sm font-semibold text-green-500">Live</span>
        </div>
      </div>

      {/* Links Table */}
      <div className="space-y-2">
        {links.map((link, index) => {
          const statusStyles = getStatusStyles(link.status);
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${statusStyles.bgClass} ${statusStyles.borderClass}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {link.status === 'healthy' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : link.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-white font-sans">{link.name}</div>
                    <div className="text-xs text-white/60 font-sans">{link.checks} health checks</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${statusStyles.textClass}`}>
                    {link.uptime} uptime
                  </div>
                  <div className="text-xs capitalize text-white/60 font-sans">{link.status}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Auto-Failover Badge */}
      <div className="mt-6 p-4 rounded-lg bg-green-500/10 border-2 border-green-500/20">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-sm font-semibold text-green-500">Automatic Failover Active</span>
        </div>
        <p className="text-xs text-white/60 font-sans">
          When a link goes down, traffic automatically routes to fallback URL. No manual intervention needed.
        </p>
      </div>
    </motion.div>
  );
};
