import { useLinkInsights, InsightType } from "@/hooks/useLinkInsights";
import { Badge } from "@/components/ui/badge";

interface LinkInsightBadgeProps {
  linkId: string;
}

const insightStyles: Record<InsightType, string> = {
  hot: "bg-red-500/20 text-red-300 border-red-500/30",
  rising: "bg-green-500/20 text-green-300 border-green-500/30",
  declining: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  "at-risk": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  dormant: "bg-white/10 text-white/60 border-white/20",
  testing: "bg-primary/20 text-primary/80 border-primary/30",
};

export const LinkInsightBadge = ({ linkId }: LinkInsightBadgeProps) => {
  const { data: insight, isLoading } = useLinkInsights(linkId);

  if (isLoading || !insight) return null;

  return (
    <Badge variant="outline" className={`${insightStyles[insight.type]} font-medium`}>
      {insight.label}
      {insight.confidence && (
        <span className="ml-1 text-xs opacity-70">
          {insight.confidence}%
        </span>
      )}
    </Badge>
  );
};
