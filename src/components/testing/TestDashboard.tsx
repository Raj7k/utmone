import { TestResult } from "@/lib/testUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, TrendingUp, Clock } from "lucide-react";

interface TestDashboardProps {
  results: TestResult[];
}

export const TestDashboard = ({ results }: TestDashboardProps) => {
  if (results.length === 0) return null;

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;
  const passRate = ((passedCount / results.length) * 100).toFixed(1);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const avgDuration = (totalDuration / results.length).toFixed(0);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{passRate}%</div>
          <p className="text-xs text-muted-foreground">
            {passedCount}/{results.length} tests passed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Passed</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{passedCount}</div>
          <p className="text-xs text-muted-foreground">
            All tests completed successfully
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Failed</CardTitle>
          <XCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{failedCount}</div>
          <p className="text-xs text-muted-foreground">
            {failedCount === 0 ? 'No failures' : 'Tests requiring attention'}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgDuration}ms</div>
          <p className="text-xs text-muted-foreground">
            Total: {totalDuration}ms
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
