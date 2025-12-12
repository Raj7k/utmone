import { useState } from "react";
import { Shield, ShieldCheck, ShieldOff, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useBulkSentinelStats, useBulkSentinelToggle } from "@/hooks/useBulkSentinelToggle";
import type { SentinelConfig } from "@/hooks/useSentinelConfig";

interface BulkSentinelPanelProps {
  workspaceId: string;
}

export function BulkSentinelPanel({ workspaceId }: BulkSentinelPanelProps) {
  const { data: stats, isLoading } = useBulkSentinelStats(workspaceId);
  const { mutate: toggleSentinel, isPending } = useBulkSentinelToggle(workspaceId);
  
  const [confirmDialog, setConfirmDialog] = useState<"enable" | "disable" | null>(null);
  const [configOpen, setConfigOpen] = useState(false);
  const [defaultConfig, setDefaultConfig] = useState<SentinelConfig>({
    health_preflight: { enabled: true, timeout_ms: 3000 },
    ai_bot_mode: { enabled: true },
  });

  if (isLoading || !stats) {
    return (
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleConfirm = () => {
    if (!confirmDialog) return;
    
    toggleSentinel({
      enabled: confirmDialog === "enable",
      defaultConfig: confirmDialog === "enable" ? defaultConfig : undefined,
    });
    setConfirmDialog(null);
  };

  const allEnabled = stats.sentinel_disabled === 0 && stats.total_links > 0;
  const allDisabled = stats.sentinel_enabled === 0;

  return (
    <>
      <Card className="border-border bg-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Icon and Stats */}
            <div className="relative">
              <div className={`
                h-12 w-12 rounded-full flex items-center justify-center
                ${stats.coverage_percent === 100 
                  ? "bg-system-green/10 text-system-green" 
                  : stats.coverage_percent > 0 
                    ? "bg-system-orange/10 text-system-orange"
                    : "bg-muted text-muted-foreground"
                }
              `}>
                <Shield className="h-6 w-6" />
              </div>
              {/* Coverage ring */}
              <svg 
                className="absolute inset-0 -rotate-90"
                viewBox="0 0 48 48"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-border"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${stats.coverage_percent * 1.38} 138`}
                  className={stats.coverage_percent === 100 ? "text-system-green" : "text-system-orange"}
                />
              </svg>
            </div>

            {/* Stats Text */}
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">
                {stats.sentinel_enabled} of {stats.total_links} links protected
              </p>
              <p className="text-xs text-muted-foreground">
                {stats.coverage_percent}% sentinel coverage
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDialog("disable")}
                disabled={isPending || allDisabled}
                className="gap-1.5"
              >
                <ShieldOff className="h-3.5 w-3.5" />
                disable all
              </Button>
              <Button
                size="sm"
                onClick={() => setConfirmDialog("enable")}
                disabled={isPending || allEnabled}
                className="gap-1.5"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                enable all
              </Button>
            </div>
          </div>

          {/* Default Config Section */}
          <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground hover:text-foreground transition-colors">
                <Settings2 className="h-3 w-3" />
                {configOpen ? "hide" : "show"} default settings
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pt-3 border-t border-border">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="health-check" className="text-xs">
                    health preflight check
                  </Label>
                  <Switch
                    id="health-check"
                    checked={defaultConfig.health_preflight?.enabled ?? true}
                    onCheckedChange={(checked) =>
                      setDefaultConfig(prev => ({
                        ...prev,
                        health_preflight: { ...prev.health_preflight, enabled: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="ai-bot" className="text-xs">
                    AI bot detection
                  </Label>
                  <Switch
                    id="ai-bot"
                    checked={defaultConfig.ai_bot_mode?.enabled ?? true}
                    onCheckedChange={(checked) =>
                      setDefaultConfig(prev => ({
                        ...prev,
                        ai_bot_mode: { ...prev.ai_bot_mode, enabled: checked },
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-heal" className="text-xs">
                    auto-heal broken links
                  </Label>
                  <Switch
                    id="auto-heal"
                    checked={defaultConfig.auto_heal?.enabled ?? false}
                    onCheckedChange={(checked) =>
                      setDefaultConfig(prev => ({
                        ...prev,
                        auto_heal: { ...prev.auto_heal, enabled: checked },
                      }))
                    }
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!confirmDialog} onOpenChange={() => setConfirmDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmDialog === "enable" 
                ? `enable sentinel on ${stats.sentinel_disabled} links?`
                : `disable sentinel on ${stats.sentinel_enabled} links?`
              }
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDialog === "enable" 
                ? "this will activate intelligent preflight checks on all unprotected links in this workspace. links will use the default sentinel settings."
                : "this will deactivate sentinel mode on all protected links. links will redirect without preflight checks."
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isPending}>
              {isPending ? "processing..." : confirmDialog === "enable" ? "enable all" : "disable all"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
