import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, UserPlus } from "lucide-react";

export const AdminDirectInvite = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("2");

  const sendInviteMutation = useMutation({
    mutationFn: async () => {
      // Generate unique invite token
      const inviteToken = btoa(`${email}-${Date.now()}-${Math.random()}`);
      
      // Create invite record
      const { error: inviteError } = await supabase
        .from("early_access_invites")
        .insert({
          email: email.toLowerCase(),
          invite_token: inviteToken,
          access_level: parseInt(accessLevel),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
        });

      if (inviteError) throw inviteError;

      // Send approval email
      const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
        body: {
          email: email.toLowerCase(),
          accessLevel: parseInt(accessLevel),
          inviteToken,
        },
      });

      if (emailError) throw emailError;

      return inviteToken;
    },
    onSuccess: () => {
      toast({
        title: "Invite sent successfully",
        description: `Direct invite sent to ${email}`,
      });
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["early-access-invites"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sendInviteMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Direct Invite
        </CardTitle>
        <CardDescription>
          Send a direct invite bypassing the waitlist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invite-email">Email address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="user@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access-level">Access level</Label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger id="access-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Waitlist (Level 0)</SelectItem>
                <SelectItem value="1">Read-Only Preview (Level 1)</SelectItem>
                <SelectItem value="2">Limited Beta (Level 2)</SelectItem>
                <SelectItem value="3">Full Access (Level 3)</SelectItem>
                <SelectItem value="4">Power User (Level 4)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2"
            disabled={sendInviteMutation.isPending}
          >
            <Mail className="h-4 w-4" />
            {sendInviteMutation.isPending ? "Sending..." : "Send invite"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
