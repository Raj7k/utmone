import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { calculateWinProbability, shouldStopTest } from "@/lib/bayesianOptimization";

export interface ABTest {
  id: string;
  workspace_id: string;
  link_id: string;
  test_name: string;
  description?: string;
  status: string;
  traffic_split: Record<string, number>;
  winner_variant_id?: string;
  started_at?: string;
  ended_at?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ABTestVariant {
  id: string;
  test_id: string;
  variant_name: string;
  destination_url: string;
  traffic_percentage: number;
  total_clicks: number;
  unique_clicks: number;
  conversions: number;
  conversion_rate: number;
  performance_score: number;
  created_at: string;
}

export const useABTests = (workspaceId: string) => {
  const queryClient = useQueryClient();

  const { data: tests = [], isLoading } = useQuery({
    queryKey: ["ab-tests", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_tests")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ABTest[];
    },
    enabled: !!workspaceId,
  });

  const createTest = useMutation({
    mutationFn: async (test: Omit<ABTest, "id" | "created_at" | "updated_at" | "created_by">) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("ab_tests")
        .insert({
          ...test,
          workspace_id: workspaceId,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ab-tests", workspaceId] });
      toast.success("A/B test created");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create test");
    },
  });

  const updateTest = useMutation({
    mutationFn: async ({ testId, updates }: { testId: string; updates: Partial<ABTest> }) => {
      const { error } = await supabase
        .from("ab_tests")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", testId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ab-tests", workspaceId] });
      toast.success("Test updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update test");
    },
  });

  const getTestVariants = useQuery({
    queryKey: ["ab-test-variants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ab_test_variants")
        .select("*")
        .order("variant_name");

      if (error) throw error;
      return data as ABTestVariant[];
    },
  });

  // Bayesian analysis functions
  const calculateWinProbabilityForTest = (testId: string) => {
    const testVariants = getTestVariants.data?.filter(v => v.test_id === testId) || [];
    
    if (testVariants.length !== 2) return null;
    
    const [variantA, variantB] = testVariants;
    
    // Import here to avoid circular dependency
    const winProb = calculateWinProbability(
      { clicks: variantA.total_clicks, conversions: variantA.conversions },
      { clicks: variantB.total_clicks, conversions: variantB.conversions }
    );
    
    return {
      variantA: { name: variantA.variant_name, winProbability: winProb },
      variantB: { name: variantB.variant_name, winProbability: 1 - winProb },
    };
  };

  const shouldStopTestEarly = (testId: string) => {
    const testVariants = getTestVariants.data?.filter(v => v.test_id === testId) || [];
    
    if (testVariants.length !== 2) return null;
    
    const [variantA, variantB] = testVariants;
    
    // Import here to avoid circular dependency
    const result = shouldStopTest([
      { clicks: variantA.total_clicks, conversions: variantA.conversions },
      { clicks: variantB.total_clicks, conversions: variantB.conversions }
    ]);
    
    if (result.shouldStop) {
      return {
        shouldStop: true,
        winner: result.winnerIndex === 0 ? variantA : variantB,
        confidence: result.confidence,
      };
    }
    
    return null;
  };

  return {
    tests,
    isLoading,
    createTest,
    updateTest,
    variants: getTestVariants.data || [],
    calculateWinProbabilityForTest,
    shouldStopTestEarly,
  };
};
