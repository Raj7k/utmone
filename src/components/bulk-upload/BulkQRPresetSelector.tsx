import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

interface QRPreset {
  name: string;
  primaryColor: string;
  secondaryColor: string;
  cornerStyle: "square" | "rounded";
}

const presets: QRPreset[] = [
  {
    name: "brand colors",
    primaryColor: "#EE3B3B",
    secondaryColor: "#1A1A1A",
    cornerStyle: "rounded",
  },
  {
    name: "monochrome",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    cornerStyle: "square",
  },
  {
    name: "electric blue",
    primaryColor: "#2B6CB0",
    secondaryColor: "#90CDF4",
    cornerStyle: "rounded",
  },
];

interface BulkQRPresetSelectorProps {
  onSelectPreset: (preset: QRPreset) => void;
}

export const BulkQRPresetSelector = ({ onSelectPreset }: BulkQRPresetSelectorProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center gap-2">
        <Palette className="h-4 w-4" />
        quick presets
      </label>
      <div className="flex gap-2">
        {presets.map((preset) => (
          <Button
            key={preset.name}
            variant="outline"
            size="sm"
            onClick={() => onSelectPreset(preset)}
            className="text-xs"
          >
            {preset.name}
          </Button>
        ))}
      </div>
    </div>
  );
};
