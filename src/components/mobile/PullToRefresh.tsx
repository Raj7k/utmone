import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const { isPulling, isRefreshing, pullDistance, handlers } = usePullToRefresh({
    onRefresh,
    threshold: 80,
  });

  const shouldShowIndicator = isPulling || isRefreshing;
  const indicatorOpacity = Math.min(pullDistance / 80, 1);

  return (
    <div {...handlers} className="relative">
      {/* Pull indicator */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{
          opacity: shouldShowIndicator ? indicatorOpacity : 0,
          y: shouldShowIndicator ? 0 : -40,
        }}
        className="absolute top-0 left-0 right-0 flex justify-center pt-4 z-10 pointer-events-none"
      >
        <div className="bg-system-background border border-separator rounded-full p-2 shadow-lg">
          <motion.div
            animate={{
              rotate: isRefreshing ? 360 : 0,
            }}
            transition={{
              duration: 1,
              repeat: isRefreshing ? Infinity : 0,
              ease: "linear",
            }}
          >
            <RefreshCw className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        animate={{
          y: shouldShowIndicator ? pullDistance * 0.5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {children}
      </motion.div>
    </div>
  );
};
