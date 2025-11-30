import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Link2 } from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface CampaignCardProps {
  id: string;
  name: string;
  status: "active" | "archived" | "draft";
  color: string;
  linkCount: number;
  totalClicks: number;
  recentClicks: number[];
}

export const CampaignCard = ({
  id,
  name,
  status,
  color,
  linkCount,
  totalClicks,
  recentClicks,
}: CampaignCardProps) => {
  // Generate sparkline data from recent clicks
  const sparklineData = recentClicks.map((clicks, index) => ({ x: index, y: clicks }));

  return (
    <Link to={`/dashboard/campaigns/${id}`}>
      <Card className="p-6 hover:shadow-lg transition-all cursor-pointer group">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div>
                <h3 className="font-semibold text-label group-hover:text-primary transition-colors">
                  {name}
                </h3>
                <Badge
                  variant={status === "active" ? "default" : "secondary"}
                  className="mt-1 text-xs"
                >
                  {status}
                </Badge>
              </div>
            </div>
          </div>

          {/* Sparkline Chart */}
          {recentClicks.length > 0 && (
            <div className="h-16">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line
                    type="monotone"
                    dataKey="y"
                    stroke={color}
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-secondary-label">
              <Link2 className="h-4 w-4" />
              <span>{linkCount} link{linkCount !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-medium text-label">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>{totalClicks.toLocaleString()} clicks</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};