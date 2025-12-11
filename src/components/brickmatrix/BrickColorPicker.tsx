import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BrickColorPickerProps {
  foreground: string;
  background: string;
  onForegroundChange: (color: string) => void;
  onBackgroundChange: (color: string) => void;
}

export const BrickColorPicker = ({
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange,
}: BrickColorPickerProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">colors</Label>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">foreground</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={foreground}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-10 w-12 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <Input
              value={foreground.toUpperCase()}
              onChange={(e) => onForegroundChange(e.target.value)}
              className="h-10 font-mono text-xs uppercase"
              maxLength={7}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">background</Label>
          <div className="flex gap-2">
            <input
              type="color"
              value={background}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-10 w-12 rounded-lg border border-border cursor-pointer bg-transparent"
            />
            <Input
              value={background.toUpperCase()}
              onChange={(e) => onBackgroundChange(e.target.value)}
              className="h-10 font-mono text-xs uppercase"
              maxLength={7}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
