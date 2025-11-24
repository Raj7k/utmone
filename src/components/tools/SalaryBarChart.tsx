import { formatCurrency } from "@/lib/salaryData";

interface SalaryBarChartProps {
  role: string;
  p10: number;
  p25: number;
  p50: number;
  p75: number;
  p90: number;
  currentSalary?: number;
}

export const SalaryBarChart = ({
  role,
  p10,
  p25,
  p50,
  p75,
  p90,
  currentSalary
}: SalaryBarChartProps) => {
  const max = p90 * 1.1; // Add 10% padding
  const getWidth = (value: number) => `${(value / max) * 100}%`;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-foreground">
          {role}
        </h3>
        <span className="text-sm text-secondary-label">
          Median: {formatCurrency(p50)}
        </span>
      </div>

      <div className="space-y-3">
        {/* 10th Percentile */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary-label">
            <span>10th Percentile</span>
            <span>{formatCurrency(p10)}</span>
          </div>
          <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
            <div
              className="h-full bg-red-500/60 transition-all duration-500"
              style={{ width: getWidth(p10) }}
            />
          </div>
        </div>

        {/* 25th Percentile */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary-label">
            <span>25th Percentile</span>
            <span>{formatCurrency(p25)}</span>
          </div>
          <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
            <div
              className="h-full bg-yellow-500/60 transition-all duration-500"
              style={{ width: getWidth(p25) }}
            />
          </div>
        </div>

        {/* 50th Percentile (Median) */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-foreground font-medium">
            <span>50th Percentile (Median)</span>
            <span>{formatCurrency(p50)}</span>
          </div>
          <div className="h-10 bg-muted/30 rounded-lg overflow-hidden border-2 border-primary/20">
            <div
              className="h-full bg-green-500/60 transition-all duration-500"
              style={{ width: getWidth(p50) }}
            />
          </div>
        </div>

        {/* 75th Percentile */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary-label">
            <span>75th Percentile</span>
            <span>{formatCurrency(p75)}</span>
          </div>
          <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
            <div
              className="h-full bg-blue-500/60 transition-all duration-500"
              style={{ width: getWidth(p75) }}
            />
          </div>
        </div>

        {/* 90th Percentile */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs text-secondary-label">
            <span>90th Percentile</span>
            <span>{formatCurrency(p90)}</span>
          </div>
          <div className="h-8 bg-muted/30 rounded-lg overflow-hidden">
            <div
              className="h-full bg-purple-500/60 transition-all duration-500"
              style={{ width: getWidth(p90) }}
            />
          </div>
        </div>

        {/* Current Salary Indicator (if provided) */}
        {currentSalary && (
          <div className="pt-4 border-t border-border/50">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-primary font-medium">
                <span>Your Current Salary</span>
                <span>{formatCurrency(currentSalary)}</span>
              </div>
              <div className="h-10 bg-muted/30 rounded-lg overflow-hidden border-2 border-primary">
                <div
                  className="h-full bg-primary transition-all duration-500 flex items-center justify-end pr-2"
                  style={{ width: getWidth(currentSalary) }}
                >
                  <span className="text-xs text-primary-foreground font-bold">YOU</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
