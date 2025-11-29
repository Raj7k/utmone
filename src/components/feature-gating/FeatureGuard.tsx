import { ReactNode, useState } from "react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "./UpgradeModal";
import { Skeleton } from "@/components/ui/skeleton";

interface FeatureGuardProps {
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradeModal?: boolean;
  mode?: 'hide' | 'lock' | 'disable';
  className?: string;
}

/**
 * FeatureGuard component wraps features and enforces tier-based access control
 * 
 * @param feature - Feature key from feature_gates table (e.g., 'csv_export', 'geo_analytics')
 * @param children - The feature content to render if access is allowed
 * @param fallback - Custom fallback UI when access is denied (optional)
 * @param showUpgradeModal - Whether to show upgrade modal on click when locked (default: true)
 * @param mode - How to handle locked features: 'hide' (don't render), 'lock' (show with lock icon), 'disable' (show grayed out)
 * @param className - Additional CSS classes
 */
export const FeatureGuard = ({
  feature,
  children,
  fallback,
  showUpgradeModal = true,
  mode = 'lock',
  className = '',
}: FeatureGuardProps) => {
  const { allowed, currentPlan, requiredPlan, isLoading } = useFeatureAccess(feature);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Loading state
  if (isLoading) {
    return <Skeleton className={`h-10 w-full ${className}`} />;
  }

  // Allowed - render children normally
  if (allowed) {
    return <>{children}</>;
  }

  // Not allowed - handle based on mode
  if (mode === 'hide') {
    return null;
  }

  if (mode === 'disable') {
    return (
      <div className={`relative opacity-60 ${className}`}>
        {children}
        <div className="absolute inset-0 cursor-not-allowed" />
      </div>
    );
  }

  // Default mode='lock' - show custom fallback or lock button
  const handleClick = () => {
    if (showUpgradeModal && requiredPlan) {
      setUpgradeModalOpen(true);
    }
  };

  return (
    <>
      {fallback || (
        <Button
          variant="outline"
          onClick={handleClick}
          className={`gap-2 ${className}`}
          disabled={!showUpgradeModal}
        >
          <Lock className="h-4 w-4" />
          unlock {feature.replace('_', ' ')}
        </Button>
      )}

      {showUpgradeModal && requiredPlan && (
        <UpgradeModal
          open={upgradeModalOpen}
          onOpenChange={setUpgradeModalOpen}
          featureName={feature.replace('_', ' ')}
          requiredPlan={requiredPlan}
          currentPlan={currentPlan}
        />
      )}
    </>
  );
};
