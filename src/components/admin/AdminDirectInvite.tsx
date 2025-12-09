import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, UserPlus, Copy, CheckCircle, Calendar } from "lucide-react";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";
import { format, addDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const PLAN_DURATION_OPTIONS = [
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
  { value: "custom", label: "Custom date" },
];

export const AdminDirectInvite = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [planTier, setPlanTier] = useState<PlanTier>("starter");
  const [durationOption, setDurationOption] = useState("30");
  const [customDate, setCustomDate] = useState<Date | undefined>(addDays(new Date(), 30));
  const [lastInviteToken, setLastInviteToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const getExpiryDate = (): Date => {
    if (durationOption === "custom" && customDate) {
      return customDate;
    }
    return addDays(new Date(), parseInt(durationOption));
  };

  const sendInviteMutation = useMutation({
    mutationFn: async () => {
      // Generate unique invite token
      const inviteToken = btoa(`${email}-${Date.now()}-${Math.random()}`);
      const expiryDate = getExpiryDate();
      
      // Create invite record with plan tier
      const { error: inviteError } = await supabase
        .from("early_access_invites")
        .insert({
          email: email.toLowerCase(),
          invite_token: inviteToken,
          access_level: getPlanAccessLevel(planTier), // For backward compatibility
          plan_tier: planTier,
          plan_duration_days: Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
          expires_at: expiryDate.toISOString(),
        });

      if (inviteError) throw inviteError;

      // Send approval email with plan info
      const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
        body: {
          email: email.toLowerCase(),
          accessLevel: getPlanAccessLevel(planTier),
          planTier,
          planExpiresAt: expiryDate.toISOString(),
          inviteToken,
        },
      });

      if (emailError) throw emailError;

      return inviteToken;
    },
    onSuccess: (inviteToken) => {
      toast({
        title: "Invite sent successfully",
        description: `Direct invite sent to ${email} with ${planTier} plan`,
      });
      setLastInviteToken(inviteToken);
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

  // Map plan tier to legacy access level for backward compatibility
  const getPlanAccessLevel = (tier: PlanTier): number => {
    const mapping: Record<PlanTier, number> = {
      free: 1,
      starter: 2,
      growth: 3,
      business: 4,
      enterprise: 4,
    };
    return mapping[tier];
  };

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
    toast({
      title: "Link copied",
      description: "Invitation link copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Direct Invite
        </CardTitle>
        <CardDescription>
          Send a direct invite with a specific plan tier and expiry date
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
            <Label htmlFor="plan-tier">Plan tier</Label>
            <Select value={planTier} onValueChange={(v) => setPlanTier(v as PlanTier)}>
              <SelectTrigger id="plan-tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PLAN_CONFIG).map(([key, plan]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex items-center gap-2">
                      <span className="capitalize">{plan.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {plan.price === 'custom' ? '(custom)' : plan.price === 0 ? '(free)' : `($${plan.price}/mo)`}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Access duration</Label>
            <Select value={durationOption} onValueChange={setDurationOption}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLAN_DURATION_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {durationOption === "custom" && (
            <div className="space-y-2">
              <Label>Custom expiry date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !customDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {customDate ? format(customDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={customDate}
                    onSelect={setCustomDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">
              User will receive <span className="font-medium text-foreground capitalize">{planTier}</span> access
              until <span className="font-medium text-foreground">{format(getExpiryDate(), "PPP")}</span>
            </p>
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

        {lastInviteToken && (
          <div className="mt-4 p-4 bg-system-green/10 border border-system-green/20 rounded-lg space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-system-green mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Invite sent successfully!</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Share this link with the user:
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${window.location.origin}/claim-access?token=${lastInviteToken}`}
                className="text-xs font-mono"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={copyInviteLink}
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-system-green" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLastInviteToken(null)}
              className="text-xs"
            >
              Dismiss
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};