import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Mail, CheckCircle2, Clock, XCircle, Send, Copy, Pencil, Trash2 } from "lucide-react";
import { notify } from "@/lib/notify";
import { useState } from "react";
import { EditInviteDialog } from "./EditInviteDialog";
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

interface Invite {
  id: string;
  email: string;
  access_level: number;
  plan_tier: string | null;
  invite_token: string;
  claimed_at: string | null;
  expires_at: string;
  created_at: string;
}

export function InviteTrackingDashboard() {
  const queryClient = useQueryClient();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [editingInvite, setEditingInvite] = useState<Invite | null>(null);
  const [deletingInvite, setDeletingInvite] = useState<Invite | null>(null);
  
  const { data: invites, isLoading } = useQuery({
    queryKey: ['early-access-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('early_access_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Invite[];
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: async (invite: Invite) => {
      const { error } = await supabase.functions.invoke("send-approval-email", {
        body: { 
          email: invite.email, 
          accessLevel: invite.access_level,
          planTier: invite.plan_tier || 'growth',
          inviteToken: invite.invite_token,
          origin: window.location.origin,
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      notify.success("Invite resent", { description: "Invitation email has been resent successfully" });
    },
    onError: (error: Error) => {
      notify.error("Failed to resend invite", { description: error.message });
    },
  });

  const deleteInviteMutation = useMutation({
    mutationFn: async (invite: Invite) => {
      // Delete from early_access_invites
      const { error: inviteError } = await supabase
        .from("early_access_invites")
        .delete()
        .eq("id", invite.id);

      if (inviteError) throw inviteError;

      // Update early_access_requests status back to pending if not claimed
      if (!invite.claimed_at) {
        const { error: requestError } = await supabase
          .from("early_access_requests")
          .update({ status: "pending", access_level: 0 })
          .eq("email", invite.email.toLowerCase());

        if (requestError) {
          console.error("Failed to update early_access_requests:", requestError);
        }
      }
    },
    onSuccess: () => {
      notify.success("Invite revoked", { description: "Invitation has been revoked" });
      queryClient.invalidateQueries({ queryKey: ["early-access-invites"] });
      setDeletingInvite(null);
    },
    onError: (error: Error) => {
      notify.error("Failed to revoke invite", { description: error.message });
    },
  });

  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/claim-access?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    notify.success("Link copied", { description: "Invitation link copied to clipboard" });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const stats = {
    total: invites?.length || 0,
    claimed: invites?.filter(i => i.claimed_at).length || 0,
    pending: invites?.filter(i => !i.claimed_at && new Date(i.expires_at) > new Date()).length || 0,
    expired: invites?.filter(i => !i.claimed_at && new Date(i.expires_at) <= new Date()).length || 0,
  };

  const getStatusBadge = (invite: Invite) => {
    if (invite.claimed_at) {
      return <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" /> Claimed</Badge>;
    }
    if (new Date(invite.expires_at) <= new Date()) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Expired</Badge>;
    }
    return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
  };

  const getPlanLabel = (invite: Invite): string => {
    if (invite.plan_tier) {
      return invite.plan_tier.charAt(0).toUpperCase() + invite.plan_tier.slice(1);
    }
    const labels: Record<number, string> = {
      0: "Waitlist",
      1: "Free",
      2: "Starter",
      3: "Growth",
      4: "Business",
    };
    return labels[invite.access_level] || "Unknown";
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">Loading invite data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Sent</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
          <CardContent>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Claimed</CardDescription>
            <CardTitle className="text-3xl">{stats.claimed}</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending</CardDescription>
            <CardTitle className="text-3xl">{stats.pending}</CardTitle>
          </CardHeader>
          <CardContent>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Expired</CardDescription>
            <CardTitle className="text-3xl">{stats.expired}</CardTitle>
          </CardHeader>
          <CardContent>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardContent>
        </Card>
      </div>

      {/* Invites Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Invitations</CardTitle>
          <CardDescription>Track invitation status and claim activity</CardDescription>
        </CardHeader>
        <CardContent>
          {invites && invites.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Claimed</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => {
                  const isPending = !invite.claimed_at && new Date(invite.expires_at) > new Date();
                  
                  return (
                    <TableRow key={invite.id}>
                      <TableCell className="font-medium">{invite.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getPlanLabel(invite)}</Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(invite)}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(invite.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invite.claimed_at ? format(new Date(invite.claimed_at), "MMM d, yyyy") : "—"}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(invite.expires_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {isPending && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                title="Resend invite"
                                onClick={() => resendInviteMutation.mutate(invite)}
                                disabled={resendInviteMutation.isPending}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Copy link"
                                onClick={() => copyInviteLink(invite.invite_token)}
                              >
                                {copiedToken === invite.invite_token ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Edit invite"
                                onClick={() => setEditingInvite(invite)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                title="Revoke invite"
                                onClick={() => setDeletingInvite(invite)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No invitations sent yet</p>
              <p className="text-sm mt-1">Start by approving users from the Applications tab</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <EditInviteDialog
        invite={editingInvite}
        open={!!editingInvite}
        onOpenChange={(open) => !open && setEditingInvite(null)}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingInvite} onOpenChange={(open) => !open && setDeletingInvite(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to revoke the invitation for {deletingInvite?.email}? 
              This will invalidate their invite link and they will need a new invitation to access the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingInvite && deleteInviteMutation.mutate(deletingInvite)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Revoke Invite
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
