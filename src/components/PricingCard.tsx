import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanDetails } from "@/lib/planConfig";

interface PricingCardProps {
  plan: PlanDetails;
  onSelect: (tier: string) => void;
}

export const PricingCard = ({ plan, onSelect }: PricingCardProps) => {
  const formatPrice = () => {
    if (plan.price === 'custom') return 'custom pricing';
    if (plan.price === 0) return 'free';
    if (plan.billingPeriod === 'lifetime') return `$${plan.price} once`;
    return `$${plan.price}/mo`;
  };

  const formatFeatureValue = (value: number | string | boolean | undefined) => {
    if (typeof value === 'boolean') return value ? '✓' : '✗';
    if (value === 'unlimited') return 'unlimited';
    if (typeof value === 'number') return value.toLocaleString();
    return value;
  };

  return (
    <Card 
      className={`relative transition-apple hover:shadow-lg ${
        plan.popular ? 'border-primary shadow-md scale-[1.02]' : ''
      }`}
    >
      {plan.badge && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
          {plan.badge}
        </Badge>
      )}
      
      <CardHeader className="text-center space-y-4 pb-8">
        <h3 className="text-heading-3 font-display font-bold capitalize">{plan.name}</h3>
        <div className="space-y-2">
          <div className="text-5xl font-bold text-foreground">
            {formatPrice()}
          </div>
          {plan.billingPeriod && plan.billingPeriod !== 'lifetime' && (
            <div className="text-small-text text-muted-foreground">
              billed {plan.billingPeriod}
            </div>
          )}
        </div>
        <p className="text-body-text text-muted-foreground">
          {plan.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-small-text">
              {formatFeatureValue(plan.features.monthlyLinks)} links/month
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-small-text">
              {formatFeatureValue(plan.features.customDomains)} custom domains
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-small-text">
              {formatFeatureValue(plan.features.monthlyClicks)} clicks/month
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-small-text">
              {formatFeatureValue(plan.features.analyticsRetentionDays)} days analytics
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-success flex-shrink-0" />
            <span className="text-small-text">
              {plan.features.teamMembers} team members
            </span>
          </div>
          {plan.features.apiAccess && (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-small-text">api access included</span>
            </div>
          )}
          {plan.features.prioritySupport && (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-small-text">priority support</span>
            </div>
          )}
          {plan.features.whiteLabel && (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-small-text">white-label branding</span>
            </div>
          )}
          {plan.features.sso && (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-small-text">sso (saml/oauth)</span>
            </div>
          )}
          {plan.features.sla && (
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-success flex-shrink-0" />
              <span className="text-small-text">99.9% uptime sla</span>
            </div>
          )}
        </div>

        <Button
          size="lg"
          className="w-full"
          variant={plan.popular ? "default" : "secondary"}
          onClick={() => onSelect(plan.tier)}
        >
          {plan.cta}
        </Button>
      </CardContent>
    </Card>
  );
};
