import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BadgeGrid } from "@/components/waitlist/BadgeGrid";
import { Button } from "@/components/ui/button";
import { Copy, Share2, TrendingUp } from "lucide-react";
import { showSuccessToast } from "@/lib/enhancedToast";
import { useNavigate } from "react-router-dom";

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

  // Fetch user's waitlist data
  const { data: userData, isLoading } = useQuery({
    queryKey: ["waitlist-status", email],
    queryFn: async () => {
      if (!email) return null;
      
      const { data, error } = await supabase
        .from("early_access_requests")
        .select("*")
        .eq("email", email)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!email,
  });

  // Fetch all badges
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

  // Fetch user's badges
  const { data: userBadges } = useQuery({
    queryKey: ["user-badges", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return [];

      const { data, error } = await supabase
        .from("user_badges")
        .select("badge_id, awarded_at")
        .eq("user_id", userData.id);

      if (error) throw error;
      return data || [];
    },
    enabled: !!userData?.id,
  });

  // Fetch queue position
  const { data: queuePosition } = useQuery({
    queryKey: ["queue-position", userData?.id],
    queryFn: async () => {
      if (!userData?.id) return null;

      const { count, error } = await supabase
        .from("early_access_requests")
        .select("*", { count: "exact", head: true })
        .gt("total_access_score", userData.total_access_score || 0);

      if (error) throw error;
      return (count || 0) + 1;
    },
    enabled: !!userData,
  });

  const copyReferralLink = () => {
    const link = `${window.location.origin}/early-access?ref=${userData?.referral_code}`;
    navigator.clipboard.writeText(link);
    showSuccessToast("referral link copied to clipboard");
  };

  const shareReferralLink = async () => {
    const link = `${window.location.origin}/early-access?ref=${userData?.referral_code}`;
    if (navigator.share) {
      await navigator.share({
        title: "Join utm.one Early Access",
        text: "Join me in early access for utm.one",
        url: link,
      });
    } else {
      copyReferralLink();
    }
  };

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

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-semibold mb-4">not found</h1>
          <p className="text-secondary-label mb-6">
            we couldn't find your waitlist entry. please sign up for early access.
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
        <div className="bg-white rounded-2xl border border-border p-8 mb-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-tertiary-label mb-2">
                queue position
              </h2>
              <p className="text-6xl font-display font-bold text-primary mb-4">
                #{queuePosition}
              </p>
              <p className="text-secondary-label">
                based on your total access score of <strong>{totalScore}</strong> points
              </p>
            </div>
            <TrendingUp className="h-12 w-12 text-primary opacity-20" />
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-medium text-tertiary-label mb-2">
              engagement score
            </h3>
            <p className="text-4xl font-display font-bold text-foreground">
              {engagementScore}
            </p>
            <p className="text-xs text-tertiary-label mt-2">out of 50 points</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-medium text-tertiary-label mb-2">
              referral score
            </h3>
            <p className="text-4xl font-display font-bold text-foreground">
              {referralScore}
            </p>
            <p className="text-xs text-tertiary-label mt-2">unlimited points</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-6">
            <h3 className="text-sm font-medium text-tertiary-label mb-2">
              fit score
            </h3>
            <p className="text-4xl font-display font-bold text-foreground">
              {fitScore}
            </p>
            <p className="text-xs text-tertiary-label mt-2">out of 50 points</p>
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
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              <span className="font-semibold">⚠️ fraud protection:</span> referrals only count when your friends verify their email. this prevents fake signups and keeps the queue fair.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={copyReferralLink} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              copy link
            </Button>
            <Button onClick={shareReferralLink} className="gap-2">
              <Share2 className="h-4 w-4" />
              share
            </Button>
          </div>
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
