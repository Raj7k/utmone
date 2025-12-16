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

// Wrapper components with Suspense - accept variant prop for light/dark themes
interface DropdownWrapperProps {
  variant?: "light" | "dark";
}

export function ProductDropdown({ variant = "dark" }: DropdownWrapperProps) {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazyProductMegaDropdown variant={variant} />
    </Suspense>
  );
}

export function FeaturesDropdown({ variant = "dark" }: DropdownWrapperProps) {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazyFeaturesMegaDropdown variant={variant} />
    </Suspense>
  );
}

export function SolutionsDropdown({ variant = "dark" }: DropdownWrapperProps) {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazySolutionsMegaDropdown variant={variant} />
    </Suspense>
  );
}

export function ResourcesDropdown({ variant = "dark" }: DropdownWrapperProps) {
  return (
    <Suspense fallback={<DropdownShimmer />}>
      <LazyResourcesMegaDropdown variant={variant} />
    </Suspense>
  );
}
