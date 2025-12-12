import { lazy, Suspense, ComponentType } from "react";
import { GlassSkeleton } from "@/components/ui/glass-skeleton";

// Lazy load heavy visualization components
export const LazyHeroGlobe = lazy(() => 
  import("@/components/product/visuals/HeroGlobe").then(m => ({ default: m.HeroGlobe }))
);

export const LazyRevenueFlow = lazy(() => 
  import("@/components/product/visuals/RevenueFlow").then(m => ({ default: m.RevenueFlow }))
);

export const LazyNeuralMesh = lazy(() => 
  import("@/components/product/visuals/NeuralMesh").then(m => ({ default: m.NeuralMesh }))
);

export const LazySecurityTerminal = lazy(() => 
  import("@/components/product/visuals/SecurityTerminal").then(m => ({ default: m.SecurityTerminal }))
);

export const LazyLinkConstructor = lazy(() => 
  import("@/components/product/visuals/LinkConstructor").then(m => ({ default: m.LinkConstructor }))
);

// Wrapper component with Suspense boundary
interface LazyVisualizationWrapperProps {
  component: ComponentType;
  height?: string;
  className?: string;
}

export const LazyVisualizationWrapper = ({ 
  component: Component, 
  height = "300px",
  className 
}: LazyVisualizationWrapperProps) => (
  <Suspense fallback={<GlassSkeleton height={height} className={className} />}>
    <Component />
  </Suspense>
);
