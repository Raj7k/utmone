import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UsageProgressBar } from "@/components/ui/usage-progress-bar";
import { Crown, Lock, Check, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlanLimits } from "@/hooks/usePlanLimits";
import { PLAN_CONFIG, FEATURE_CATEGORIES, getNextPlanTier } from "@/lib/planConfig";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export const YourPlanTile = () => {
  const navigate = useNavigate();
  const { links, clicks, qrCodes, planTier, isLoading } = usePlanLimits();
  const [showFeatures, setShowFeatures] = useState(false);

  const planConfig = PLAN_CONFIG[planTier as keyof typeof PLAN_CONFIG];
  const nextTier = getNextPlanTier(planTier);
  const nextPlanConfig = nextTier ? PLAN_CONFIG[nextTier] : null;
  const showUpgrade = planTier === 'free' || planTier === 'growth';

  const daysUntilReset = 30 - new Date().getDate();

  // Get locked features for upsell
  const getLockedFeatures = () => {
    if (!nextPlanConfig) return [];
    const locked: string[] = [];
    
    if (planTier === 'free') {
      locked.push('custom domains', 'branded qr codes', 'geo-targeting', 'team roles', 'api access');
    } else if (planTier === 'growth') {
      locked.push('smart routing', 'predictive analytics', 'approval workflows', 'audit logs');
    }
    
    return locked.slice(0, 4);
  };

  const lockedFeatures = getLockedFeatures();

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="h-5 w-5 text-primary" />
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
              <Badge className="bg-primary text-primary-foreground">
                popular
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

          {/* Features Included - Collapsible */}
          <Collapsible open={showFeatures} onOpenChange={setShowFeatures}>
            <CollapsibleTrigger className="flex items-center justify-between w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span>features included</span>
              {showFeatures ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              {planTier === 'free' ? (
                <div className="space-y-1.5">
                  <FeatureItem label="25 links/month" included />
                  <FeatureItem label="1K clicks/month" included />
                  <FeatureItem label="utm builder" included />
                  <FeatureItem label="basic qr codes" included />
                  <FeatureItem label="30-day analytics" included />
                </div>
              ) : planTier === 'growth' ? (
                <div className="space-y-1.5">
                  <FeatureItem label="1,000 links/month" included />
                  <FeatureItem label="100K clicks/month" included />
                  <FeatureItem label="3 custom domains" included />
                  <FeatureItem label="geo-targeting" included />
                  <FeatureItem label="attribution models" included />
                  <FeatureItem label="api & webhooks" included />
                </div>
              ) : planTier === 'business' ? (
                <div className="space-y-1.5">
                  <FeatureItem label="10,000 links/month" included />
                  <FeatureItem label="1M clicks/month" included />
                  <FeatureItem label="10 custom domains" included />
                  <FeatureItem label="smart routing" included />
                  <FeatureItem label="predictive analytics" included />
                  <FeatureItem label="approval workflows" included />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <FeatureItem label="unlimited everything" included />
                  <FeatureItem label="identity graph" included />
                  <FeatureItem label="sso (saml)" included />
                  <FeatureItem label="white-label" included />
                  <FeatureItem label="dedicated csm" included />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>

          {/* Locked Features Teaser */}
          {showUpgrade && lockedFeatures.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                unlock with {nextTier}
              </p>
              <div className="space-y-1.5">
                {lockedFeatures.map((feature) => (
                  <FeatureItem key={feature} label={feature} included={false} />
                ))}
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
                upgrade to {nextTier}
              </Button>
            ) : (
              <Button
                variant="outline"
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

interface FeatureItemProps {
  label: string;
  included: boolean;
}

const FeatureItem = ({ label, included }: FeatureItemProps) => (
  <div className="flex items-center gap-2 text-xs">
    {included ? (
      <Check className="h-3 w-3 text-primary flex-shrink-0" />
    ) : (
      <Lock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
    )}
    <span className={included ? 'text-foreground' : 'text-muted-foreground'}>
      {label}
    </span>
  </div>
);
