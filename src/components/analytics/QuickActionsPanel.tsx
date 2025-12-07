import { Button } from "@/components/ui/button";
import { 
  Download, 
  Share2, 
  Calendar, 
  FileText, 
  RefreshCw,
  Settings
} from "lucide-react";
import { toast } from "sonner";

interface QuickActionsPanelProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export const QuickActionsPanel = ({ onRefresh, isRefreshing }: QuickActionsPanelProps) => {
  const handleExport = () => {
    toast.success("Export started. You'll receive an email when ready.");
  };

  const handleShare = () => {
    toast.info("Share feature coming soon.");
  };

  const handleSchedule = () => {
    toast.info("Report scheduling coming soon.");
  };

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
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExport}
        className="gap-2"
      >
        <Download className="h-4 w-4" />
        Export
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleShare}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSchedule}
        className="gap-2"
      >
        <Calendar className="h-4 w-4" />
        Schedule
      </Button>
    </div>
  );
};
