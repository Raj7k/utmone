import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { AttributionModel } from "@/hooks/useAttribution";

interface AttributionModelSelectorProps {
  value: AttributionModel;
  onChange: (value: AttributionModel) => void;
}

export const AttributionModelSelector = ({ value, onChange }: AttributionModelSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">attribution model</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[280px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="linear">
            <div className="space-y-1">
              <div className="font-medium">linear attribution</div>
              <div className="text-xs text-muted-foreground">
                equal credit to all touchpoints
              </div>
            </div>
          </SelectItem>
          <SelectItem value="time_decay">
            <div className="space-y-1">
              <div className="font-medium">time decay</div>
              <div className="text-xs text-muted-foreground">
                more credit to recent touchpoints (7-day half-life)
              </div>
            </div>
          </SelectItem>
          <SelectItem value="position">
            <div className="space-y-1">
              <div className="font-medium">position-based (u-shaped)</div>
              <div className="text-xs text-muted-foreground">
                40% first, 40% last, 20% middle
              </div>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
