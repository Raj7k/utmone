import { Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CONFIG, FEATURE_CATEGORIES, PlanTier } from "@/lib/planConfig";
import { ADDONS_CONFIG, formatAddonPrice } from "@/lib/addonsConfig";
import { useState } from "react";
import { 
  getAnnualDiscountedPrice, 
  getAnnualSavings as getAnnualSavingsFromConfig,
  getMaxAnnualDiscount,
  BillingCycle
} from "@/lib/discountConfig";

interface PricingTableProps {
  onSelect: (tier: string) => void;
}

export const PricingTable = ({ onSelect }: PricingTableProps) => {
  const plans = [
    PLAN_CONFIG.free,
    PLAN_CONFIG.starter,
    PLAN_CONFIG.growth,
    PLAN_CONFIG.business,
  ];

  const [selectedTab, setSelectedTab] = useState<PlanTier>('growth');
  const [billingPeriod, setBillingPeriod] = useState<BillingCycle>('monthly');

  const getPrice = (plan: typeof plans[0]) => {
    if (plan.price === 'custom') return 'custom';
    const basePrice = plan.price;
    
    if (billingPeriod === 'monthly' || basePrice === 0) {
      return basePrice;
    }
    
    // Use dynamic discount config
    return getAnnualDiscountedPrice(plan.tier, basePrice);
  };

  const getAnnualSavings = (tier: PlanTier) => {
    const plan = PLAN_CONFIG[tier];
    if (plan.price === 'custom' || plan.price === 0) return 0;
    return getAnnualSavingsFromConfig(tier, plan.price);
  };

  const maxDiscount = getMaxAnnualDiscount();

  const formatValue = (value: boolean | string | number) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-primary mx-auto" />
      ) : (
        <Minus className="w-4 h-4 text-muted-foreground/40 mx-auto" />
      );
    }
    
    if (value === 'unlimited') {
      return <span className="font-medium text-foreground">unlimited</span>;
    }
    
    return <span>{value}</span>;
  };

  return (
    <>
      {/* Billing Period Toggle */}
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
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            annual
          </button>
        </div>
        
        <div 
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-200 ${
            billingPeriod === 'annual' 
              ? 'bg-primary/10 border border-primary/20' 
              : 'bg-transparent'
          }`}
        >
          <Check className={`w-4 h-4 transition-colors ${billingPeriod === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`} />
          <span className={`text-xs font-medium transition-colors ${billingPeriod === 'annual' ? 'text-foreground' : 'text-muted-foreground'}`}>
            save up to {maxDiscount}% with annual billing
          </span>
        </div>
      </div>

      {/* Desktop Grid View - 4 Columns */}
      <div className="hidden lg:block relative">
        {/* MOST POPULAR Badge */}
        <div className="absolute -top-4 z-20" style={{ left: '37.5%', transform: 'translateX(-50%)' }}>
          <span className="rounded-full text-[10px] px-3 py-1 uppercase tracking-wide font-semibold shadow-sm bg-primary text-primary-foreground">
            most popular
          </span>
        </div>

        <div className="border border-border rounded-2xl overflow-hidden bg-card">
          {/* Header Row: Plan Names & Prices */}
          <div className="grid grid-cols-5 divide-x divide-border border-b border-border">
            <div className="p-6">
              <p className="text-sm text-muted-foreground font-medium">choose your plan</p>
            </div>
            
            {plans.map((plan) => (
              <div key={plan.tier} className={`p-6 space-y-2 ${plan.tier === 'growth' ? 'bg-primary/5' : ''}`}>
                <h3 className="text-xl font-display font-bold text-foreground">
                  {plan.name}
                </h3>
                
                <div className="space-y-1">
                  {plan.price === 'custom' ? (
                    <div className="text-2xl font-display font-bold text-foreground">custom</div>
                  ) : (
                    <div className="text-3xl font-display font-bold text-foreground">
                      ${getPrice(plan)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {plan.price === 'custom' ? 'contact us' : `/${billingPeriod === 'annual' ? 'mo, billed annually' : 'month'}`}
                  </div>
                  {billingPeriod === 'annual' && plan.tier !== 'free' && plan.tier !== 'enterprise' && getAnnualSavings(plan.tier) > 0 && (
                    <div className="text-xs font-medium text-primary">
                      save ${getAnnualSavings(plan.tier)}/year
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons Row */}
          <div className="grid grid-cols-5 divide-x divide-border border-b border-border">
            <div className="p-6"></div>
            
            {plans.map((plan) => (
              <div key={`cta-${plan.tier}`} className={`p-6 ${plan.tier === 'growth' ? 'bg-primary/5' : ''}`}>
                <Button
                  size="lg"
                  onClick={() => onSelect(plan.tier)}
                  variant={plan.tier === 'growth' ? 'default' : 'outline'}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* Feature Categories */}
          {FEATURE_CATEGORIES.map((category) => (
            <div key={category.name}>
              {/* Category Header */}
              <div className="grid grid-cols-5 divide-x divide-border border-b border-border bg-muted/30">
                <div className="py-3 px-6">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    {category.name}
                  </span>
                </div>
                {plans.map((plan) => (
                  <div key={`${plan.tier}-header`} className={`py-3 px-6 ${plan.tier === 'growth' ? 'bg-primary/5' : ''}`} />
                ))}
              </div>

              {/* Feature Rows */}
              {category.features.map((feature) => (
                <div 
                  key={feature.key}
                  className="grid grid-cols-5 divide-x divide-border border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="py-3 px-6 text-left">
                    <span className="text-sm text-foreground">{feature.label}</span>
                  </div>
                  
                  {(['free', 'starter', 'growth', 'business'] as PlanTier[]).map((tier) => (
                    <div 
                      key={`${tier}-${feature.key}`}
                      className={`py-3 px-6 text-center flex items-center justify-center ${tier === 'growth' ? 'bg-primary/5' : ''}`}
                    >
                      <span className="text-sm text-muted-foreground">
                        {formatValue(feature[tier])}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile/Tablet Tabbed View */}
      <div className="lg:hidden space-y-6">
        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg overflow-x-auto">
          {plans.map((plan) => (
            <button
              key={plan.tier}
              onClick={() => setSelectedTab(plan.tier)}
              className={`flex-1 min-w-[80px] py-2 px-3 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
                selectedTab === plan.tier
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {plan.name}
            </button>
          ))}
        </div>

        {/* Selected Plan Content */}
        {plans.filter(plan => plan.tier === selectedTab).map((plan) => (
          <div key={plan.tier} className="relative">
            {plan.tier === 'growth' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <span className="rounded-full text-[10px] px-3 py-1 uppercase tracking-wide font-semibold shadow-sm bg-primary text-primary-foreground">
                  most popular
                </span>
              </div>
            )}
            <div className="border border-border rounded-2xl overflow-hidden bg-card">
              {/* Plan Header */}
              <div className="p-6 space-y-4 border-b border-border">
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {plan.name}
                </h3>
                
                <div className="space-y-1">
                  {plan.price === 'custom' ? (
                    <div className="text-3xl font-display font-bold text-foreground">custom</div>
                  ) : (
                    <div className="text-4xl font-display font-bold text-foreground">
                      ${getPrice(plan)}
                    </div>
                  )}
                  <div className="text-sm text-muted-foreground">
                    {plan.price === 'custom' ? 'contact us for pricing' : `/${billingPeriod === 'annual' ? 'mo, billed annually' : 'month'}`}
                  </div>
                  {billingPeriod === 'annual' && plan.tier !== 'free' && plan.tier !== 'enterprise' && getAnnualSavings(plan.tier) > 0 && (
                    <div className="text-xs font-medium text-primary">
                      save ${getAnnualSavings(plan.tier)}/year
                    </div>
                  )}
                </div>

                <Button
                  size="lg"
                  onClick={() => onSelect(plan.tier)}
                  className="w-full"
                >
                  {plan.cta}
                </Button>
              </div>

              {/* Feature Categories */}
              {FEATURE_CATEGORIES.map((category) => (
                <div key={category.name}>
                  <div className="py-3 px-6 bg-muted/30 border-b border-border">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      {category.name}
                    </span>
                  </div>
                  {category.features.map((feature) => (
                    <div 
                      key={feature.key}
                      className="py-3 px-6 flex items-center justify-between border-b border-border last:border-b-0"
                    >
                      <span className="text-sm text-foreground">{feature.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {formatValue(feature[plan.tier as keyof typeof feature] as boolean | string | number)}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Enterprise CTA Section */}
      <div className="mt-16">
        <div className="border border-border rounded-2xl p-8 bg-card/50 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl font-display font-bold mb-2">need enterprise-grade features?</h2>
              <p className="text-muted-foreground max-w-xl">
                unlimited links, SSO, audit logs, dedicated support, custom SLAs, and more.
              </p>
            </div>
            <Button
              size="lg"
              variant="outline"
              onClick={() => onSelect('enterprise')}
              className="whitespace-nowrap"
            >
              contact sales
            </Button>
          </div>
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-display font-bold mb-2">need more?</h2>
          <p className="text-muted-foreground">
            add extra capacity or features to your starter, growth, or business plan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADDONS_CONFIG.map((addon) => (
            <div
              key={addon.key}
              className="border border-border rounded-xl p-4 bg-card hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-foreground">{addon.name}</h3>
                <span className="text-sm font-semibold text-primary">
                  {formatAddonPrice(addon)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{addon.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
