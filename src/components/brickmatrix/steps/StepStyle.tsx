import { BrickStyle, BrickColorId, BRICK_COLORS, getBrickColor } from "@/lib/qrMatrix";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Box, Layers, Square, Circle, Check } from "lucide-react";

interface StepStyleProps {
  style: BrickStyle;
  onStyleChange: (style: BrickStyle) => void;
  foreground: BrickColorId;
  background: BrickColorId;
  onForegroundChange: (color: BrickColorId) => void;
  onBackgroundChange: (color: BrickColorId) => void;
}

const styles: { id: BrickStyle; label: string; icon: React.ElementType; description: string }[] = [
  { id: "3d", label: "3D", icon: Box, description: "studs + shadows" },
  { id: "inverse", label: "Inverse", icon: Layers, description: "swapped colors" },
  { id: "flat", label: "Flat", icon: Square, description: "tiles only" },
  { id: "studs", label: "Studs", icon: Circle, description: "dots pattern" },
];

export const StepStyle = ({
  style,
  onStyleChange,
  foreground,
  background,
  onForegroundChange,
  onBackgroundChange,
}: StepStyleProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">customize your design</h3>
        <p className="text-sm text-muted-foreground">pick a style and colors for your brick QR</p>
      </div>

      {/* Brick Style */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">brick style</Label>
        <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-muted/50 border border-border">
          {styles.map((s) => {
            const Icon = s.icon;
            const isActive = style === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onStyleChange(s.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-3 px-2 rounded-lg transition-all",
                  "text-xs font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">{styles.find(s => s.id === style)?.description}</p>
      </div>

      {/* Foreground Color */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-sm border border-border shadow-sm"
            style={{ backgroundColor: getBrickColor(foreground) }}
          />
          <Label className="text-sm font-medium">foreground</Label>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {BRICK_COLORS.map((color) => (
            <button
              key={`fg-${color.id}`}
              onClick={() => onForegroundChange(color.id)}
              className={cn(
                "w-9 h-9 rounded-lg transition-all relative",
                "border-2 shadow-sm hover:scale-110",
                foreground === color.id 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border/50 hover:border-border"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {foreground === color.id && (
                <Check className={cn(
                  "absolute inset-0 m-auto h-4 w-4",
                  ['white', 'yellow', 'tan', 'light-gray', 'pink'].includes(color.id) ? "text-black/70" : "text-white/90"
                )} />
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
        <div className="grid grid-cols-7 gap-2">
          {BRICK_COLORS.map((color) => (
            <button
              key={`bg-${color.id}`}
              onClick={() => onBackgroundChange(color.id)}
              className={cn(
                "w-9 h-9 rounded-lg transition-all relative",
                "border-2 shadow-sm hover:scale-110",
                background === color.id 
                  ? "border-primary ring-2 ring-primary/20" 
                  : "border-border/50 hover:border-border"
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            >
              {background === color.id && (
                <Check className={cn(
                  "absolute inset-0 m-auto h-4 w-4",
                  ['white', 'yellow', 'tan', 'light-gray', 'pink'].includes(color.id) ? "text-black/70" : "text-white/90"
                )} />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
