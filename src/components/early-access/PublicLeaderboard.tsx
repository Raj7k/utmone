import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp } from "lucide-react";

export const PublicLeaderboard = () => {
  const { data: topReferrers } = useQuery({
    queryKey: ["public-leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("early_access_requests")
        .select("name, referral_code")
        .not("referral_code", "is", null)
        .order("referral_score", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Calculate referral counts for each user
      const referrersWithCounts = await Promise.all(
        (data || []).map(async (referrer) => {
          const { count } = await supabase
            .from("early_access_requests")
            .select("*", { count: "exact", head: true })
            .eq("referred_by", referrer.referral_code);

          return {
            name: anonymizeName(referrer.name),
            referrals: count || 0,
          };
        })
      );

      return referrersWithCounts.filter((r) => r.referrals > 0);
    },
  });

  const anonymizeName = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length === 1) return parts[0];
    const firstName = parts[0];
    const lastInitial = parts[parts.length - 1][0];
    return `${firstName} ${lastInitial}.`;
  };

  const getMedalEmoji = (index: number) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}`;
  };

  if (!topReferrers || topReferrers.length === 0) return null;

  return (
    <section className="relative py-32 bg-wildSand overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_hsl(var(--blaze-orange)/0.05)_2px,_transparent_2px)] bg-[length:48px_48px]" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blazeOrange/10 text-blazeOrange text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            referral leaderboard
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-6">
            top referrers
          </h2>
          <p className="text-xl text-muted-foreground">
            these early adopters are helping build the community. join them.
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">
          {topReferrers.map((referrer, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-blazeOrange/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-display font-extrabold text-blazeOrange">
                    {getMedalEmoji(index)}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-foreground">
                      {referrer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {referrer.referrals} {referrer.referrals === 1 ? "referral" : "referrals"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-deepSea">
                  <TrendingUp className="w-5 h-5" />
                  <span className="font-display font-bold text-2xl">
                    {referrer.referrals}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-muted-foreground mb-4">
            share your referral link to climb the leaderboard
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-deepSea/10 text-deepSea font-medium">
            <Trophy className="w-4 h-4" />
            top 10 referrers get exclusive early access perks
          </div>
        </div>
      </div>
    </section>
  );
};
