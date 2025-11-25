import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EnhancedLinksTable } from "@/components/EnhancedLinksTable";
import { LinkFilters } from "@/components/LinkFilters";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileActionSheet } from "@/components/mobile/MobileActionSheet";
import { MobileLinkFilters } from "@/components/mobile/MobileLinkFilters";
import { FeatureHint } from "@/components/FeatureHint";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LinkForge } from "@/components/link-forge/LinkForge";

export default function Links() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
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
    <div className="space-y-6">
      <FeatureHint
        id="links-first-visit"
        title="Create Your First Short Link"
        description="Add UTM parameters for better campaign tracking. Click the create button to get started."
        className="mb-content"
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-large-title font-bold text-label mb-2 heading">links</h1>
          <p className="text-body-apple text-secondary-label">
            manage and track all your short links
          </p>
        </div>
        <Button size="lg" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-5 w-5 mr-2" />
          create link
        </Button>
      </div>

      {!isMobile && (
        <LinkFilters
          onSearchChange={setSearchQuery}
          onStatusChange={setStatusFilter}
        />
      )}

      <Card variant="grouped">
        <CardHeader>
          <CardTitle className="text-title-2 text-label">your links</CardTitle>
          <CardDescription className="text-secondary-label">
            view and manage all links in your workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EnhancedLinksTable 
            workspaceId={currentWorkspace.id}
            searchQuery={searchQuery}
            statusFilter={statusFilter}
          />
        </CardContent>
      </Card>

      {/* Create Link Dialog with Link Forge */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-title-2 heading">create new link</DialogTitle>
            <DialogDescription>
              build your utm url, shorten it, and generate a qr code
            </DialogDescription>
          </DialogHeader>
          <LinkForge 
            workspaceId={currentWorkspace.id}
            onSuccess={() => {
              // Keep dialog open so user can see journey and go to step 3 for QR
            }}
          />
        </DialogContent>
      </Dialog>

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

