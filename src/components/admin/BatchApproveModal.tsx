import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Zap } from "lucide-react";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";

// Map plan tier to legacy access level for backward compatibility
const planTierToAccessLevel: Record<PlanTier, number> = {
  free: 1,
  starter: 2,
  growth: 3,
  business: 4,
  enterprise: 4,
};

interface BatchApproveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (count: number, accessLevel: number) => Promise<void>;
  pendingCount: number;
}

export function BatchApproveModal({ 
  open, 
  onOpenChange, 
  onApprove, 
  pendingCount 
}: BatchApproveModalProps) {
  const [count, setCount] = useState<string>("10");
  const [planTier, setPlanTier] = useState<PlanTier>("growth");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    const countNum = parseInt(count);
    if (isNaN(countNum) || countNum < 1) {
      return;
    }

    setIsLoading(true);
    try {
      await onApprove(countNum, planTierToAccessLevel[planTier]);
      onOpenChange(false);
      setCount("10");
    } finally {
      setIsLoading(false);
    }
  };

  const quickCounts = [10, 25, 50, 100];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-foreground" />
            bulk approve users
          </DialogTitle>
          <DialogDescription>
            approve the next batch of waitlist users. users are sorted by referral count (highest first), then by signup date.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-foreground" />
              <div>
                <p className="text-sm font-medium">pending in queue</p>
                <p className="text-2xl font-bold">{pendingCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="count">how many users?</Label>
            <div className="flex gap-2">
              <Input
                id="count"
                type="number"
                min="1"
                max={pendingCount}
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Enter number"
                className="flex-1"
              />
            </div>
            
            <div className="flex gap-2">
              {quickCounts.map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => setCount(num.toString())}
                  disabled={num > pendingCount}
                  className="flex-1"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="plan-tier">plan tier</Label>
            <Select value={planTier} onValueChange={(v) => setPlanTier(v as PlanTier)}>
              <SelectTrigger id="plan-tier">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(PLAN_CONFIG).map(([key, plan]) => (
                  <SelectItem key={key} value={key}>
                    <span className="capitalize">{plan.name}</span>
                    <span className="text-muted-foreground ml-2">
                      {plan.price === 'custom' ? '(custom)' : plan.price === 0 ? '(free)' : `($${plan.price}/mo)`}
                    </span>
                    {key === 'growth' && <span className="text-muted-foreground ml-1">(recommended)</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              all users will receive 1 month free of selected plan
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading || parseInt(count) < 1 || parseInt(count) > pendingCount}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  approving...
                </>
              ) : (
                <>approve {count} users</>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            this action will send approval emails to all selected users
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
