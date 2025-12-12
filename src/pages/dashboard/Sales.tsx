import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { SalesLinkTable } from "@/components/sales/SalesLinkTable";
import { SalesActivityFeed } from "@/components/sales/SalesActivityFeed";
import { SalesStatCard } from "@/components/sales/SalesStatCard";
import { CreateSalesLinkModal } from "@/components/sales/CreateSalesLinkModal";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Briefcase, Eye } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

// Stats skeleton for progressive loading
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
    {[1, 2, 3].map(i => (
      <Skeleton key={i} className="h-24 rounded-xl" />
    ))}
  </div>
);

// Content skeleton
const ContentSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <Skeleton className="h-96 rounded-xl" />
    </div>
    <div className="lg:col-span-1">
      <Skeleton className="h-96 rounded-xl" />
    </div>
  </div>
);

const Sales = () => {
  const { currentWorkspace, isLoading: isWorkspaceLoading, hasTimedOut, retry } = useWorkspace();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Use cached workspace ID for immediate query start
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || "";

  const { data: salesLinks = [], isLoading, refetch, isFetched } = useQuery({
    queryKey: ["sales-links", effectiveWorkspaceId],
    queryFn: async () => {
      if (!effectiveWorkspaceId) return [];

      const [userResult, linksResult] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("links")
          .select("*")
          .eq("workspace_id", effectiveWorkspaceId)
          .eq("link_type", "sales")
          .order("created_at", { ascending: false })
      ]);

      const user = userResult.data?.user;
      if (!user) return [];

      const data = linksResult.data?.filter(link => link.created_by === user.id) || [];
      if (linksResult.error) throw linksResult.error;
      
      return data;
    },
    enabled: !!effectiveWorkspaceId,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
  });

  // Complete navigation progress when data loads or times out
  useEffect(() => {
    if ((isFetched && !isWorkspaceLoading) || hasTimedOut) {
      completeNavigation();
    }
  }, [isFetched, isWorkspaceLoading, hasTimedOut]);

  // Calculate stats
  const hotLeads = salesLinks.filter(l => {
    const lastClick = l.last_clicked_at;
    if (!lastClick) return false;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(lastClick) > hourAgo;
  }).length;

  const totalViews = salesLinks.reduce((sum, l) => sum + (l.total_clicks || 0), 0);

  const dataLoading = isLoading;

  return (
    <PageContentWrapper
      title="sales companion"
      description="track prospect engagement and get instant alerts when they view your links"
      breadcrumbs={[{ label: "sales" }]}
      action={
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="gap-2 rounded-xl"
        >
          <Plus className="h-4 w-4" />
          new sales link
        </Button>
      }
    >
      {/* Stats Banner - skeleton if loading */}
      {dataLoading ? (
        <StatsSkeleton />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <SalesStatCard
            icon={Zap}
            label="hot leads (1h)"
            value={hotLeads}
            variant="hot"
            pulse={hotLeads > 0}
          />
          <SalesStatCard
            icon={Briefcase}
            label="active deals"
            value={salesLinks.length}
            variant="primary"
          />
          <SalesStatCard
            icon={Eye}
            label="total views"
            value={totalViews}
            variant="amber"
          />
        </motion.div>
      )}

      {/* Main Content - skeleton if loading */}
      {dataLoading ? (
        <ContentSkeleton />
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Sales Links Table */}
          <div className="lg:col-span-2">
            <SalesLinkTable 
              links={salesLinks} 
              isLoading={isLoading} 
              onRefresh={refetch}
              onCreateLink={() => setIsCreateModalOpen(true)}
            />
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-1">
            <SalesActivityFeed />
          </div>
        </motion.div>
      )}

      {/* Error state with retry */}
      {hasTimedOut && !currentWorkspace && (
        <div className="flex flex-col items-center gap-4 py-12">
          <p className="text-sm text-muted-foreground">couldn't load workspace data</p>
          <button 
            onClick={() => retry?.()}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            try again
          </button>
        </div>
      )}

      {/* Create Sales Link Modal */}
      <CreateSalesLinkModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </PageContentWrapper>
  );
};

export default Sales;
