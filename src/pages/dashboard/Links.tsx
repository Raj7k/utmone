import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EnhancedLinksTable } from "@/components/EnhancedLinksTable";
import { LinkFilters } from "@/components/LinkFilters";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileActionSheet } from "@/components/mobile/MobileActionSheet";
import { MobileLinkFilters } from "@/components/mobile/MobileLinkFilters";
import { FeatureHint } from "@/components/FeatureHint";
import { FeatureGuard } from "@/components/feature-gating";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";


export default function Links() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { currentWorkspace } = useWorkspace();
  const isMobile = useIsMobile();

  if (!currentWorkspace) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-body-apple text-secondary-label">loading workspace…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <PageHeader
        title="links"
        description="create and manage short links with smart slug optimization and A/B testing"
        breadcrumbs={[{ label: "links" }]}
        action={
          <div className="flex items-center gap-3">
            <FeatureGuard feature="csv_export">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                export csv
              </Button>
            </FeatureGuard>
            {!isMobile && (
              <LinkFilters
                onSearchChange={setSearchQuery}
                onStatusChange={setStatusFilter}
              />
            )}
          </div>
        }
      />
      
      <FeatureHint
        id="links-first-visit"
        title="create your first short link"
        description="add UTM parameters for better campaign tracking. choose a tool to get started."
        className="mb-content"
      />

      <Card variant="grouped">
        <CardHeader className="p-0">
          <CardTitle className="sr-only">your links</CardTitle>
          <CardDescription className="sr-only">
            view and manage all links in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <EnhancedLinksTable 
            workspaceId={currentWorkspace.id}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </CardContent>
      </Card>

      {/* Mobile Filters */}
      {isMobile && (
        <MobileActionSheet
          open={mobileFiltersOpen}
          onOpenChange={setMobileFiltersOpen}
          title="filter links"
          description="narrow down your links"
        >
          <MobileLinkFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onClose={() => setMobileFiltersOpen(false)}
          />
        </MobileActionSheet>
      )}
    </div>
  );
}

