import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { FeatureGuard } from "@/components/FeatureGuard";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";

export default function Campaigns() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentWorkspace } = useWorkspace();

  // Fetch campaigns
  const { data: campaigns, isLoading, isFetched } = useQuery({
    queryKey: ["campaigns", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];

      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace,
  });

  // Complete navigation when data loads
  useEffect(() => {
    if (isFetched) {
      completeNavigation();
    }
  }, [isFetched]);

  // Fetch links and clicks for each campaign
  const { data: campaignStats } = useQuery({
    queryKey: ["campaign-stats", currentWorkspace?.id, JSON.stringify(campaigns?.map(c => c.id) || [])],
    queryFn: async () => {
      if (!campaigns || campaigns.length === 0) return {};

      const stats: Record<string, { linkCount: number; totalClicks: number; recentClicks: number[] }> = {};

      for (const campaign of campaigns) {
        // Get links for this campaign
        const { data: links } = await supabase
          .from("links")
          .select("id, total_clicks")
          .eq("campaign_id", campaign.id);

        const linkCount = links?.length || 0;
        const totalClicks = links?.reduce((sum, link) => sum + (link.total_clicks || 0), 0) || 0;

        // Get recent clicks (last 7 days) for sparkline
        const { data: clicksData } = await supabase
          .from("link_clicks")
          .select("clicked_at")
          .in("link_id", links?.map(l => l.id) || [])
          .gte("clicked_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        // Group clicks by day
        const clicksByDay: Record<string, number> = {};
        for (const click of clicksData || []) {
          const day = new Date(click.clicked_at).toISOString().split("T")[0];
          clicksByDay[day] = (clicksByDay[day] || 0) + 1;
        }

        const recentClicks = Object.values(clicksByDay);

        stats[campaign.id] = { linkCount, totalClicks, recentClicks };
      }

      return stats;
    },
    enabled: !!campaigns && campaigns.length > 0,
  });

  return (
    <PageContentWrapper
      title="campaigns"
      description="organize links by campaign and track channel performance"
      breadcrumbs={[{ label: "campaigns" }]}
      action={
        <FeatureGuard feature="campaigns" showUpgradeModal>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            create campaign
          </Button>
        </FeatureGuard>
      }
    >
      {/* Campaigns Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">Loading campaigns...</div>
      ) : campaigns && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => {
            const stats = campaignStats?.[campaign.id] || { linkCount: 0, totalClicks: 0, recentClicks: [] };
            return (
              <CampaignCard
                key={campaign.id}
                id={campaign.id}
                name={campaign.name}
                status={campaign.status as "active" | "archived" | "draft"}
                color={campaign.color}
                linkCount={stats.linkCount}
                totalClicks={stats.totalClicks}
                recentClicks={stats.recentClicks}
              />
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full mb-4 bg-primary/10">
            <Megaphone className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create your first campaign to organize links and track performance
          </p>
          <FeatureGuard feature="campaigns" showUpgradeModal>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </FeatureGuard>
        </div>
      )}

      {/* Create Campaign Modal */}
      <CreateCampaignModal open={showCreateModal} onOpenChange={setShowCreateModal} />
    </PageContentWrapper>
  );
}
