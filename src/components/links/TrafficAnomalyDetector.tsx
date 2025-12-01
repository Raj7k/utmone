import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react";
import { useTrafficAnomaly } from "@/hooks/useTrafficAnomaly";
import { Skeleton } from "@/components/ui/skeleton";

interface TrafficAnomalyDetectorProps {
  linkId: string;
}

export const TrafficAnomalyDetector = ({ linkId }: TrafficAnomalyDetectorProps) => {
  const { data, isLoading } = useTrafficAnomaly(linkId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">traffic pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getIcon = () => {
    if (data.status === "normal") return <CheckCircle className="h-5 w-5 text-system-green" />;
    if (data.status === "spike") return <TrendingUp className="h-5 w-5 text-system-blue" />;
    return <TrendingDown className="h-5 w-5 text-system-orange" />;
  };

  const getBadgeVariant = () => {
    if (data.status === "normal") return "default";
    if (data.status === "spike") return "default";
    return "destructive";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          {getIcon()}
          traffic pattern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant={getBadgeVariant()} className="text-sm">
            {data.status}
          </Badge>
          <span className="text-sm text-secondary-label">{data.message}</span>
        </div>
        {data.status !== "normal" && (
          <p className="text-xs text-tertiary-label mt-2">
            clean track detected unusual activity based on your historical patterns
          </p>
        )}
      </CardContent>
    </Card>
  );
};
