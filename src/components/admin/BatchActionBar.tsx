import { Button } from "@/components/ui/button";
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
      <div 
        className="rounded-lg shadow-lg px-6 py-4 flex items-center gap-4"
        style={{ 
          background: 'rgba(255,255,255,0.9)', 
          color: 'rgba(24,24,27,0.9)',
          boxShadow: '0 0 30px -5px rgba(255,255,255,0.3)'
        }}
      >
        <span className="font-semibold">{selectedCount} user{selectedCount !== 1 ? 's' : ''} selected</span>
        <div className="h-6 w-px" style={{ background: 'rgba(24,24,27,0.2)' }} />
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
          className="gap-2"
        >
          <X className="h-4 w-4" />
          Clear
        </Button>
      </div>
    </div>
  );
}
