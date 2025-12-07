import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { checkPlanLimits } from "@/lib/planEnforcement";
import { PLAN_CONFIG, PLAN_HIERARCHY, PlanTier, FEATURE_CATEGORIES } from "@/lib/planConfig";
import { 
  getAnnualDiscountedPrice, 
  getAnnualSavings, 
  getAnnualDiscountForTier,
  validatePromoCode,
  getActivePromotions,
  BillingCycle,
  getMaxAnnualDiscount,
} from "@/lib/discountConfig";
import { getAddonsForTier, formatAddonPrice, Addon } from "@/lib/addonsConfig";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2, Check, X, Sparkles, Plus, Tag, Percent } from "lucide-react";
import confetti from "canvas-confetti";
import { UsageForecastWidget } from "@/components/workspace/UsageForecastWidget";
import type { UsageDataPoint } from "@/lib/optimizations/usageForecasting";

// Dynamic badge styles from plan config
const getPlanBadgeStyles = (tier: PlanTier): string => {
  const styles: Record<PlanTier, string> = {
    free: 'bg-muted/50 text-muted-foreground',
    starter: 'bg-blue-500/10 text-blue-500 dark:bg-blue-400/10 dark:text-blue-400',
    growth: 'bg-green-500/10 text-green-500 dark:bg-green-400/10 dark:text-green-400',
    business: 'bg-purple-500/10 text-purple-500 dark:bg-purple-400/10 dark:text-purple-400',
    enterprise: 'bg-amber-500/10 text-amber-500 dark:bg-amber-400/10 dark:text-amber-400',
  };
  return styles[tier];
};

