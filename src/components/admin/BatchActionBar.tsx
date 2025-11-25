import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Send } from "lucide-react";

type BatchActionBarProps = {
  selectedCount: number;
  onClearSelection: () => void;
  onSendInvites: () => void;
};

export function BatchActionBar({ selectedCount, onClearSelection, onSendInvites }: BatchActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg border px-6 py-4 flex items-center gap-4">
        <span className="font-semibold">{selectedCount} user{selectedCount !== 1 ? 's' : ''} selected</span>
        <div className="h-6 w-px bg-primary-foreground/20" />
        <Button 
          size="sm" 
          variant="secondary"
          onClick={onSendInvites}
          className="gap-2"
        >
          <Send className="h-4 w-4" />
          Send Invitations
        </Button>
        <Button 
          size="sm" 
          variant="ghost"
          onClick={onClearSelection}
          className="gap-2 hover:bg-primary-foreground/10"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
