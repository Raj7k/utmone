import { BRICK_COLORS, BrickColorId, getBrickColor } from "@/lib/qrMatrix";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

interface BrickColorPaletteProps {
  foreground: BrickColorId;
  background: BrickColorId;
  onForegroundChange: (color: BrickColorId) => void;
  onBackgroundChange: (color: BrickColorId) => void;
}

export const BrickColorPalette = ({
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange,
}: BrickColorPaletteProps) => {
  return (
    <div className="space-y-4">
      {/* Foreground Color */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-sm border border-border shadow-sm"
            style={{ backgroundColor: getBrickColor(foreground) }}
          />
          <Label className="text-sm font-medium">foreground</Label>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {BRICK_COLORS.map((color) => (
            <button
              key={`fg-${color.id}`}
              onClick={() => onForegroundChange(color.id)}
              className={cn(
                "w-8 h-8 rounded-lg transition-all relative",
                "border-2 shadow-sm hover:scale-110",
                foreground === color.id 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border/50 hover:border-border"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {foreground === color.id && (
                <Check 
                  className={cn(
                    "absolute inset-0 m-auto h-4 w-4",
                    color.id === 'white' || color.id === 'yellow' || color.id === 'tan' || color.id === 'light-gray' || color.id === 'pink'
                      ? "text-black/70" 
                      : "text-white/90"
                  )} 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-sm border border-border shadow-sm"
            style={{ backgroundColor: getBrickColor(background) }}
          />
          <Label className="text-sm font-medium">background</Label>
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {BRICK_COLORS.map((color) => (
            <button
              key={`bg-${color.id}`}
              onClick={() => onBackgroundChange(color.id)}
              className={cn(
                "w-8 h-8 rounded-lg transition-all relative",
                "border-2 shadow-sm hover:scale-110",
                background === color.id 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border/50 hover:border-border"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {background === color.id && (
                <Check 
                  className={cn(
                    "absolute inset-0 m-auto h-4 w-4",
                    color.id === 'white' || color.id === 'yellow' || color.id === 'tan' || color.id === 'light-gray' || color.id === 'pink'
                      ? "text-black/70" 
                      : "text-white/90"
                  )} 
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
