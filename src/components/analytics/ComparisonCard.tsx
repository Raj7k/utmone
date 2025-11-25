import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrendSparkline } from "./TrendSparkline";

interface ComparisonCardProps {
  title: string;
  current: number;
  change: number;
  format?: "number" | "decimal";
  icon?: React.ReactNode;
  trendData?: number[];
}

export const ComparisonCard = ({ title, current, change, format = "number", icon, trendData }: ComparisonCardProps) => {
  const formattedCurrent = format === "decimal" ? current.toFixed(1) : current.toLocaleString();
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-display font-bold">{formattedCurrent}</div>
        <div className="flex items-center justify-between gap-4 mt-1">
          <div className={cn(
            "text-xs flex items-center gap-1",
            isPositive && "text-system-green",
            isNegative && "text-system-red",
            isNeutral && "text-secondary-label"
          )}>
            {isPositive && <ArrowUp className="h-3 w-3" />}
            {isNegative && <ArrowDown className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            <span>
              {Math.abs(change).toFixed(1)}% vs last period
            </span>
          </div>
          {trendData && trendData.length > 0 && (
            <TrendSparkline data={trendData} change={change} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
