import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useDeleteLink } from "@/hooks/links";
import { AlertTriangle, Archive, Trash2 } from "lucide-react";

interface DeleteLinkDialogProps {
  linkId: string;
  linkSlug: string;
  totalClicks: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DeleteLinkDialog = ({ linkId, linkSlug, totalClicks, open, onOpenChange }: DeleteLinkDialogProps) => {
  const [stage, setStage] = useState<"archive" | "delete">("archive");
  const [confirmText, setConfirmText] = useState("");
  const navigate = useNavigate();
  const deleteLink = useDeleteLink();

  const handleArchive = async () => {
    await deleteLink.mutateAsync({ linkId, permanent: false });
    onOpenChange(false);
    navigate("/links");
  };

  const handleDelete = async () => {
    if (confirmText !== linkSlug) return;
    await deleteLink.mutateAsync({ linkId, permanent: true });
    onOpenChange(false);
    navigate("/links");
  };

  const resetAndClose = () => {
    setStage("archive");
    setConfirmText("");
    onOpenChange(false);
  };

  if (stage === "archive") {
    return (
      <Dialog open={open} onOpenChange={resetAndClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>archive link?</DialogTitle>
            <DialogDescription>
              this link will be hidden but can be restored later.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This link has <strong>{totalClicks}</strong> total clicks. 
                {totalClicks > 0 && " All analytics data will be preserved."}
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={resetAndClose}>
              cancel
            </Button>
            <Button variant="secondary" onClick={handleArchive} disabled={deleteLink.isPending}>
              <Archive className="h-4 w-4 mr-2" />
              archive
            </Button>
            <Button variant="ghost" className="text-destructive" onClick={() => setStage("delete")}>
              delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="border-destructive">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            permanent deletion
          </DialogTitle>
          <DialogDescription>
            this action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1 mt-2">
                <li>Link will stop working immediately</li>
                <li>All QR codes will become invalid</li>
                <li>Click data will be preserved but link metadata will be deleted</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>type <code className="bg-muted px-1 py-0.5 rounded">{linkSlug}</code> to confirm</Label>
            <Input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={linkSlug}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setStage("archive")}>
            just archive
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={confirmText !== linkSlug || deleteLink.isPending}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteLink.isPending ? "deleting…" : "delete permanently"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
