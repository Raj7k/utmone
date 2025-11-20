import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDuplicateLink } from "@/hooks/useDuplicateLink";
import { Copy } from "lucide-react";

interface DuplicateLinkDialogProps {
  linkId: string;
  linkTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DuplicateLinkDialog = ({ linkId, linkTitle, open, onOpenChange }: DuplicateLinkDialogProps) => {
  const navigate = useNavigate();
  const duplicateLink = useDuplicateLink();

  const handleDuplicate = async () => {
    const result = await duplicateLink.mutateAsync(linkId);
    onOpenChange(false);
    navigate(`/links/${result.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Duplicate Link</DialogTitle>
          <DialogDescription>
            Create a copy of "{linkTitle}". All settings and UTM parameters will be preserved.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Original Link</Label>
            <div className="text-sm text-muted-foreground">{linkTitle}</div>
          </div>

          <div className="space-y-2">
            <Label>New Link Title</Label>
            <div className="text-sm text-muted-foreground">{linkTitle} (Copy)</div>
          </div>

          <div className="space-y-2">
            <Label>New Slug</Label>
            <div className="text-sm text-muted-foreground">
              Will be auto-generated with "-copy" suffix
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleDuplicate} disabled={duplicateLink.isPending}>
            <Copy className="h-4 w-4 mr-2" />
            {duplicateLink.isPending ? "Duplicating..." : "Create Duplicate"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
