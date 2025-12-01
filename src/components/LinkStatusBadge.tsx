import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Clock, CheckCircle, XCircle, Pause, Archive } from "lucide-react";

interface LinkStatusBadgeProps {
  status: string;
  rejectionReason?: string | null;
}

export const LinkStatusBadge = ({ status, rejectionReason }: LinkStatusBadgeProps) => {
  if (status === "pending") {
    return (
      <Badge variant="secondary" className="gap-1.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20">
        <Clock className="h-3 w-3" />
        waiting for approval
      </Badge>
    );
  }

  if (status === "rejected" && rejectionReason) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="destructive" className="gap-1.5">
              <XCircle className="h-3 w-3" />
              rejected
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm font-medium mb-1">Rejection reason:</p>
            <p className="text-sm text-muted-foreground">{rejectionReason}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (status === "active") {
    return (
      <Badge className="gap-1.5 bg-system-green/10 text-system-green border-system-green/20">
        <CheckCircle className="h-3 w-3" />
        active
      </Badge>
    );
  }

  if (status === "paused") {
    return (
      <Badge className="gap-1.5 bg-system-orange/10 text-system-orange border-system-orange/20">
        <Pause className="h-3 w-3" />
        paused
      </Badge>
    );
  }

  if (status === "archived") {
    return (
      <Badge className="gap-1.5 bg-system-gray/10 text-system-gray border-system-gray/20">
        <Archive className="h-3 w-3" />
        archived
      </Badge>
    );
  }

  return <Badge>{status}</Badge>;
};
