import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle } from "lucide-react";
import { useStatisticalReadiness } from "@/hooks/useStatisticalReadiness";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticalReadinessProps {
  linkId: string;
}

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {data.isReady && <CheckCircle className="h-5 w-5 text-system-green" />}
          data reliability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={data.progress} className="h-2" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-secondary-label">
            {data.isReady ? "you have enough data ✓" : `~${data.samplesNeeded} more clicks for reliable insights`}
          </span>
          <span className="text-label font-medium">{data.progress}%</span>
        </div>
        {!data.isReady && data.progress > 50 && (
          <p className="text-xs text-tertiary-label">
            {data.progress}% there — keep sharing your link
          </p>
        )}
      </CardContent>
    </Card>
  );
};
