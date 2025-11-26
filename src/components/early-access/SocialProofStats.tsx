import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export const SocialProofStats = () => {
  const [liveTotal, setLiveTotal] = useState(0);
  
  const { data: stats } = useQuery({
    queryKey: ["waitlist-stats"],
    queryFn: async () => {
      const { count: totalCount } = await supabase
        .from("early_access_requests")
        .select("*", { count: "exact", head: true });

      const { count: approvedCount } = await supabase
        .from("early_access_requests")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved");

      const { count: referralCount } = await supabase
        .from("early_access_requests")
        .select("*", { count: "exact", head: true })
        .gt("referral_score", 0);

      return {
        total: totalCount || 0,
        approved: approvedCount || 0,
        referrals: referralCount || 0,
      };
    },
  });

  // Set initial live count
  useEffect(() => {
    if (stats?.total) {
      setLiveTotal(stats.total);
    }
  }, [stats?.total]);

  // Realtime subscription for new signups
  useEffect(() => {
    const channel = supabase
      .channel('early-access-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'early_access_requests',
        },
        () => {
          // Increment counter with animation
          setLiveTotal(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const statItems = [
    {
      icon: Users,
      value: `${liveTotal || stats?.total || 0}+`,
      label: "on waitlist",
      color: "primary",
    },
    {
      icon: Sparkles,
      value: `${stats?.approved || 0}+`,
      label: "teams approved",
      color: "blazeOrange",
    },
    {
      icon: TrendingUp,
      value: `${stats?.referrals || 0}+`,
      label: "referrals made",
      color: "deepSea",
    },
  ];

  return (
    <section className="relative py-16 bg-wildSand border-y border-border/50 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      <div className="container mx-auto px-6 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {statItems.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl bg-${stat.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className={`w-8 h-8 text-${stat.color}`} />
                </div>
                <div className="font-display font-extrabold text-5xl md:text-6xl tracking-tighter mb-2 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
