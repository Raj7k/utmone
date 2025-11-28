import { Card } from "@/components/ui/card";
import { AIInsights } from "@/components/dashboard/AIInsights";

export const AIInsightsTile = () => {
  return (
    <Card variant="grouped" className="h-full">
      <AIInsights />
    </Card>
  );
};
