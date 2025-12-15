import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getCachedUserId } from "@/lib/getCachedUser";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";
import { notify } from "@/lib/notify";

interface ManualTierAdjustProps {
  workspace: {
    id: string;
    name: string;
    plan_tier: PlanTier;
    owner_email?: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TIER_OPTIONS: PlanTier[] = ['free', 'starter', 'growth', 'business', 'enterprise'];

const REASONS = [
  { value: "upgrade", label: "Manual upgrade" },
  { value: "downgrade", label: "Manual downgrade" },
  { value: "trial_extension", label: "Trial extension" },
  { value: "win_back", label: "Win-back offer" },
  { value: "special_deal", label: "Special deal" },
  { value: "support_resolution", label: "Support resolution" },
  { value: "other", label: "Other" },
];

export function ManualTierAdjust({ workspace, open, onOpenChange }: ManualTierAdjustProps) {
  const queryClient = useQueryClient();
  const [newTier, setNewTier] = useState<PlanTier | "">("");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");
  const [expiryDays, setExpiryDays] = useState("30");

  const adjustTierMutation = useMutation({
    mutationFn: async () => {
      if (!workspace || !newTier) return;

      const userId = getCachedUserId();
      const expiryDate = new Date(Date.now() + parseInt(expiryDays) * 24 * 60 * 60 * 1000);

      // Update workspace tier
      const { error: updateError } = await supabase
        .from("workspaces")
        .update({
          plan_tier: newTier,
          subscription_status: "active",
          plan_expires_at: newTier !== "free" ? expiryDate.toISOString() : null,
          previous_plan_tier: workspace.plan_tier,
          downgraded_at: null,
          data_deletion_scheduled_at: null,
        })
        .eq("id", workspace.id);

      if (updateError) throw updateError;

      // Log admin action
      await supabase.rpc("log_admin_action", {
        p_admin_user_id: userId,
        p_action: "tier_adjustment",
        p_resource_type: "workspace",
        p_resource_id: workspace.id,
        p_old_values: { plan_tier: workspace.plan_tier },
        p_new_values: { 
          plan_tier: newTier, 
          reason, 
          notes,
          expires_at: expiryDate.toISOString(),
        },
      });
    },
    onSuccess: () => {
      notify.success("tier updated successfully");
      queryClient.invalidateQueries({ queryKey: ["all-workspaces-subscriptions"] });
      onOpenChange(false);
      resetForm();
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const resetForm = () => {
    setNewTier("");
    setReason("");
    setNotes("");
    setExpiryDays("30");
  };

  const handleClose = (open: boolean) => {
    if (!open) resetForm();
    onOpenChange(open);
  };

  if (!workspace) return null;

  const currentPrice = PLAN_CONFIG[workspace.plan_tier].price;
  const newPrice = newTier ? PLAN_CONFIG[newTier].price : null;
  const isDowngrade = newTier && TIER_OPTIONS.indexOf(newTier) < TIER_OPTIONS.indexOf(workspace.plan_tier);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>adjust subscription tier</DialogTitle>
          <DialogDescription>
            manually change the subscription tier for <strong>{workspace.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current → New Tier Visual */}
          <div className="flex items-center justify-center gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">current</div>
              <Badge variant="outline" className="capitalize text-sm">
                {workspace.plan_tier}
              </Badge>
              <div className="text-xs text-muted-foreground mt-1">
                {typeof currentPrice === 'number' ? `$${currentPrice}/mo` : 'custom'}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground" />
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">new</div>
              {newTier ? (
                <>
                  <Badge variant="outline" className="capitalize text-sm bg-primary/10 text-primary border-primary/20">
                    {newTier}
                  </Badge>
                  <div className="text-xs text-muted-foreground mt-1">
                    {typeof newPrice === 'number' ? `$${newPrice}/mo` : 'custom'}
                  </div>
                </>
              ) : (
                <Badge variant="outline" className="text-sm">select tier</Badge>
              )}
            </div>
          </div>

          {isDowngrade && (
            <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-500">
                this is a downgrade. some features may become unavailable.
              </span>
            </div>
          )}

          {/* New Tier Select */}
          <div className="space-y-2">
            <Label>new tier</Label>
            <Select value={newTier} onValueChange={(v) => setNewTier(v as PlanTier)}>
              <SelectTrigger>
                <SelectValue placeholder="select new tier" />
              </SelectTrigger>
              <SelectContent>
                {TIER_OPTIONS.map(tier => (
                  <SelectItem 
                    key={tier} 
                    value={tier}
                    disabled={tier === workspace.plan_tier}
                    className="capitalize"
                  >
                    {tier} {tier === workspace.plan_tier && "(current)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Expiry Days */}
          {newTier && newTier !== 'free' && (
            <div className="space-y-2">
              <Label>subscription duration</Label>
              <Select value={expiryDays} onValueChange={setExpiryDays}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Reason */}
          <div className="space-y-2">
            <Label>reason for change</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="select reason" />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>notes (optional)</Label>
            <Textarea
              placeholder="add any additional context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            cancel
          </Button>
          <Button
            onClick={() => adjustTierMutation.mutate()}
            disabled={!newTier || !reason || adjustTierMutation.isPending}
          >
            {adjustTierMutation.isPending ? "updating..." : "apply change"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
