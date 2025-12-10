import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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

export function PeriodSelector({ value, onChange, customRange, onCustomRangeChange }: PeriodSelectorProps) {
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
