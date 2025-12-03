import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CONFIG } from "@/lib/planConfig";
import { useState } from "react";

type BillingPeriod = 'monthly' | 'annual';

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
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');

  const getPrice = (plan: typeof plans[0]) => {
    const basePrice = typeof plan.price === 'number' ? plan.price : 0;
    
    if (billingPeriod === 'monthly' || basePrice === 0) {
      return basePrice;
    }
    // Annual discounts
    if (plan.tier === 'pro') {
      return Math.round(basePrice * 0.85); // 15% off → $17
    }
    if (plan.tier === 'business') {
      return Math.round(basePrice * 0.80); // 20% off → $79
    }
    return basePrice;
  };

  const getAnnualSavings = (tier: string) => {
    if (tier === 'pro') {
      return (20 * 12) - (17 * 12); // $36/year
    }
    if (tier === 'business') {
      return (99 * 12) - (79 * 12); // $240/year
    }
    return 0;
  };

  const formatValue = (value: any, type?: string) => {
    if (type === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-system-green mx-auto" />
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
        return <span className="text-primary font-medium">unlimited</span>;
      }
      return value;
    }
    
    return value?.toString() || '—';
  };

  // Badge is now rendered outside the table structure

  return (
    <>
      {/* Billing Period Toggle - Segmented Control */}
      <div className="flex flex-col items-center justify-center gap-3 mb-12">
        <div className="inline-flex items-center bg-muted/50 border border-border rounded-full p-1">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              billingPeriod === 'monthly'
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            monthly
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
              billingPeriod === 'annual'
                ? 'bg-blazeOrange text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            annual
          </button>
        </div>
        
        {/* Savings badge - always visible but styled differently */}
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-200 ${
          billingPeriod === 'annual'
            ? 'bg-primary/10 border border-primary/20'
            : 'bg-transparent'
        }`}>
          <svg className={`w-4 h-4 transition-colors ${
            billingPeriod === 'annual' ? 'text-primary' : 'text-muted-foreground'
          }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className={`text-xs font-medium transition-colors ${
            billingPeriod === 'annual' ? 'text-primary' : 'text-muted-foreground'
          }`}>
            save up to 20% with annual billing
          </span>
        </div>
      </div>

      {/* Desktop Grid View - Wrapper with badge */}
      <div className="hidden md:block relative">
        {/* MOST POPULAR Badge - Floating above table */}
        <div className="absolute -top-4 z-20" style={{ left: '62.5%', transform: 'translateX(-50%)' }}>
          <span className="bg-primary text-white rounded-full text-[10px] px-3 py-1 uppercase tracking-wide font-semibold shadow-sm">
            most popular
          </span>
        </div>

        {/* Table Structure */}
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-xl">
          {/* Header Row 1: Plan Names & Prices */}
          <div className="grid grid-cols-4 divide-x divide-white/10 border-b border-white/10">
            {/* Column 1: Label */}
            <div className="p-6">
              <p className="text-sm text-muted-foreground font-medium">choose your plan</p>
            </div>
            
            {/* Columns 2-4: Plan Names & Prices */}
            {plans.slice(0, 3).map((plan) => (
              <div key={plan.tier} className="p-6 space-y-2">
                <h3 className="text-xl font-display font-bold text-foreground brand-lowercase">
                  {plan.name}
                </h3>
                
                <div className="space-y-1">
                  <div className="text-3xl font-display font-bold text-foreground">
                    {plan.price === 0 ? '$0' : `$${getPrice(plan)}`}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    /{billingPeriod === 'annual' ? 'month, billed annually' : 'monthly'}
                  </div>
                  {billingPeriod === 'annual' && plan.tier !== 'free' && plan.tier !== 'enterprise' && (
                    <div className="text-xs text-primary font-medium">
                      save ${getAnnualSavings(plan.tier)}/year
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Header Row 2: CTA Buttons - All Aligned */}
          <div className="grid grid-cols-4 divide-x divide-white/10 border-b border-white/10">
            {/* Column 1: Empty */}
            <div className="p-6"></div>
            
            {/* Columns 2-4: CTA Buttons */}
            {plans.slice(0, 3).map((plan) => (
              <div key={`cta-${plan.tier}`} className="p-6">
                <Button
                  size="lg"
                  onClick={() => onSelect(plan.tier)}
                  className="w-full brand-lowercase bg-blazeOrange text-white hover:bg-blazeOrange/90"
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
            className="grid grid-cols-4 divide-x divide-white/10 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
          >
            {/* Column 1: Feature Name */}
            <div className="py-4 px-6 text-left">
              <span className="text-sm text-white font-medium">{feature.label}</span>
            </div>
            
            {/* Columns 2-4: Feature Values */}
            {plans.slice(0, 3).map((plan) => (
              <div 
                key={`${plan.tier}-${feature.key}`}
                className="py-4 px-6 text-center flex items-center justify-center"
              >
                <span className="text-sm text-white/70">
                  {formatValue((plan.features as any)[feature.key], feature.type)}
                </span>
              </div>
            ))}
          </div>
        ))}
        
          {/* Enterprise Row */}
          <div className="bg-white/5 p-6 text-center border-t border-white/10">
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
      </div>

      {/* Mobile Tabbed View */}
      <div className="md:hidden space-y-6">
        {/* Tabs */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-lg">
          {plans.slice(0, 3).map((plan) => (
            <button
              key={plan.tier}
              onClick={() => setSelectedTab(plan.tier as any)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors brand-lowercase ${
                selectedTab === plan.tier
                  ? 'bg-zinc-900 text-white shadow-sm'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Selected Plan Content */}
        {plans.slice(0, 3).filter(plan => plan.tier === selectedTab).map((plan) => (
          <div key={plan.tier} className="relative">
            {/* Badge for mobile */}
            {plan.tier === 'pro' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="bg-primary text-white rounded-full text-[10px] px-3 py-1 uppercase tracking-wide font-semibold shadow-sm">
                  most popular
                </span>
              </div>
            )}
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-zinc-900/40 backdrop-blur-xl">
            {/* Plan Header */}
            <div className="p-6 space-y-4 border-b border-white/10">
              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-foreground brand-lowercase">
                  {plan.name}
                </h3>
              </div>
              
              <div className="space-y-1">
                <div className="text-4xl font-display font-bold text-foreground">
                  {plan.price === 0 ? '$0' : `$${getPrice(plan)}`}
                </div>
                <div className="text-sm text-muted-foreground">
                  /{billingPeriod === 'annual' ? 'month, billed annually' : 'monthly'}
                </div>
                {billingPeriod === 'annual' && plan.tier !== 'free' && plan.tier !== 'enterprise' && (
                  <div className="text-xs text-primary font-medium">
                    save ${getAnnualSavings(plan.tier)}/year
                  </div>
                )}
              </div>

              <Button
                size="lg"
                onClick={() => onSelect(plan.tier)}
                className="w-full brand-lowercase bg-blazeOrange text-white hover:bg-blazeOrange/90"
              >
                {plan.cta}
              </Button>
            </div>

            {/* Features List */}
            <div className="divide-y divide-white/10">
              {PRICING_FEATURES.map((feature) => (
                <div 
                  key={feature.key}
                  className="py-4 px-6 flex items-center justify-between"
                >
                  <span className="text-sm text-white font-medium">{feature.label}</span>
                  <span className="text-sm text-white/70">
                    {formatValue((plan.features as any)[feature.key], feature.type)}
                  </span>
                </div>
              ))}
            </div>
            </div>
          </div>
        ))}
        
        {/* Enterprise Card */}
        <div className="border border-white/10 rounded-2xl p-6 bg-white/5 text-center space-y-4">
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
