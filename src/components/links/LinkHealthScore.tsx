import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useLinkHealthScore } from "@/hooks/useLinkHealthScore";
import { Skeleton } from "@/components/ui/skeleton";

interface LinkHealthScoreProps {
  linkId: string;
}

export const LinkHealthScore = ({ linkId }: LinkHealthScoreProps) => {
  const { data, isLoading } = useLinkHealthScore(linkId);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">link health</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-system-green";
    if (score >= 60) return "text-system-orange";
    return "text-system-red";
  };

  const getStatusIcon = (status: string) => {
    if (status === "good") return <CheckCircle className="h-4 w-4 text-system-green" />;
    if (status === "warning") return <AlertTriangle className="h-4 w-4 text-system-orange" />;
    return <XCircle className="h-4 w-4 text-system-red" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">link health</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-4xl font-bold ${getScoreColor(data.score)}`}>
              {data.score}/100
            </p>
            <p className="text-sm text-secondary-label mt-1">
              {data.score >= 80
                ? "this link is doing well"
                : data.score >= 60
                ? "room for improvement"
                : "needs attention"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {data.factors.map((factor) => (
            <div
              key={factor.name}
              className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
            >
              <div className="flex items-center gap-2">
                {getStatusIcon(factor.status)}
                <span className="text-sm text-label capitalize">{factor.name}</span>
              </div>
              <Badge variant="outline">{factor.score}/100</Badge>
            </div>
          ))}
        </div>

        {data.recommendations.length > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs font-medium text-label mb-2">suggestions:</p>
            <ul className="space-y-1">
              {data.recommendations.map((rec, idx) => (
                <li key={idx} className="text-xs text-secondary-label">
                  • {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
