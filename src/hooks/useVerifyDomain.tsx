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
        // Provide specific error message based on verification status
        let description = data.message || "DNS changes can take up to 72 hours to propagate.";
        
        // Check if it's a TXT record not found error (Status 3 = NXDOMAIN)
        if (data.message?.includes("Status: 3") || data.message?.toLowerCase().includes("nxdomain")) {
          description = "TXT record not found. Make sure you've added just '_utm-verification' (not '_utm-verification.yourdomain.com') in your DNS provider's Name field.";
        } else if (data.message?.toLowerCase().includes("mismatch") || data.message?.toLowerCase().includes("does not match")) {
          description = `TXT record found but value doesn't match. Please verify you've entered the correct verification code.`;
        }
        
        toast({
          title: "Verification pending",
          description,
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
