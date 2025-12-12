import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface SalesPageSkeletonProps {
  showSlowMessage?: boolean;
}

export const SalesPageSkeleton = ({ showSlowMessage = false }: SalesPageSkeletonProps) => {
  return (
    <PageContentWrapper
      title="sales companion"
      description="track prospect engagement and get instant alerts when they view your links"
      breadcrumbs={[{ label: "sales" }]}
      action={<Skeleton className="h-10 w-36 rounded-xl" />}
    >
      {/* Slow loading message */}
      <AnimatePresence>
        {showSlowMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between"
          >
            <p className="text-sm text-amber-600 dark:text-amber-400">
              still loading sales data...
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="text-amber-600 dark:text-amber-400 hover:text-amber-700 hover:bg-amber-500/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              refresh
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className="bg-card border border-border rounded-2xl p-5"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="h-11 w-11 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-7 w-12" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="divide-y divide-border">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-40" />
                      <Skeleton className="h-4 w-28" />
                    </div>
                    <Skeleton className="h-8 w-16 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-2xl">
            <div className="p-4 border-b border-border">
              <Skeleton className="h-5 w-24" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-9 w-9 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContentWrapper>
  );
};