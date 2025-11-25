import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

interface DashboardPreferences {
  visible_widgets: string[];
  tab_order: string[];
  default_period: 'day' | 'week' | 'month';
  timezone?: string;
}

const DEFAULT_PREFERENCES: DashboardPreferences = {
  visible_widgets: ['overview', 'heatmap', 'conversions', 'geography', 'devices', 'campaigns'],
  tab_order: ['overview', 'devices', 'geography', 'campaigns', 'time', 'compare'],
  default_period: 'month',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export function useDashboardPreferences(workspaceId: string) {
  const queryClient = useQueryClient();
  const [localPreferences, setLocalPreferences] = useState<DashboardPreferences>(DEFAULT_PREFERENCES);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`dashboard-prefs-${workspaceId}`);
    if (stored) {
      try {
        setLocalPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(stored) });
      } catch (e) {
        console.error('Failed to parse stored preferences', e);
      }
    }
  }, [workspaceId]);

  // Merge local preferences (no DB for now, just localStorage)
  const preferences = localPreferences;

  // Update preferences
  const updatePreferencesMutation = useMutation({
    mutationFn: async (updates: Partial<DashboardPreferences>) => {
      // Save to localStorage
      const newPrefs = { ...localPreferences, ...updates };
      localStorage.setItem(`dashboard-prefs-${workspaceId}`, JSON.stringify(newPrefs));
      setLocalPreferences(newPrefs);
      return newPrefs;
    },
    onSuccess: () => {
      toast.success("Dashboard preferences updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update preferences: " + error.message);
    },
  });
  
  return {
    preferences,
    isLoading: false,
    updatePreferences: updatePreferencesMutation.mutate,
    isUpdating: updatePreferencesMutation.isPending,
  };
}
