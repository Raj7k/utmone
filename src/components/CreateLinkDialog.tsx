import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkForm } from "./LinkForm";
import { Plus } from "lucide-react";
import { useState } from "react";

interface CreateLinkDialogProps {
  workspaceId: string;
}

export const CreateLinkDialog = ({ workspaceId }: CreateLinkDialogProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Create Link
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Create New Short Link</DialogTitle>
          <DialogDescription>
            Create a branded short link with UTM tracking for your campaigns
          </DialogDescription>
        </DialogHeader>
        <LinkForm workspaceId={workspaceId} onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
