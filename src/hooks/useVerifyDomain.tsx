import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVerifyDomain = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (domainId: string) => {
      const { data, error } = await supabase.functions.invoke('verify-domain', {
        body: { domainId }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data, domainId) => {
      queryClient.invalidateQueries({ queryKey: ["workspace-domains"] });
      
      if (data.verified) {
        toast({
          title: "Domain verified!",
          description: "Your domain is now active and ready to use.",
        });
      } else {
        toast({
          title: "Verification pending",
          description: data.message || "DNS changes can take up to 72 hours to propagate.",
          variant: "default",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
