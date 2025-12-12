import { useState } from "react";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SalesAlertToggleProps {
  linkId: string;
  enabled: boolean;
  onToggle: () => void;
}

export const SalesAlertToggle = ({ linkId, enabled, onToggle }: SalesAlertToggleProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleAlert = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("links")
        .update({ alert_on_click: !enabled })
        .eq("id", linkId);

      if (error) throw error;

      notify.success(enabled ? "alerts disabled" : "alerts enabled");
      onToggle();
    } catch (error) {
      console.error("Failed to toggle alert:", error);
      notify.error("failed to update alert settings");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-8 w-8 transition-colors",
              enabled 
                ? "text-primary hover:text-primary/80" 
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={toggleAlert}
            disabled={isUpdating}
          >
            {enabled ? (
              <Bell className="h-4 w-4 fill-current" />
            ) : (
              <BellOff className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{enabled ? "click to disable alerts" : "click to enable instant alerts"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
