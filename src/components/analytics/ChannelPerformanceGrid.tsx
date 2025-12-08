import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, subDays } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { 
  Globe, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram, 
  Mail, 
  Search,
  ArrowUpRight
} from "lucide-react";

interface ChannelPerformanceGridProps {
  workspaceId: string;
}

interface ChannelData {
  name: string;
  clicks: number;
  uniqueClicks: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

const getChannelIcon = (channel: string) => {
  const lc = channel.toLowerCase();
  if (lc.includes('linkedin')) return <Linkedin className="h-4 w-4" />;
  if (lc.includes('twitter') || lc.includes('x.com')) return <Twitter className="h-4 w-4" />;
  if (lc.includes('facebook')) return <Facebook className="h-4 w-4" />;
  if (lc.includes('instagram')) return <Instagram className="h-4 w-4" />;
  if (lc.includes('google')) return <Search className="h-4 w-4" />;
  if (lc.includes('email') || lc.includes('mail')) return <Mail className="h-4 w-4" />;
  return <Globe className="h-4 w-4" />;
};

const getChannelColor = (channel: string) => {
  const lc = channel.toLowerCase();
  // Monochrome Obsidian style - all channels use white/silver palette
  if (lc.includes('linkedin')) return 'bg-white/10 text-white border-white/20';
  if (lc.includes('twitter') || lc.includes('x.com')) return 'bg-white/10 text-white border-white/20';
  if (lc.includes('facebook')) return 'bg-white/10 text-white border-white/20';
  if (lc.includes('instagram')) return 'bg-white/10 text-white border-white/20';
  if (lc.includes('google')) return 'bg-white/10 text-white border-white/20';
  if (lc.includes('direct')) return 'bg-white/5 text-white border-white/10';
  return 'bg-muted text-muted-foreground border-border';
};

export const ChannelPerformanceGrid = ({ workspaceId }: ChannelPerformanceGridProps) => {
  const { data: channels, isLoading } = useQuery({
    queryKey: ["channel-performance", workspaceId],
    queryFn: async () => {
      const startDate = startOfDay(subDays(new Date(), 30));

      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("referrer, is_unique, links!inner(workspace_id)")
        .eq("links.workspace_id", workspaceId)
        .gte("clicked_at", startDate.toISOString());

      if (error) throw error;

      const channelMap = new Map<string, { total: number; unique: number }>();

      clicks?.forEach(click => {
        let channel = 'Direct';
        if (click.referrer) {
          try {
            const url = new URL(click.referrer);
            const domain = url.hostname.replace('www.', '');
            if (domain.includes('google')) channel = 'Google';
            else if (domain.includes('linkedin')) channel = 'LinkedIn';
            else if (domain.includes('twitter') || domain.includes('x.com')) channel = 'Twitter/X';
            else if (domain.includes('facebook')) channel = 'Facebook';
            else if (domain.includes('instagram')) channel = 'Instagram';
            else if (domain.includes('mail') || domain.includes('outlook')) channel = 'Email';
            else channel = domain.charAt(0).toUpperCase() + domain.slice(1);
          } catch {
            channel = 'Other';
          }
        }
        
        const existing = channelMap.get(channel) || { total: 0, unique: 0 };
        channelMap.set(channel, {
          total: existing.total + 1,
          unique: existing.unique + (click.is_unique ? 1 : 0)
        });
      });

      const totalClicks = clicks?.length || 1;
      
      return Array.from(channelMap.entries())
        .map(([name, data]): ChannelData => ({
          name,
          clicks: data.total,
          uniqueClicks: data.unique,
          percentage: (data.total / totalClicks) * 100,
          icon: getChannelIcon(name),
          color: getChannelColor(name)
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 6);
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000
  });

  if (isLoading) {
    return (
      <Card className="rounded-2xl">
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!channels?.length) {
    return (
      <Card className="rounded-2xl border-border">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">channel performance</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-label text-center py-8">
            no channel data available yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">channel performance</CardTitle>
        <p className="text-sm text-secondary-label">where your traffic comes from</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {channels.map((channel) => (
            <div
              key={channel.name}
              className={cn(
                "p-4 rounded-xl border transition-all hover:shadow-md cursor-pointer group",
                channel.color
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-1.5 rounded-lg bg-background/50">
                  {channel.icon}
                </div>
                <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium truncate">{channel.name}</p>
                <p className="text-xl font-bold">{channel.clicks.toLocaleString()}</p>
                <p className="text-xs opacity-70">{channel.percentage.toFixed(1)}% of traffic</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
