import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/salaryData";

interface SalaryComparisonCardProps {
  title: string;
  current: number;
  market: number;
  format?: "currency" | "percent";
  icon?: React.ReactNode;
}

export const SalaryComparisonCard = ({
  title,
  current,
  market,
  format = "currency",
  icon
}: SalaryComparisonCardProps) => {
  const difference = current - market;
  const percentDiff = ((difference / market) * 100);
  
  const isAbove = difference > 0;
  const isBelow = difference < 0;
  const isEqual = Math.abs(percentDiff) < 1;

  const formattedCurrent = format === "currency" ? formatCurrency(current) : `${current.toFixed(1)}%`;
  const formattedMarket = format === "currency" ? formatCurrency(market) : `${market.toFixed(1)}%`;
  const formattedDiff = format === "currency" ? formatCurrency(Math.abs(difference)) : `${Math.abs(percentDiff).toFixed(1)}%`;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium lowercase">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Current Value */}
        <div>
          <div className="text-2xl font-display font-bold text-foreground">
            {formattedCurrent}
          </div>
          <div className="text-xs text-muted-foreground">your current</div>
        </div>

        {/* Comparison to Market */}
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">market median</span>
            <span className="text-sm font-medium text-foreground">{formattedMarket}</span>
          </div>
          
          <div className={cn(
            "text-xs flex items-center gap-1 mt-2",
            isAbove && "text-green-600",
            isBelow && "text-red-600",
            isEqual && "text-muted-foreground"
          )}>
            {isAbove && <ArrowUp className="h-3 w-3" />}
            {isBelow && <ArrowDown className="h-3 w-3" />}
            {isEqual && <Minus className="h-3 w-3" />}
            <span>
              {isAbove && `${formattedDiff} above market`}
              {isBelow && `${formattedDiff} below market`}
              {isEqual && 'at market rate'}
            </span>
          </div>
        </div>

        {/* Percentile Indicator */}
        {isBelow && (
          <div className="text-xs text-red-600/80 bg-red-50 p-2 rounded">
            room to negotiate up to market median
          </div>
        )}
        {isAbove && (
          <div className="text-xs text-green-600/80 bg-green-50 p-2 rounded">
            you're above market average
          </div>
        )}
      </CardContent>
    </Card>
  );
};
