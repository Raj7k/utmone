import { ReactNode, useState } from "react";
import { Lock } from "lucide-react";
import { useCanAccessFeature } from "@/hooks/useCanAccessFeature";
import { UpgradeModal } from "./UpgradeModal";
import { PlanTier } from "@/lib/planConfig";

interface FeatureGuardProps {
  /** Feature key from feature_gates table */
  feature: string;
  /** Content to show if user has access */
  children: ReactNode;
  /** Optional content to show if user lacks access (defaults to lock icon) */
  fallback?: ReactNode;
  /** If true, clicking locked element opens upgrade modal */
  showUpgradeModal?: boolean;
  /** Custom className for wrapper */
  className?: string;
}

/**
 * Declarative feature gating component
 * Wraps UI elements and conditionally renders based on user's plan tier
 * 
 * @example
 * // Simple lock icon fallback
 * <FeatureGuard feature="csv_export">
 *   <Button>Export CSV</Button>
 * </FeatureGuard>
 * 
 * @example
 * // With upgrade modal
 * <FeatureGuard feature="export_svg" showUpgradeModal>
 *   <Button>Export SVG</Button>
 * </FeatureGuard>
 */
export const FeatureGuard = ({
  feature,
  children,
  fallback,
  showUpgradeModal = false,
  className = "",
}: FeatureGuardProps) => {
  const { allowed, minPlanRequired, description, isLoading } = useCanAccessFeature(feature);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // While loading, show nothing to prevent flash
  if (isLoading) {
    return null;
  }

  // User has access - render children normally
  if (allowed) {
    return <>{children}</>;
  }

  // User lacks access
  const lockedContent = fallback || (
    <div className="relative inline-flex items-center gap-2 opacity-50 cursor-not-allowed">
      <Lock className="h-4 w-4 text-muted-foreground" />
      <div className="pointer-events-none">
        {children}
      </div>
    </div>
  );

  // If showUpgradeModal is enabled, make it clickable
  if (showUpgradeModal) {
    return (
      <>
        <div
          className={`cursor-pointer hover:opacity-70 transition-opacity ${className}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsUpgradeModalOpen(true);
          }}
          role="button"
          tabIndex={0}
          title={`Upgrade to ${minPlanRequired} to unlock this feature`}
        >
          <div className="pointer-events-none select-none">
            {lockedContent}
          </div>
        </div>
        {isUpgradeModalOpen && (
          <UpgradeModal
            open={true}
            onOpenChange={(open) => {
              if (!open) setIsUpgradeModalOpen(false);
            }}
            feature={feature}
            upgradeToTier={minPlanRequired as PlanTier}
            reason={description || `This feature requires ${minPlanRequired} plan`}
          />
        )}
      </>
    );
  }

  // No modal - just show locked state
  return <div className={className}>{lockedContent}</div>;
};
