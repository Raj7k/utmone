import { motion } from "framer-motion";

const integrations = [
  { name: "Zapier", icon: "⚡" },
  { name: "Slack", icon: "💬" },
  { name: "HubSpot", icon: "🧡" },
  { name: "Salesforce", icon: "☁️" },
  { name: "Notion", icon: "📝" },
];

export function IntegrationsCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="group p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-medium text-white/90 mb-0.5">Integrations</h3>
          <p className="text-xs text-white/50">Connect your stack</p>
        </div>
        <motion.span 
          className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.05] text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          50+ apps
        </motion.span>
      </div>

      <div className="flex items-center gap-2">
        {integrations.map((integration, i) => (
          <motion.div
            key={integration.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2, delay: 0.25 + i * 0.04 }}
            className="group/icon flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] hover:border-white/[0.1] transition-all duration-200 cursor-pointer"
            title={integration.name}
          >
            <span className="text-base opacity-70 group-hover/icon:opacity-100 transition-opacity">
              {integration.icon}
            </span>
          </motion.div>
        ))}
        
        {/* More indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: 0.45 }}
          className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.1] text-white/30 text-xs font-mono"
        >
          +45
        </motion.div>
      </div>
    </motion.div>
  );
}
