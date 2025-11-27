import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Check, Sparkles } from "lucide-react";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  feature: string;
  currentUsage?: number;
  limit?: number | 'unlimited';
  upgradeToTier?: PlanTier;
  reason?: string;
}

export const UpgradeModal = ({
  open,
  onClose,
  feature,
  currentUsage,
  limit,
  upgradeToTier = 'pro',
  reason,
}: UpgradeModalProps) => {
  const navigate = useNavigate();
  const targetPlan = PLAN_CONFIG[upgradeToTier];
  
  const usagePercentage = 
    typeof limit === 'number' && currentUsage 
      ? Math.min((currentUsage / limit) * 100, 100)
      : 100;

  const benefits = [
    upgradeToTier === 'pro' && "1,000 links per month",
    upgradeToTier === 'pro' && "1 custom domain",
    upgradeToTier === 'business' && "10,000 links per month",
    upgradeToTier === 'business' && "5 custom domains",
    "Advanced analytics",
    "Priority support",
    upgradeToTier === 'business' && "White-label options",
  ].filter(Boolean) as string[];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-system-blue" />
            <DialogTitle className="text-title-2">You've reached your limit</DialogTitle>
          </div>
          <DialogDescription className="text-body-apple text-secondary-label">
            {reason || `Upgrade to ${targetPlan.name} to continue using this feature`}
          </DialogDescription>
        </DialogHeader>

        {typeof limit === 'number' && currentUsage !== undefined && (
          <div className="space-y-2 my-4">
            <div className="flex justify-between text-caption-1">
              <span className="text-secondary-label">Current usage</span>
              <span className="text-label font-medium">
                {currentUsage} / {limit}
              </span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
        )}

        <div className="space-y-3 my-6">
          <p className="text-caption-1 text-tertiary-label uppercase tracking-wide font-medium">
            With {targetPlan.name}
          </p>
          <ul className="space-y-2">
            {benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="h-4 w-4 text-system-green mt-0.5 flex-shrink-0" />
                <span className="text-body-apple text-label">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <Button
            variant="default"
            className="flex-1"
            onClick={() => {
              navigate('/pricing');
              onClose();
            }}
          >
            Upgrade to {targetPlan.name}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Maybe later
          </Button>
        </div>

        <p className="text-caption-2 text-tertiary-label text-center mt-4">
          Starting at ${typeof targetPlan.price === 'number' ? targetPlan.price : '20'}/month
        </p>
      </DialogContent>
    </Dialog>
  );
};
