import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Brain, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ContextualRoutingToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  destinationCount: number;
  disabled?: boolean;
}

export function ContextualRoutingToggle({
  enabled,
  onToggle,
  destinationCount,
  disabled = false,
}: ContextualRoutingToggleProps) {
  const canEnable = destinationCount >= 2;
  const isDisabled = disabled || !canEnable;

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 rounded-lg bg-primary/10">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <Label 
              htmlFor="contextual-routing" 
              className="text-sm font-medium cursor-pointer"
            >
              context-aware routing
            </Label>
            {enabled && (
              <Badge variant="default" className="text-xs">
                active
              </Badge>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">
                  Uses LinUCB algorithm to automatically route users to the best destination based on their device, OS, and location. Learns over time which URLs perform best for different user segments.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
          <p className="text-xs text-muted-foreground">
            {canEnable
              ? "automatically optimizes traffic based on device, os, and location"
              : "requires at least 2 destinations to enable"}
          </p>
          {enabled && (
            <div className="mt-2 p-2 bg-muted/30 rounded text-xs text-muted-foreground">
              <strong>Active contexts:</strong> mobile/desktop × ios/other × us/other (8 segments)
            </div>
          )}
        </div>
      </div>
      <Switch
        id="contextual-routing"
        checked={enabled}
        onCheckedChange={onToggle}
        disabled={isDisabled}
        className="ml-4"
      />
    </div>
    </TooltipProvider>
  );
}
