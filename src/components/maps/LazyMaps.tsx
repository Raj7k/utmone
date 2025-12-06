import { lazy, Suspense, ReactNode, ComponentType } from "react";

// Map loading skeleton
const MapSkeleton = ({ height = 400 }: { height?: number }) => (
  <div 
    className="w-full flex items-center justify-center bg-muted/20 rounded-lg animate-pulse"
    style={{ height }}
  >
    <div className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
  </div>
);

// Lazy load entire map components (react-simple-maps doesn't work well with individual lazy imports)
export const LazyInteractiveWorldMap = lazy(() =>
  import("@/components/reports/visualizations/InteractiveWorldMap").then((mod) => ({ 
    default: mod.InteractiveWorldMap 
  }))
);

export const LazyUSStateMap = lazy(() =>
  import("@/components/reports/visualizations/USStateMap").then((mod) => ({ 
    default: mod.USStateMap 
  }))
);

// Lazy load @nivo/sankey
export const LazyResponsiveSankey = lazy(() =>
  import("@nivo/sankey").then((mod) => ({ default: mod.ResponsiveSankey }))
);

// Wrapper component for lazy maps with built-in Suspense
interface LazyMapContainerProps {
  children: ReactNode;
  height?: number;
}

export const LazyMapContainer = ({ children, height = 400 }: LazyMapContainerProps) => (
  <Suspense fallback={<MapSkeleton height={height} />}>
    {children}
  </Suspense>
);

export { MapSkeleton };
