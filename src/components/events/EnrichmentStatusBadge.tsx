import { Sparkles, AlertCircle, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEnrichmentSettings } from "@/hooks/useEnrichmentSettings";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface EnrichmentStatusBadgeProps {
  showSetupLink?: boolean;
  className?: string;
}

export const EnrichmentStatusBadge = ({ 
  showSetupLink = true,
  className 
}: EnrichmentStatusBadgeProps) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { isConfigured, provider, autoEnrichEnabled, isLoading } = useEnrichmentSettings(currentWorkspace?.id);
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Badge variant="outline" className={cn("gap-1.5 text-muted-foreground", className)}>
        <Sparkles className="h-3 w-3 animate-pulse" />
        checking...
      </Badge>
    );
  }

  if (isConfigured) {
    return (
      <Badge 
        variant="outline" 
        className={cn(
          "gap-1.5",
          autoEnrichEnabled 
            ? "border-green-500/30 text-green-600 bg-green-500/5" 
            : "border-primary/30 text-primary bg-primary/5",
          className
        )}
      >
        <Sparkles className="h-3 w-3" />
        {autoEnrichEnabled ? "auto-enrich on" : `${provider} connected`}
      </Badge>
    );
  }

  if (!showSetupLink) {
    return (
      <Badge variant="outline" className={cn("gap-1.5 text-muted-foreground", className)}>
        <AlertCircle className="h-3 w-3" />
        enrichment not set up
      </Badge>
    );
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1.5 h-7 text-xs", className)}
      onClick={() => navigate('/settings/integrations')}
    >
      <Settings className="h-3 w-3" />
      set up enrichment
    </Button>
  );
};
