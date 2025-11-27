import { Button } from "@/components/ui/button";
import { Gift, Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ReferralTile = () => {
  const { data: profile } = useQuery({
    queryKey: ["profile-referral"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const referralCode = profile?.id?.substring(0, 8) || "loading...";
  const referralLink = `${window.location.origin}/invite/${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Copied!", {
      description: "Referral link copied to clipboard",
    });
  };

  return (
    <div className="bg-gradient-to-br from-system-blue/10 to-system-teal/10 rounded-xl border border-slate-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Gift className="h-5 w-5 text-system-blue" />
        <h3 className="text-title-3 font-display">Invite & Earn</h3>
      </div>

      <div className="space-y-4">
        <p className="text-body-apple text-secondary-label">
          Earn <span className="font-semibold text-label">1 month of Pro</span> for every referral
        </p>

        <div className="p-3 bg-white rounded-lg border border-slate-200">
          <p className="text-caption-2 text-tertiary-label mb-1">Your referral code</p>
          <div className="flex items-center gap-2">
            <code className="text-body-apple font-mono font-semibold text-system-blue flex-1">
              {referralCode}
            </code>
            <Button
              variant="ghost"
              size="icon"
              onClick={copyReferralLink}
              className="h-8 w-8 flex-shrink-0"
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <Button
          variant="system-secondary"
          className="w-full"
          onClick={copyReferralLink}
        >
          Copy referral link
        </Button>
      </div>
    </div>
  );
};
