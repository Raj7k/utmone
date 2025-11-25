import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkForge } from "./link-forge/LinkForge";
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
    // LinkForge handles the complete journey, just close dialog
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
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
        <DialogHeader>
          <DialogTitle className="text-title-2 heading">create new link</DialogTitle>
          <DialogDescription>
            build your utm url, shorten it, and generate a qr code
          </DialogDescription>
        </DialogHeader>
        <LinkForge workspaceId={workspaceId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
};
