import { useMemo } from "react";
import { QRMatrixResult, BrickStyle, BrickColorId, getBrickColor } from "@/lib/qrMatrix";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface BrickPreviewProps {
  result: QRMatrixResult;
  style: BrickStyle;
  foreground: BrickColorId;
  background: BrickColorId;
}

export const BrickPreview = ({ result, style, foreground, background }: BrickPreviewProps) => {
  const fgColor = getBrickColor(foreground);
  const bgColor = getBrickColor(background);

  const svgContent = useMemo(() => {
    if (!result.isValid || result.matrix.length === 0) return null;

    const cellSize = 20;
    const studRadius = 4;
    const size = result.size;
    const totalSize = size * cellSize;

    // For inverse style, swap colors
    const fg = style === 'inverse' ? bgColor : fgColor;
    const bg = style === 'inverse' ? fgColor : bgColor;

    const cells: JSX.Element[] = [];
    const studs: JSX.Element[] = [];

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const isActive = result.matrix[row]?.[col] ?? false;
        const x = col * cellSize;
        const y = row * cellSize;
        const color = isActive ? fg : bg;

        if (style === 'studs') {
          // Studs only - circles
          cells.push(
            <circle
              key={`cell-${row}-${col}`}
              cx={x + cellSize / 2}
              cy={y + cellSize / 2}
              r={cellSize / 2 - 1}
              fill={color}
            />
          );
          // Inner stud circle
          studs.push(
            <circle
              key={`stud-${row}-${col}`}
              cx={x + cellSize / 2}
              cy={y + cellSize / 2}
              r={studRadius}
              fill={color}
              stroke={isActive ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.1)"}
              strokeWidth="1"
            />
          );
        } else if (style === 'flat') {
          // Flat tiles - simple rectangles
          cells.push(
            <rect
              key={`cell-${row}-${col}`}
              x={x + 0.5}
              y={y + 0.5}
              width={cellSize - 1}
              height={cellSize - 1}
              fill={color}
              rx="1"
            />
          );
        } else {
          // 3D style with studs and shadows
          cells.push(
            <g key={`cell-${row}-${col}`}>
              {/* Base rectangle */}
              <rect
                x={x + 0.5}
                y={y + 0.5}
                width={cellSize - 1}
                height={cellSize - 1}
                fill={color}
                rx="1"
              />
              {/* Top highlight */}
              <rect
                x={x + 1}
                y={y + 1}
                width={cellSize - 2}
                height="2"
                fill="rgba(255,255,255,0.15)"
                rx="0.5"
              />
              {/* Bottom shadow */}
              <rect
                x={x + 1}
                y={y + cellSize - 3}
                width={cellSize - 2}
                height="2"
                fill="rgba(0,0,0,0.15)"
                rx="0.5"
              />
            </g>
          );
          // Stud on top
          studs.push(
            <g key={`stud-${row}-${col}`}>
              <circle
                cx={x + cellSize / 2}
                cy={y + cellSize / 2}
                r={studRadius}
                fill={color}
                stroke="rgba(0,0,0,0.2)"
                strokeWidth="0.5"
              />
              {/* Stud highlight */}
              <ellipse
                cx={x + cellSize / 2 - 1}
                cy={y + cellSize / 2 - 1}
                rx={studRadius * 0.4}
                ry={studRadius * 0.3}
                fill="rgba(255,255,255,0.25)"
              />
            </g>
          );
        }
      }
    }

    return { cells, studs, totalSize };
  }, [result, style, fgColor, bgColor]);

  if (!result.isValid) {
    return (
      <div className="aspect-square w-full flex flex-col items-center justify-center gap-3 bg-muted/30 rounded-2xl border border-dashed border-border">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-center px-4">
          {result.warning || "enter content to preview"}
        </p>
      </div>
    );
  }

  if (!svgContent) return null;

  return (
    <div className="relative">
      {/* Baseplate container with shadow */}
      <div 
        className={cn(
          "aspect-square w-full rounded-2xl p-4",
          "bg-gradient-to-br from-muted/50 to-muted/30",
          "border border-border shadow-xl"
        )}
      >
        {/* Inner baseplate */}
        <div 
          className="w-full h-full rounded-xl overflow-hidden shadow-inner"
          style={{ backgroundColor: bgColor }}
        >
          <svg
            viewBox={`0 0 ${svgContent.totalSize} ${svgContent.totalSize}`}
            className="w-full h-full"
          >
            {/* Background */}
            <rect 
              x="0" 
              y="0" 
              width={svgContent.totalSize} 
              height={svgContent.totalSize} 
              fill={style === 'inverse' ? fgColor : bgColor}
            />
            {/* Cells */}
            {svgContent.cells}
            {/* Studs on top */}
            {style !== 'flat' && svgContent.studs}
          </svg>
        </div>
      </div>

      {/* Decorative corner studs */}
      <div className="absolute -top-1.5 -left-1.5 w-4 h-4 rounded-full bg-muted-foreground/20 border-2 border-background" />
      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-muted-foreground/20 border-2 border-background" />
      <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 rounded-full bg-muted-foreground/20 border-2 border-background" />
      <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 rounded-full bg-muted-foreground/20 border-2 border-background" />
    </div>
  );
};
