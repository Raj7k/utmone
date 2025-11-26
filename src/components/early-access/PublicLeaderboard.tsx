import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

// Country flag emojis
const countryFlags: Record<string, string> = {
  "India": "🇮🇳",
  "United States": "🇺🇸",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Spain": "🇪🇸",
  "Italy": "🇮🇹",
  "Poland": "🇵🇱",
  "Sweden": "🇸🇪",
  "Russia": "🇷🇺",
  "Denmark": "🇩🇰",
  "Czech Republic": "🇨🇿",
  "Japan": "🇯🇵",
  "China": "🇨🇳",
  "Brazil": "🇧🇷",
  "United Arab Emirates": "🇦🇪",
  "Australia": "🇦🇺",
};

export const PublicLeaderboard = () => {
  const [userCountry, setUserCountry] = useState<string | null>(null);

  // Detect user's location
  useEffect(() => {
    const detectLocation = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("detect-location");
        if (!error && data?.country) {
          setUserCountry(data.country);
        }
      } catch (err) {
        console.error("Location detection failed:", err);
      }
    };
    detectLocation();
  }, []);

  const { data: leaderboardData } = useQuery({
    queryKey: ["public-leaderboard", userCountry],
    queryFn: async () => {
      // Fetch all top referrers
      const { data: allReferrers, error } = await supabase
        .from("early_access_requests")
        .select("name, referral_score, country")
        .not("referral_code", "is", null)
        .gt("referral_score", 0)
        .order("referral_score", { ascending: false })
        .limit(50);

      if (error) throw error;

      const referrers = (allReferrers || []).map((referrer) => ({
        name: anonymizeName(referrer.name),
        score: referrer.referral_score || 0,
        country: referrer.country || "Unknown",
        flag: countryFlags[referrer.country || ""] || "🌐",
      }));

      // If we have user's country, prioritize local leaders
      if (userCountry) {
        const localLeaders = referrers.filter(r => r.country === userCountry).slice(0, 5);
        const globalLeaders = referrers.filter(r => r.country !== userCountry).slice(0, 5);
        return {
          local: localLeaders,
          global: globalLeaders,
          country: userCountry,
        };
      }

      // Default: just show top 10
      return {
        local: [],
        global: referrers.slice(0, 10),
        country: null,
      };
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

  // Combine local + global leaders
  const allLeaders = leaderboardData 
    ? [...(leaderboardData.local || []), ...(leaderboardData.global || [])]
    : [];
  const hasLocalLeaders = (leaderboardData?.local?.length || 0) > 0;

  // Always show leaderboard section, even if empty
  if (!leaderboardData || allLeaders.length === 0) {
    return (
      <section id="leaderboard" className="relative py-32 bg-wildSand overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_hsl(var(--blaze-orange)/0.05)_2px,_transparent_2px)] bg-[length:48px_48px]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blazeOrange/10 text-blazeOrange text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              referral leaderboard
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-6">
              top referrers
            </h2>
            <p className="text-xl text-muted-foreground">
              be the first to climb the leaderboard
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="leaderboard" className="relative py-32 bg-wildSand overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,_hsl(var(--blaze-orange)/0.05)_2px,_transparent_2px)] bg-[length:48px_48px]" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blazeOrange/10 text-blazeOrange text-sm font-medium mb-6">
            <Trophy className="w-4 h-4" />
            referral leaderboard
          </div>
          
          {/* Geo-personalized header */}
          {leaderboardData?.country && hasLocalLeaders ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <p className="text-lg text-muted-foreground">
                  showing leaders from{" "}
                  <span className="font-display font-bold text-primary">
                    {leaderboardData.country}
                  </span>
                </p>
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-6">
                top referrers from {leaderboardData.country}
              </h2>
            </>
          ) : (
            <h2 className="text-5xl md:text-6xl font-display font-extrabold tracking-tighter mb-6">
              top referrers worldwide
            </h2>
          )}
          
          <p className="text-xl text-muted-foreground">
            these early adopters are helping build the community. join them.
          </p>
        </div>

        {/* Local leaders section */}
        {hasLocalLeaders && (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-display font-bold text-foreground">
                {countryFlags[leaderboardData.country || ""]} from your region
              </h3>
            </div>
            <div className="space-y-4">
              {leaderboardData.local.map((referrer, index) => (
                <div
                  key={`local-${index}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-primary/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-display font-extrabold text-primary">
                        {getMedalEmoji(index)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-foreground">
                            {referrer.name}
                          </h3>
                          <span className="text-xl">{referrer.flag}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {referrer.score} referral {referrer.score === 1 ? "point" : "points"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-display font-bold text-2xl">
                        {referrer.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Global leaders section */}
        <div className="max-w-2xl mx-auto">
          {hasLocalLeaders && (
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-2xl font-display font-bold text-foreground">
                🌐 global leaders
              </h3>
            </div>
          )}
          <div className="space-y-4">
            {leaderboardData.global.map((referrer, index) => {
              const globalIndex = hasLocalLeaders ? index + leaderboardData.local.length : index;
              return (
                <div
                  key={`global-${index}`}
                  className="group bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-border/50 hover:border-blazeOrange/30"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-display font-extrabold text-blazeOrange">
                        {getMedalEmoji(globalIndex)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold text-lg text-foreground">
                            {referrer.name}
                          </h3>
                          <span className="text-xl">{referrer.flag}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {referrer.score} referral {referrer.score === 1 ? "point" : "points"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-deepSea">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-display font-bold text-2xl">
                        {referrer.score}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
