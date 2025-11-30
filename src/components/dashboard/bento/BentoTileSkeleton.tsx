import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface BentoTileSkeletonProps {
  variant?: 'default' | 'small' | 'list';
}

export const BentoTileSkeleton = ({ variant = 'default' }: BentoTileSkeletonProps) => {
  if (variant === 'small') {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full flex flex-col justify-center gap-3 animate-pulse">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-5 w-24 rounded" />
        </div>
        <Skeleton className="h-12 w-full rounded" />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <Card variant="grouped" className="h-full animate-pulse">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Default variant
  return (
    <Card variant="grouped" className="h-full animate-pulse">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-32 w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </CardContent>
    </Card>
  );
};
