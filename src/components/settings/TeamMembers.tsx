import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Trash2, Copy, CheckCircle, Send, HelpCircle, Clock, Link as LinkIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SmartContactRanking } from "@/components/workspace/SmartContactRanking";
import { RoleRecommenderWizard } from "@/components/workspace/RoleRecommenderWizard";
import type { Contact } from "@/lib/optimizations/contactRanking";

interface TeamMembersProps {
  workspaceId: string;
}

export function TeamMembers({ workspaceId }: TeamMembersProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock contacts for smart ranking (in production, fetch from Google/Microsoft OAuth)
  const mockContacts: Contact[] = [
    { name: "Sarah Johnson", email: "sarah@utm.one", domain: "utm.one", jobTitle: "Marketing Manager", lastContactDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { name: "Mike Chen", email: "mike@utm.one", domain: "utm.one", jobTitle: "Growth Lead", lastContactDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
    { name: "Alex Rivera", email: "alex@external.com", domain: "external.com", jobTitle: "Developer", lastContactDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
    { name: "Jane Smith", email: "jane@utm.one", domain: "utm.one", jobTitle: "Product Manager", lastContactDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  ];
  
  const {
    members,
    invitations,
    isLoading,
    inviteTeamMember,
    updateRole,
    removeMember,
    cancelInvitation,
    lastInvitation,
    clearLastInvitation,
  } = useTeamMembers(workspaceId);

  const resendInviteMutation = useMutation({
    mutationFn: async (invitationId: string) => {
      const { error } = await supabase.functions.invoke("resend-team-invitation", {
        body: { invitationId },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Invite resent",
        description: "Invitation email has been resent successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["workspace-invitations", workspaceId] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to resend invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    
    const normalizedEmail = email.toLowerCase().trim();
    
    // Check if already a member
    const existingMember = members?.find(
      m => m.profiles?.email?.toLowerCase() === normalizedEmail
    );
    
    if (existingMember) {
      toast({
        title: "Already a member",
        description: `${email} is already a member of this workspace.`,
        variant: "destructive",
      });
      return;
    }
    
    // Check if already has pending invitation
    const existingPending = invitations?.find(
      inv => inv.email.toLowerCase() === normalizedEmail
    );
    
    if (existingPending) {
      toast({
        title: "Invitation already pending",
        description: "Would you like to resend the invitation email?",
        action: (
          <Button 
            size="sm" 
            onClick={() => resendInviteMutation.mutate(existingPending.id)}
          >
            Resend
          </Button>
        ),
      });
      return;
    }
    
    inviteTeamMember({ email: normalizedEmail, role });
    setEmail("");
    setRole("viewer");
  };

  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    toast({
      title: "link copied",
      description: "share this link with your teammate",
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const getExpiryText = (expiresAt: string) => {
    const expiry = new Date(expiresAt);
    const now = new Date();
    if (expiry < now) return "expired";
    return `expires ${formatDistanceToNow(expiry, { addSuffix: true })}`;
  };

  const getShortenedLink = (token: string) => {
    // Show shortened version for display
    return `utm.one/invite/${token.slice(0, 8)}...`;
  };

  const handleSmartInvite = (contactEmail: string, contactName: string) => {
    setEmail(contactEmail);
    // Scroll to form
    document.getElementById('invite-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-6">
      {/* Smart Contact Ranking */}
      <SmartContactRanking 
        contacts={mockContacts}
        onInvite={handleSmartInvite}
      />

      <Card>
        <CardHeader>
          <CardTitle>invite team member</CardTitle>
          <CardDescription>
            send an invitation to add a new member to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleInvite} className="space-y-4" id="invite-form">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="email" className="text-callout text-label">email address</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="role" className="text-callout text-label">role</label>
                  <RoleRecommenderWizard 
                    onRoleSelect={(selectedRole) => setRole(selectedRole)}
                    trigger={
                      <Button variant="ghost" size="sm" type="button">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        help me choose
                      </Button>
                    }
                  />
                </div>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">viewer</SelectItem>
                    <SelectItem value="editor">editor</SelectItem>
                    <SelectItem value="workspace_admin">admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit">Send Invitation</Button>
          </form>

          {lastInvitation && (
            <div className="mt-4 p-5 bg-primary/5 border-2 border-primary/20 rounded-xl space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-foreground">invitation sent!</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    we've emailed <span className="font-medium text-foreground">{lastInvitation.email}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    they'll receive an email shortly with a link to join
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 pl-[52px]">
                <p className="text-xs text-muted-foreground">or share this link directly:</p>
                <div className="flex gap-2 items-center">
                  <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border">
                    <LinkIcon className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-mono text-foreground truncate">
                      {getShortenedLink(lastInvitation.token)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInviteLink(lastInvitation.token)}
                    className="h-9 px-3"
                  >
                    {copiedToken === lastInvitation.token ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="pl-[52px]">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearLastInvitation}
                  className="text-xs text-muted-foreground hover:text-foreground -ml-2"
                >
                  dismiss
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {invitations && invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>pending invitations</CardTitle>
            <CardDescription>
              invitations that haven't been accepted yet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>email</TableHead>
                  <TableHead>role</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead className="text-right">actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => {
                  const isExpired = new Date(invitation.expires_at) < new Date();
                  return (
                    <TableRow key={invitation.id} className={isExpired ? "opacity-60" : ""}>
                      <TableCell>
                        <div className="font-medium">{invitation.email}</div>
                      </TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{invitation.role.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className={`h-3.5 w-3.5 ${isExpired ? "text-destructive" : "text-muted-foreground"}`} />
                          <span className={`text-sm ${isExpired ? "text-destructive" : "text-muted-foreground"}`}>
                            {getExpiryText(invitation.expires_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 justify-end">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={resendInviteMutation.isPending}
                                title="resend invitation"
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>resend invitation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  this will send a new email to {invitation.email} with a fresh invitation link.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => resendInviteMutation.mutate(invitation.id)}>
                                  resend
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyInviteLink(invitation.token)}
                            title="copy invite link"
                          >
                            {copiedToken === invitation.token ? (
                              <CheckCircle className="h-4 w-4 text-primary" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" title="cancel invitation">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>cancel invitation?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  the invitation link sent to {invitation.email} will no longer work. you can always send a new one.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>keep invitation</AlertDialogCancel>
                                <AlertDialogAction onClick={() => cancelInvitation(invitation.id)}>
                                  cancel invitation
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>team members</CardTitle>
          <CardDescription>
            manage your workspace team members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>member</TableHead>
                <TableHead>email</TableHead>
                <TableHead>role</TableHead>
                <TableHead>actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members?.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="font-medium">
                      {member.profiles?.full_name || "unknown"}
                    </div>
                  </TableCell>
                  <TableCell>{member.profiles?.email}</TableCell>
                  <TableCell>
                    <Select
                      value={member.role}
                      onValueChange={(newRole) => updateRole({ memberId: member.id, role: newRole as "editor" | "viewer" | "workspace_admin" })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">viewer</SelectItem>
                        <SelectItem value="editor">editor</SelectItem>
                        <SelectItem value="workspace_admin">admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 text-system-red" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>remove team member?</AlertDialogTitle>
                          <AlertDialogDescription>
                            this will remove {member.profiles?.email} from the workspace.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => removeMember(member.id)}>
                            remove
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
