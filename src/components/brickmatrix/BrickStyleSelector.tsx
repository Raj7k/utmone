import { BrickStyle } from "@/lib/qrMatrix";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Box, Layers, Square, Circle } from "lucide-react";

interface BrickStyleSelectorProps {
  value: BrickStyle;
  onChange: (style: BrickStyle) => void;
}

const styles: { id: BrickStyle; label: string; icon: React.ElementType; description: string }[] = [
  { id: "3d", label: "3D", icon: Box, description: "studs + shadows" },
  { id: "inverse", label: "Inverse", icon: Layers, description: "swapped colors" },
  { id: "flat", label: "Flat", icon: Square, description: "tiles only" },
  { id: "studs", label: "Studs", icon: Circle, description: "dots pattern" },
];

export const BrickStyleSelector = ({ value, onChange }: BrickStyleSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">brick style</Label>
      
      <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-muted/50 border border-border">
        {styles.map((style) => {
          const Icon = style.icon;
          const isActive = value === style.id;
          
          return (
            <button
              key={style.id}
              onClick={() => onChange(style.id)}
              className={cn(
                "flex flex-col items-center gap-1 py-2.5 px-2 rounded-lg transition-all",
                "text-xs font-medium",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{style.label}</span>
            </button>
          );
        })}
      </div>
      
      <p className="text-xs text-muted-foreground">
        {styles.find(s => s.id === value)?.description}
      </p>
    </div>
  );
};
