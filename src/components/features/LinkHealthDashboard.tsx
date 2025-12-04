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
        bg: 'rgba(34,197,94,0.1)',
        border: 'rgba(34,197,94,0.2)',
        text: 'rgba(34,197,94,0.9)'
      };
    } else if (status === 'warning') {
      return {
        bg: 'rgba(245,158,11,0.1)',
        border: 'rgba(245,158,11,0.2)',
        text: 'rgba(245,158,11,0.9)'
      };
    }
    return {
      bg: 'rgba(239,68,68,0.1)',
      border: 'rgba(239,68,68,0.2)',
      text: 'rgba(239,68,68,0.9)'
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-8 shadow-xl"
      style={{
        background: 'rgba(24,24,27,0.4)',
        border: '2px solid rgba(255,255,255,0.1)'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground lowercase mb-1">
            link health monitor
          </h3>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Real-time status of your top 100 links</p>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-full"
          style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)' }}
        >
          <Activity className="w-4 h-4 animate-pulse" style={{ color: 'rgba(34,197,94,0.9)' }} />
          <span className="text-sm font-semibold" style={{ color: 'rgba(34,197,94,0.9)' }}>Live</span>
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
              className="p-4 rounded-lg"
              style={{
                background: statusStyles.bg,
                border: `2px solid ${statusStyles.border}`
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {link.status === 'healthy' ? (
                    <CheckCircle2 className="w-5 h-5" style={{ color: 'rgba(34,197,94,0.9)' }} />
                  ) : link.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5" style={{ color: 'rgba(245,158,11,0.9)' }} />
                  ) : (
                    <XCircle className="w-5 h-5" style={{ color: 'rgba(239,68,68,0.9)' }} />
                  )}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{link.name}</div>
                    <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{link.checks} health checks</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: statusStyles.text }}>
                    {link.uptime} uptime
                  </div>
                  <div className="text-xs capitalize" style={{ color: 'rgba(255,255,255,0.5)' }}>{link.status}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Auto-Failover Badge */}
      <div 
        className="mt-6 p-4 rounded-lg"
        style={{ background: 'rgba(34,197,94,0.1)', border: '2px solid rgba(34,197,94,0.2)' }}
      >
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5" style={{ color: 'rgba(34,197,94,0.9)' }} />
          <span className="text-sm font-semibold" style={{ color: 'rgba(34,197,94,0.9)' }}>Automatic Failover Active</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
          When a link goes down, traffic automatically routes to fallback URL. No manual intervention needed.
        </p>
      </div>
    </motion.div>
  );
};