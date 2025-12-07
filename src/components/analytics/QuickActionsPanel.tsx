import { Button } from "@/components/ui/button";
import { 
  Share2, 
  Calendar, 
  RefreshCw
} from "lucide-react";
import { ExportButton } from "./ExportButton";

interface QuickActionsPanelProps {
  workspaceId?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onShare?: () => void;
  onSchedule?: () => void;
}

export const QuickActionsPanel = ({ 
  workspaceId,
  onRefresh, 
  isRefreshing,
  onShare,
  onSchedule
}: QuickActionsPanelProps) => {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onRefresh}
        disabled={isRefreshing}
        className="gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
      
      {workspaceId && (
        <ExportButton workspaceId={workspaceId} />
      )}
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onShare}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onSchedule}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Schedule
      </Button>
    </div>
  );
};
