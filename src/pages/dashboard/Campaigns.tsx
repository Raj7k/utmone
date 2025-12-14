import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Megaphone } from "lucide-react";
import { useDashboardUnified } from "@/hooks/dashboard";
import { CreateCampaignModal } from "@/components/campaigns/CreateCampaignModal";
import { CampaignCard } from "@/components/campaigns/CampaignCard";
import { FeatureGuard } from "@/components/FeatureGuard";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function Campaigns() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Use unified dashboard data for campaigns
  const { campaigns, isFetching, isFetched } = useDashboardUnified();

  // Complete navigation when data loads
  useEffect(() => {
    if (isFetched) {
      completeNavigation();
    }
  }, [isFetched]);

  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-muted-foreground">Something went wrong loading campaigns. Please refresh the page.</div>}>
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
        <div className="relative">
          {/* Subtle loading indicator for background refresh */}
          {isFetching && (
            <div className="absolute top-2 right-2 z-10">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
            </div>
          )}

          {/* Render content immediately - no blocking skeleton */}
          {campaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  id={campaign.id}
                  name={campaign.name}
                  status={campaign.status}
                  color={campaign.color}
                  linkCount={campaign.stats.linkCount}
                  totalClicks={campaign.stats.totalClicks}
                  recentClicks={[]} // Simplified - no sparkline data in unified query
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
        </div>

        {/* Create Campaign Modal */}
        <CreateCampaignModal open={showCreateModal} onOpenChange={setShowCreateModal} />
      </PageContentWrapper>
    </ErrorBoundary>
  );
}
