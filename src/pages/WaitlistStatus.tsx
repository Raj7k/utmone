import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BadgeGrid } from "@/components/waitlist/BadgeGrid";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ShareReferralModal } from "@/components/waitlist/ShareReferralModal";

export default function WaitlistStatus() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get email from URL params or localStorage
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      localStorage.setItem("waitlist_email", emailParam);
    } else {
      setEmail(localStorage.getItem("waitlist_email"));
    }
  }, []);

  // Fetch user data via public edge function (bypasses RLS)
  const { data: statusData, isLoading, error: userError } = useQuery({
    queryKey: ["waitlist-status", email],
    queryFn: async () => {
      if (!email) throw new Error("No email provided");
      
      const { data, error } = await supabase.functions.invoke("get-waitlist-status", {
        body: { email },
      });

      if (error) throw error;
      if (!data?.found) throw new Error("User not found");
      
      return data;
    },
    enabled: !!email,
    retry: 1,
  });

  const userData = statusData?.user;
  const userBadges = statusData?.badges || [];
  const queuePosition = statusData?.queuePosition || 0;

  // Fetch all badges for display
  const { data: allBadges } = useQuery({
    queryKey: ["waitlist-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("waitlist_badges")
        .select("*")
        .order("tier", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (!email) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-semibold mb-4">waitlist status</h1>
          <p className="text-secondary-label mb-6">
            enter your email to check your waitlist status
          </p>
          <Button onClick={() => navigate("/early-access")}>
            go to early access
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-secondary-label">loading your status…</p>
        </div>
      </div>
    );
  }

  if (userError || !userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-semibold mb-4">not found</h1>
          <p className="text-secondary-label mb-6">
            {userError?.message || "we couldn't find your waitlist entry. please check your email or sign up for early access."}
          </p>
          <Button onClick={() => navigate("/early-access")}>
            join early access
          </Button>
        </div>
      </div>
    );
  }

  const engagementScore = userData.engagement_score || 0;
  const referralScore = userData.referral_score || 0;
  const fitScore = userData.fit_score || 0;
  const totalScore = userData.total_access_score || 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-display font-bold mb-2">
            your waitlist status
          </h1>
          <p className="text-xl text-secondary-label">
            hi {userData.name}, here's where you stand
          </p>
        </div>

        {/* Queue Position Card */}
        <div className="bg-zinc-900/40 backdrop-blur-xl rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-white/40 mb-2">
                queue position
              </h2>
              <p className="text-6xl font-display font-bold text-primary mb-4">
                #{queuePosition}
              </p>
              <p className="text-white/60">
                based on your total access score of <strong>{totalScore}</strong> points
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-primary opacity-20" />
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-white/40 mb-2">
              engagement score
            </h3>
            <p className="text-4xl font-display font-bold text-white">
              {engagementScore}
            </p>
            <p className="text-xs text-white/40 mt-2">out of 50 points</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-white/40 mb-2">
              referral score
            </h3>
            <p className="text-4xl font-display font-bold text-white">
              {referralScore}
            </p>
            <p className="text-xs text-white/40 mt-2">unlimited points</p>
          </div>
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
            <h3 className="text-sm font-medium text-white/40 mb-2">
              fit score
            </h3>
            <p className="text-4xl font-display font-bold text-white">
              {fitScore}
            </p>
            <p className="text-xs text-white/40 mt-2">out of 50 points</p>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-4">
            jump the queue with referrals
          </h2>
          <p className="text-secondary-label mb-4">
            share your unique referral link and earn points for every friend who joins and <span className="font-semibold text-primary">verifies their email</span>.
          </p>
          
          {/* Referral Progress */}
          <div className="bg-zinc-900/40 backdrop-blur-xl rounded-lg border border-white/10 p-4 mb-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-white/40">referrals</span>
              <span className="font-semibold text-white">{userData.referral_count || 0} friends</span>
            </div>
            <div className="w-full bg-muted/30 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((userData.referral_count || 0) / 10) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-tertiary-label mt-2">
              {userData.referral_count >= 10 
                ? "🎉 max referral bonus achieved!" 
                : `${10 - (userData.referral_count || 0)} more to max bonus`}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">⚠️ fraud protection:</span> referrals only count when your friends verify their email. this prevents fake signups and keeps the queue fair.
            </p>
          </div>
          
          <ShareReferralModal 
            referralCode={userData.referral_code} 
            userName={userData.name}
          />
        </div>

        {/* Badges */}
        {allBadges && userBadges && (
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold mb-6">your badges</h2>
            <BadgeGrid allBadges={allBadges as any} userBadges={userBadges} />
          </div>
        )}
      </div>
    </div>
  );
}
