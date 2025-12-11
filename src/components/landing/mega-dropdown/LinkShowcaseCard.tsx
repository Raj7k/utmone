import { motion } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";

const links = [
  { short: "utm.one/nike", destination: "nike.com/sale", clicks: "151.8K", favicon: "🏃" },
  { short: "utm.one/tesla", destination: "tesla.com/model-s", clicks: "100K", favicon: "⚡" },
  { short: "utm.one/apple", destination: "apple.com/iphone", clicks: "89.2K", favicon: "🍎" },
];

export function LinkShowcaseCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 }}
      className="group p-5 rounded-2xl bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white/90 mb-1">utm.one Links</h3>
        <p className="text-xs text-white/50">Short links with superpowers</p>
      </div>

      <div className="space-y-2.5">
        {links.map((link, i) => (
          <motion.div
            key={link.short}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
            className="group/link flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{link.favicon}</span>
              <div>
                <p className="text-xs font-mono text-white/80 group-hover/link:text-white transition-colors">
                  {link.short}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-white/40">
                  <ExternalLink className="w-2.5 h-2.5" />
                  <span>{link.destination}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs font-mono text-white/70 tabular-nums">{link.clicks}</span>
              <Sparkles className="w-3 h-3 text-white/30 group-hover/link:text-white/60 transition-colors" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
