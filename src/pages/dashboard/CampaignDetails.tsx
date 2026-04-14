import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, MoreVertical, Archive, Trash2 } from "lucide-react";
import { LazyPieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LazyChartContainer } from "@/components/charts/LazyCharts";

import { notify } from "@/lib/notify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useState } from "react";

const CHART_COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"];

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Fetch campaign details
  const { data: campaign, isLoading: campaignLoading } = useQuery({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('campaigns')
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch links in this campaign
  const { data: links, isLoading: linksLoading } = useQuery({
    queryKey: ["campaign-links", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("campaign_id", id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch click analytics for channel breakdown (optimized with campaign_id)
  const { data: channelData, isLoading: analyticsLoading } = useQuery({
    queryKey: ["campaign-analytics", id],
    queryFn: async () => {
      if (!links) return [];

      // Use denormalized campaign_id for faster queries
      const { data: clicks, error } = await supabaseFrom('link_clicks')
        .select("link_id, id")
        .eq("campaign_id", id);

      if (error) throw error;

      // Group clicks by link's utm_source
      const channelCounts: Record<string, number> = {};
      
      for (const click of clicks || []) {
        const link = links.find(l => l.id === click.link_id);
        if (link) {
          // Extract utm_source from destination_url
          try {
            const url = new URL(link.destination_url);
            const source = url.searchParams.get("utm_source") || "direct";
            channelCounts[source] = (channelCounts[source] || 0) + 1;
          } catch {
            channelCounts["direct"] = (channelCounts["direct"] || 0) + 1;
          }
        }
      }

      return Object.entries(channelCounts).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }));
    },
    enabled: !!links && links.length > 0,
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabaseFrom('campaigns')
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      notify.success("campaign deleted");
      navigate("/dashboard/campaigns");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const archiveCampaignMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabaseFrom('campaigns')
        .update({ status: "archived" })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["campaign", id] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      notify.success("campaign archived");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const exportToCSV = () => {
    if (!links || !channelData) return;

    const csvContent = [
      ["Channel", "Clicks"],
      ...channelData.map(item => [item.name, item.value.toString()]),
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${campaign?.name}-report.csv`;
    a.click();
  };

  // Show not found only after loading completes
  if (!campaignLoading && !campaign) {
    return <div className="p-6">Campaign not found</div>;
  }

  const totalClicks = channelData?.reduce((sum, item) => sum + item.value, 0) || 0;

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* Header - always render immediately */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/campaigns">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <div
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: campaign?.color || 'hsl(var(--muted))' }}
              />
              <h1 className="text-2xl font-display font-semibold text-label">
                {campaign?.name || "Loading..."}
              </h1>
            </div>
            <p className="text-sm text-secondary-label mt-1">
              {links?.length || 0} links • {totalClicks.toLocaleString()} total clicks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV} disabled={!campaign}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" disabled={!campaign}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => archiveCampaignMutation.mutate()}
                disabled={campaign?.status === "archived"}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive Campaign
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Channel Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic by Channel</CardTitle>
          <CardDescription>Distribution of clicks across different traffic sources</CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsLoading ? (
            <div className="h-64 flex items-center justify-center text-secondary-label">
              Loading analytics...
            </div>
          ) : channelData && channelData.length > 0 ? (
            <div className="h-64">
              <LazyChartContainer height={256}>
                <ResponsiveContainer width="100%" height="100%">
                  <LazyPieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {channelData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </LazyPieChart>
                </ResponsiveContainer>
              </LazyChartContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-secondary-label">
              No click data available yet
            </div>
          )}
        </CardContent>
      </Card>

      {/* Links Table */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Links</CardTitle>
          <CardDescription>All short links associated with this campaign</CardDescription>
        </CardHeader>
        <CardContent>
          {linksLoading ? (
            <div className="py-8 text-center text-secondary-label">Loading links...</div>
          ) : links && links.length > 0 ? (
            <div className="space-y-4">
              {links.map((link) => (
                <div key={link.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-label">{link.title}</h4>
                      <p className="text-sm text-secondary-label mt-1">
                        {link.domain}/{link.slug}
                      </p>
                      <p className="text-xs text-tertiary-label mt-1 truncate">
                        → {link.destination_url}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-label">{link.total_clicks || 0} clicks</p>
                      <p className="text-xs text-secondary-label">{link.unique_clicks || 0} unique</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-secondary-label">No links in this campaign yet</div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign and remove all associated links. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCampaignMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}