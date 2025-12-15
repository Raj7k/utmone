import { useEffect, useState, lazy, Suspense } from "react";
import { useSalesData } from "@/hooks/dashboard";
import { useWorkspace } from "@/hooks/workspace";
import { SalesLinkTable } from "@/components/sales/SalesLinkTable";
import { SalesStatCard } from "@/components/sales/SalesStatCard";
import { LazySection } from "@/components/loading/LazySection";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
const SalesActivityFeed = lazy(() => import("@/components/sales/SalesActivityFeed").then(m => ({ default: m.SalesActivityFeed })));
import { CreateSalesLinkModal } from "@/components/sales/CreateSalesLinkModal";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Briefcase, Eye } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { DashboardContentLoader } from "@/components/loading/DashboardContentLoader";
import { StaleIndicator } from "@/components/loading/CardSkeleton";

const Sales = () => {
  const { hasTimedOut, retry, currentWorkspace } = useWorkspace();
  // Use lightweight sales hook - only fetches sales links (1 query instead of 10)
  const { data: salesLinks = [], isFetching, isFetched, isLoading, refetch } = useSalesData();
  const isStale = false; // Lightweight hook doesn't track staleness
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Complete navigation progress when data loads or times out
  useEffect(() => {
    if (isFetched || hasTimedOut) {
      completeNavigation();
    }
  }, [isFetched, hasTimedOut]);

  // Calculate stats - safe even when loading
  const hotLeads = salesLinks.filter(l => {
    const lastClick = l.last_clicked_at;
    if (!lastClick) return false;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(lastClick) > hourAgo;
  }).length;

  const totalViews = salesLinks.reduce((sum, l) => sum + (l.total_clicks || 0), 0);

  // Prepare salesLinks data for activity feed (strip to needed fields)
  const activityFeedLinks = salesLinks.map(l => ({
    id: l.id,
    title: l.title || '',
    prospect_name: l.prospect_name,
    slug: l.slug || '',
  }));

  return (
    <div className="animate-fade-in">
    <PageContentWrapper
      title="sales companion"
      description="track prospect engagement and get instant alerts when they view your links"
      breadcrumbs={[{ label: "sales" }]}
      action={
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          new sales link
        </Button>
      }
    >
      {/* Stale data indicator */}
      <div className="absolute top-4 right-4">
        <StaleIndicator visible={isStale || isFetching} />
      </div>

      {/* Stats Banner - show skeletons when loading, data when ready */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {isLoading && !isFetched ? (
          <>
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </>
        ) : (
          <>
            <SalesStatCard
              icon={Zap}
              label="hot leads (1h)"
              value={hotLeads}
              variant="hot"
              pulse={hotLeads > 0}
            />
            <SalesStatCard
              icon={Briefcase}
              label="active deals"
              value={salesLinks.length}
              variant="primary"
            />
            <SalesStatCard
              icon={Eye}
              label="total views"
              value={totalViews}
              variant="amber"
            />
          </>
        )}
      </div>

      {/* Main Content - always render */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Sales Links Table */}
      <div className="lg:col-span-2">
        <SalesLinkTable 
          links={salesLinks as any} 
          isLoading={false} 
          onRefresh={refetch}
          onCreateLink={() => setIsCreateModalOpen(true)}
        />
      </div>

        {/* Activity Feed - Lazy loaded, receives pre-fetched links */}
        <div className="lg:col-span-1">
          <LazySection 
            fallback={<Skeleton className="h-80 rounded-xl" />}
            rootMargin="200px"
          >
            <Suspense fallback={<Skeleton className="h-80 rounded-xl" />}>
              <SalesActivityFeed salesLinks={activityFeedLinks} />
            </Suspense>
          </LazySection>
        </div>
      </div>

      {/* Error state with retry */}
      {hasTimedOut && !currentWorkspace && (
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">couldn't load workspace data</p>
          <button 
            onClick={() => retry?.()}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            try again
          </button>
        </div>
      )}

      {/* Create Sales Link Modal */}
      <CreateSalesLinkModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </PageContentWrapper>
    </div>
  );
};

export default Sales;
