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
      <FeatureHint
        id="links-first-visit"
        title="Create Your First Short Link"
        description="Add UTM parameters for better campaign tracking. Choose a tool to get started."
        className="mb-content"
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-label">links</h2>
          <p className="text-sm text-secondary-label mt-1">create and manage your short links</p>
        </div>
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
      </div>

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

