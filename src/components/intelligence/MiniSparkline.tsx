import { useMemo } from "react";

interface MiniSparklineProps {
  data: number[];
  color?: string;
  strokeWidth?: number;
}

export default function MiniSparkline({
  data,
  color = "hsl(var(--primary))",
  strokeWidth = 2,
}: MiniSparklineProps) {
  const path = useMemo(() => {
    if (!data || data.length === 0) return "";

    const width = 100;
    const height = 100;
    const padding = 5;

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((value - min) / range) * (height - padding * 2);
      return { x, y };
    });

    // Create smooth curve using quadratic bezier curves
    let d = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      
      if (i === 1) {
        d += ` Q ${prev.x} ${prev.y} ${midX} ${midY}`;
      } else {
        d += ` T ${midX} ${midY}`;
      }
    }
    
    // End at the last point
    const last = points[points.length - 1];
    d += ` T ${last.x} ${last.y}`;

    return d;
  }, [data]);

  const gradientId = useMemo(() => `sparkline-gradient-${Math.random().toString(36).slice(2)}`, []);

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="w-full h-full"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Area fill */}
      <path
        d={`${path} L 95 95 L 5 95 Z`}
        fill={`url(#${gradientId})`}
      />
      
      {/* Line */}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
