import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, TrendingUp, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

export const SocialProofStats = () => {
  const [liveTotal, setLiveTotal] = useState(0);
  
  const { data: stats } = useQuery({
    queryKey: ["waitlist-stats"],
    queryFn: async () => {
      // Use secure edge function to get stats (no PII exposure)
      const { data, error } = await supabase.functions.invoke("get-waitlist-stats");

      if (error) {
        console.error("Error fetching waitlist stats:", error);
        return { total: 0, approved: 0, referrals: 0 };
      }

      return {
        total: data?.totalCount || 0,
        approved: data?.approvedCount || 0,
        referrals: data?.referralCount || 0,
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

  const getColorStyles = (color: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      primary: { bg: 'hsl(var(--primary) / 0.1)', text: 'hsl(var(--primary))' },
      blazeOrange: { bg: 'rgba(249,115,22,0.1)', text: 'rgba(249,115,22,1)' },
      deepSea: { bg: 'rgba(20,184,166,0.1)', text: 'rgba(20,184,166,1)' },
    };
    return colors[color] || colors.primary;
  };

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
            const colorStyles = getColorStyles(stat.color);
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center group"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: colorStyles.bg }}
                >
                  <Icon className="w-8 h-8" style={{ color: colorStyles.text }} />
                </div>
                <div className="font-display font-bold text-5xl md:text-6xl tracking-tighter mb-2 bg-gradient-to-br from-foreground to-foreground/50 bg-clip-text text-transparent">
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
