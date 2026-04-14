import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, UserCheck, AlertCircle, Activity } from "lucide-react";

export default function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["waitlist-analytics"],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('waitlist_analytics')
        .select("*")
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["recent-signups"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("early_access_requests")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return <div>loading analytics...</div>;
  }

  const conversionRate = analytics?.total_approved && analytics?.total_waitlist
    ? ((analytics.total_approved / analytics.total_waitlist) * 100).toFixed(1)
    : "0.0";

  const referralRate = analytics?.referral_based_signups && analytics?.total_waitlist
    ? ((analytics.referral_based_signups / analytics.total_waitlist) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">total waitlist</CardTitle>
            <Users className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_waitlist || 0}</div>
            <p className="text-xs text-secondary-label">
              {analytics?.signups_last_7_days || 0} in last 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">approved users</CardTitle>
            <UserCheck className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_approved || 0}</div>
            <p className="text-xs text-secondary-label">
              {conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">referral signups</CardTitle>
            <TrendingUp className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.referral_based_signups || 0}</div>
            <p className="text-xs text-secondary-label">
              {referralRate}% of total signups
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">flagged users</CardTitle>
            <AlertCircle className="h-4 w-4 text-secondary-label" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.flagged_users || 0}</div>
            <p className="text-xs text-secondary-label">
              fraud detection active
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            signup activity (7 days)
          </CardTitle>
          <CardDescription>daily signup trend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-label">average engagement score</span>
              <span className="font-semibold">{analytics?.avg_engagement_score?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-label">average fit score</span>
              <span className="font-semibold">{analytics?.avg_fit_score?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-label">average total score</span>
              <span className="font-semibold">{analytics?.avg_total_score?.toFixed(1) || "0.0"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-secondary-label">unique companies</span>
              <span className="font-semibold">{analytics?.unique_companies || 0}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}