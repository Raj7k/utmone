import { useState, useEffect } from "react";
import { useWorkspace } from "@/hooks/workspace";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedLinks } from "@/hooks/links";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { LinksHeroStats } from "@/components/links/LinksHeroStats";
import { SmartLinkFilters } from "@/components/links/SmartLinkFilters";
import { LinkCardGrid } from "@/components/links/LinkCardGrid";
import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Download } from "lucide-react";
import { FeatureGuard } from "@/components/feature-gating";
import { EnhancedLinksTable } from "@/components/EnhancedLinksTable";
import { FeatureHint } from "@/components/FeatureHint";
import { BulkSentinelPanel } from "@/components/sentinel";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardContentLoader } from "@/components/loading/DashboardContentLoader";
import { StaleIndicator } from "@/components/loading/CardSkeleton";

export default function Links() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const { currentWorkspace, isLoading: isWorkspaceLoading, hasTimedOut, retry } = useWorkspace();
  const isMobile = useIsMobile();

  // Use cached workspace ID as fallback for immediate query start
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const { data, isLoading, isFetched, isFetching } = useEnhancedLinks({
    workspaceId: effectiveWorkspaceId,
    searchQuery,
    statusFilter,
    pageSize: 50,
  });

  // Complete navigation when data loads or times out
  useEffect(() => {
    if ((isFetched && !isWorkspaceLoading) || hasTimedOut) {
      completeNavigation();
    }
  }, [isFetched, isWorkspaceLoading, hasTimedOut]);

  // Show loading state when data is loading (before any content checks)
  if (isLoading && !data?.links?.length) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <DashboardContentLoader context="links" minHeight="60vh" />
      </div>
    );
  }

  // Progressive render with fade-in
  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-muted-foreground">Something went wrong loading links. Please refresh the page.</div>}>
      <div className="animate-fade-in relative">
      {/* Stale data indicator */}
      <div className="absolute top-0 right-0 z-10">
        <StaleIndicator visible={isFetching && !!data?.links?.length} />
      </div>
      <PageContentWrapper
        title="links"
        description="decision intelligence dashboard with health scores and AI insights"
        breadcrumbs={[{ label: "links" }]}
        action={
          <div className="flex items-center gap-3">
            <FeatureGuard feature="csv_export">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                export csv
              </Button>
            </FeatureGuard>
            
            {/* View Toggle */}
            <div className="hidden md:flex items-center border border-border rounded-lg p-1">
              <Button
                variant={viewMode === "cards" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode("cards")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-3"
                onClick={() => setViewMode("table")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        }
      >
        {/* Hero Stats Bar - always render with fallback */}
        <LinksHeroStats workspaceId={effectiveWorkspaceId} />

        {/* Bulk Sentinel Panel - only show with workspace */}
        {effectiveWorkspaceId && (
          <BulkSentinelPanel workspaceId={effectiveWorkspaceId} />
        )}

        {/* Feature Discovery Hint */}
        <FeatureHint
          id="links-contextual-routing"
          title="New: Context-Aware Routing"
          description="Enable AI-powered routing when creating links with multiple destinations. The system learns which URLs perform best for different devices and locations."
        />

        {/* Smart Filters - always visible */}
        <SmartLinkFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          performanceFilter={performanceFilter}
          onPerformanceFilterChange={setPerformanceFilter}
          healthFilter={healthFilter}
          onHealthFilterChange={setHealthFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {/* View Content - always render immediately */}
        {viewMode === "cards" ? (
          <LinkCardGrid links={data?.links || []} />
        ) : (
          <EnhancedLinksTable 
            workspaceId={effectiveWorkspaceId}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        )}

        {/* Error state with retry - only show after timeout */}
        {hasTimedOut && !currentWorkspace && (
          <div className="flex flex-col items-center gap-4 py-12">
            <p className="text-sm text-muted-foreground">couldn't load workspace data</p>
            <div className="flex gap-3">
              <button 
                onClick={() => retry?.()}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                try again
              </button>
            </div>
          </div>
        )}
      </PageContentWrapper>
      </div>
    </ErrorBoundary>
  );
}
