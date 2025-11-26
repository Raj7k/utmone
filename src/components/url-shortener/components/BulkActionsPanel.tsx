import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Trash2, Edit3, Download } from 'lucide-react';
import { useState } from 'react';
import { useVersionManagement } from '../hooks/useVersionManagement';
import { toast } from '@/hooks/use-toast';

interface BulkActionsPanelProps {
  selectedVersions: string[];
  onClearSelection: () => void;
  workspaceId: string;
}

export const BulkActionsPanel = ({ selectedVersions, onClearSelection, workspaceId }: BulkActionsPanelProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const versionManagement = useVersionManagement(workspaceId);

  const handleBulkArchive = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedVersions.map(id => versionManagement.archiveVersion.mutateAsync(id))
      );
      toast({
        title: 'Versions archived',
        description: `${selectedVersions.length} versions archived successfully.`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to archive some versions.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedVersions.length} versions? This cannot be undone.`)) {
      return;
    }
    
    setIsProcessing(true);
    try {
      await Promise.all(
        selectedVersions.map(id => versionManagement.deleteVersion.mutateAsync(id))
      );
      toast({
        title: 'Versions deleted',
        description: `${selectedVersions.length} versions deleted successfully.`,
      });
      onClearSelection();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete some versions.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (selectedVersions.length === 0) return null;

  return (
    <Card className="p-4 bg-gray-900/50 backdrop-blur border-gray-800 sticky top-4 z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {selectedVersions.length} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            clear selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkArchive}
            disabled={isProcessing}
            className="border-gray-700 hover:bg-gray-800"
          >
            <Archive className="h-4 w-4 mr-2" />
            archive
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleBulkDelete}
            disabled={isProcessing}
            className="border-gray-700 hover:bg-gray-800 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            delete
          </Button>
        </div>
      </div>
    </Card>
  );
};
