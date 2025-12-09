import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, UserCheck, Clock, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

type StatsData = {
  pending: number;
  approved: number;
  approvedThisWeek: number;
  avgWaitDays: number;
  conversionRate: number;
};

export function WaitlistStatsBar() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["waitlist-stats"],
    queryFn: async (): Promise<StatsData> => {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const { data: requests, error } = await supabase
        .from("early_access_requests")
        .select("status, created_at, approval_timestamp");

      if (error) throw error;

      const pending = requests?.filter((r) => r.status === "pending").length || 0;
      const approved = requests?.filter((r) => r.status === "approved").length || 0;
      const total = requests?.length || 1;

      const approvedThisWeek = requests?.filter(
        (r) => r.status === "approved" && r.approval_timestamp && new Date(r.approval_timestamp) >= weekAgo
      ).length || 0;

      // Calculate average wait time for approved users
      const approvedWithWait = requests?.filter(
        (r) => r.status === "approved" && r.approval_timestamp && r.created_at
      ) || [];
      
      let avgWaitDays = 0;
      if (approvedWithWait.length > 0) {
        const totalWaitMs = approvedWithWait.reduce((sum, r) => {
          const created = new Date(r.created_at).getTime();
          const approved = new Date(r.approval_timestamp!).getTime();
          return sum + (approved - created);
        }, 0);
        avgWaitDays = Math.round(totalWaitMs / approvedWithWait.length / (1000 * 60 * 60 * 24));
      }

      return {
        pending,
        approved,
        approvedThisWeek,
        avgWaitDays,
        conversionRate: Math.round((approved / total) * 100),
      };
    },
  });

  const statCards = [
    {
      label: "pending",
      value: stats?.pending || 0,
      icon: Users,
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
    },
    {
      label: "approved",
      value: stats?.approved || 0,
      icon: UserCheck,
      color: "text-emerald-400",
      bgColor: "bg-emerald-400/10",
    },
    {
      label: "this week",
      value: `+${stats?.approvedThisWeek || 0}`,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "avg wait",
      value: `${stats?.avgWaitDays || 0}d`,
      icon: Clock,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat) => (
        <div
          key={stat.label}
          className="relative overflow-hidden rounded-xl border border-border/50 bg-card p-4 transition-all hover:border-border"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} ${stat.color} p-2.5 rounded-lg`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
