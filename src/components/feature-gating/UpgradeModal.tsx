import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Lock, Sparkles, Check } from "lucide-react";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";
import { useNavigate } from "react-router-dom";

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  featureName: string;
  requiredPlan: PlanTier;
  currentPlan: PlanTier;
}

export const UpgradeModal = ({
  open,
  onOpenChange,
  featureName,
  requiredPlan,
  currentPlan,
}: UpgradeModalProps) => {
  const navigate = useNavigate();
  const planDetails = PLAN_CONFIG[requiredPlan];

  const handleUpgrade = () => {
    onOpenChange(false);
    navigate('/settings/billing');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-center text-xl">
            unlock {featureName}
          </DialogTitle>
          <DialogDescription className="text-center">
            this feature is available on the {requiredPlan} plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current vs Required Plan */}
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">your plan</span>
              <span className="font-medium text-foreground">{currentPlan}</span>
            </div>
            <div className="my-2 border-t border-border" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">required plan</span>
              <div className="flex items-center gap-1 font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                {requiredPlan}
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">included in {requiredPlan}:</p>
            <div className="space-y-1">
              {requiredPlan === 'pro' && (
                <>
                  <FeatureItem text="1,000 links per month" />
                  <FeatureItem text="1 custom domain" />
                  <FeatureItem text="advanced analytics" />
                  <FeatureItem text="priority support" />
                </>
              )}
              {requiredPlan === 'business' && (
                <>
                  <FeatureItem text="10,000 links per month" />
                  <FeatureItem text="5 custom domains" />
                  <FeatureItem text="unlimited clicks" />
                  <FeatureItem text="white-label branding" />
                </>
              )}
              {requiredPlan === 'enterprise' && (
                <>
                  <FeatureItem text="unlimited everything" />
                  <FeatureItem text="SSO & dedicated support" />
                  <FeatureItem text="custom SLA" />
                  <FeatureItem text="bulk QR generation" />
                </>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="rounded-lg p-4 text-center border border-primary/20 bg-primary/5">
            <div className="text-3xl font-bold text-primary">
              ${planDetails.price}
              <span className="text-base font-normal text-muted-foreground">/month</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              maybe later
            </Button>
            <Button onClick={handleUpgrade} className="flex-1">
              upgrade now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const FeatureItem = ({ text }: { text: string }) => (
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    <Check className="h-4 w-4 text-primary" />
    <span>{text}</span>
  </div>
);
