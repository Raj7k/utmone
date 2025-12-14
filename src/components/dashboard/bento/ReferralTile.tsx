import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, Users, Award } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferralStats } from "@/hooks/useReferralStats";
import { NetworkRipple } from "@/components/growth/NetworkRipple";
import { useAppSession } from "@/contexts/AppSessionContext";

export const ReferralTile = () => {
  const [copied, setCopied] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  const { user } = useAppSession();
  
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["profile-referral", user?.id],
    queryFn: async () => {
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
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
    setShowRipple(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-muted-foreground" />
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
    <>
      <NetworkRipple 
        isActive={showRipple} 
        onComplete={() => setShowRipple(false)} 
      />
      
      <div className="bg-card rounded-2xl border border-border overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-muted border border-border">
              <Gift className="h-4 w-4 text-foreground" />
            </div>
            <h3 className="font-semibold text-foreground">invite & earn</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            earn <span className="font-medium text-foreground">1 month of pro</span> per referral
          </p>
        </div>
        
        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">referrals</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {successfulReferrals}
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-muted border border-border/50">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">earned</span>
              </div>
              <p className="text-2xl font-bold text-foreground">
                {monthsEarned} mo
              </p>
            </div>
          </div>

          {/* Your Code */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border/50">
            <span className="text-xs text-muted-foreground font-mono">your code</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono font-medium tracking-tight text-foreground">
                {referralCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
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
    </>
  );
};
