/**
 * Main hooks barrel file - re-exports from domain-specific folders
 * This provides backward compatibility while organizing hooks by domain
 */

// Core hooks - re-export from dashboard folder (removed duplicate root file)
export { useDashboardUnified } from "./dashboard/useDashboardUnified";
export { useToast } from "./use-toast";
export { useIsMobile } from "./use-mobile";

// Domain-specific hook exports
export * from "./auth";
export * from "./dashboard";
export * from "./workspace";
export * from "./links";
export * from "./analytics";
export * from "./campaigns";
export * from "./attribution";
export * from "./ai";
export * from "./notifications";
export * from "./billing";
export * from "./security";
export * from "./bulk";
export * from "./qr";
export * from "./events";
export * from "./integrations";
export * from "./ui";
export * from "./experiments";
export * from "./domains";
export * from "./features";
export * from "./predictions";
