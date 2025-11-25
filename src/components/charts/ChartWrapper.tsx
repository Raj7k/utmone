import { Suspense, ReactNode } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

interface ChartWrapperProps {
  children: ReactNode;
  height?: number;
  className?: string;
}

export const ChartWrapper = ({ children, height = 300, className }: ChartWrapperProps) => {
  return (
    <Suspense
      fallback={
        <Card className={className}>
          <CardContent className="pt-6">
            <Skeleton className="w-full" style={{ height: `${height}px` }} />
          </CardContent>
        </Card>
      }
    >
      {children}
    </Suspense>
  );
};
