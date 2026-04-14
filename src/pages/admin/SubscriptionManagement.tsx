import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SubscriptionStats } from "@/components/admin/subscriptions/SubscriptionStats";
import { SubscriberTable } from "@/components/admin/subscriptions/SubscriberTable";
import { ManualTierAdjust } from "@/components/admin/subscriptions/ManualTierAdjust";
import { GracePeriodSection } from "@/components/admin/subscriptions/GracePeriodSection";
import { PlanTier } from "@/lib/planConfig";
import { notify } from "@/lib/notify";

interface Workspace {
  id: string;
  name: string;
  plan_tier: PlanTier;
  subscription_status: string;
  created_at: string;
  plan_expires_at: string | null;
  previous_plan_tier: string | null;
  downgraded_at: string | null;
  data_deletion_scheduled_at: string | null;
  owner_id: string;
  owner_email?: string;
  owner_name?: string;
  link_count?: number;
}

export default function SubscriptionManagement() {
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [isAdjustDialogOpen, setIsAdjustDialogOpen] = useState(false);

  // Fetch all workspaces with owner info and link count
  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["all-workspaces-subscriptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select(`
          id,
          name,
          plan_tier,
          created_at,
          owner_id
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rawData = data as any[];

      // Fetch owner profiles
      const ownerIds = [...new Set(rawData?.map(w => w.owner_id) || [])];
      const { data: profiles } = await supabaseFrom('profiles')
        .select("id, email, full_name")
        .in("id", ownerIds);

      const profileMap = new Map((profiles as any[])?.map(p => [p.id, p]) || []);

      // Fetch link counts per workspace
      const { data: linkCounts } = await supabase
        .from("links")
        .select("workspace_id")
        .in("workspace_id", rawData?.map(w => w.id) || []);

      const linkCountMap = new Map<string, number>();
      linkCounts?.forEach(l => {
        linkCountMap.set(l.workspace_id, (linkCountMap.get(l.workspace_id) || 0) + 1);
      });

      return rawData?.map(w => ({
        ...w,
        subscription_status: w.plan_tier === 'free' ? 'active' : 'active',
        plan_expires_at: null,
        previous_plan_tier: null,
        downgraded_at: null,
        data_deletion_scheduled_at: null,
        owner_email: (profileMap.get(w.owner_id) as any)?.email,
        owner_name: (profileMap.get(w.owner_id) as any)?.full_name,
        link_count: linkCountMap.get(w.id) || 0,
      })) as Workspace[];
    },
  });

  // Filter grace period workspaces
  const gracePeriodWorkspaces = workspaces?.filter(
    w => w.subscription_status === 'grace_period' || w.subscription_status === 'expired'
  ).filter(w => w.downgraded_at && w.data_deletion_scheduled_at) || [];

  const handleManageTier = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setIsAdjustDialogOpen(true);
  };

  const handleSendEmail = async (workspace: Workspace) => {
    if (!workspace.owner_email) {
      notify.error("no email address available");
      return;
    }
    
    // Open default email client
    const subject = encodeURIComponent(`Your utm.one subscription - ${workspace.name}`);
    const body = encodeURIComponent(
      `Hi ${workspace.owner_name || 'there'},\n\nWe noticed your utm.one subscription for "${workspace.name}" needs attention.\n\n`
    );
    window.open(`mailto:${workspace.owner_email}?subject=${subject}&body=${body}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">subscription management</h1>
        <p className="text-muted-foreground">
          monitor revenue, manage tiers, and run win-back campaigns
        </p>
      </div>

      {/* Stats Overview */}
      <SubscriptionStats workspaces={workspaces || []} isLoading={isLoading} />

      {/* Grace Period Section (if any) */}
      {gracePeriodWorkspaces.length > 0 && (
        <GracePeriodSection 
          workspaces={gracePeriodWorkspaces as any} 
          isLoading={isLoading} 
        />
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">all subscribers</TabsTrigger>
          <TabsTrigger value="paid">paid only</TabsTrigger>
          <TabsTrigger value="free">free tier</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>all subscribers</CardTitle>
              <CardDescription>
                complete list of all workspaces and their subscription status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriberTable
                workspaces={workspaces || []}
                isLoading={isLoading}
                onManageTier={handleManageTier}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid">
          <Card>
            <CardHeader>
              <CardTitle>paid subscribers</CardTitle>
              <CardDescription>
                workspaces on starter, growth, business, or enterprise plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriberTable
                workspaces={workspaces?.filter(w => w.plan_tier !== 'free') || []}
                isLoading={isLoading}
                onManageTier={handleManageTier}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="free">
          <Card>
            <CardHeader>
              <CardTitle>free tier users</CardTitle>
              <CardDescription>
                workspaces on the free plan - potential upgrade candidates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriberTable
                workspaces={workspaces?.filter(w => w.plan_tier === 'free') || []}
                isLoading={isLoading}
                onManageTier={handleManageTier}
                onSendEmail={handleSendEmail}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Manual Tier Adjust Dialog */}
      <ManualTierAdjust
        workspace={selectedWorkspace}
        open={isAdjustDialogOpen}
        onOpenChange={setIsAdjustDialogOpen}
      />
    </div>
  );
}
