import { motion } from "framer-motion";
import { Users, Cloud, CloudOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScanCounterProps {
  count: number;
  pendingCount: number;
  isOnline: boolean;
  onClick?: () => void;
}

/**
 * Floating pill showing scan count with sync status
 * Minimal, always visible, non-intrusive
 */
export const ScanCounter = ({ count, pendingCount, isOnline, onClick }: ScanCounterProps) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full",
        "bg-black/60 backdrop-blur-xl border border-white/10",
        "text-white text-sm font-medium",
        "transition-all duration-200",
        onClick && "hover:bg-black/80 active:scale-95"
      )}
    >
      <Users className="w-4 h-4 text-white/70" />
      <span className="tabular-nums">{count} lead{count !== 1 ? 's' : ''}</span>
      
      {pendingCount > 0 && (
        <span className="flex items-center gap-1 text-amber-400 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          {pendingCount}
        </span>
      )}
      
      {isOnline ? (
        <Cloud className="w-3.5 h-3.5 text-emerald-400" />
      ) : (
        <CloudOff className="w-3.5 h-3.5 text-amber-400" />
      )}
    </motion.button>
  );
};
