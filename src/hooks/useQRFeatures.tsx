import { usePlanLimits } from "./usePlanLimits";
import { PLAN_CONFIG } from "@/lib/planConfig";

export const useQRFeatures = () => {
  const { data: limits, isLoading } = usePlanLimits();

  // Get plan tier and features
  const planTier = limits?.planTier || 'free';
  const planFeatures = PLAN_CONFIG[planTier]?.features || PLAN_CONFIG.free.features;

  const features = {
    qrMonthlyLimit: planFeatures.qrMonthlyLimit,
    canRemoveQRWatermark: planFeatures.canRemoveQRWatermark,
    canExportSVG: planFeatures.canExportSVG,
    canExportPDF: planFeatures.canExportPDF,
    canUploadLogo: planFeatures.canUploadLogo,
    canUseGradients: planFeatures.canUseGradients,
    canUseAdvancedShapes: planFeatures.canUseAdvancedShapes,
    canBulkGenerateQR: planFeatures.canBulkGenerateQR || false,
    canSaveQRTemplates: planFeatures.canSaveQRTemplates || false,
    qrMaxResolution: planFeatures.qrMaxResolution,
  };

  return {
    ...features,
    isLoading,
    isFreeTier: !features.canRemoveQRWatermark,
  };
};
