import { useLinkInsights, InsightType } from "@/hooks/useLinkInsights";
import { Badge } from "@/components/ui/badge";

interface LinkInsightBadgeProps {
  linkId: string;
}

const insightStyles: Record<InsightType, string> = {
  hot: "bg-red-500/10 text-red-700 border-red-500/20",
  rising: "bg-green-500/10 text-green-700 border-green-500/20",
  declining: "bg-orange-500/10 text-orange-700 border-orange-500/20",
  "at-risk": "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  dormant: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  testing: "bg-blue-500/10 text-blue-700 border-blue-500/20",
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
