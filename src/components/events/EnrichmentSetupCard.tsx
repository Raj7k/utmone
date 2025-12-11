import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap } from "lucide-react";
import { useEnrichmentSettings } from "@/hooks/useEnrichmentSettings";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { EnrichmentSetupDialog } from "./EnrichmentSetupDialog";

interface EnrichmentSetupCardProps {
  onSetupComplete?: () => void;
}

export const EnrichmentSetupCard = ({ onSetupComplete }: EnrichmentSetupCardProps) => {
  const { currentWorkspace } = useWorkspaceContext();
  const { isConfigured, isLoading } = useEnrichmentSettings(currentWorkspace?.id);
  const [showDialog, setShowDialog] = useState(false);

  // Don't show if already configured or loading
  if (isLoading || isConfigured || !currentWorkspace?.id) return null;

  return (
    <>
      <Card className="p-4 border-dashed border-primary/30 bg-primary/5">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-foreground text-sm">set up lead enrichment</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              auto-find missing emails, phones & linkedin from badge scans
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <Zap className="h-3 w-3" />
                save $3k+ per event
              </div>
            </div>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowDialog(true)}
            className="gap-1.5 shrink-0"
          >
            set up
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </Card>

      <EnrichmentSetupDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        workspaceId={currentWorkspace.id}
        onComplete={() => {
          setShowDialog(false);
          onSetupComplete?.();
        }}
      />
    </>
  );
};
