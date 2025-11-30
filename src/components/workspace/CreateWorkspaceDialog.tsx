import { useState } from "react";
import { useClientWorkspaces } from "@/hooks/useClientWorkspaces";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateWorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (workspace: any) => void;
}

export function CreateWorkspaceDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateWorkspaceDialogProps) {
  const [name, setName] = useState("");
  const [isClient, setIsClient] = useState(false);
  const { createWorkspace } = useClientWorkspaces();
  const { switchWorkspace } = useWorkspaceContext();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createWorkspace(
      { name, isClient },
      {
        onSuccess: (workspace) => {
          // Switch to the newly created workspace
          if (workspace?.id) {
            switchWorkspace(workspace.id);
          }
          
          // Reset form
          setName("");
          setIsClient(false);
          onOpenChange(false);
          
          // Call optional success callback
          onSuccess?.(workspace);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>create new workspace</DialogTitle>
          <DialogDescription>
            create a new workspace for your team or a client
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreate}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">workspace name</Label>
              <Input
                id="name"
                placeholder="My Company"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isClient"
                checked={isClient}
                onChange={(e) => setIsClient(e.target.checked)}
              />
              <Label htmlFor="isClient">this is a client workspace</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">create workspace</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
