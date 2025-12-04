import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageProgressBar } from "@/components/ui/usage-progress-bar";
import { Crown, Lock, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { PLAN_CONFIG } from "@/lib/planConfig";

export const YourPlanTile = () => {
  const navigate = useNavigate();
  const { links, clicks, qrCodes, planTier, isLoading } = usePlanLimits();

  const planConfig = PLAN_CONFIG[planTier as keyof typeof PLAN_CONFIG];
  const showUpgrade = planTier === 'free';

  const daysUntilReset = 30 - new Date().getDate();

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
        <h3 className="text-title-3 font-display">your plan</h3>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-3 flex-1">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-2 bg-muted rounded" />
        </div>
      ) : planConfig ? (
        <div className="space-y-4 flex-1 flex flex-col">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {planConfig.name}
            </Badge>
            {planConfig.popular && (
              <Badge className="bg-system-blue">
                Popular
              </Badge>
            )}
          </div>

          {/* Usage Stats */}
          <div className="space-y-3">
            <UsageProgressBar 
              label="links" 
              used={links.used} 
              limit={links.limit} 
            />
            <UsageProgressBar 
              label="qr codes" 
              used={qrCodes.used} 
              limit={qrCodes.limit} 
            />
            <UsageProgressBar 
              label="clicks" 
              used={clicks.used} 
              limit={clicks.limit} 
            />
          </div>

          {/* Constraint Hints for Free Tier */}
          {showUpgrade && (
            <div className="space-y-2 pt-2 border-t border-border">
              <div className="flex items-start gap-2 text-xs text-tertiary-label">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>analytics: 90-day retention</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-tertiary-label">
                <Lock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>custom domains not available</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-tertiary-label">
                <Lock className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <span>qr watermark required</span>
              </div>
            </div>
          )}

          <div className="mt-auto pt-2">
            <p className="text-caption-2 text-tertiary-label mb-3">
              resets in {daysUntilReset} days
            </p>

            {showUpgrade ? (
              <Button
                className="w-full"
                onClick={() => navigate('/pricing')}
              >
                upgrade to pro
              </Button>
            ) : (
              <Button
                variant="system-secondary"
                className="w-full"
                onClick={() => navigate('/settings?tab=billing')}
              >
                manage plan
              </Button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-caption-2 text-tertiary-label flex-1">Unable to load plan data</p>
      )}
    </div>
  );
};
