import { useFeatureFlags } from './useFeatureFlags';

/**
 * Simple hook to check if a single UI feature flag is enabled
 * Used for conditional rendering of UI elements
 */
export const useUIFeatureFlag = (flagKey: string): { enabled: boolean; isLoading: boolean } => {
  const { flags, isLoading } = useFeatureFlags();
  const flag = flags?.find(f => f.flag_key === flagKey);
  return { enabled: flag?.is_enabled ?? false, isLoading };
};

/**
 * Hook to check multiple UI feature flags at once
 */
export const useUIFeatureFlags = (flagKeys: string[]): { flags: Record<string, boolean>; isLoading: boolean } => {
  const { flags: allFlags, isLoading } = useFeatureFlags();
  
  const flags = flagKeys.reduce((acc, key) => {
    const flag = allFlags?.find(f => f.flag_key === key);
    acc[key] = flag?.is_enabled ?? false;
    return acc;
  }, {} as Record<string, boolean>);
  
  return { flags, isLoading };
};
