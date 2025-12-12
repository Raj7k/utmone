import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface SentinelBadgeProps {
  enabled: boolean;
  onClick?: () => void;
}

export function SentinelBadge({ enabled, onClick }: SentinelBadgeProps) {
  if (!enabled) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="gap-1 cursor-pointer hover:bg-primary/10 transition-colors border-primary/30 text-primary"
          onClick={onClick}
        >
          <Shield className="h-3 w-3" />
          sentinel
        </Badge>
      </TooltipTrigger>
      <TooltipContent>
        <p>sentinel mode active — click to configure</p>
      </TooltipContent>
    </Tooltip>
  );
}
