import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CONFIG } from "@/lib/planConfig";
import { useState } from "react";

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

  const [selectedTab, setSelectedTab] = useState<'free' | 'pro' | 'business'>('pro');

  const formatValue = (value: any, type?: string) => {
    if (type === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
      ) : (
        <span className="text-muted-foreground/40">—</span>
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
        return <span className="text-emerald-600 font-medium">unlimited</span>;
      }
      return value;
    }
    
    return value?.toString() || '—';
  };

  const getBadge = (tier: string) => {
    if (tier === 'pro') {
      return (
        <span className="border border-emerald-500 text-emerald-600 rounded-full text-[10px] px-2 py-0.5 uppercase tracking-wide font-semibold">
          most popular
        </span>
      );
    }
    return null;
  };

  return (
    <>
      {/* Desktop Grid View */}
      <div className="hidden md:block border border-gray-200 rounded-2xl overflow-hidden bg-white">
        {/* Header Row */}
        <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
          {/* Column 1: Empty or Label */}
          <div className="p-6">
            <p className="text-sm text-muted-foreground font-medium">choose your plan</p>
          </div>
          
          {/* Columns 2-4: Plan Headers */}
          {plans.slice(0, 3).map((plan) => (
            <div key={plan.tier} className="p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-display font-bold text-foreground brand-lowercase">
                  {plan.name}
                </h3>
                {getBadge(plan.tier)}
              </div>
              
              <div className="space-y-1">
                <div className="text-3xl font-display font-bold text-foreground">
                  {plan.price === 0 ? '$0' : `$${plan.price}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  /{plan.billingPeriod}
                </div>
              </div>

              <Button
                variant={plan.price === 0 ? "outline" : "default"}
                size="lg"
                onClick={() => onSelect(plan.tier)}
                className={`w-full brand-lowercase ${
                  plan.price === 0 
                    ? 'bg-white border-gray-200 text-foreground hover:bg-gray-50' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* Feature Rows */}
        {PRICING_FEATURES.map((feature) => (
          <div 
            key={feature.key}
            className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
          >
            {/* Column 1: Feature Name */}
            <div className="py-4 px-6 text-left">
              <span className="text-sm text-gray-900 font-medium">{feature.label}</span>
            </div>
            
            {/* Columns 2-4: Feature Values */}
            {plans.slice(0, 3).map((plan) => (
              <div 
                key={`${plan.tier}-${feature.key}`}
                className="py-4 px-6 text-center flex items-center justify-center"
              >
                <span className="text-sm text-gray-700">
                  {formatValue((plan.features as any)[feature.key], feature.type)}
                </span>
              </div>
            ))}
          </div>
        ))}
        
        {/* Enterprise Row */}
        <div className="bg-gray-50 p-6 text-center border-t border-gray-200">
          <div className="space-y-3">
            <h3 className="text-lg font-display font-bold text-foreground brand-lowercase">
              enterprise
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              custom pricing with unlimited everything, dedicated support, and white-label options.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onSelect('enterprise')}
              className="brand-lowercase"
            >
              contact sales
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Tabbed View */}
      <div className="md:hidden space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {plans.slice(0, 3).map((plan) => (
            <button
              key={plan.tier}
              onClick={() => setSelectedTab(plan.tier as any)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors brand-lowercase ${
                selectedTab === plan.tier
                  ? 'bg-white text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Selected Plan Content */}
        {plans.slice(0, 3).filter(plan => plan.tier === selectedTab).map((plan) => (
          <div key={plan.tier} className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
            {/* Plan Header */}
            <div className="p-6 space-y-4 border-b border-gray-100">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground brand-lowercase">
                  {plan.name}
                </h3>
                {getBadge(plan.tier)}
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl font-display font-bold text-foreground">
                  {plan.price === 0 ? '$0' : `$${plan.price}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  /{plan.billingPeriod}
                </div>
              </div>

              <Button
                variant={plan.price === 0 ? "outline" : "default"}
                size="lg"
                onClick={() => onSelect(plan.tier)}
                className={`w-full brand-lowercase ${
                  plan.price === 0 
                    ? 'bg-white border-gray-200 text-foreground hover:bg-gray-50' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {plan.cta}
              </Button>
            </div>

            {/* Features List */}
            <div className="divide-y divide-gray-100">
              {PRICING_FEATURES.map((feature) => (
                <div 
                  key={feature.key}
                  className="py-4 px-6 flex items-center justify-between"
                >
                  <span className="text-sm text-gray-900 font-medium">{feature.label}</span>
                  <span className="text-sm text-gray-700">
                    {formatValue((plan.features as any)[feature.key], feature.type)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* Enterprise Card */}
        <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50 text-center space-y-4">
          <h3 className="text-xl font-display font-bold text-foreground brand-lowercase">
            enterprise
          </h3>
          <p className="text-sm text-muted-foreground">
            custom pricing with unlimited everything, dedicated support, and white-label options.
          </p>
          <Button
            variant="outline"
            size="lg"
            onClick={() => onSelect('enterprise')}
            className="w-full brand-lowercase"
          >
            contact sales
          </Button>
        </div>
      </div>
    </>
  );
};
