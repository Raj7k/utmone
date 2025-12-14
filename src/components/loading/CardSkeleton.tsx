import { Skeleton } from "@/components/ui/skeleton";

// Granular skeleton components for progressive loading

export const StatCardSkeleton = () => (
  <div className="p-4 rounded-xl bg-card border border-border">
    <Skeleton className="h-4 w-20 mb-2" />
    <Skeleton className="h-8 w-16" />
  </div>
);

export const HeroStatsSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map(i => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

export const LinkCardSkeleton = () => (
  <div className="p-4 rounded-xl bg-card border border-border space-y-3">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div className="flex-1">
        <Skeleton className="h-4 w-3/4 mb-2" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
    <Skeleton className="h-8 w-full" />
  </div>
);

export const LinkCardGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <LinkCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-border">
    <Skeleton className="h-4 w-4 rounded" />
    <Skeleton className="h-4 flex-1" />
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-4 w-16" />
  </div>
);

export const TableSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="rounded-xl bg-card border border-border overflow-hidden">
    <div className="p-4 border-b border-border">
      <Skeleton className="h-5 w-32" />
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <TableRowSkeleton key={i} />
    ))}
  </div>
);

export const ChartSkeleton = ({ height = "h-64" }: { height?: string }) => (
  <div className={`rounded-xl bg-card border border-border p-4 ${height}`}>
    <div className="flex items-center justify-between mb-4">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-8 w-24" />
    </div>
    <Skeleton className="h-full w-full rounded-lg" />
  </div>
);

export const ActivityFeedSkeleton = ({ items = 5 }: { items?: number }) => (
  <div className="rounded-xl bg-card border border-border p-4 space-y-4">
    <Skeleton className="h-5 w-32" />
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-3 w-3/4 mb-1" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

export const BentoCardSkeleton = ({ className = "" }: { className?: string }) => (
  <div className={`rounded-2xl bg-card border border-border p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <Skeleton className="h-10 w-10 rounded-lg" />
      <div>
        <Skeleton className="h-5 w-24 mb-1" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
    <Skeleton className="h-32 w-full rounded-lg" />
  </div>
);

// Stale data indicator - subtle "updating" badge
export const StaleIndicator = ({ visible }: { visible: boolean }) => {
  if (!visible) return null;
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
      <span>updating...</span>
    </div>
  );
};
