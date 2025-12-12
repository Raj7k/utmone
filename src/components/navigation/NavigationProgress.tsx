import { motion, AnimatePresence } from "framer-motion";
import { useNavigationProgress } from "@/hooks/useNavigationProgress";

export const NavigationProgress = () => {
  const { isNavigating, progress, isSlowLoad } = useNavigationProgress();

  return (
    <AnimatePresence>
      {isNavigating && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed top-0 left-0 right-0 z-[100] h-0.5"
          >
            {/* Background track */}
            <div className="absolute inset-0 bg-primary/10" />
            
            {/* Progress bar */}
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.1,
                ease: "easeOut"
              }}
              className="absolute inset-y-0 left-0 bg-primary"
              style={{
                boxShadow: "0 0 10px hsl(var(--primary)), 0 0 5px hsl(var(--primary))"
              }}
            />
            
            {/* Shimmer effect */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
          </motion.div>

          {/* Slow load indicator */}
          {isSlowLoad && progress >= 70 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-3 left-1/2 -translate-x-1/2 z-[100] px-3 py-1.5 rounded-full bg-card/80 backdrop-blur-sm border border-border text-xs text-muted-foreground"
            >
              still loading...
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
