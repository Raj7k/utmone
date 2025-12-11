import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link2, Tags, QrCode, TrendingUp, Sparkles, GitBranch, Route, Shield } from "lucide-react";

const coreFeatures = [
  { icon: Link2, label: "Short Links", path: "/features/short-links", desc: "branded urls" },
  { icon: Tags, label: "UTM Builder", path: "/features/utm-builder", desc: "consistent tracking" },
  { icon: QrCode, label: "QR Generator", path: "/features/qr-generator", desc: "trackable codes" },
  { icon: TrendingUp, label: "Analytics", path: "/features/analytics", desc: "real-time insights" },
];

const aiFeatures = [
  { icon: Sparkles, label: "Predictive", path: "/features/predictive-analytics", desc: "forecast performance" },
  { icon: GitBranch, label: "Attribution", path: "/features/attribution-graph", desc: "revenue mapping" },
  { icon: Route, label: "Smart Routing", path: "/features/smart-routing", desc: "geo-targeting" },
  { icon: Shield, label: "Link Immunity", path: "/features/link-immunity", desc: "zero broken links" },
];

export function FeatureGridCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-2xl p-4
        bg-white/[0.02] border border-white/[0.08]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
    >
      {/* Core Features */}
      <div className="mb-4">
        <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2 px-1">Core Features</p>
        <div className="grid grid-cols-2 gap-1">
          {coreFeatures.map((feature, i) => (
            <Link
              key={feature.label}
              to={feature.path}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.05] transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                <feature.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{feature.label}</span>
                <p className="text-[9px] text-white/40">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Intelligence */}
      <div>
        <p className="text-[10px] font-medium text-white/40 uppercase tracking-wider mb-2 px-1">AI Intelligence</p>
        <div className="grid grid-cols-2 gap-1">
          {aiFeatures.map((feature, i) => (
            <Link
              key={feature.label}
              to={feature.path}
              className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.05] transition-all duration-200"
            >
              <div className="w-7 h-7 rounded-md bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.1] transition-colors">
                <feature.icon className="w-3.5 h-3.5 text-white/60 group-hover:text-white/80 transition-colors" />
              </div>
              <div>
                <span className="text-[11px] font-medium text-white/80 group-hover:text-white transition-colors">{feature.label}</span>
                <p className="text-[9px] text-white/40">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
