import { isLightColor } from "@/lib/colorExtractor";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BrandPaletteDisplayProps {
  colors: string[];
  className?: string;
}

export function BrandPaletteDisplay({ colors, className }: BrandPaletteDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyColor = async (color: string, index: number) => {
    await navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  if (colors.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        brand palette extracted
      </p>
      <div className="flex gap-2">
        {colors.map((color, index) => (
          <button
            key={index}
            onClick={() => copyColor(color, index)}
            className="group relative flex flex-col items-center gap-1 transition-transform hover:scale-105"
          >
            <div
              className="w-14 h-14 rounded-lg border border-border shadow-sm flex items-center justify-center transition-all group-hover:shadow-md"
              style={{ backgroundColor: color }}
            >
              {copiedIndex === index ? (
                <Check 
                  className={cn(
                    "h-4 w-4",
                    isLightColor(color) ? "text-zinc-800" : "text-white"
                  )} 
                />
              ) : (
                <Copy 
                  className={cn(
                    "h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    isLightColor(color) ? "text-zinc-800" : "text-white"
                  )} 
                />
              )}
            </div>
            <span className="text-[10px] font-mono text-muted-foreground uppercase">
              {color}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
