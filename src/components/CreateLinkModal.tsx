import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { useWorkspace } from "@/hooks/useWorkspace";
import { ToolSelector } from "@/components/tools/ToolSelector";
import { UTMBuilderTool } from "@/components/tools/UTMBuilderTool";
import { URLShortenerTool } from "@/components/tools/URLShortenerTool";
import { URLShortenerPicker } from "@/components/tools/URLShortenerPicker";
import { BulkURLShortenerTool } from "@/components/tools/BulkURLShortenerTool";
import { QRCodeTool } from "@/components/tools/QRCodeTool";
import { LinkForge } from "@/components/link-forge/LinkForge";
import { BulkUploadTabs } from "@/components/bulk-upload/BulkUploadTabs";

export const CreateLinkModal = () => {
  const { isCreateModalOpen, setCreateModalOpen } = useModal();
  const { currentWorkspace } = useWorkspace();
  const [selectedTool, setSelectedTool] = useState<"utm" | "shortener" | "bulk" | "qr" | "forge" | "shortener-single" | "shortener-bulk" | "shortener-advanced" | null>(null);
  const [utmToShorten, setUtmToShorten] = useState<string>("");
  const [urlForQR, setUrlForQR] = useState<string>("");

  const handleToolSelect = (tool: "utm" | "shortener" | "bulk" | "qr" | "forge") => {
    setSelectedTool(tool);
  };

  const handleShortenerModeSelect = (mode: "shortener-single" | "shortener-bulk" | "shortener-advanced") => {
    setSelectedTool(mode);
  };

  const handleCloseTool = () => {
    setSelectedTool(null);
    setUtmToShorten("");
    setUrlForQR("");
  };

  const handleCloseModal = (open: boolean) => {
    setCreateModalOpen(open);
    if (!open) {
      handleCloseTool();
    }
  };

  if (!currentWorkspace) return null;

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-title-2 heading">
                {!selectedTool && "create link"}
                {selectedTool === "utm" && "utm builder"}
                {selectedTool === "shortener" && "url shortener"}
                {selectedTool === "shortener-single" && "single url shortener"}
                {selectedTool === "shortener-bulk" && "bulk url shortener"}
                {selectedTool === "shortener-advanced" && "advanced bulk shortener"}
                {selectedTool === "qr" && "qr code generator"}
                {selectedTool === "forge" && "link forge"}
              </DialogTitle>
              <DialogDescription>
                {!selectedTool && "choose a tool to get started"}
                {selectedTool === "utm" && "build utm parameters with quick templates"}
                {selectedTool === "shortener" && "choose how you'd like to shorten"}
                {selectedTool === "shortener-single" && "create one short link"}
                {selectedTool === "shortener-bulk" && "process multiple urls at once"}
                {selectedTool === "shortener-advanced" && "full control with templates & utm"}
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

        {selectedTool && selectedTool !== "shortener" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (selectedTool.startsWith("shortener-")) {
                setSelectedTool("shortener");
              } else {
                setSelectedTool(null);
              }
            }}
            className="mb-4"
          >
            ← back to {selectedTool.startsWith("shortener-") ? "options" : "tools"}
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

        {selectedTool === "shortener" && (
          <URLShortenerPicker onSelectMode={handleShortenerModeSelect} />
        )}

        {selectedTool === "shortener-single" && (
          <URLShortenerTool 
            workspaceId={currentWorkspace.id}
            initialURL={utmToShorten}
            onGenerateQR={(url) => {
              setUrlForQR(url);
              setSelectedTool("qr");
            }}
          />
        )}

        {selectedTool === "shortener-bulk" && (
          <BulkURLShortenerTool workspaceId={currentWorkspace.id} />
        )}

        {selectedTool === "shortener-advanced" && (
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
  );
};

