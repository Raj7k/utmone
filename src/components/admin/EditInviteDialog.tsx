import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";
import { cn } from "@/lib/utils";
import { notify } from "@/lib/notify";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";

interface EditInviteDialogProps {
  invite: {
    id: string;
    email: string;
    plan_tier: string | null;
    access_level: number;
    expires_at: string;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

export function EditInviteDialog({ invite, open, onOpenChange }: EditInviteDialogProps) {
  const queryClient = useQueryClient();
  const [planTier, setPlanTier] = useState<PlanTier>((invite?.plan_tier as PlanTier) || "growth");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(
    invite ? new Date(invite.expires_at) : addDays(new Date(), 30)
  );

  // Reset form when invite changes
  useState(() => {
    if (invite) {
      setPlanTier((invite.plan_tier as PlanTier) || "growth");
      setExpiryDate(new Date(invite.expires_at));
    }
  });

  const updateInviteMutation = useMutation({
    mutationFn: async () => {
      if (!invite || !expiryDate) throw new Error("Missing invite data");

      const newAccessLevel = getPlanAccessLevel(planTier);
      const durationDays = Math.ceil((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

      // Update early_access_invites
      const { error: inviteError } = await supabaseFrom('early_access_invites')
        .update({
          plan_tier: planTier,
          access_level: newAccessLevel,
          plan_duration_days: durationDays,
          expires_at: expiryDate.toISOString(),
        })
        .eq("id", invite.id);

      if (inviteError) throw inviteError;

      // Sync early_access_requests
      const { error: syncError } = await supabase
        .from("early_access_requests")
        .update({
          access_level: newAccessLevel,
        })
        .eq("email", invite.email.toLowerCase());

      if (syncError) {
        console.error("Failed to sync early_access_requests:", syncError);
      }

      return { planTier, expiryDate };
    },
    onSuccess: () => {
      notify.success("Invite updated", { description: "Changes saved successfully" });
      queryClient.invalidateQueries({ queryKey: ["early-access-invites"] });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      notify.error("Failed to update invite", { description: error.message });
    },
  });

  if (!invite) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invite</DialogTitle>
          <DialogDescription>
            Modify the invite for {invite.email}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Plan Tier</Label>
            <Select value={planTier} onValueChange={(v) => setPlanTier(v as PlanTier)}>
              <SelectTrigger>
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
            <Label>Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg text-sm">
            <p className="text-muted-foreground">
              User will have <span className="font-medium text-foreground capitalize">{planTier}</span> access
              until <span className="font-medium text-foreground">{expiryDate ? format(expiryDate, "PPP") : "—"}</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => updateInviteMutation.mutate()}
            disabled={updateInviteMutation.isPending}
          >
            {updateInviteMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
