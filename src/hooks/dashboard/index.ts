/**
 * Dashboard hooks - centralized exports
 */
export { useDashboardUnified } from "./useDashboardUnified";
export type { 
  DashboardLink, 
  DashboardEvent, 
  DashboardCampaign, 
  DashboardSalesLink, 
  DashboardStats, 
  DashboardOnboarding, 
  DashboardAnalytics, 
  DashboardExecutiveMetrics, 
  DashboardData 
} from "./useDashboardUnified";
export { useDashboardPreferences } from "./useDashboardPreferences";
export { useDashboardPrefetch } from "./useDashboardPrefetch";

// Core hook for DashboardHome (1 RPC call instead of 10)
export { useDashboardCore } from "./useDashboardCore";
export type { DashboardCoreLink, DashboardCoreStats, DashboardCoreOnboarding } from "./useDashboardCore";

// Domain-specific lightweight hooks
export { useSalesData } from "./useSalesData";
export type { SalesLink } from "./useSalesData";
export { useEventsData } from "./useEventsData";
export type { FieldEvent } from "./useEventsData";
export { useCampaignsData } from "./useCampaignsData";
export type { Campaign } from "./useCampaignsData";
