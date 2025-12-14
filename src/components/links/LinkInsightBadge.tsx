import { useLinkInsights, InsightType } from "@/hooks/links";
import { Badge } from "@/components/ui/badge";

interface LinkInsightBadgeProps {
  linkId: string;
}

const insightStyles: Record<InsightType, string> = {
  hot: "bg-destructive/20 text-destructive border-destructive/30",
  rising: "bg-green-500/20 text-green-600 dark:text-green-300 border-green-500/30",
  declining: "bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/30",
  "at-risk": "bg-yellow-500/20 text-yellow-600 dark:text-yellow-300 border-yellow-500/30",
  dormant: "bg-muted text-muted-foreground border-border",
  testing: "bg-primary/20 text-primary border-primary/30",
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
