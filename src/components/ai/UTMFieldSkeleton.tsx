import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UTMFieldSkeletonProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

export function UTMFieldSkeleton({ isLoading, children, className }: UTMFieldSkeletonProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <div className={cn("relative", className)}>
      {children}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="h-full w-full bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-pulse rounded-md" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent rounded-md"
          animate={{
            x: ["-100%", "100%"],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}
