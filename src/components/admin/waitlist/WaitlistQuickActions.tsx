import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, UserPlus, Mail, RefreshCw, MoreHorizontal } from "lucide-react";
import { AddToWaitlistForm } from "./AddToWaitlistForm";
import { DirectInviteForm } from "./DirectInviteForm";

type Props = {
  onRecalculateScores: () => void;
  isRecalculating: boolean;
};

export function WaitlistQuickActions({ onRecalculateScores, isRecalculating }: Props) {
  const [addToWaitlistOpen, setAddToWaitlistOpen] = useState(false);
  const [directInviteOpen, setDirectInviteOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            quick actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => setAddToWaitlistOpen(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            add to waitlist
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setDirectInviteOpen(true)}>
            <Mail className="h-4 w-4 mr-2" />
            direct invite
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={onRecalculateScores} disabled={isRecalculating}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRecalculating ? "animate-spin" : ""}`} />
            recalculate scores
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={addToWaitlistOpen} onOpenChange={setAddToWaitlistOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>add to waitlist</DialogTitle>
          </DialogHeader>
          <AddToWaitlistForm onSuccess={() => setAddToWaitlistOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={directInviteOpen} onOpenChange={setDirectInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>send direct invite</DialogTitle>
          </DialogHeader>
          <DirectInviteForm onSuccess={() => setDirectInviteOpen(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}
