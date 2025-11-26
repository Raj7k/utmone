import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Mail, CheckCircle2, Clock, XCircle, Send, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function InviteTrackingDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  
  const { data: invites, isLoading } = useQuery({
    queryKey: ['early-access-invites'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('early_access_invites')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const resendInviteMutation = useMutation({
    mutationFn: async ({ email, accessLevel, inviteToken }: { email: string; accessLevel: number; inviteToken: string }) => {
      const { error } = await supabase.functions.invoke("send-approval-email", {
        body: { email, accessLevel, inviteToken },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Invite resent",
        description: "Invitation email has been resent successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/claim-access?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard",
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const stats = {
    total: invites?.length || 0,
    claimed: invites?.filter(i => i.claimed_at).length || 0,
    pending: invites?.filter(i => !i.claimed_at && new Date(i.expires_at) > new Date()).length || 0,
    expired: invites?.filter(i => !i.claimed_at && new Date(i.expires_at) <= new Date()).length || 0,
  };

  const getStatusBadge = (invite: any) => {
    if (invite.claimed_at) {
      return <Badge className="gap-1"><CheckCircle2 className="h-3 w-3" /> Claimed</Badge>;
    }
    if (new Date(invite.expires_at) <= new Date()) {
      return <Badge variant="destructive" className="gap-1"><XCircle className="h-3 w-3" /> Expired</Badge>;
    }
    return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
  };

  const getAccessLevelLabel = (level: number): string => {
    const labels: Record<number, string> = {
      0: "Waitlist",
      1: "Read-Only Preview",
      2: "Limited Beta",
      3: "Full Access",
      4: "Power User",
    };
    return labels[level] || "Unknown";
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
                  <TableHead>Access Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sent</TableHead>
                  <TableHead>Claimed</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((invite) => (
                  <TableRow key={invite.id}>
                    <TableCell className="font-medium">{invite.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{getAccessLevelLabel(invite.access_level)}</Badge>
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
                      {!invite.claimed_at && new Date(invite.expires_at) > new Date() && (
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-2"
                            onClick={() => resendInviteMutation.mutate({
                              email: invite.email,
                              accessLevel: invite.access_level,
                              inviteToken: invite.invite_token,
                            })}
                            disabled={resendInviteMutation.isPending}
                          >
                            <Send className="h-3 w-3" />
                            Resend
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyInviteLink(invite.invite_token)}
                          >
                            {copiedToken === invite.invite_token ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
    </div>
  );
}
