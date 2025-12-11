import { motion } from "framer-motion";
import { ExternalLink, Sparkles, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const links = [
  { short: "utm.one/nike", destination: "nike.com/sale", clicks: "151.8K", favicon: "🏃" },
  { short: "utm.one/tesla", destination: "tesla.com/model-s", clicks: "100K", favicon: "⚡" },
  { short: "utm.one/apple", destination: "apple.com/iphone", clicks: "89.2K", favicon: "🍎" },
];

interface LinkShowcaseCardProps {
  variant?: "light" | "dark";
}

export function LinkShowcaseCard({ variant = "dark" }: LinkShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/features/short-links" className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className={cn(
          "group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={cn("text-sm font-medium mb-1", isLight ? "text-zinc-800" : "text-white/90")}>utm.one Links</h3>
            <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-white/50")}>Short links with superpowers</p>
          </div>
          <ArrowUpRight className={cn(
            "w-3.5 h-3.5 transition-all duration-200",
            isLight ? "text-transparent group-hover:text-zinc-400" : "text-white/0 group-hover:text-white/40"
          )} />
        </div>

        <div className="space-y-2.5">
          {links.map((link, i) => (
            <motion.div
              key={link.short}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: 0.1 + i * 0.05 }}
              className={cn(
                "group/link flex items-center justify-between p-2.5 rounded-xl transition-all duration-200",
                isLight
                  ? "bg-white border border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                  : "bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1]"
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{link.favicon}</span>
                <div>
                  <p className={cn(
                    "text-xs font-mono transition-colors",
                    isLight ? "text-zinc-700 group-hover/link:text-zinc-900" : "text-white/80 group-hover/link:text-white"
                  )}>
                    {link.short}
                  </p>
                  <div className={cn("flex items-center gap-1 text-[10px]", isLight ? "text-zinc-400" : "text-white/40")}>
                    <ExternalLink className="w-2.5 h-2.5" />
                    <span>{link.destination}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className={cn("text-xs font-mono tabular-nums", isLight ? "text-zinc-600" : "text-white/70")}>{link.clicks}</span>
                <Sparkles className={cn(
                  "w-3 h-3 transition-colors",
                  isLight ? "text-zinc-300 group-hover/link:text-zinc-500" : "text-white/30 group-hover/link:text-white/60"
                )} />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
