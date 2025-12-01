import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, Users, Award } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferralStats } from "@/hooks/useReferralStats";

export const ReferralTile = () => {
  const [copied, setCopied] = useState(false);
  
  const { data: profile, isLoading: profileLoading } = useQuery({
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

  const { data: stats, isLoading: statsLoading } = useReferralStats(profile?.id || "");
  
  const isLoading = profileLoading || statsLoading;
  const referralCode = stats?.referral_code || profile?.id?.substring(0, 8) || "loading...";
  const referralLink = `${window.location.origin}/invite/${referralCode}`;
  const successfulReferrals = stats?.successful_referrals || 0;
  const monthsEarned = successfulReferrals;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Copied!", {
      description: "Referral link copied to clipboard",
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden h-full">
        <div className="bg-gradient-to-r from-system-blue/20 to-system-teal/20 p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden h-full flex flex-col">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-system-blue/20 to-system-teal/20 p-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-display">invite & earn</h3>
        </div>
        <p className="text-caption-1 text-secondary-label mt-1">
          earn <span className="font-semibold text-label">1 month of pro</span> per referral
        </p>
      </div>
      
      <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
        {/* Your Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">referrals</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {successfulReferrals}
            </p>
          </div>
          
          <div className="p-3 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-2 mb-1">
              <Award className="h-4 w-4 text-primary" />
              <span className="text-xs text-muted-foreground">earned</span>
            </div>
            <p className="text-2xl font-bold text-foreground">
              {monthsEarned} mo
            </p>
          </div>
        </div>

        {/* Your Code */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border/50">
          <span className="text-xs text-muted-foreground">your code</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono font-medium tracking-tight text-foreground">
              {referralCode}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyReferralLink}
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
            </Button>
          </div>
        </div>

        {/* Copy Link Button */}
        <Button
          className="w-full"
          size="sm"
          onClick={copyReferralLink}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              copy link
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
