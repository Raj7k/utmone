import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CONFIG } from "@/lib/planConfig";

interface PricingTableProps {
  onSelect: (tier: string) => void;
}

const PRICING_FEATURES = [
  { key: 'monthlyLinks', label: 'monthly links' },
  { key: 'customDomains', label: 'custom domains' },
  { key: 'monthlyClicks', label: 'monthly clicks' },
  { key: 'analyticsRetentionDays', label: 'analytics retention' },
  { key: 'teamMembers', label: 'team members' },
  { key: 'apiAccess', label: 'api access', type: 'boolean' },
  { key: 'prioritySupport', label: 'priority support', type: 'boolean' },
  { key: 'whiteLabel', label: 'white-label branding', type: 'boolean' },
  { key: 'sso', label: 'sso (saml/oauth)', type: 'boolean' },
  { key: 'sla', label: '99.9% uptime sla', type: 'boolean' },
  { key: 'qrMonthlyLimit', label: 'qr codes/month' },
  { key: 'canRemoveQRWatermark', label: 'remove qr watermark', type: 'boolean' },
  { key: 'canExportSVG', label: 'svg/pdf export', type: 'boolean' },
];

export const PricingTable = ({ onSelect }: PricingTableProps) => {
  const plans = [
    PLAN_CONFIG.free,
    PLAN_CONFIG.pro,
    PLAN_CONFIG.business,
    PLAN_CONFIG.enterprise,
  ];

  const formatValue = (value: any, type?: string) => {
    if (type === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/50 mx-auto" />
      );
    }
    
    if (typeof value === 'number') {
      if (value === Infinity || value === -1) return 'unlimited';
      if (value >= 1000000) return `${(value / 1000000).toFixed(0)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
      return value.toString();
    }
    
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('unlimited')) {
        return <span className="text-green-500">unlimited</span>;
      }
      return value;
    }
    
    return value?.toString() || '—';
  };

  const getBadge = (tier: string) => {
    if (tier === 'pro') {
      return (
        <span className="inline-block px-3 py-1 bg-primary/20 text-primary text-xs font-semibold rounded-full">
          most popular
        </span>
      );
    }
    if (tier === 'enterprise') {
      return (
        <span className="inline-block px-3 py-1 bg-accent/20 text-accent-foreground text-xs font-semibold rounded-full">
          recommended
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Plan Headers */}
          <thead>
            <tr className="border-b border-border">
              <th className="w-1/5 p-6 text-left align-top">
                {/* Empty corner cell */}
              </th>
              {plans.map((plan, idx) => (
                <th 
                  key={plan.tier}
                  className={`w-1/5 p-6 align-top ${
                    plan.tier === 'pro' ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-title-3 font-display font-bold text-label brand-lowercase">
                        {plan.name}
                      </h3>
                      {getBadge(plan.tier)}
                      <p className="text-caption-apple text-secondary-label">
                        {plan.description}
                      </p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-4xl font-display font-bold text-label">
                        {plan.price === 0 ? '$0' : `$${plan.price}`}
                      </div>
                      <div className="text-caption-apple text-secondary-label">
                        {plan.billingPeriod === 'lifetime' ? 'one-time' : `/${plan.billingPeriod}`}
                      </div>
                    </div>

                    <Button
                      variant={plan.price === 0 ? "outline" : "marketing"}
                      size="lg"
                      onClick={() => onSelect(plan.tier)}
                      className="w-full brand-lowercase"
                    >
                      {plan.cta}
                    </Button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Feature Rows */}
          <tbody>
            {PRICING_FEATURES.map((feature, idx) => (
              <tr 
                key={feature.key}
                className={`border-b border-border/50 ${
                  idx % 2 === 0 ? 'bg-muted/30' : ''
                }`}
              >
                <td className="py-4 px-6 text-body-apple text-label font-medium">
                  {feature.label}
                </td>
                {plans.map((plan) => (
                  <td 
                    key={`${plan.tier}-${feature.key}`}
                    className={`py-4 px-6 text-center text-body-apple text-label ${
                      plan.tier === 'pro' ? 'bg-primary/5' : ''
                    }`}
                  >
                    {formatValue((plan.features as any)[feature.key], feature.type)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
