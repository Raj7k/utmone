import { useState, useEffect } from "react";
import { X, Sparkles, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLAN_CONFIG, PlanTier } from "@/lib/planConfig";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface PlanWelcomeCardProps {
  planTier: PlanTier;
  workspaceName?: string;
}

const STORAGE_KEY = 'utm_plan_welcome_dismissed';

export const PlanWelcomeCard = ({ planTier, workspaceName }: PlanWelcomeCardProps) => {
  const [dismissed, setDismissed] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const isDismissed = localStorage.getItem(STORAGE_KEY);
    setDismissed(isDismissed === 'true');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  const planConfig = PLAN_CONFIG[planTier];
  if (!planConfig) return null;

  const getWelcomeFeatures = (): { category: string; features: string[] }[] => {
    if (planTier === 'free') {
      return [
        { category: 'link intelligence', features: ['short links', 'utm builder', 'basic qr codes'] },
        { category: 'analytics', features: ['click tracking', '30-day retention'] },
      ];
    }
    if (planTier === 'growth') {
      return [
        { category: 'link intelligence', features: ['3 custom domains', 'geo-targeting', 'link expiration'] },
        { category: 'analytics', features: ['attribution models', 'journey analytics', '1-year retention'] },
        { category: 'team', features: ['5 team members', 'campaigns', 'bulk create'] },
        { category: 'integrations', features: ['api access', 'webhooks', 'ga4'] },
      ];
    }
    if (planTier === 'business') {
      return [
        { category: 'link intelligence', features: ['10 custom domains', 'smart routing', 'geo-targeting'] },
        { category: 'analytics', features: ['predictive analytics', 'attribution models', '2-year retention'] },
        { category: 'governance', features: ['25 team members', 'approval workflows', 'audit logs'] },
        { category: 'integrations', features: ['api access', 'webhooks', 'ga4'] },
      ];
    }
    return [
      { category: 'everything unlimited', features: ['links', 'domains', 'clicks', 'team members'] },
      { category: 'enterprise features', features: ['identity graph', 'sso', 'white-label', 'custom sla'] },
    ];
  };

  const features = getWelcomeFeatures();

  const getQuickActions = () => {
    return [
      { label: 'create your first link', path: '/dashboard/links' },
      { label: 'generate a qr code', path: '/dashboard/qr-codes' },
      { label: 'view analytics', path: '/dashboard/analytics' },
    ];
  };

  const quickActions = getQuickActions();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="relative bg-gradient-to-br from-primary/10 via-card to-primary/5 rounded-2xl border border-primary/20 p-6 mb-6"
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Dismiss welcome card"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-display font-semibold">
            welcome to {planConfig.name}
            {workspaceName && <span className="text-muted-foreground"> • {workspaceName}</span>}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          here's what's included in your plan
        </p>

        {/* Feature Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {features.map((category) => (
            <div key={category.category} className="space-y-2">
              <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {category.category}
              </h3>
              <ul className="space-y-1.5">
                {category.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.path}
              variant="outline"
              size="sm"
              onClick={() => {
                handleDismiss();
                navigate(action.path);
              }}
              className="gap-1"
            >
              {action.label}
              <ArrowRight className="h-3 w-3" />
            </Button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
