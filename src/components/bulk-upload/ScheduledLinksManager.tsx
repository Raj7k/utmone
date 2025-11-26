import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, Edit2, Trash2, PlayCircle } from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ScheduledLinksManagerProps {
  workspaceId: string;
}

export function ScheduledLinksManager({ workspaceId }: ScheduledLinksManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [linkToActivate, setLinkToActivate] = useState<string | null>(null);
  const [linkToCancel, setLinkToCancel] = useState<string | null>(null);

  const { data: scheduledLinks, isLoading } = useQuery({
    queryKey: ["scheduled-links", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("id, title, short_url, activation_at, created_at, folder_id")
        .eq("workspace_id", workspaceId)
        .eq("status", "scheduled")
        .order("activation_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const activateMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from("links")
        .update({ status: "active" })
        .eq("id", linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast({
        title: "link activated",
        description: "scheduled link has been activated early",
      });
      setLinkToActivate(null);
    },
    onError: (error: any) => {
      toast({
        title: "activation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from("links")
        .delete()
        .eq("id", linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduled-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast({
        title: "schedule cancelled",
        description: "scheduled link has been removed",
      });
      setLinkToCancel(null);
    },
    onError: (error: any) => {
      toast({
        title: "cancellation failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getTimeUntilActivation = (activationAt: string) => {
    const now = new Date();
    const activation = new Date(activationAt);
    return activation > now ? formatDistanceToNow(activation, { addSuffix: true }) : "overdue";
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">scheduled links</CardTitle>
          <CardDescription>loading scheduled activations...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!scheduledLinks || scheduledLinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">scheduled links</CardTitle>
          <CardDescription>no links scheduled for activation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">schedule links in bulk upload to see them here</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">scheduled links</CardTitle>
          <CardDescription>
            {scheduledLinks.length} {scheduledLinks.length === 1 ? "link" : "links"} waiting for activation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scheduledLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                    <h4 className="font-medium truncate">{link.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mb-2">
                    {link.short_url}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      activates {getTimeUntilActivation(link.activation_at!)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(link.activation_at!), "PPP 'at' p")}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLinkToActivate(link.id)}
                    disabled={activateMutation.isPending}
                  >
                    <PlayCircle className="w-4 h-4 mr-1" />
                    activate now
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLinkToCancel(link.id)}
                    disabled={cancelMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activate Confirmation Dialog */}
      <AlertDialog open={!!linkToActivate} onOpenChange={() => setLinkToActivate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>activate link early?</AlertDialogTitle>
            <AlertDialogDescription>
              this will immediately activate the scheduled link before its planned activation time. this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => linkToActivate && activateMutation.mutate(linkToActivate)}
            >
              activate now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={!!linkToCancel} onOpenChange={() => setLinkToCancel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>cancel scheduled link?</AlertDialogTitle>
            <AlertDialogDescription>
              this will permanently delete the scheduled link. this action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => linkToCancel && cancelMutation.mutate(linkToCancel)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              delete link
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
