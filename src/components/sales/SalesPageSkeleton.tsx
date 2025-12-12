import { Skeleton } from "@/components/ui/skeleton";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";

export const SalesPageSkeleton = () => {
  return (
    <PageContentWrapper
      title="sales companion"
      description="track prospect engagement and get instant alerts when they view your links"
      breadcrumbs={[{ label: "sales" }]}
      action={<Skeleton className="h-10 w-36" />}
    >
      {/* Stats Banner Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
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
        {/* Sales Links Table Skeleton */}
        <div className="lg:col-span-2">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-3 border border-border rounded-lg">
                  <Skeleton className="h-10 w-10 rounded" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Activity Feed Skeleton */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-4 space-y-4">
            <Skeleton className="h-6 w-28" />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-20" />
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
