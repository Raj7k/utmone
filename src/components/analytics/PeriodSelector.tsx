import { cn } from "@/lib/utils";

type Period = "day" | "week" | "month";

interface PeriodSelectorProps {
  value: Period;
  onChange: (period: Period) => void;
  className?: string;
}

export const PeriodSelector = ({ value, onChange, className }: PeriodSelectorProps) => {
  const periods: { value: Period; label: string }[] = [
    { value: "day", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  return (
    <div className={cn("inline-flex rounded-xl bg-grouped-background p-1 gap-1", className)}>
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
            value === period.value
              ? "bg-system-background text-label shadow-sm"
              : "text-secondary-label hover:text-label"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
};
