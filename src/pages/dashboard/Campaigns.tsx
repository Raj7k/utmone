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
import { Skeleton } from "@/components/ui/skeleton";

interface CampaignStats {
  linkCount: number;
  totalClicks: number;
  recentClicks: number[];
}

// Skeleton for progressive loading
const CampaignGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Skeleton key={i} className="h-48 rounded-xl" />
    ))}
  </div>
);

export default function Campaigns() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentWorkspace } = useWorkspace();

  // Fetch campaigns with stats in a single optimized query
  const { data: campaignsWithStats, isLoading, isFetched } = useQuery({
    queryKey: ["campaigns-with-stats", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];

      const { data: campaigns, error: campaignsError } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          status,
          color,
          created_at,
          links!links_campaign_id_fkey (
            id,
            total_clicks
          )
        `)
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false });

      if (campaignsError) throw campaignsError;
      if (!campaigns || campaigns.length === 0) return [];

      const allLinkIds = campaigns.flatMap((c: any) => 
        (c.links || []).map((l: any) => l.id)
      );

      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data: recentClicksData } = allLinkIds.length > 0
        ? await supabase
            .from("link_clicks")
            .select("link_id, clicked_at")
            .in("link_id", allLinkIds)
            .gte("clicked_at", sevenDaysAgo)
        : { data: [] };

      const linkToCampaign = new Map<string, string>();
      campaigns.forEach((c: any) => {
        (c.links || []).forEach((l: any) => {
          linkToCampaign.set(l.id, c.id);
        });
      });

      const campaignClicksByDay = new Map<string, Record<string, number>>();
      (recentClicksData || []).forEach((click: any) => {
        const campaignId = linkToCampaign.get(click.link_id);
        if (!campaignId) return;
        
        if (!campaignClicksByDay.has(campaignId)) {
          campaignClicksByDay.set(campaignId, {});
        }
        const day = new Date(click.clicked_at).toISOString().split("T")[0];
        const dayMap = campaignClicksByDay.get(campaignId)!;
        dayMap[day] = (dayMap[day] || 0) + 1;
      });

      return campaigns.map((campaign: any) => {
        const links = campaign.links || [];
        const linkCount = links.length;
        const totalClicks = links.reduce((sum: number, link: any) => sum + (link.total_clicks || 0), 0);
        const clicksByDay = campaignClicksByDay.get(campaign.id) || {};
        const recentClicks = Object.values(clicksByDay) as number[];

        return {
          id: campaign.id,
          name: campaign.name,
          status: campaign.status as "active" | "archived" | "draft",
          color: campaign.color,
          stats: { linkCount, totalClicks, recentClicks } as CampaignStats,
        };
      });
    },
    enabled: !!currentWorkspace,
  });

  // Complete navigation when data loads
  useEffect(() => {
    if (isFetched) {
      completeNavigation();
    }
  }, [isFetched]);

  const dataLoading = isLoading || !currentWorkspace;

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
      {/* Progressive loading - skeleton or content */}
      {dataLoading ? (
        <CampaignGridSkeleton />
      ) : campaignsWithStats && campaignsWithStats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaignsWithStats.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              name={campaign.name}
              status={campaign.status}
              color={campaign.color}
              linkCount={campaign.stats.linkCount}
              totalClicks={campaign.stats.totalClicks}
              recentClicks={campaign.stats.recentClicks}
            />
          ))}
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
