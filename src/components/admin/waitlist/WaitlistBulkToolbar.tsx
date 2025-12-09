import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, X, CheckCircle } from "lucide-react";

type Props = {
  selectedCount: number;
  onClearSelection: () => void;
  onSendInvites: () => void;
  onSelectTop: (count: number) => void;
  onSelectAll: () => void;
};

export function WaitlistBulkToolbar({
  selectedCount,
  onClearSelection,
  onSendInvites,
  onSelectTop,
  onSelectAll,
}: Props) {
  return (
    <div className="flex items-center justify-between gap-4 p-3 bg-muted/50 rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        <Select
          onValueChange={(value) => {
            if (value === "all") onSelectAll();
            else onSelectTop(parseInt(value));
          }}
        >
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="quick select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">top 10</SelectItem>
            <SelectItem value="25">top 25</SelectItem>
            <SelectItem value="50">top 50</SelectItem>
            <SelectItem value="100">top 100</SelectItem>
            <SelectItem value="all">all pending</SelectItem>
          </SelectContent>
        </Select>

        {selectedCount > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-primary" />
            <span className="font-medium">{selectedCount} selected</span>
          </div>
        )}
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-2">
          <Button size="sm" variant="default" onClick={onSendInvites} className="gap-2">
            <Send className="h-4 w-4" />
            send invites
          </Button>
          <Button size="sm" variant="ghost" onClick={onClearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
