import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparisonCardProps {
  title: string;
  current: number;
  change: number;
  format?: "number" | "decimal";
  icon?: React.ReactNode;
}

export const ComparisonCard = ({ title, current, change, format = "number", icon }: ComparisonCardProps) => {
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
        <div className="text-2xl font-bold">{formattedCurrent}</div>
        <div className={cn(
          "text-xs flex items-center gap-1 mt-1",
          isPositive && "text-green-600",
          isNegative && "text-red-600",
          isNeutral && "text-muted-foreground"
        )}>
          {isPositive && <ArrowUp className="h-3 w-3" />}
          {isNegative && <ArrowDown className="h-3 w-3" />}
          {isNeutral && <Minus className="h-3 w-3" />}
          <span>
            {Math.abs(change).toFixed(1)}% vs last period
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
