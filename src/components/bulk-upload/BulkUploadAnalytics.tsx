import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, TrendingUp, MousePointerClick, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";

interface BulkUploadAnalyticsProps {
  workspaceId: string;
}

export function BulkUploadAnalytics({ workspaceId }: BulkUploadAnalyticsProps) {
  const { data: bulkBatches, isLoading } = useQuery({
    queryKey: ["bulk-upload-analytics", workspaceId],
    queryFn: async () => {
      // Query links grouped by creation timestamp
      const { data: links, error } = await supabase
        .from("links")
        .select("id, title, short_url, created_at, status, total_clicks, unique_clicks, domain")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(200);

      if (error) throw error;

      // Group by creation timestamp (within 2 minute window = same batch)
      const batches = new Map<string, typeof links>();
      links?.forEach((link) => {
        const timestamp = new Date(link.created_at!);
        const batchKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}-${Math.floor(timestamp.getMinutes() / 2)}`;
        
        if (!batches.has(batchKey)) {
          batches.set(batchKey, []);
        }
        batches.get(batchKey)!.push(link);
      });

      // Convert to array and filter batches with 2+ links (bulk uploads)
      const batchAnalytics = Array.from(batches.entries())
        .map(([key, links]) => {
          const totalClicks = links.reduce((sum, l) => sum + (l.total_clicks || 0), 0);
          const uniqueClicks = links.reduce((sum, l) => sum + (l.unique_clicks || 0), 0);
          const activeLinks = links.filter(l => l.status === 'active').length;
          const topPerformer = [...links].sort((a, b) => (b.total_clicks || 0) - (a.total_clicks || 0))[0];
          const avgClicksPerLink = totalClicks / links.length;
          const ctr = uniqueClicks > 0 ? ((totalClicks / uniqueClicks) * 100).toFixed(1) : '0.0';

          return {
            timestamp: links[0].created_at,
            totalLinks: links.length,
            activeLinks,
            totalClicks,
            uniqueClicks,
            avgClicksPerLink: Math.round(avgClicksPerLink),
            ctr: parseFloat(ctr),
            topPerformer: {
              title: topPerformer.title,
              short_url: topPerformer.short_url,
              clicks: topPerformer.total_clicks || 0,
            },
            domain: links[0].domain,
            links: links.map(l => ({ id: l.id, title: l.title, short_url: l.short_url })),
          };
        })
        .filter(batch => batch.totalLinks >= 2)
        .slice(0, 10); // Show last 10 bulk uploads with analytics

      return batchAnalytics;
    },
  });

  const handleExportBatch = (batch: any) => {
    const csvContent = [
      'Short URL,Title,Total Clicks,Unique Clicks,Status',
      ...batch.links.map((l: any) => 
        `"${l.short_url}","${l.title}","${l.clicks || 0}","${l.unique_clicks || 0}","active"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bulk-upload-${format(new Date(batch.timestamp), 'yyyy-MM-dd-HHmm')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">bulk upload analytics</CardTitle>
          <CardDescription>loading performance data...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!bulkBatches || bulkBatches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">bulk upload analytics</CardTitle>
          <CardDescription>no bulk upload data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">analytics will appear after your first bulk upload</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-title-2">bulk upload analytics</CardTitle>
        <CardDescription>performance metrics for recent bulk uploads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {bulkBatches.map((batch, index) => (
            <div
              key={index}
              className="border rounded-lg p-4 space-y-4 hover:bg-muted/20 transition-colors"
            >
              {/* Batch Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4 text-white-80" />
                    <span className="font-medium">
                      {format(new Date(batch.timestamp), "PPP 'at' p")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {batch.totalLinks} links
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {batch.domain}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleExportBatch(batch)}
                >
                  <Download className="w-4 h-4 mr-1" />
                  export
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MousePointerClick className="w-3 h-3 text-white-80" />
                    <span className="text-xs text-muted-foreground">total clicks</span>
                  </div>
                  <p className="text-2xl font-bold">{batch.totalClicks.toLocaleString()}</p>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-white-80" />
                    <span className="text-xs text-muted-foreground">avg per link</span>
                  </div>
                  <p className="text-2xl font-bold">{batch.avgClicksPerLink}</p>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-3 h-3 text-white-80" />
                    <span className="text-xs text-muted-foreground">unique clicks</span>
                  </div>
                  <p className="text-2xl font-bold">{batch.uniqueClicks.toLocaleString()}</p>
                </div>

                <div className="p-3 bg-muted/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="w-3 h-3 text-white-80" />
                    <span className="text-xs text-muted-foreground">CTR</span>
                  </div>
                  <p className="text-2xl font-bold">{batch.ctr}%</p>
                </div>
              </div>

              {/* Top Performer */}
              <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-white-80" />
                  <span className="text-sm font-medium">top performer</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{batch.topPerformer.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {batch.topPerformer.short_url}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white-90">
                        {batch.topPerformer.clicks}
                      </p>
                      <p className="text-xs text-muted-foreground">clicks</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={batch.topPerformer.short_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
