import { Suspense, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartWrapperProps {
  children: ReactNode;
  height?: number;
  className?: string;
  accessibilityData?: {
    caption: string;
    headers: string[];
    rows: (string | number)[][];
  };
}

export const ChartWrapper = ({ 
  children, 
  height = 300, 
  className,
  accessibilityData 
}: ChartWrapperProps) => {
  return (
    <div className={cn("relative", className)}>
      <Suspense
        fallback={
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="w-full" style={{ height: `${height}px` }} />
            </CardContent>
          </Card>
        }
      >
        {children}
      </Suspense>

      {/* Screen Reader Accessible Table */}
      {accessibilityData && (
        <table className="sr-only" aria-label={accessibilityData.caption}>
          <caption>{accessibilityData.caption}</caption>
          <thead>
            <tr>
              {accessibilityData.headers.map((header, i) => (
                <th key={i} scope="col">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accessibilityData.rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
