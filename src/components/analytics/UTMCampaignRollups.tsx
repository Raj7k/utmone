import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CampaignSparkline } from "./CampaignSparkline";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface UTMCampaignRollupsProps {
  workspaceId: string;
}

export const UTMCampaignRollups = ({ workspaceId }: UTMCampaignRollupsProps) => {
  const { data: campaignData, isLoading } = useQuery({
    queryKey: ["utm-campaigns", workspaceId],
    queryFn: async () => {
      const { data: links } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", workspaceId)
        .not("utm_campaign", "is", null);

      if (!links) return null;

      // Aggregate by campaign
      const campaignStats: Record<string, {
        campaign: string;
        source: string;
        medium: string;
        term: string;
        content: string;
        links: number;
        clicks: number;
      }> = {};

      links.forEach(link => {
        const key = `${link.utm_campaign}-${link.utm_source}-${link.utm_medium}-${link.utm_term}-${link.utm_content}`;
        if (!campaignStats[key]) {
          campaignStats[key] = {
            campaign: link.utm_campaign || "",
            source: link.utm_source || "",
            medium: link.utm_medium || "",
            term: link.utm_term || "",
            content: link.utm_content || "",
            links: 0,
            clicks: 0,
          };
        }
        campaignStats[key].links += 1;
        campaignStats[key].clicks += link.total_clicks || 0;
      });

      const campaigns = Object.values(campaignStats).sort((a, b) => b.clicks - a.clicks);

      // Top campaigns for chart
      const topCampaigns = campaigns.slice(0, 5).map(c => ({
        name: c.campaign,
        clicks: c.clicks,
      }));

      return { campaigns, topCampaigns };
    },
  });

    return <div className="text-center py-8 text-secondary-label">loading campaign data…</div>;

  if (!campaignData || campaignData.campaigns.length === 0) {
    return (
      <div className="text-center py-8 text-secondary-label">
        No UTM campaign data available. Create links with UTM parameters to see analytics here.
      </div>
    );
  }

  const chartConfig = {
    clicks: {
      label: "Clicks",
      color: "hsl(var(--primary))",
    },
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Campaigns Performance</CardTitle>
          <CardDescription>Your most successful campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaignData.topCampaigns}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--secondary-label))" />
                  <YAxis stroke="hsl(var(--secondary-label))" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="clicks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <CardDescription>Complete campaign breakdown with UTM parameters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-separator">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Trend (14d)</TableHead>
                  <TableHead className="text-center">Links</TableHead>
                  <TableHead className="text-right">Total Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaignData.campaigns.map((campaign, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium text-label">
                      {campaign.campaign}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.source || "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{campaign.medium || "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{campaign.term || "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{campaign.content || "-"}</Badge>
                    </TableCell>
                    <TableCell>
                      <CampaignSparkline
                        workspaceId={workspaceId}
                        campaign={campaign.campaign}
                        source={campaign.source}
                        medium={campaign.medium}
                        term={campaign.term}
                        content={campaign.content}
                      />
                    </TableCell>
                    <TableCell className="text-center text-secondary-label">
                      {campaign.links}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-label">
                      {campaign.clicks}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
