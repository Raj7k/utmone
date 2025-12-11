import { useMemo, forwardRef } from "react";
import { QRMatrixResult, BrickStyle } from "@/lib/qrMatrix";
import { AlertCircle } from "lucide-react";

interface BrickPreviewProps {
  result: QRMatrixResult;
  style: BrickStyle;
  foreground: string;
  background: string;
}

export const BrickPreview = forwardRef<SVGSVGElement, BrickPreviewProps>(
  ({ result, style, foreground, background }, ref) => {
    const svgContent = useMemo(() => {
      if (!result.isValid || result.matrix.length === 0) return null;

      const cellSize = 20;
      const studRadius = 4;
      const size = result.size;
      const totalSize = size * cellSize;

      // For inverse style, swap colors
      const fg = style === "inverse" ? background : foreground;
      const bg = style === "inverse" ? foreground : background;

      const cells: JSX.Element[] = [];
      const studs: JSX.Element[] = [];

      for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
          const isActive = result.matrix[row]?.[col] ?? false;
          const x = col * cellSize;
          const y = row * cellSize;
          const color = isActive ? fg : bg;

          if (style === "studs") {
            cells.push(
              <circle
                key={`cell-${row}-${col}`}
                cx={x + cellSize / 2}
                cy={y + cellSize / 2}
                r={cellSize / 2 - 1}
                fill={color}
              />
            );
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
          } else if (style === "flat") {
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
                <rect
                  x={x + 0.5}
                  y={y + 0.5}
                  width={cellSize - 1}
                  height={cellSize - 1}
                  fill={color}
                  rx="1"
                />
                <rect
                  x={x + 1}
                  y={y + 1}
                  width={cellSize - 2}
                  height="2"
                  fill="rgba(255,255,255,0.15)"
                  rx="0.5"
                />
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

      return { cells, studs, totalSize, bg };
    }, [result, style, foreground, background]);

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
      <div className="aspect-square w-full rounded-2xl overflow-hidden border border-border">
        <svg
          ref={ref}
          viewBox={`0 0 ${svgContent.totalSize} ${svgContent.totalSize}`}
          className="w-full h-full"
        >
          <rect
            x="0"
            y="0"
            width={svgContent.totalSize}
            height={svgContent.totalSize}
            fill={svgContent.bg}
          />
          {svgContent.cells}
          {style !== "flat" && svgContent.studs}
        </svg>
      </div>
    );
  }
);

BrickPreview.displayName = "BrickPreview";
