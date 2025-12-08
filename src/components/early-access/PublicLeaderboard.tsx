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
      // Use secure edge function (names already anonymized, no email exposure)
      const { data, error } = await supabase.functions.invoke("get-waitlist-stats");

      if (error) {
        console.error("Error fetching leaderboard:", error);
        return { local: [], global: [], country: null };
      }

      const topReferrers = data?.topReferrers || [];

      // Map to expected format with flags
      const referrers = topReferrers.map((r: any) => ({
        name: r.name, // Already anonymized by edge function
        score: r.score,
        country: r.country,
        flag: countryFlags[r.country] || "🌐",
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
      <section id="leaderboard" className="relative py-32 overflow-hidden bg-muted/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,hsl(var(--primary)/0.05)_2px,transparent_2px)] bg-[length:48px_48px]" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-white/10 text-white">
              <Trophy className="w-4 h-4" />
              referral leaderboard
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-6 text-foreground">
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
    <section id="leaderboard" className="relative py-32 overflow-hidden bg-muted/5">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,hsl(var(--primary)/0.05)_2px,transparent_2px)] bg-[length:48px_48px]" />
      
      <div className="container mx-auto px-6 relative">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6 bg-white/10 text-white">
            <Trophy className="w-4 h-4" />
            referral leaderboard
          </div>
          
          {/* Geo-personalized header */}
          {leaderboardData?.country && hasLocalLeaders ? (
            <>
              <div className="flex items-center justify-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary/80" />
                <p className="text-lg text-muted-foreground">
                  showing leaders from{" "}
                  <span className="font-display font-bold text-primary">
                    {leaderboardData.country}
                  </span>
                </p>
              </div>
              <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-6 text-foreground">
                top referrers from {leaderboardData.country}
              </h2>
            </>
          ) : (
            <h2 className="text-5xl md:text-6xl font-display font-bold tracking-tighter mb-6 text-foreground">
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
                  className="group backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 bg-card border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-display font-bold text-primary">
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
                    <div className="flex items-center gap-2 text-primary/80">
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
                  className="group backdrop-blur-xl rounded-2xl p-6 transition-all duration-300 bg-card border border-border"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-display font-bold text-primary">
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
                    <div className="flex items-center gap-2 text-primary/80">
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
          <p className="text-lg mb-4 text-muted-foreground">
            share your referral link to climb the leaderboard
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-white/10 text-white">
            <Trophy className="w-4 h-4" />
            top 10 referrers get exclusive early access perks
          </div>
        </div>
      </div>
    </section>
  );
};
