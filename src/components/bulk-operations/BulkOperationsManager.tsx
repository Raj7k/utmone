import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useBulkOperations } from "@/hooks/useBulkOperations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, CheckCircle2, XCircle, Clock, Layers } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function BulkOperationsManager() {
  const { currentWorkspace } = useWorkspace();
  const { operations, isLoading } = useBulkOperations(currentWorkspace?.id || "");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getOperationLabel = (type: string) => {
    const labels: Record<string, string> = {
      edit_utms: "Edit UTMs",
      archive: "Archive Links",
      delete: "Delete Links",
      add_tags: "Add Tags",
      migrate_domain: "Migrate Domain",
    };
    return labels[type] || type;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5" />
              Bulk Operations History
            </CardTitle>
            <CardDescription>
              Track all bulk operations performed on your links
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : operations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bulk operations yet
            </div>
          ) : (
            <div className="space-y-3">
              {operations.map((operation) => (
                <div
                  key={operation.id}
                  className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(operation.status)}
                      <div>
                        <div className="font-medium">
                          {getOperationLabel(operation.operation_type)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(operation.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant={
                        operation.status === "completed"
                          ? "default"
                          : operation.status === "failed"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {operation.status}
                    </Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Links affected:</span>
                      <span className="font-medium">
                        {operation.affected_count} / {operation.link_ids.length}
                      </span>
                    </div>

                    {operation.error_message && (
                      <div className="text-red-500 text-xs mt-2 p-2 bg-red-50 rounded border border-red-200">
                        {operation.error_message}
                      </div>
                    )}

                    {operation.completed_at && (
                      <div className="text-xs text-muted-foreground">
                        Completed {formatDistanceToNow(new Date(operation.completed_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
