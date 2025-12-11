import { QRMatrixResult } from "@/lib/qrMatrix";
import { Grid3X3, Ruler, Boxes } from "lucide-react";

interface BrickStatsProps {
  result: QRMatrixResult;
}

export const BrickStats = ({ result }: BrickStatsProps) => {
  if (!result.isValid) return null;

  const stats = [
    {
      icon: Grid3X3,
      label: "baseplate",
      value: `${result.size}×${result.size}`,
    },
    {
      icon: Ruler,
      label: "size",
      value: `${result.physicalSize.cm.toFixed(1)}cm`,
    },
    {
      icon: Boxes,
      label: "parts",
      value: result.partsCounts.total.toLocaleString(),
    },
  ];

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="inline-flex items-center gap-4 px-4 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border shadow-lg">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center gap-3">
            {index > 0 && (
              <div className="w-px h-4 bg-border" />
            )}
            <div className="flex items-center gap-1.5">
              <stat.icon className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{stat.label}:</span>
              <span className="text-sm font-medium">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
