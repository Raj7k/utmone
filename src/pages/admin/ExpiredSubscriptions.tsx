import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Mail, RefreshCw, Clock, Trash2 } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface GracePeriodWorkspace {
  id: string;
  name: string;
  owner_id: string;
  previous_plan_tier: string;
  downgraded_at: string;
  data_deletion_scheduled_at: string;
  owner_email?: string;
  owner_name?: string;
}

export default function ExpiredSubscriptions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ["grace-period-workspaces"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("workspaces")
        .select(`
          id,
          name,
          owner_id,
          previous_plan_tier,
          downgraded_at,
          data_deletion_scheduled_at
        `)
        .in("subscription_status", ["grace_period", "expired"])
        .order("data_deletion_scheduled_at", { ascending: true });

      if (error) throw error;

      // Fetch owner profiles
      const ownerIds = data?.map(w => w.owner_id) || [];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name")
        .in("id", ownerIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data?.map(w => ({
        ...w,
        owner_email: profileMap.get(w.owner_id)?.email,
        owner_name: profileMap.get(w.owner_id)?.full_name,
      })) as GracePeriodWorkspace[];
    },
  });

  const extendSubscriptionMutation = useMutation({
    mutationFn: async ({ workspaceId, days }: { workspaceId: string; days: number }) => {
      const newExpiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
      
      const workspace = workspaces?.find(w => w.id === workspaceId);
      
      const previousTier = workspace?.previous_plan_tier as "free" | "starter" | "growth" | "business" | "enterprise" | null;
      
      const { error } = await supabase
        .from("workspaces")
        .update({
          plan_tier: previousTier || "starter",
          subscription_status: "active",
          plan_expires_at: newExpiryDate.toISOString(),
          previous_plan_tier: null,
          downgraded_at: null,
          data_deletion_scheduled_at: null,
        })
        .eq("id", workspaceId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Subscription extended successfully" });
      queryClient.invalidateQueries({ queryKey: ["grace-period-workspaces"] });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to extend subscription", description: error.message, variant: "destructive" });
    },
  });

  const sendWinBackEmailMutation = useMutation({
    mutationFn: async (workspace: GracePeriodWorkspace) => {
      if (!workspace.owner_email) throw new Error("No owner email");
      
      await supabase.functions.invoke("send-subscription-expiry-email", {
        body: {
          email: workspace.owner_email,
          name: workspace.owner_name || "there",
          workspaceName: workspace.name,
          previousPlan: workspace.previous_plan_tier,
          dataRetentionDays: differenceInDays(new Date(workspace.data_deletion_scheduled_at), new Date()),
          deletionDate: workspace.data_deletion_scheduled_at,
        },
      });
    },
    onSuccess: () => {
      toast({ title: "Win-back email sent" });
    },
    onError: (error: Error) => {
      toast({ title: "Failed to send email", description: error.message, variant: "destructive" });
    },
  });

  const getDaysRemaining = (deletionDate: string) => {
    return differenceInDays(new Date(deletionDate), new Date());
  };

  const getUrgencyBadge = (daysRemaining: number) => {
    if (daysRemaining <= 7) {
      return <Badge variant="destructive">Critical - {daysRemaining}d left</Badge>;
    }
    if (daysRemaining <= 14) {
      return <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">Urgent - {daysRemaining}d left</Badge>;
    }
    return <Badge variant="secondary">{daysRemaining}d remaining</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold">Expired Subscriptions</h1>
        <p className="text-muted-foreground">Manage workspaces in grace period and send win-back campaigns</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Grace Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{workspaces?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Expiring This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">
              {workspaces?.filter(w => getDaysRemaining(w.data_deletion_scheduled_at) <= 7).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Critical (≤3 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {workspaces?.filter(w => getDaysRemaining(w.data_deletion_scheduled_at) <= 3).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Grace Period Workspaces
          </CardTitle>
          <CardDescription>
            These workspaces have expired subscriptions and are in the 60-day data retention period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : workspaces?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No workspaces in grace period
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Previous Plan</TableHead>
                  <TableHead>Downgraded</TableHead>
                  <TableHead>Data Deletion</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces?.map((workspace) => {
                  const daysRemaining = getDaysRemaining(workspace.data_deletion_scheduled_at);
                  return (
                    <TableRow key={workspace.id}>
                      <TableCell className="font-medium">{workspace.name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{workspace.owner_name || "Unknown"}</div>
                          <div className="text-muted-foreground text-xs">{workspace.owner_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {workspace.previous_plan_tier}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(workspace.downgraded_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {getUrgencyBadge(daysRemaining)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => sendWinBackEmailMutation.mutate(workspace)}
                            disabled={sendWinBackEmailMutation.isPending || !workspace.owner_email}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => extendSubscriptionMutation.mutate({ 
                              workspaceId: workspace.id, 
                              days: 30 
                            })}
                            disabled={extendSubscriptionMutation.isPending}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Extend 30d
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}