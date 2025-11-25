import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkForm } from "./LinkForm";
import { Plus, Copy, QrCode, BarChart3, CheckCircle2, ExternalLink } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { QRCodeDialog } from "./QRCodeDialog";
import { useNavigate } from "react-router-dom";
import { LinkPreviewCard } from "./LinkPreviewCard";
import { TrustBadge } from "./TrustBadge";

interface CreateLinkDialogProps {
  workspaceId: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const CreateLinkDialog = ({ workspaceId, open: externalOpen, onOpenChange }: CreateLinkDialogProps) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen);
    } else {
      setInternalOpen(newOpen);
    }
  };
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdLinkId, setCreatedLinkId] = useState<string | null>(null);
  const [createdShortUrl, setCreatedShortUrl] = useState<string>("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSuccess = (linkId: string, shortUrl: string) => {
    setCreatedLinkId(linkId);
    setCreatedShortUrl(shortUrl);
    setShowSuccess(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowSuccess(false);
    setCreatedLinkId(null);
    setCreatedShortUrl("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(createdShortUrl);
    toast({
      title: "Copied!",
      description: "Short URL copied to clipboard",
    });
  };

  const handleViewAnalytics = () => {
    if (createdLinkId) {
      handleClose();
      navigate(`/links/${createdLinkId}`);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccess(false);
    setCreatedLinkId(null);
    setCreatedShortUrl("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          create link
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl">create new link</DialogTitle>
              <DialogDescription>
                add the url you want to track
              </DialogDescription>
            </DialogHeader>
            <LinkForm workspaceId={workspaceId} onSuccess={handleSuccess} />
          </>
        ) : (
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <DialogTitle className="font-serif text-2xl">link created.</DialogTitle>
                <DialogDescription>your link is ready</DialogDescription>
              </div>
            </div>

            <Card className="p-4 bg-muted/50">
              <label className="text-sm font-medium text-secondary-label block mb-2">
                Short URL
              </label>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 px-3 py-2 bg-background rounded-md border font-mono text-sm truncate">
                  {createdShortUrl}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => window.open(createdShortUrl, '_blank')}
                  title="Open in new tab"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Link Preview with Trust Indicators */}
              {createdLinkId && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary-label block">
                    Link Preview & Security
                  </label>
                  <LinkPreviewCard 
                    linkId={createdLinkId}
                    destinationUrl={createdShortUrl}
                  >
                    <div className="text-xs text-secondary-label hover:underline cursor-help">
                      hover to preview destination & security status
                    </div>
                  </LinkPreviewCard>
                </div>
              )}
            </Card>

            <div className="space-y-3">
              <h4 className="font-medium text-sm text-secondary-label">What would you like to do next?</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <QRCodeDialog
                  linkId={createdLinkId!}
                  shortUrl={createdShortUrl}
                  trigger={
                    <Button variant="default" className="w-full gap-2 h-auto py-4 flex-col">
                      <QrCode className="h-5 w-5" />
                      <span className="font-medium">generate qr</span>
                      <span className="text-xs opacity-80">create a branded qr code</span>
                    </Button>
                  }
                />
                <Button
                  variant="outline"
                  className="w-full gap-2 h-auto py-4 flex-col"
                  onClick={handleViewAnalytics}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="font-medium">view analytics</span>
                  <span className="text-xs opacity-80">see what matters</span>
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCreateAnother}
              >
                <Plus className="h-4 w-4 mr-2" />
                create another
              </Button>
              <Button
                variant="default"
                className="flex-1"
                onClick={handleClose}
              >
                continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
