/**
 * Analytics hooks - centralized exports
 */
export { useLandingAnalytics, useTrackPageView, useTrackCTAClick, useTrackScrollDepth, useTrackTimeOnPage } from "./useLandingPageAnalytics";
export type { VariantMetrics } from "./useLandingPageAnalytics";
export { useRealAnalytics } from "./useRealAnalytics";
export { useAnalyticsCache, useCachedLinkAnalytics, useCachedUTMAnalytics, useCachedGeolocationAnalytics, useCachedDeviceAnalytics, useCachedTimeSeriesAnalytics } from "./useAnalyticsCache";
export { useAnalyticsShare } from "./useAnalyticsShare";
