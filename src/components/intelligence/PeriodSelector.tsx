import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

export type PeriodOption = "today" | "this_week" | "this_month" | "this_quarter" | "7d" | "30d" | "90d" | "365d";

interface PeriodSelectorProps {
  value: PeriodOption;
  onChange: (period: PeriodOption) => void;
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
};

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as PeriodOption)}>
      <SelectTrigger className="w-[160px] h-10 rounded-xl border-border/50 bg-card/50">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <SelectValue />
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
      </SelectContent>
    </Select>
  );
}
