import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, CheckCircle, Mail } from "lucide-react";

type Props = {
  onSuccess: () => void;
};

const PLAN_TIERS = [
  { value: "starter", label: "Starter", description: "500 links, 1 domain" },
  { value: "growth", label: "Growth", description: "Unlimited links, 3 domains" },
  { value: "business", label: "Business", description: "Full features + SSO" },
  { value: "enterprise", label: "Enterprise", description: "Custom SLA" },
];

const DURATION_OPTIONS = [
  { value: "30", label: "1 month" },
  { value: "60", label: "2 months" },
  { value: "90", label: "3 months" },
  { value: "180", label: "6 months" },
  { value: "365", label: "1 year" },
];

export function DirectInviteForm({ onSuccess }: Props) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [planTier, setPlanTier] = useState("growth");
  const [durationDays, setDurationDays] = useState("30");
  const [lastInviteToken, setLastInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const sendInviteMutation = useMutation({
    mutationFn: async () => {
      const inviteToken = btoa(`${email}-${Date.now()}-${Math.random().toString(36).substring(2)}`);
      const duration = parseInt(durationDays);

      const { error: inviteError } = await supabase
        .from("early_access_invites")
        .insert({
          email: email.toLowerCase(),
          invite_token: inviteToken,
          plan_tier: planTier,
          plan_duration_days: duration,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days to claim
        });

      if (inviteError) throw inviteError;

      const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
        body: {
          email: email.toLowerCase(),
          name: email.split('@')[0],
          invite_token: inviteToken,
          plan_tier: planTier,
          plan_duration_days: duration,
        },
      });

      if (emailError) throw emailError;

      return inviteToken;
    },
    onSuccess: (inviteToken) => {
      notify.success(`invite sent to ${email}`);
      setLastInviteToken(inviteToken);
      setEmail("");
      queryClient.invalidateQueries({ queryKey: ["early-access-invites"] });
      onSuccess();
    },
    onError: (error: Error) => {
      notify.error(error.message || "failed to send invite");
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
    notify.success("link copied");
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

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="plan-tier">plan tier</Label>
            <Select value={planTier} onValueChange={setPlanTier}>
              <SelectTrigger id="plan-tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_TIERS.map((tier) => (
                  <SelectItem key={tier.value} value={tier.value}>
                    <div className="flex flex-col">
                      <span>{tier.label}</span>
                      <span className="text-xs text-muted-foreground">{tier.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">duration</Label>
            <Select value={durationDays} onValueChange={setDurationDays}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
