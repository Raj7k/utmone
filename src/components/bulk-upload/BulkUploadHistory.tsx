import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { History, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface BulkUploadHistoryProps {
  workspaceId: string;
}

export function BulkUploadHistory({ workspaceId }: BulkUploadHistoryProps) {
  const { data: uploadHistory, isLoading } = useQuery({
    queryKey: ["bulk-upload-history", workspaceId],
    queryFn: async () => {
      // Query links grouped by creation time (batch uploads)
      const { data, error } = await supabase
        .from("links")
        .select("id, title, created_at, status, created_by")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;

      // Group by creation timestamp (within 1 minute window = same batch)
      const batches = new Map<string, typeof data>();
      data?.forEach((link) => {
        const timestamp = new Date(link.created_at!);
        const batchKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}-${timestamp.getMinutes()}`;
        
        if (!batches.has(batchKey)) {
          batches.set(batchKey, []);
        }
        batches.get(batchKey)!.push(link);
      });

      // Convert to array and filter batches with 2+ links (bulk uploads)
      return Array.from(batches.entries())
        .map(([key, links]) => ({
          timestamp: links[0].created_at,
          links,
          totalLinks: links.length,
          activeLinks: links.filter(l => l.status === 'active').length,
          scheduledLinks: links.filter(l => l.status === 'scheduled').length,
        }))
        .filter(batch => batch.totalLinks >= 2)
        .slice(0, 10); // Show last 10 bulk uploads
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">bulk upload history</CardTitle>
          <CardDescription>loading recent bulk uploads...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!uploadHistory || uploadHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">bulk upload history</CardTitle>
          <CardDescription>no bulk uploads found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">bulk upload history will appear here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-title-2">bulk upload history</CardTitle>
        <CardDescription>last 10 bulk upload operations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {uploadHistory.map((batch, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg bg-muted/20"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <History className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                  <span className="font-medium">
                    {format(new Date(batch.timestamp!), "PPP 'at' p")}
                  </span>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {batch.totalLinks} links
                  </Badge>
                  {batch.activeLinks > 0 && (
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <CheckCircle2 className="w-3 h-3" />
                      {batch.activeLinks} active
                    </div>
                  )}
                  {batch.scheduledLinks > 0 && (
                    <div className="flex items-center gap-1 text-xs text-orange-600">
                      <Clock className="w-3 h-3" />
                      {batch.scheduledLinks} scheduled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
