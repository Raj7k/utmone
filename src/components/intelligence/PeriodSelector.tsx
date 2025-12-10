import { useState } from "react";
import { format, subDays, subWeeks, subMonths, subQuarters, subYears } from "date-fns";
import { Calendar as CalendarIcon, GitCompare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

export type PeriodOption = "today" | "this_week" | "this_month" | "this_quarter" | "7d" | "30d" | "90d" | "365d" | "custom";

export interface DateRange {
  from: Date;
  to: Date;
}

interface PeriodSelectorProps {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
  customRange?: DateRange;
  onCustomRangeChange?: (range: DateRange) => void;
  compareEnabled?: boolean;
  onCompareChange?: (enabled: boolean) => void;
}

export const periodLabels: Record<PeriodOption, string> = {
  today: "today",
  this_week: "this week",
  this_month: "this month",
  this_quarter: "this quarter",
  "7d": "last 7 days",
  "30d": "last 30 days",
  "90d": "last 90 days",
  "365d": "last year",
  custom: "custom range",
};

export const periodDays: Record<PeriodOption, number> = {
  today: 1,
  this_week: 7,
  this_month: 30,
  this_quarter: 90,
  "7d": 7,
  "30d": 30,
  "90d": 90,
  "365d": 365,
  custom: 0,
};

export const getComparisonLabel = (period: PeriodOption): string => {
  switch (period) {
    case "today": return "vs yesterday";
    case "this_week": return "vs last week";
    case "this_month": return "vs last month";
    case "this_quarter": return "vs last quarter";
    case "7d": return "vs prev 7 days";
    case "30d": return "vs prev 30 days";
    case "90d": return "vs prev 90 days";
    case "365d": return "vs prev year";
    case "custom": return "vs prev period";
    default: return "vs previous";
  }
};

export const getComparisonRange = (period: PeriodOption, customRange?: DateRange): DateRange | null => {
  const now = new Date();
  
  switch (period) {
    case "today":
      return { from: subDays(now, 1), to: subDays(now, 1) };
    case "this_week":
      return { from: subWeeks(now, 1), to: subDays(now, 7) };
    case "this_month":
      return { from: subMonths(now, 1), to: subDays(now, 30) };
    case "this_quarter":
      return { from: subQuarters(now, 1), to: subDays(now, 90) };
    case "7d":
      return { from: subDays(now, 14), to: subDays(now, 8) };
    case "30d":
      return { from: subDays(now, 60), to: subDays(now, 31) };
    case "90d":
      return { from: subDays(now, 180), to: subDays(now, 91) };
    case "365d":
      return { from: subYears(now, 2), to: subYears(now, 1) };
    case "custom":
      if (customRange) {
        const rangeDays = Math.ceil((customRange.to.getTime() - customRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
        return {
          from: subDays(customRange.from, rangeDays),
          to: subDays(customRange.from, 1)
        };
      }
      return null;
    default:
      return null;
  }
};

export function PeriodSelector({ 
  value, 
  onChange, 
  customRange, 
  onCustomRangeChange,
  compareEnabled = false,
  onCompareChange 
}: PeriodSelectorProps) {
  const [isCustomOpen, setIsCustomOpen] = useState(false);
  const [tempRange, setTempRange] = useState<{ from?: Date; to?: Date }>({
    from: customRange?.from,
    to: customRange?.to,
  });

  const handleApplyCustomRange = () => {
    if (tempRange.from && tempRange.to && onCustomRangeChange) {
      onCustomRangeChange({ from: tempRange.from, to: tempRange.to });
      onChange("custom");
      setIsCustomOpen(false);
    }
  };

  const getDisplayValue = () => {
    if (value === "custom" && customRange) {
      return `${format(customRange.from, "MMM d")} - ${format(customRange.to, "MMM d")}`;
    }
    return periodLabels[value];
  };

  return (
    <div className="flex items-center gap-2">
      <Select 
        value={value} 
        onValueChange={(v) => {
          if (v === "custom") {
            setIsCustomOpen(true);
          } else {
            onChange(v as PeriodOption);
          }
        }}
      >
        <SelectTrigger className="w-[180px] h-10 rounded-xl border-border/50 bg-card/50">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{getDisplayValue()}</span>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="today">today</SelectItem>
          <SelectItem value="this_week">this week</SelectItem>
          <SelectItem value="this_month">this month</SelectItem>
          <SelectItem value="this_quarter">this quarter</SelectItem>
          <div className="my-1 border-t border-border" />
          <SelectItem value="7d">last 7 days</SelectItem>
          <SelectItem value="30d">last 30 days</SelectItem>
          <SelectItem value="90d">last 90 days</SelectItem>
          <SelectItem value="365d">last year</SelectItem>
          <div className="my-1 border-t border-border" />
          <SelectItem value="custom">custom range...</SelectItem>
        </SelectContent>
      </Select>

      {/* Compare Toggle */}
      {onCompareChange && (
        <Toggle
          pressed={compareEnabled}
          onPressedChange={onCompareChange}
          size="sm"
          className={cn(
            "h-10 px-3 rounded-xl border border-border/50 bg-card/50 gap-2",
            compareEnabled && "bg-primary/10 border-primary/30 text-primary"
          )}
          aria-label="Toggle comparison mode"
        >
          <GitCompare className="h-4 w-4" />
          <span className="hidden sm:inline text-sm">
            {compareEnabled ? getComparisonLabel(value) : "compare"}
          </span>
        </Toggle>
      )}

      <Popover open={isCustomOpen} onOpenChange={setIsCustomOpen}>
        <PopoverTrigger asChild>
          <span className="hidden" />
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div className="text-sm font-medium text-foreground">Select date range</div>
            <div className="flex gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">From</label>
                <Calendar
                  mode="single"
                  selected={tempRange.from}
                  onSelect={(date) => setTempRange(prev => ({ ...prev, from: date }))}
                  disabled={(date) => date > new Date() || (tempRange.to ? date > tempRange.to : false)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto rounded-lg border border-border")}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">To</label>
                <Calendar
                  mode="single"
                  selected={tempRange.to}
                  onSelect={(date) => setTempRange(prev => ({ ...prev, to: date }))}
                  disabled={(date) => date > new Date() || (tempRange.from ? date < tempRange.from : false)}
                  className={cn("p-3 pointer-events-auto rounded-lg border border-border")}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => setIsCustomOpen(false)}>
                cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleApplyCustomRange}
                disabled={!tempRange.from || !tempRange.to}
              >
                apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}