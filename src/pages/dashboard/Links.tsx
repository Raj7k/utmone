import { useState, useEffect } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEnhancedLinks } from "@/hooks/useEnhancedLinks";
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

export default function Links() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState<string[]>([]);
  const [healthFilter, setHealthFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const { currentWorkspace, isLoading: isWorkspaceLoading, hasTimedOut, retry } = useWorkspace();
  const isMobile = useIsMobile();

  const { data, isLoading, isFetched } = useEnhancedLinks({
    workspaceId: currentWorkspace?.id || "",
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

  // Show loading state with better UX
  if (isWorkspaceLoading && !hasTimedOut) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">loading workspace…</p>
        </div>
      </div>
    );
  }

  // Show error/timeout state with retry option
  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-1">couldn't load workspace</h3>
            <p className="text-sm text-muted-foreground">
              {hasTimedOut 
                ? "the request took too long. this might be a temporary issue." 
                : "there was a problem loading your workspace data."}
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => retry?.()}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              try again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-sm border border-border rounded-lg hover:bg-muted transition-colors"
            >
              refresh page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
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
      {/* Hero Stats Bar */}
      {currentWorkspace && (
        <LinksHeroStats workspaceId={currentWorkspace.id} />
      )}

      {/* Bulk Sentinel Panel */}
      {currentWorkspace && (
        <BulkSentinelPanel workspaceId={currentWorkspace.id} />
      )}

      {/* Feature Discovery Hint */}
      <FeatureHint
        id="links-contextual-routing"
        title="New: Context-Aware Routing"
        description="Enable AI-powered routing when creating links with multiple destinations. The system learns which URLs perform best for different devices and locations."
      />

      {/* Smart Filters */}
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

      {/* View Content */}
      {viewMode === "cards" ? (
        <LinkCardGrid links={data?.links || []} />
      ) : (
        <EnhancedLinksTable 
          workspaceId={currentWorkspace?.id || ""}
          searchQuery={searchQuery}
          statusFilter={statusFilter}
        />
      )}
    </PageContentWrapper>
  );
}
