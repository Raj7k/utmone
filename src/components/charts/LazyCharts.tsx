import { lazy } from "react";

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

// Export common chart components
export { Line, Bar, Pie, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
