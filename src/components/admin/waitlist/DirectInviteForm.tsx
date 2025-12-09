import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, CheckCircle, Mail } from "lucide-react";

type Props = {
  onSuccess: () => void;
};

export function DirectInviteForm({ onSuccess }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [accessLevel, setAccessLevel] = useState("2");
  const [lastInviteToken, setLastInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sendInviteMutation = useMutation({
    mutationFn: async () => {
      const inviteToken = btoa(`${email}-${Date.now()}-${Math.random().toString(36).substring(2)}`);

      const { error: inviteError } = await supabase
        .from("early_access_invites")
        .insert({
          email: email.toLowerCase(),
          invite_token: inviteToken,
          access_level: parseInt(accessLevel),
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

      if (inviteError) throw inviteError;

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
    onSuccess: (inviteToken) => {
      toast({ title: "invite sent", description: `sent to ${email}` });
      setLastInviteToken(inviteToken);
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["early-access-invites"] });
    },
    onError: (error: Error) => {
      toast({
        title: "failed to send invite",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLastInviteToken(null);
    sendInviteMutation.mutate();
  };

  const copyInviteLink = () => {
    if (!lastInviteToken) return;
    const inviteUrl = `${window.location.origin}/claim-access?token=${lastInviteToken}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast({ title: "link copied" });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="invite-email">email address</Label>
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
          <Label htmlFor="access-level">access level</Label>
          <Select value={accessLevel} onValueChange={setAccessLevel}>
            <SelectTrigger id="access-level">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">read-only preview</SelectItem>
              <SelectItem value="2">limited beta</SelectItem>
              <SelectItem value="3">full access</SelectItem>
              <SelectItem value="4">power user</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full gap-2" disabled={sendInviteMutation.isPending}>
          <Mail className="h-4 w-4" />
          {sendInviteMutation.isPending ? "sending..." : "send invite"}
        </Button>
      </form>

      {lastInviteToken && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <p className="text-sm font-medium">invite sent!</p>
          </div>

          <div className="flex gap-2">
            <Input
              readOnly
              value={`${window.location.origin}/claim-access?token=${lastInviteToken}`}
              className="text-xs font-mono"
            />
            <Button variant="outline" size="icon" onClick={copyInviteLink}>
              {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
