import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Gift, Copy, Check, Users, Award } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useReferralStats } from "@/hooks/useReferralStats";
import { NetworkRipple } from "@/components/growth/NetworkRipple";

export const ReferralTile = () => {
  const [copied, setCopied] = useState(false);
  const [showRipple, setShowRipple] = useState(false);
  
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
    setShowRipple(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full">
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-white/60" />
            <Skeleton className="h-6 w-32 bg-white/10" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full bg-white/10" />
          <Skeleton className="h-8 w-full bg-white/10" />
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
      
      <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 rounded-full bg-white/10 border border-white/20 shadow-[0_0_8px_hsl(0_0%_100%/0.15)]"
            >
              <Gift className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-white">invite & earn</h3>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            earn <span className="font-medium text-zinc-300">1 month of pro</span> per referral
          </p>
        </div>
        
        <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Users className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500">referrals</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {successfulReferrals}
              </p>
            </div>
            
            <div className="p-3 rounded-lg bg-zinc-900/60 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-3.5 w-3.5 text-zinc-500" />
                <span className="text-xs text-zinc-500">earned</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {monthsEarned} mo
              </p>
            </div>
          </div>

          {/* Your Code */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/60 border border-white/5">
            <span className="text-xs text-zinc-500 font-mono">your code</span>
            <div className="flex items-center gap-2">
              <code className="text-sm font-mono font-medium tracking-tight text-zinc-300">
                {referralCode}
              </code>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-zinc-400 hover:text-white hover:bg-white/10"
                onClick={copyReferralLink}
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </Button>
            </div>
          </div>

          {/* Copy Link Button */}
          <Button
            className="w-full bg-white text-zinc-900 hover:bg-zinc-200"
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
