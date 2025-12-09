import { motion, AnimatePresence } from "framer-motion";
import { Cloud, Check, WifiOff, RefreshCw, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface SyncStatusBarProps {
  isOnline: boolean;
  pendingCount: number;
  syncedCount: number;
  isSyncing: boolean;
  reviewCount: number;
  onSync: () => void;
}

export const SyncStatusBar = ({
  isOnline,
  pendingCount,
  syncedCount,
  isSyncing,
  reviewCount,
  onSync
}: SyncStatusBarProps) => {
  const totalScans = pendingCount + syncedCount;
  const syncProgress = totalScans > 0 ? (syncedCount / totalScans) * 100 : 100;

  return (
    <div className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted/50 border border-border">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <AnimatePresence mode="wait">
          {isOnline ? (
            <motion.div
              key="online"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              <div className="relative">
                <Cloud className="h-4 w-4 text-green-500" />
                <motion.div
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                />
              </div>
              <span className="text-xs text-green-600 font-medium">online</span>
            </motion.div>
          ) : (
            <motion.div
              key="offline"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1"
            >
              <WifiOff className="h-4 w-4 text-orange-500" />
              <span className="text-xs text-orange-600 font-medium">offline</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sync Progress */}
      <div className="flex-1 flex items-center gap-2">
        {totalScans > 0 && (
          <>
            <Progress value={syncProgress} className="h-1.5 flex-1" />
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {syncedCount}/{totalScans}
            </span>
          </>
        )}
      </div>

      {/* Status Badges */}
      <div className="flex items-center gap-1.5">
        {/* Synced indicator */}
        {syncedCount > 0 && (
          <Badge 
            variant="outline" 
            className={cn(
              "gap-1 text-xs",
              "text-green-600 border-green-600/50 bg-green-500/10"
            )}
          >
            <Check className="h-3 w-3" />
            {syncedCount}
          </Badge>
        )}

        {/* Pending indicator */}
        {pendingCount > 0 && (
          <Badge 
            variant="outline" 
            className="gap-1 text-xs text-yellow-600 border-yellow-600/50 bg-yellow-500/10"
          >
            <WifiOff className="h-3 w-3" />
            {pendingCount}
          </Badge>
        )}

        {/* Review needed indicator */}
        {reviewCount > 0 && (
          <Badge 
            variant="outline" 
            className="gap-1 text-xs text-orange-600 border-orange-600/50 bg-orange-500/10"
          >
            <AlertTriangle className="h-3 w-3" />
            {reviewCount}
          </Badge>
        )}

        {/* Sync button */}
        {pendingCount > 0 && isOnline && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onSync}
            disabled={isSyncing}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isSyncing && "animate-spin")} />
          </Button>
        )}
      </div>
    </div>
  );
};
