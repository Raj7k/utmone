import { Link, Type, Image, AlignCenter, MessageSquare, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { LinkPageBlockType } from "@/lib/linkPages";

interface QuickAddBarProps {
  onAddBlock: (type: LinkPageBlockType) => void;
  disabled?: boolean;
}

const BLOCK_TYPES: { type: LinkPageBlockType; icon: typeof Link; label: string }[] = [
  { type: "link", icon: Link, label: "Link" },
  { type: "header", icon: Type, label: "Header" },
  { type: "text", icon: MessageSquare, label: "Text" },
  { type: "social", icon: Share2, label: "Social" },
  { type: "divider", icon: AlignCenter, label: "Divider" },
  { type: "image", icon: Image, label: "Image" },
];

export function QuickAddBar({ onAddBlock, disabled }: QuickAddBarProps) {
  return (
    <div className="flex items-center justify-center gap-1 p-2 bg-muted/50 rounded-xl border border-border">
      <span className="text-xs text-muted-foreground mr-2 hidden sm:inline">Add:</span>
      {BLOCK_TYPES.map(({ type, icon: Icon, label }) => (
        <Tooltip key={type}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => onAddBlock(type)}
              disabled={disabled}
            >
              <Icon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}
