import { Info } from "lucide-react";
import { CalculationMetadata } from "@/hooks/useFieldEvents";
import { format, parseISO } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface EventAuditTooltipProps {
  metadata: CalculationMetadata | null;
  baselineVisitors: number;
}

export const EventAuditTooltip = ({ metadata, baselineVisitors }: EventAuditTooltipProps) => {
  if (!metadata) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'MMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-help">
          <Info className="w-3 h-3" />
          how was this calculated?
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-sm p-4">
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-foreground mb-1">methodology</p>
              <p className="text-muted-foreground">
                {metadata.methodology === 'geo-temporal-lift-v2' 
                  ? 'geo-temporal lift analysis v2 (with control group)'
                  : metadata.methodology
                }
              </p>
            </div>
            
            <div>
              <p className="font-medium text-foreground mb-1">baseline period</p>
              <p className="text-muted-foreground">
                {formatDate(metadata.baseline_period.start)} – {formatDate(metadata.baseline_period.end)}
                <br />
                ({metadata.baseline_days} days, ~{Math.round(baselineVisitors / metadata.baseline_days)} visitors/day)
              </p>
            </div>

            {metadata.control_city && (
              <div>
                <p className="font-medium text-foreground mb-1">control group</p>
                <p className="text-muted-foreground">
                  {metadata.control_city} (lift: {metadata.control_lift_percentage.toFixed(0)}%)
                </p>
              </div>
            )}

            <div>
              <p className="font-medium text-foreground mb-1">data quality</p>
              <p className="text-muted-foreground">
                {metadata.bots_filtered > 0 && `${metadata.bots_filtered} bots filtered, `}
                {metadata.internal_ips_filtered > 0 && `${metadata.internal_ips_filtered} internal IPs excluded, `}
                first-party pixel data only
              </p>
            </div>

            <div className="pt-2 border-t border-border text-xs text-muted-foreground">
              calculated: {formatDate(metadata.calculated_at)}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
