// Preload dropdown chunks on hover (before user clicks)
// This eliminates loading delay when dropdown opens

const preloadDropdownChunks = {
  product: () => import("@/components/landing/mega-dropdown/ProductMegaDropdown"),
  features: () => import("@/components/landing/mega-dropdown/features/FeaturesMegaDropdown"),
  solutions: () => import("@/components/landing/mega-dropdown/solutions/SolutionsMegaDropdown"),
  resources: () => import("@/components/landing/mega-dropdown/resources/ResourcesMegaDropdown"),
  tools: () => import("@/components/landing/mega-dropdown/tools/ToolsMegaDropdown"),
};

const preloadedDropdowns = new Set<string>();

export function preloadDropdown(key: keyof typeof preloadDropdownChunks) {
  if (preloadedDropdowns.has(key)) return;
  preloadedDropdowns.add(key);
  // Trigger dynamic import to cache the chunk
  preloadDropdownChunks[key]();
}

// Create handler for use in onMouseEnter/onFocus
export function createDropdownPreloadHandler(key: keyof typeof preloadDropdownChunks) {
  return () => preloadDropdown(key);
}
