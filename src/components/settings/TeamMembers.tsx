import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useTeamMembers } from "@/hooks/useTeamMembers";
import { Trash2, Copy, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TeamMembersProps {
  workspaceId: string;
}

export function TeamMembers({ workspaceId }: TeamMembersProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { toast } = useToast();
  
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteTeamMember({ email, role });
    setEmail("");
    setRole("viewer");
  };

  const copyInviteLink = (token: string) => {
    const inviteUrl = `${window.location.origin}/accept-invite?token=${token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedToken(token);
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard",
    });
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>invite team member</CardTitle>
          <CardDescription>
            send an invitation to add a new member to your workspace
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleInvite} className="space-y-4">
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
                <label htmlFor="role" className="text-callout text-label">role</label>
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
            <div className="mt-4 p-4 bg-system-green/10 border border-system-green/20 rounded-lg space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-system-green mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-callout font-medium text-label">invitation sent!</p>
                  <p className="text-footnote text-secondary-label mt-0.5">
                    email sent to {lastInvitation.email}
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-footnote text-secondary-label">or share this link directly:</p>
                <div className="flex gap-2">
                  <Input
                    readOnly
                    value={`${window.location.origin}/accept-invite?token=${lastInvitation.token}`}
                    className="text-footnote font-mono"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyInviteLink(lastInvitation.token)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={clearLastInvitation}
                className="text-footnote"
              >
                dismiss
              </Button>
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
                  <TableHead>expires</TableHead>
                  <TableHead>actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>{invitation.email}</TableCell>
                    <TableCell>{invitation.role}</TableCell>
                    <TableCell>{new Date(invitation.expires_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyInviteLink(invitation.token)}
                        >
                          {copiedToken === invitation.token ? (
                            <CheckCircle className="h-4 w-4 text-system-green" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>cancel invitation</AlertDialogTitle>
                              <AlertDialogDescription>
                                are you sure you want to cancel this invitation? the link will no longer work.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => cancelInvitation(invitation.id)}>
                                cancel invitation
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
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
