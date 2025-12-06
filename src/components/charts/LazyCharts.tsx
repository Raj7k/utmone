import { lazy, Suspense, ComponentType, ReactNode } from "react";

// Chart loading skeleton
const ChartSkeleton = ({ height = 300 }: { height?: number }) => (
  <div 
    className="w-full flex items-center justify-center bg-muted/20 rounded-lg animate-pulse"
    style={{ height }}
  >
    <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
  </div>
);

// Lazy load Recharts components to reduce initial bundle size
export const LazyLineChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.LineChart }))
);

export const LazyBarChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.BarChart }))
);

export const LazyPieChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.PieChart }))
);

export const LazyAreaChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.AreaChart }))
);

export const LazyRadarChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.RadarChart }))
);

export const LazyScatterChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.ScatterChart }))
);

export const LazyComposedChart = lazy(() =>
  import("recharts").then((mod) => ({ default: mod.ComposedChart }))
);

// Wrapper component for lazy charts with built-in Suspense
interface LazyChartContainerProps {
  children: ReactNode;
  height?: number;
}

export const LazyChartContainer = ({ children, height = 300 }: LazyChartContainerProps) => (
  <Suspense fallback={<ChartSkeleton height={height} />}>
    {children}
  </Suspense>
);

// Export common chart components (these are lightweight, no need to lazy load)
export { 
  Line, 
  Bar, 
  Pie, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell, 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis,
  Scatter,
  ZAxis,
  Label,
  LabelList,
  ReferenceLine
} from "recharts";

export { ChartSkeleton };
