import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { EnhancedLinksTable } from "@/components/EnhancedLinksTable";
import { LinkFilters } from "@/components/LinkFilters";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileActionSheet } from "@/components/mobile/MobileActionSheet";
import { MobileLinkFilters } from "@/components/mobile/MobileLinkFilters";
import { FeatureHint } from "@/components/FeatureHint";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LinkForge } from "@/components/link-forge/LinkForge";
import { ToolSelector } from "@/components/tools/ToolSelector";
import { UTMBuilderTool } from "@/components/tools/UTMBuilderTool";
import { URLShortenerTool } from "@/components/tools/URLShortenerTool";
import { QRCodeTool } from "@/components/tools/QRCodeTool";
import { BulkUploadTabs } from "@/components/bulk-upload/BulkUploadTabs";


export default function Links() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<"utm" | "shortener" | "bulk" | "qr" | "forge" | null>(null);
  const [utmToShorten, setUtmToShorten] = useState<string>("");
  const [urlForQR, setUrlForQR] = useState<string>("");
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

  const handleToolSelect = (tool: "utm" | "shortener" | "bulk" | "qr" | "forge") => {
    setSelectedTool(tool);
    setCreateDialogOpen(true);
  };

  const handleCloseTool = () => {
    setSelectedTool(null);
    setUtmToShorten("");
    setUrlForQR("");
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <FeatureHint
        id="links-first-visit"
        title="Create Your First Short Link"
        description="Add UTM parameters for better campaign tracking. Choose a tool to get started."
        className="mb-content"
      />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-semibold text-label">links</h2>
          <p className="text-sm text-secondary-label mt-1">create and manage your short links</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
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

      {/* Create Link Dialog with Tool Selection */}
      <Dialog open={createDialogOpen} onOpenChange={(open) => {
        setCreateDialogOpen(open);
        if (!open) handleCloseTool();
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-title-2 heading">
                  {!selectedTool && "create link"}
                  {selectedTool === "utm" && "utm builder"}
                  {selectedTool === "shortener" && "url shortener"}
                  {selectedTool === "bulk" && "bulk url shortener"}
                  {selectedTool === "qr" && "qr code generator"}
                  {selectedTool === "forge" && "link forge"}
                </DialogTitle>
                <DialogDescription>
                  {!selectedTool && "choose a tool to get started"}
                  {selectedTool === "utm" && "build utm parameters with quick templates"}
                  {selectedTool === "shortener" && "create short, memorable links"}
                  {selectedTool === "bulk" && "process hundreds of urls at once"}
                  {selectedTool === "qr" && "generate branded qr codes"}
                  {selectedTool === "forge" && "all-in-one: utm + shortener + qr"}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseTool}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {!selectedTool && (
            <ToolSelector onSelectTool={handleToolSelect} />
          )}

          {selectedTool && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTool(null)}
              className="mb-4"
            >
              ← back to tools
            </Button>
          )}

          {selectedTool === "utm" && (
            <UTMBuilderTool
              onShortenURL={(url) => {
                setUtmToShorten(url);
                setSelectedTool("shortener");
              }}
            />
          )}

          {selectedTool === "shortener" && currentWorkspace && (
            <URLShortenerTool 
              workspaceId={currentWorkspace.id}
              initialURL={utmToShorten}
              onGenerateQR={(url) => {
                setUrlForQR(url);
                setSelectedTool("qr");
              }}
            />
          )}

          {selectedTool === "bulk" && (
            <BulkUploadTabs workspaceId={currentWorkspace.id} />
          )}

          {selectedTool === "qr" && (
            <QRCodeTool initialURL={urlForQR} />
          )}

          {selectedTool === "forge" && (
            <LinkForge 
              workspaceId={currentWorkspace.id}
              onSuccess={() => {
                // Keep dialog open so user can see journey and go to step 3 for QR
              }}
            />
          )}
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

