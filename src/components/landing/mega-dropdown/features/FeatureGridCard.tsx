import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Link2, Tags, QrCode, TrendingUp, Sparkles, GitBranch, Route, Shield, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

const coreFeatures = [
  { icon: Link2, label: "Short Links", path: "/features/short-links", desc: "branded urls" },
  { icon: Tags, label: "UTM Builder", path: "/features/utm-builder", desc: "consistent tracking" },
  { icon: QrCode, label: "QR Generator", path: "/features/qr-generator", desc: "trackable codes" },
  { icon: LayoutGrid, label: "Link Pages", path: "/features/link-pages", desc: "link-in-bio" },
  { icon: TrendingUp, label: "Analytics", path: "/features/analytics", desc: "real-time insights" },
];

const aiFeatures = [
  { icon: Sparkles, label: "Predictive", path: "/features/predictive-analytics", desc: "forecast performance" },
  { icon: GitBranch, label: "Attribution", path: "/features/attribution-graph", desc: "revenue mapping" },
  { icon: Route, label: "Smart Routing", path: "/features/smart-routing", desc: "geo-targeting" },
  { icon: Shield, label: "Sentinel Mode", path: "/features/sentinel", desc: "link protection" },
];

interface FeatureGridCardProps {
  variant?: "light" | "dark";
}

export function FeatureGridCard({ variant = "dark" }: FeatureGridCardProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={cn(
        "rounded-2xl p-4",
        isLight
          ? "bg-zinc-50 border border-zinc-200"
          : "bg-white/[0.02] border border-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
      )}
    >
      {/* Core Features */}
      <div className="mb-4">
        <p className={cn(
          "text-[10px] font-medium uppercase tracking-wider mb-2 px-1",
          isLight ? "text-zinc-400" : "text-white/40"
        )}>Core Features</p>
        <div className="grid grid-cols-2 gap-1">
          {coreFeatures.map((feature) => (
            <Link
              key={feature.label}
              to={feature.path}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                isLight ? "hover:bg-zinc-100" : "hover:bg-white/[0.05]"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                isLight ? "bg-zinc-100 group-hover:bg-zinc-200" : "bg-white/[0.06] group-hover:bg-white/[0.1]"
              )}>
                <feature.icon className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isLight ? "text-zinc-500 group-hover:text-zinc-700" : "text-white/60 group-hover:text-white/80"
                )} />
              </div>
              <div>
                <span className={cn(
                  "text-[11px] font-medium transition-colors",
                  isLight ? "text-zinc-700 group-hover:text-zinc-900" : "text-white/80 group-hover:text-white"
                )}>{feature.label}</span>
                <p className={cn("text-[9px]", isLight ? "text-zinc-400" : "text-white/40")}>{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* AI Intelligence */}
      <div>
        <p className={cn(
          "text-[10px] font-medium uppercase tracking-wider mb-2 px-1",
          isLight ? "text-zinc-400" : "text-white/40"
        )}>AI Intelligence</p>
        <div className="grid grid-cols-2 gap-1">
          {aiFeatures.map((feature) => (
            <Link
              key={feature.label}
              to={feature.path}
              className={cn(
                "group flex items-center gap-2 p-2 rounded-lg transition-all duration-200",
                isLight ? "hover:bg-zinc-100" : "hover:bg-white/[0.05]"
              )}
            >
              <div className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                isLight ? "bg-zinc-100 group-hover:bg-zinc-200" : "bg-white/[0.06] group-hover:bg-white/[0.1]"
              )}>
                <feature.icon className={cn(
                  "w-3.5 h-3.5 transition-colors",
                  isLight ? "text-zinc-500 group-hover:text-zinc-700" : "text-white/60 group-hover:text-white/80"
                )} />
              </div>
              <div>
                <span className={cn(
                  "text-[11px] font-medium transition-colors",
                  isLight ? "text-zinc-700 group-hover:text-zinc-900" : "text-white/80 group-hover:text-white"
                )}>{feature.label}</span>
                <p className={cn("text-[9px]", isLight ? "text-zinc-400" : "text-white/40")}>{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
