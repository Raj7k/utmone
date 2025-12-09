import { useSubscriptionStatus, useIsSubscriptionExpiringSoon } from "@/hooks/useSubscriptionStatus";
import { AlertTriangle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export const SubscriptionExpiryBanner = () => {
  const { data: status, isLoading } = useSubscriptionStatus();
  const isExpiringSoon = useIsSubscriptionExpiringSoon(7);
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (isLoading || dismissed || !status) return null;

  // Grace period warning (most urgent)
  if (status.isInGracePeriod) {
    return (
      <div className="bg-destructive/10 border-b border-destructive/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-destructive">Your subscription has expired.</span>
              <span className="text-muted-foreground ml-2">
                Your data will be preserved until{" "}
                {status.dataDeletionScheduledAt 
                  ? format(status.dataDeletionScheduledAt, "MMMM d, yyyy")
                  : "the retention period ends"
                }.
                {status.daysUntilDeletion !== null && (
                  <span className="font-medium"> ({status.daysUntilDeletion} days remaining)</span>
                )}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              onClick={() => navigate("/dashboard/settings?tab=billing")}
            >
              Upgrade to restore access
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Expiring soon warning
  if (isExpiringSoon && status.daysUntilExpiry !== null) {
    return (
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-500 shrink-0" />
            <div className="text-sm">
              <span className="font-medium text-amber-500">
                Your subscription expires in {status.daysUntilExpiry} day{status.daysUntilExpiry !== 1 ? 's' : ''}.
              </span>
              <span className="text-muted-foreground ml-2">
                Renew now to keep your {status.planTier} features.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => navigate("/dashboard/settings?tab=billing")}
            >
              Renew subscription
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};