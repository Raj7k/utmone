import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClickHeatmap } from "@/hooks/useClickHeatmap";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, CalendarDays } from "lucide-react";

interface BestTimeCardProps {
  workspaceId: string;
  linkId?: string;
  days?: number;
}

export const BestTimeCard = ({ workspaceId, linkId, days = 30 }: BestTimeCardProps) => {
  const { bestTimes, bestDay, isLoading } = useClickHeatmap({ workspaceId, linkId, days });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const topTime = bestTimes[0];
  const formatHour = (hour: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${period}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Best Time to Post
        </CardTitle>
        <CardDescription>
          When your audience is most active
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Insight */}
        {topTime && topTime.clicks > 0 ? (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2">Peak Activity</p>
            <p className="text-2xl font-semibold">
              {topTime.dayName} at {formatHour(topTime.hour)}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {topTime.clicks} clicks during this hour
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-muted text-center">
            <p className="text-sm text-muted-foreground">
              Not enough data to determine best posting times
            </p>
          </div>
        )}

        {/* Best Day */}
        {bestDay.clicks > 0 && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <CalendarDays className="h-5 w-5 mt-0.5 text-primary" />
            <div>
              <p className="font-medium">{bestDay.dayName}</p>
              <p className="text-sm text-muted-foreground">
                Best day overall with {bestDay.clicks} total clicks
              </p>
            </div>
          </div>
        )}

        {/* Top 3 Times */}
        {bestTimes.length > 0 && bestTimes[0].clicks > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Top Posting Times</p>
            <div className="space-y-2">
              {bestTimes.slice(0, 3).map((time, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm p-2 rounded bg-muted/30"
                >
                  <span className="text-muted-foreground">
                    #{index + 1} · {time.dayName} at {formatHour(time.hour)}
                  </span>
                  <span className="font-medium">{time.clicks} clicks</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
