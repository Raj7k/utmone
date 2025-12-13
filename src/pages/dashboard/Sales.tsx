import { useEffect, useState } from "react";
import { useDashboardUnified } from "@/hooks/useDashboardUnified";
import { useWorkspace } from "@/hooks/useWorkspace";
import { SalesLinkTable } from "@/components/sales/SalesLinkTable";
import { SalesActivityFeed } from "@/components/sales/SalesActivityFeed";
import { SalesStatCard } from "@/components/sales/SalesStatCard";
import { CreateSalesLinkModal } from "@/components/sales/CreateSalesLinkModal";
import { Button } from "@/components/ui/button";
import { Plus, Zap, Briefcase, Eye } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { DashboardContentLoader } from "@/components/loading/DashboardContentLoader";
import { motion } from "framer-motion";

const Sales = () => {
  const { hasTimedOut, retry, currentWorkspace } = useWorkspace();
  const { salesLinks, isFetching, isFetched, isLoading, refetch } = useDashboardUnified();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Complete navigation progress when data loads or times out
  useEffect(() => {
    if (isFetched || hasTimedOut) {
      completeNavigation();
    }
  }, [isFetched, hasTimedOut]);

  // Calculate stats
  const hotLeads = salesLinks.filter(l => {
    const lastClick = l.last_clicked_at;
    if (!lastClick) return false;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return new Date(lastClick) > hourAgo;
  }).length;

  const totalViews = salesLinks.reduce((sum, l) => sum + (l.total_clicks || 0), 0);

  // Show loading state when data is loading
  if (isLoading && !isFetched) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <DashboardContentLoader context="sales" minHeight="60vh" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
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
      {/* Subtle loading indicator */}
      {isFetching && (
        <div className="absolute top-4 right-4">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        </div>
      )}

      {/* Stats Banner - always render with data */}
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

      {/* Main Content - always render */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
      {/* Sales Links Table */}
      <div className="lg:col-span-2">
        <SalesLinkTable 
          links={salesLinks as any} 
          isLoading={false} 
          onRefresh={refetch}
          onCreateLink={() => setIsCreateModalOpen(true)}
        />
      </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <SalesActivityFeed />
        </div>
      </motion.div>

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
    </div>
  );
};

export default Sales;
