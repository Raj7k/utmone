import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import { PLAN_CONFIG, PlanTier } from "@/lib/planConfig";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Crown, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";

const PLAN_HIERARCHY = {
  free: 0,
  pro: 1,
  business: 2,
  enterprise: 3,
  lifetime: 1,
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

  const { data: limits, isLoading } = useQuery({
    queryKey: ["plan-limits", currentWorkspace?.id, currentPlanId],
    enabled: !!currentWorkspace?.id,
    queryFn: async () => {
      if (!currentWorkspace?.id) throw new Error("No workspace");
      const simulatedPlan = localStorage.getItem('SIMULATED_PLAN');
      return checkPlanLimits(currentWorkspace.id, simulatedPlan as PlanTier | undefined);
    },
  });

  const upgradeMutation = useMutation({
    mutationFn: async (newPlanTier: PlanTier) => {
      if (!currentWorkspace?.id) throw new Error("No workspace");
      
      // Simulated processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update workspace plan
      const { error } = await supabase
        .from('workspaces')
        .update({ plan_tier: newPlanTier })
        .eq('id', currentWorkspace.id);
      
      if (error) throw error;
      return newPlanTier;
    },
    onSuccess: async (newPlanTier) => {
      // CRITICAL: Invalidate cache FIRST before any UI updates
      await queryClient.invalidateQueries({ queryKey: ["plan-limits"] });
      await queryClient.invalidateQueries({ queryKey: ["client-workspaces"] });
      
      // Wait for queries to settle
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Success celebration
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      
      const planName = PLAN_CONFIG[newPlanTier].name;
      toast({
        title: `🎉 Welcome to ${planName}!`,
        description: "Your plan has been upgraded successfully.",
      });
      
      // Force a hard reload to ensure clean state
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
    const currentLevel = PLAN_HIERARCHY[limits.planTier];
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

  const planConfig = limits ? PLAN_CONFIG[limits.planTier] : null;
  const daysUntilReset = 30 - new Date().getDate();

  const getProgressColor = (percentage: number) => {
    if (percentage < 50) return "bg-system-green";
    if (percentage < 80) return "bg-system-yellow";
    return "bg-system-red";
  };

  const calculatePercentage = (used: number, limit: number | 'unlimited') => {
    if (limit === 'unlimited') return 0;
    return Math.min((used / limit) * 100, 100);
  };

  const getPlanBadgeColor = (tier: PlanTier) => {
    switch (tier) {
      case 'free': return "bg-muted/50 text-muted-foreground";
      case 'pro': return "bg-system-blue/10 text-system-blue";
      case 'business': return "bg-purple-100 text-purple-700";
      case 'enterprise': return "bg-amber-100 text-amber-700";
      default: return "bg-muted/50 text-muted-foreground";
    }
  };

  const getButtonState = (tier: PlanTier) => {
    if (!limits) return { disabled: true, text: "Loading..." };
    
    const currentLevel = PLAN_HIERARCHY[limits.planTier];
    const tierLevel = PLAN_HIERARCHY[tier];
    
    if (currentLevel === tierLevel) {
      return { disabled: true, text: "Current Plan", variant: "outline" as const };
    } else if (tierLevel > currentLevel) {
      return { disabled: false, text: `Upgrade to ${PLAN_CONFIG[tier].name}`, variant: "default" as const };
    } else {
      return { disabled: false, text: `Downgrade to ${PLAN_CONFIG[tier].name}`, variant: "outline" as const };
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-48 bg-muted rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-80 bg-muted rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Current Usage Card */}
        {limits && planConfig && (
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-primary" />
                <div>
                  <h2 className="text-xl font-display font-semibold">Current Plan</h2>
                  <Badge className={`capitalize mt-1 ${getPlanBadgeColor(limits.planTier)}`}>
                    {planConfig.name}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Resets in</p>
                <p className="text-lg font-semibold">{daysUntilReset} days</p>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              {/* Links Usage */}
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Links Used</span>
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
                  <span className="text-muted-foreground">Clicks This Month</span>
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
                  <span className="text-muted-foreground">Custom Domains</span>
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
            </div>
          </div>
        )}

        {/* Available Plans Grid */}
        <div>
          <h3 className="text-lg font-display font-semibold mb-4">Available Plans</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(['free', 'pro', 'business', 'enterprise'] as PlanTier[]).map((tier) => {
              const plan = PLAN_CONFIG[tier];
              const buttonState = getButtonState(tier);
              const isCurrentPlan = limits?.planTier === tier;
              
              return (
                <div
                  key={tier}
                  className={`bg-card rounded-2xl border shadow-sm p-6 flex flex-col ${
                    plan.popular ? 'border-primary shadow-md scale-[1.02]' : 'border-border'
                  } ${isCurrentPlan ? 'opacity-50' : ''}`}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-display font-semibold capitalize">{plan.name}</h4>
                      {plan.popular && (
                        <Badge className="bg-system-blue text-white">Popular</Badge>
                      )}
                    </div>
                    
                    <div className="mb-4">
                      <span className="text-3xl font-bold">
                        {typeof plan.price === 'number' ? `$${plan.price}` : plan.price || 'Free'}
                      </span>
                      {plan.billingPeriod && (
                        <span className="text-sm text-muted-foreground">
                          {plan.billingPeriod === 'lifetime' ? '' : `/${plan.billingPeriod}`}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>

                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Links</span>
                        <span className="font-medium">
                          {typeof plan.features.monthlyLinks === 'number' 
                            ? plan.features.monthlyLinks.toLocaleString() 
                            : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Custom Domains</span>
                        <span className="font-medium">
                          {typeof plan.features.customDomains === 'number' 
                            ? plan.features.customDomains 
                            : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Clicks</span>
                        <span className="font-medium">
                          {typeof plan.features.monthlyClicks === 'number' 
                            ? plan.features.monthlyClicks.toLocaleString() 
                            : 'Unlimited'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6"
                    variant={buttonState.variant}
                    disabled={buttonState.disabled}
                    onClick={() => !buttonState.disabled && handlePlanChange(tier)}
                  >
                    {buttonState.text}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Processing Modal */}
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md [&>button]:hidden">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Processing Secure Payment...</h3>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we upgrade your plan
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Downgrade Confirmation Dialog */}
      <AlertDialog open={showDowngradeConfirm} onOpenChange={setShowDowngradeConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Downgrade</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                By downgrading to <strong className="text-foreground capitalize">{pendingDowngradeTier}</strong>, you'll lose access to:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Advanced analytics features</li>
                <li>Additional custom domains</li>
                <li>Higher monthly limits</li>
                <li>Priority support</li>
              </ul>
              <p className="text-sm font-medium mt-3">
                This change takes effect immediately.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                if (pendingDowngradeTier) {
                  handleUpgrade(pendingDowngradeTier);
                  setShowDowngradeConfirm(false);
                }
              }}
            >
              Confirm Downgrade
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
