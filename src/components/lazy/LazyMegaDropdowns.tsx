import { lazy, Suspense } from "react";
import { DropdownShimmer } from "./LazyOnScroll";

// Lazy load mega-dropdowns - only loaded when dropdown is opened
export const LazyProductMegaDropdown = lazy(() => 
  import("@/components/landing/mega-dropdown/ProductMegaDropdown").then(m => ({ default: m.ProductMegaDropdown }))
);

export const LazyFeaturesMegaDropdown = lazy(() => 
  import("@/components/landing/mega-dropdown/features/FeaturesMegaDropdown").then(m => ({ default: m.FeaturesMegaDropdown }))
);

export const LazySolutionsMegaDropdown = lazy(() => 
  import("@/components/landing/mega-dropdown/solutions/SolutionsMegaDropdown").then(m => ({ default: m.SolutionsMegaDropdown }))
);

export const LazyResourcesMegaDropdown = lazy(() => 
  import("@/components/landing/mega-dropdown/resources/ResourcesMegaDropdown").then(m => ({ default: m.ResourcesMegaDropdown }))
);

// Wrapper components with Suspense
export function ProductDropdown() {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazyProductMegaDropdown />
    </Suspense>
  );
}

export function FeaturesDropdown() {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazyFeaturesMegaDropdown />
    </Suspense>
  );
}

export function SolutionsDropdown() {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazySolutionsMegaDropdown />
    </Suspense>
  );
}

export function ResourcesDropdown() {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazyResourcesMegaDropdown />
    </Suspense>
  );
}
