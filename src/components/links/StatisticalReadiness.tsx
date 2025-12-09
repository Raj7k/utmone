import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, TrendingUp, BarChart3, Sparkles } from "lucide-react";
import { useStatisticalReadiness, ReliabilityTier } from "@/hooks/useStatisticalReadiness";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticalReadinessProps {
  linkId: string;
}

const tierConfig: Record<ReliabilityTier, { message: string; icon: React.ReactNode; color: string }> = {
  gathering: {
    message: "gathering initial data...",
    icon: <Sparkles className="h-4 w-4" />,
    color: "text-muted-foreground"
  },
  minimum: {
    message: "early insights available",
    icon: <BarChart3 className="h-4 w-4" />,
    color: "text-muted-foreground"
  },
  early: {
    message: "data confidence growing",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "text-foreground"
  },
  good: {
    message: "good data reliability",
    icon: <TrendingUp className="h-4 w-4 text-primary" />,
    color: "text-foreground"
  },
  reliable: {
    message: "reliable insights ✓",
    icon: <CheckCircle className="h-5 w-5 text-primary" />,
    color: "text-primary"
  }
};

export const StatisticalReadiness = ({ linkId }: StatisticalReadinessProps) => {
  const { data, isLoading } = useStatisticalReadiness(linkId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">data reliability</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const config = tierConfig[data.tier];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {config.icon}
          data reliability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={data.progress} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className={config.color}>
            {config.message}
          </span>
          <span className="text-foreground font-medium">{data.progress}%</span>
        </div>
        {!data.isReady && data.samplesNeeded > 0 && (
          <p className="text-xs text-muted-foreground">
            ~{data.samplesNeeded} more clicks to reach full reliability
          </p>
        )}
      </CardContent>
    </Card>
  );
};