export default function BillingSettings() {
  const { currentWorkspace } = useWorkspace();
  const { id: currentPlanId } = useCurrentPlan();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);
  const [pendingDowngradeTier, setPendingDowngradeTier] = useState<PlanTier | null>(null);
  
  // Billing cycle toggle state
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  
  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<ReturnType<typeof validatePromoCode>>(null);
  const [promoError, setPromoError] = useState('');

  const { data: limits, isLoading } = useQuery({
    queryKey: ["plan-limits", currentWorkspace?.id, currentPlanId],
    enabled: !!currentWorkspace?.id,
    queryFn: async () => {
      if (!currentWorkspace?.id) throw new Error("No workspace");
      const simulatedPlan = localStorage.getItem('SIMULATED_PLAN');
      return checkPlanLimits(currentWorkspace.id, simulatedPlan as PlanTier | undefined);
    },
  });

  // Fetch usage history for forecasting
  const { data: usageHistory } = useQuery({
    queryKey: ["usage-history", currentWorkspace?.id],
    enabled: !!currentWorkspace?.id,
    queryFn: async () => {
      if (!currentWorkspace?.id) throw new Error("No workspace");
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data, error } = await supabase
        .from("links")
        .select("created_at")
        .eq("workspace_id", currentWorkspace.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      
      const countsByDay = new Map<string, number>();
      data?.forEach(link => {
        const date = new Date(link.created_at).toISOString().split('T')[0];
        countsByDay.set(date, (countsByDay.get(date) || 0) + 1);
      });
      
      const usageData: UsageDataPoint[] = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        usageData.push({
          date: new Date(dateStr),
          count: countsByDay.get(dateStr) || 0,
        });
      }
      
      return usageData;
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (newPlanTier: PlanTier) => {
      if (!currentWorkspace?.id) throw new Error("No workspace");
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { error } = await supabase
        .from('workspaces')
        .update({ plan_tier: newPlanTier as any })
        .eq('id', currentWorkspace.id);
      
      if (error) throw error;
      return newPlanTier;
    },
    onSuccess: async (newPlanTier) => {
      await queryClient.invalidateQueries({ queryKey: ["plan-limits"] });
      await queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      const planName = PLAN_CONFIG[newPlanTier].name;
      toast({
        title: `🎉 Welcome to ${planName}!`,
        description: "Your plan has been upgraded successfully.",
      });
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Upgrade failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsProcessing(false);
    },
  });

  const isDowngrade = (newTier: PlanTier) => {
    if (!limits) return false;
    const currentLevel = PLAN_HIERARCHY[limits.planTier as PlanTier];
    const newLevel = PLAN_HIERARCHY[newTier];
    return newLevel < currentLevel;
  };

  const handleUpgrade = (newPlanTier: PlanTier) => {
    setIsProcessing(true);
    upgradeMutation.mutate(newPlanTier);
  };

  const handlePlanChange = (tier: PlanTier) => {
    if (isDowngrade(tier)) {
      setPendingDowngradeTier(tier);
      setShowDowngradeConfirm(true);
    } else {
      handleUpgrade(tier);
    }
  };

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoCode.trim()) return;
    
    const promo = validatePromoCode(promoCode, 'growth', billingCycle);
    if (promo) {
      setAppliedPromo(promo);
      toast({
        title: "Promo code applied!",
        description: promo.description || `${promo.value}% off applied`,
      });
    } else {
      setPromoError('Invalid or expired promo code');
      setAppliedPromo(null);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
    setPromoError('');
  };

  // Get display price based on billing cycle
  const getDisplayPrice = (tier: PlanTier, basePrice: number | 'custom'): string => {
    if (basePrice === 'custom') return 'Custom';
    if (basePrice === 0) return 'Free';
    
    if (billingCycle === 'annual') {
      const discounted = getAnnualDiscountedPrice(tier, basePrice);
      return `$${discounted}`;
    }
    return `$${basePrice}`;
  };

  const planConfig = limits ? PLAN_CONFIG[limits.planTier as PlanTier] : null;
  const daysUntilReset = 30 - new Date().getDate();
  const maxDiscount = getMaxAnnualDiscount();
  const activePromotions = getActivePromotions();
  const availableAddons = limits ? getAddonsForTier(limits.planTier as PlanTier) : [];

  const calculatePercentage = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getButtonState = (tier: PlanTier) => {
    if (!limits) return { disabled: true, text: "Loading..." };
    
    const currentLevel = PLAN_HIERARCHY[limits.planTier as PlanTier];
    const tierLevel = PLAN_HIERARCHY[tier];
    
    if (currentLevel === tierLevel) {
      return { disabled: true, text: "Current Plan", variant: "outline" as const };
    } else if (tierLevel > currentLevel) {
      return { disabled: false, text: `Upgrade to ${PLAN_CONFIG[tier].name}`, variant: "default" as const };
    } else {
      return { disabled: false, text: `Downgrade to ${PLAN_CONFIG[tier].name}`, variant: "outline" as const };
    }
  };

  // All 5 plan tiers
  const planTiers: PlanTier[] = ['free', 'starter', 'growth', 'business', 'enterprise'];

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Current Usage Card */}
        {limits && planConfig && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl font-display">current plan</CardTitle>
                    <Badge className={`capitalize mt-1 ${getPlanBadgeStyles(limits.planTier as PlanTier)}`}>
                      {planConfig.name}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">resets in</p>
                  <p className="text-lg font-semibold">{daysUntilReset} days</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Links Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">links used</span>
                  <span className="font-medium">
                    {limits.currentUsage.linksThisMonth} / {
                      typeof limits.limits.monthlyLinks === 'number' 
                        ? limits.limits.monthlyLinks 
                        : 'Unlimited'
                    }
                  </span>
                </div>
                {typeof limits.limits.monthlyLinks === 'number' ? (
                  <Progress 
                    value={calculatePercentage(limits.currentUsage.linksThisMonth, limits.limits.monthlyLinks)} 
                    className="h-2"
                  />
                ) : (
                  <div className="h-2 bg-muted/30 rounded-full" />
                )}
              </div>

              {/* Clicks Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">clicks this month</span>
                  <span className="font-medium">
                    {limits.currentUsage.clicksThisMonth.toLocaleString()} / {
                      typeof limits.limits.monthlyClicks === 'number' 
                        ? limits.limits.monthlyClicks.toLocaleString() 
                        : 'Unlimited'
                    }
                  </span>
                </div>
                {typeof limits.limits.monthlyClicks === 'number' ? (
                  <Progress 
                    value={calculatePercentage(limits.currentUsage.clicksThisMonth, limits.limits.monthlyClicks)} 
                    className="h-2"
                  />
                ) : (
                  <div className="h-2 bg-muted/30 rounded-full" />
                )}
              </div>

              {/* Custom Domains Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">custom domains</span>
                  <span className="font-medium">
                    {limits.currentUsage.customDomains} / {
                      typeof limits.limits.customDomains === 'number' 
                        ? limits.limits.customDomains 
                        : 'Unlimited'
                    }
                  </span>
                </div>
                {typeof limits.limits.customDomains === 'number' ? (
                  <Progress 
                    value={calculatePercentage(limits.currentUsage.customDomains, limits.limits.customDomains)} 
                    className="h-2"
                  />
                ) : (
                  <div className="h-2 bg-muted/30 rounded-full" />
                )}
              </div>

              {/* Current Plan Features */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-3">what's included</p>
                <div className="grid grid-cols-2 gap-2">
                  {FEATURE_CATEGORIES[0].features.slice(0, 6).map((feature) => {
                    const value = feature[limits.planTier as PlanTier];
                    const hasFeature = value === true || (typeof value === 'number' && value > 0) || (typeof value === 'string' && value !== '0');
                    return (
                      <div key={feature.key} className="flex items-center gap-2 text-sm">
                        {hasFeature ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <X className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={hasFeature ? 'text-foreground' : 'text-muted-foreground'}>
                          {feature.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Usage Forecast Widget */}
        {limits && usageHistory && typeof limits.limits.monthlyLinks === 'number' && (
          <UsageForecastWidget
            usageHistory={usageHistory}
            currentUsage={limits.currentUsage.linksThisMonth}
            limit={limits.limits.monthlyLinks}
            resourceName="Links"
            upgradeLink="/settings/billing"
          />
        )}

        {/* Billing Cycle Toggle */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setBillingCycle('monthly')}
            >
              monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-full px-6"
              onClick={() => setBillingCycle('annual')}
            >
              annual
              {maxDiscount > 0 && (
                <Badge className="ml-2 bg-green-500/10 text-green-500 border-0">
                  save up to {maxDiscount}%
                </Badge>
              )}
            </Button>
          </div>
          {billingCycle === 'annual' && (
            <p className="text-sm text-muted-foreground">
              billed annually. cancel anytime.
            </p>
          )}
        </div>

        {/* Active Promotions Banner */}
        {activePromotions.length > 0 && (
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{activePromotions[0].badge}</p>
                  <p className="text-sm text-muted-foreground">{activePromotions[0].description}</p>
                </div>
                <Badge className="ml-auto">{activePromotions[0].code}</Badge>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Promo Code Input */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              promo code
            </CardTitle>
          </CardHeader>
          <CardContent>
            {appliedPromo ? (
              <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <span className="font-medium">{appliedPromo.code}</span>
                  <span className="text-sm text-muted-foreground">
                    - {appliedPromo.value}% off
                  </span>
                </div>
                <Button variant="ghost" size="sm" onClick={handleRemovePromo}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className={promoError ? 'border-destructive' : ''}
                />
                <Button onClick={handleApplyPromo} variant="outline">
                  apply
                </Button>
              </div>
            )}
            {promoError && (
              <p className="text-sm text-destructive mt-2">{promoError}</p>
            )}
          </CardContent>
        </Card>

        {/* Available Plans Grid - All 5 Tiers */}
        <div>
          <h3 className="text-lg font-display font-semibold mb-4">available plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {planTiers.map((tier) => {
              const plan = PLAN_CONFIG[tier];
              const buttonState = getButtonState(tier);
              const isCurrentPlan = limits?.planTier === tier;
              const basePrice = plan.price;
              const displayPrice = getDisplayPrice(tier, basePrice);
              const annualDiscount = getAnnualDiscountForTier(tier);
              const annualSavings = typeof basePrice === 'number' ? getAnnualSavings(tier, basePrice) : 0;
              
              return (
                <Card
                  key={tier}
                  className={`flex flex-col transition-all ${
                    plan.popular ? 'border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]' : ''
                  } ${isCurrentPlan ? 'opacity-60' : 'hover:shadow-md'}`}
                >
                  <CardHeader className="pb-2 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-display capitalize">{plan.name}</CardTitle>
                      {plan.popular && (
                        <Badge className="bg-primary text-primary-foreground">popular</Badge>
                      )}
                    </div>
                    
                    <div className="mt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold">{displayPrice}</span>
                        {typeof basePrice === 'number' && basePrice > 0 && (
                          <span className="text-sm text-muted-foreground">/mo</span>
                        )}
                      </div>
                      
                      {billingCycle === 'annual' && annualDiscount && typeof basePrice === 'number' && basePrice > 0 && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-muted-foreground line-through">
                            ${basePrice}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            save ${annualSavings}/yr
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardDescription className="text-xs mt-2">{plan.description}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col">
                    <div className="space-y-2 text-sm flex-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">links</span>
                        <span className="font-medium">
                          {typeof plan.features.monthlyLinks === 'number' 
                            ? plan.features.monthlyLinks.toLocaleString() 
                            : '∞'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">domains</span>
                        <span className="font-medium">
                          {typeof plan.features.customDomains === 'number' 
                            ? plan.features.customDomains 
                            : '∞'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">clicks</span>
                        <span className="font-medium">
                          {typeof plan.features.monthlyClicks === 'number' 
                            ? (plan.features.monthlyClicks >= 1000000 
                                ? `${plan.features.monthlyClicks / 1000000}M`
                                : plan.features.monthlyClicks >= 1000 
                                  ? `${plan.features.monthlyClicks / 1000}K`
                                  : plan.features.monthlyClicks)
                            : '∞'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">team</span>
                        <span className="font-medium">
                          {typeof plan.features.teamMembers === 'number' 
                            ? plan.features.teamMembers 
                            : '∞'}
                        </span>
                      </div>
                    </div>

                    <Button
                      className="w-full mt-4"
                      variant={buttonState.variant}
                      disabled={buttonState.disabled}
                      onClick={() => !buttonState.disabled && handlePlanChange(tier)}
                    >
                      {buttonState.text}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Add-ons Section */}
        {availableAddons.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Plus className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-display font-semibold">expand your plan</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              need more capacity without upgrading? add exactly what you need.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableAddons.map((addon) => (
                <Card key={addon.key} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base font-medium">{addon.name}</CardTitle>
                    <CardDescription className="text-xs">{addon.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold">${addon.price}</span>
                        <span className="text-sm text-muted-foreground">
                          /{addon.unit === 'month' ? 'mo' : `${addon.unitAmount.toLocaleString()} ${addon.unit}`}
                        </span>
                      </div>
                      <Button size="sm" variant="outline">
                        add
                      </Button>
                    </div>
                    {addon.category === 'limits' && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Percent className="h-3 w-3" />
                        <span>volume discounts available</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Processing Modal */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">processing secure payment...</h3>
            <p className="text-sm text-muted-foreground text-center">
              please wait while we upgrade your plan
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Downgrade Confirmation Dialog */}
      <AlertDialog open={showDowngradeConfirm} onOpenChange={setShowDowngradeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>confirm downgrade</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                by downgrading to <strong className="text-foreground capitalize">{pendingDowngradeTier}</strong>, you'll lose access to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>advanced analytics features</li>
                <li>additional custom domains</li>
                <li>higher monthly limits</li>
                <li>priority support</li>
              </ul>
              <p className="text-sm font-medium mt-3">
                this change takes effect immediately.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (pendingDowngradeTier) {
                  handleUpgrade(pendingDowngradeTier);
                  setShowDowngradeConfirm(false);
                }
              }}
            >
              confirm downgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
