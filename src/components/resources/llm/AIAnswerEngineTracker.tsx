import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, ExternalLink } from "lucide-react";

interface PlatformStats {
  platform: string;
  logo: string;
  traffic: number;
  citations: number;
  topQueries: string[];
  position: number;
  trend: "up" | "down" | "stable";
}

const mockStats: PlatformStats[] = [
  {
    platform: "ChatGPT",
    logo: "🤖",
    traffic: 2847,
    citations: 156,
    topQueries: ["what are utm parameters", "utm tracking guide", "utm naming conventions"],
    position: 1,
    trend: "up"
  },
  {
    platform: "Claude",
    logo: "🧠",
    traffic: 1923,
    citations: 98,
    topQueries: ["utm best practices", "utm parameter examples", "how to use utm codes"],
    position: 2,
    trend: "up"
  },
  {
    platform: "Perplexity",
    logo: "🔍",
    traffic: 1456,
    citations: 72,
    topQueries: ["utm guide 2024", "campaign tracking parameters", "analytics utm setup"],
    position: 1,
    trend: "stable"
  },
  {
    platform: "Gemini",
    logo: "✨",
    traffic: 834,
    citations: 43,
    topQueries: ["utm definition", "utm vs tracking pixels", "marketing analytics utms"],
    position: 3,
    trend: "down"
  }
];

export const AIAnswerEngineTracker = () => {
  const totalTraffic = mockStats.reduce((sum, stat) => sum + stat.traffic, 0);
  const totalCitations = mockStats.reduce((sum, stat) => sum + stat.citations, 0);

  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (trend === "down") return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return <span className="w-4 h-4 text-white/50">—</span>;
  };

  return (
    <Card className="p-8 bg-card border border-border rounded-xl">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-display font-semibold text-foreground">
            AI Answer Engine Tracker
          </h3>
          <Badge variant="outline" className="text-xs">
            Mock Data
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Track traffic and citations from AI platforms (requires utm.one integration)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Total AI Traffic (30 days)</p>
          <p className="text-3xl font-bold text-foreground">{totalTraffic.toLocaleString()}</p>
        </div>
        <div className="p-4 bg-muted/30 rounded-lg">
          <p className="text-sm text-muted-foreground mb-1">Total Citations</p>
          <p className="text-3xl font-bold text-foreground">{totalCitations}</p>
        </div>
      </div>

      <div className="space-y-4">
        {mockStats.map((stat, index) => (
          <div key={index} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{stat.logo}</span>
                <div>
                  <h4 className="font-semibold text-foreground">{stat.platform}</h4>
                  <p className="text-xs text-muted-foreground">
                    Position #{stat.position} • {stat.traffic.toLocaleString()} visits
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getTrendIcon(stat.trend)}
                <Badge variant={stat.trend === "up" ? "default" : "outline"}>
                  {stat.citations} citations
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-foreground mb-2">Top Queries Driving Citations:</p>
              <div className="space-y-1">
                {stat.topQueries.map((query, i) => (
                  <div key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>"{query}"</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Want to Track This for Your Content?
            </p>
            <p className="text-xs text-muted-foreground">
              utm.one tracks AI referral traffic with UTM parameters: utm_source=chatgpt|claude|perplexity|gemini and utm_medium=ai-referral
            </p>
          </div>
          <Button size="sm" variant="outline">
            <ExternalLink className="w-4 h-4 mr-2" />
            Learn More
          </Button>
        </div>
      </div>
    </Card>
  );
};
