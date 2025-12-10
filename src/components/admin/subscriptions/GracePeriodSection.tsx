import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, Mail, RefreshCw } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { notify } from "@/lib/notify";
import { Skeleton } from "@/components/ui/skeleton";
import { PlanTier } from "@/lib/planConfig";

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

interface GracePeriodSectionProps {
  workspaces: GracePeriodWorkspace[];
  isLoading: boolean;
}

export function GracePeriodSection({ workspaces, isLoading }: GracePeriodSectionProps) {
  const queryClient = useQueryClient();

  const extendSubscriptionMutation = useMutation({
    mutationFn: async ({ workspaceId, previousTier }: { workspaceId: string; previousTier: string }) => {
      const newExpiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      
      const { error } = await supabase
        .from("workspaces")
        .update({
          plan_tier: (previousTier || "starter") as PlanTier,
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
      notify.success("subscription extended");
      queryClient.invalidateQueries({ queryKey: ["all-workspaces-subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["grace-period-workspaces"] });
    },
    onError: (error: Error) => {
      notify.error(error.message);
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
      notify.success("win-back email sent");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const getDaysRemaining = (deletionDate: string) => {
    return differenceInDays(new Date(deletionDate), new Date());
  };

  const getUrgencyBadge = (daysRemaining: number) => {
    if (daysRemaining <= 7) {
      return <Badge variant="destructive">critical - {daysRemaining}d left</Badge>;
    }
    if (daysRemaining <= 14) {
      return <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20">urgent - {daysRemaining}d left</Badge>;
    }
    return <Badge variant="secondary">{daysRemaining}d remaining</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          grace period workspaces
        </CardTitle>
        <CardDescription>
          {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} in the 60-day data retention period
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>workspace</TableHead>
              <TableHead>owner</TableHead>
              <TableHead>previous plan</TableHead>
              <TableHead>downgraded</TableHead>
              <TableHead>data deletion</TableHead>
              <TableHead className="text-right">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {workspaces.map((workspace) => {
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
                        email
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => extendSubscriptionMutation.mutate({ 
                          workspaceId: workspace.id, 
                          previousTier: workspace.previous_plan_tier 
                        })}
                        disabled={extendSubscriptionMutation.isPending}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        extend 30d
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
