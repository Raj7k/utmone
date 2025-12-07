import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { SalesLinkTable } from "@/components/sales/SalesLinkTable";
import { SalesActivityFeed } from "@/components/sales/SalesActivityFeed";
import { Button } from "@/components/ui/button";
import { Plus, Briefcase, Zap } from "lucide-react";
import { useModal } from "@/contexts/ModalContext";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";

const Sales = () => {
  const { currentWorkspace } = useWorkspace();
  const { setCreateModalOpen } = useModal();

  const { data: salesLinks = [], isLoading, refetch } = useQuery({
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

  return (
    <PageContentWrapper
      title="sales companion"
      description="track prospect engagement and get instant alerts when they view your links"
      breadcrumbs={[{ label: "sales" }]}
      action={
        <Button onClick={() => setCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          new sales link
        </Button>
      }
    >
      {/* Stats Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/10">
              <Zap className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {salesLinks.filter(l => {
                  const lastClick = l.last_clicked_at;
                  if (!lastClick) return false;
                  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
                  return new Date(lastClick) > hourAgo;
                }).length}
              </p>
              <p className="text-sm text-muted-foreground">hot leads (1h)</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{salesLinks.length}</p>
              <p className="text-sm text-muted-foreground">active deals</p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10">
              <span className="text-amber-500 text-lg">👁</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {salesLinks.reduce((sum, l) => sum + (l.total_clicks || 0), 0)}
              </p>
              <p className="text-sm text-muted-foreground">total views</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Links Table */}
        <div className="lg:col-span-2">
          <SalesLinkTable 
            links={salesLinks} 
            isLoading={isLoading} 
            onRefresh={refetch}
          />
        </div>

        {/* Activity Feed */}
        <div className="lg:col-span-1">
          <SalesActivityFeed />
        </div>
      </div>
    </PageContentWrapper>
  );
};

export default Sales;
