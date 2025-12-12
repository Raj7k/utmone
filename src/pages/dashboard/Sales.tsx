import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { SalesLinkTable } from "@/components/sales/SalesLinkTable";
import { SalesActivityFeed } from "@/components/sales/SalesActivityFeed";
import { SalesPageSkeleton } from "@/components/sales/SalesPageSkeleton";
import { SalesStatCard } from "@/components/sales/SalesStatCard";
import { CreateSalesLinkModal } from "@/components/sales/CreateSalesLinkModal";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Briefcase, Eye } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { motion } from "framer-motion";

const Sales = () => {
  const { currentWorkspace, isLoading: isWorkspaceLoading } = useWorkspace();
  const [loadingTooLong, setLoadingTooLong] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: salesLinks = [], isLoading, refetch, isFetched } = useQuery({
    queryKey: ["sales-links", currentWorkspace?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", currentWorkspace.id)
        .eq("created_by", user.id)
        .eq("link_type", "sales")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  // Timeout fallback for stuck loading
  useEffect(() => {
    if (isWorkspaceLoading || isLoading) {
      setLoadingTooLong(false);
      const timer = setTimeout(() => setLoadingTooLong(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isWorkspaceLoading, isLoading]);

  // Complete navigation progress when data loads
  useEffect(() => {
    if (isFetched && !isWorkspaceLoading) {
      completeNavigation();
    }
  }, [isFetched, isWorkspaceLoading]);

  // Calculate stats
  const hotLeads = salesLinks.filter(l => {
    const lastClick = l.last_clicked_at;
    if (!lastClick) return false;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(lastClick) > hourAgo;
  }).length;

  const totalViews = salesLinks.reduce((sum, l) => sum + (l.total_clicks || 0), 0);

  // Show skeleton while workspace or data is loading
  if (isWorkspaceLoading || isLoading) {
    return <SalesPageSkeleton showSlowMessage={loadingTooLong} />;
  }

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
      {/* Stats Banner */}
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

      {/* Main Content */}
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

      {/* Create Sales Link Modal */}
      <CreateSalesLinkModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </PageContentWrapper>
  );
};

export default Sales;
