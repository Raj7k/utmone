import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useState, useEffect } from "react";
import { PlanTier } from "@/lib/planConfig";

const SIMULATED_PLAN_KEY = 'SIMULATED_PLAN';
const DEMO_COLLAPSED_KEY = 'demo-mode-collapsed';

export const useDemoMode = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [simulatedPlan, setSimulatedPlan] = useState<PlanTier | null>(null);

  // Check localStorage for dismissal and collapse state
  useEffect(() => {
    const dismissed = localStorage.getItem(`demo-mode-dismissed-${currentWorkspace?.id}`);
    const collapsed = localStorage.getItem(`${DEMO_COLLAPSED_KEY}-${currentWorkspace?.id}`);
    setIsDismissed(!!dismissed);
    setIsCollapsed(!!collapsed);
  }, [currentWorkspace?.id]);

  // Listen for simulated plan changes from AdminToolbar
  useEffect(() => {
    const updateSimulatedPlan = () => {
      const plan = localStorage.getItem(SIMULATED_PLAN_KEY) as PlanTier | null;
      setSimulatedPlan(plan);
    };

    // Initial read
    updateSimulatedPlan();

    // Listen for changes
    window.addEventListener('storage-update', updateSimulatedPlan);
    window.addEventListener('storage', updateSimulatedPlan);

    return () => {
      window.removeEventListener('storage-update', updateSimulatedPlan);
      window.removeEventListener('storage', updateSimulatedPlan);
    };
  }, []);

  // Query to check if user has any links
  const { data: linksCount, isLoading } = useQuery({
    queryKey: ["links-count", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return 0;
      
      const { count, error } = await supabase
        .from("links")
        .select("*", { count: "exact", head: true })
        .eq("workspace_id", currentWorkspace.id);
      
      if (error) {
        console.error("Error fetching links count:", error);
        return 0;
      }
      
      return count || 0;
    },
    enabled: !!currentWorkspace?.id,
  });

  const hasNoLinks = linksCount === 0;
  const showDemoMode = hasNoLinks && !isDismissed && !isLoading;

  // Get the active plan (simulated or real)
  const activePlan: PlanTier = simulatedPlan || (currentWorkspace?.plan_tier as PlanTier) || 'free';

  const dismissDemoMode = () => {
    if (currentWorkspace?.id) {
      localStorage.setItem(`demo-mode-dismissed-${currentWorkspace.id}`, "true");
      setIsDismissed(true);
    }
  };

  const toggleCollapse = () => {
    if (currentWorkspace?.id) {
      const newState = !isCollapsed;
      if (newState) {
        localStorage.setItem(`${DEMO_COLLAPSED_KEY}-${currentWorkspace.id}`, "true");
      } else {
        localStorage.removeItem(`${DEMO_COLLAPSED_KEY}-${currentWorkspace.id}`);
      }
      setIsCollapsed(newState);
    }
  };

  return {
    showDemoMode,
    hasNoLinks,
    linksCount: linksCount || 0,
    isLoading,
    isCollapsed,
    activePlan,
    dismissDemoMode,
    toggleCollapse,
  };
};

// Tier-aware demo data helper
export const getDemoFeaturesForPlan = (planTier: PlanTier) => {
  const features = {
    clicks: true,
    visitors: true,
    basicAnalytics: true,
    countries: false,
    devices: false,
    referrers: false,
    attribution: false,
    journeys: false,
    predictive: false,
    identityGraph: false,
  };

  switch (planTier) {
    case 'starter':
      features.countries = true;
      features.devices = true;
      features.referrers = true;
      break;
    case 'growth':
      features.countries = true;
      features.devices = true;
      features.referrers = true;
      features.attribution = true;
      features.journeys = true;
      break;
    case 'business':
    case 'enterprise':
      features.countries = true;
      features.devices = true;
      features.referrers = true;
      features.attribution = true;
      features.journeys = true;
      features.predictive = true;
      features.identityGraph = true;
      break;
  }

  return features;
};

// Demo data for visualizations
export const DEMO_ATTRIBUTION_DATA = {
  sources: [
    { name: "LinkedIn", value: 45000, percentage: 36 },
    { name: "Google Ads", value: 32000, percentage: 26 },
    { name: "Email", value: 28000, percentage: 22 },
    { name: "Direct", value: 20000, percentage: 16 },
  ],
  totalRevenue: 125000,
  conversions: 847,
  journeys: [
    { path: ["LinkedIn", "Webinar", "Demo", "Purchase"], count: 234, revenue: 45000 },
    { path: ["Google Ads", "Landing Page", "Purchase"], count: 189, revenue: 32000 },
    { path: ["Email", "Blog", "Demo", "Purchase"], count: 156, revenue: 28000 },
  ],
};

export const DEMO_ANALYTICS_DATA = {
  totalClicks: 12847,
  uniqueVisitors: 8234,
  clicksChange: 23.5,
  topCountries: [
    { country: "United States", clicks: 4521, percentage: 35 },
    { country: "United Kingdom", clicks: 2341, percentage: 18 },
    { country: "Germany", clicks: 1876, percentage: 15 },
    { country: "France", clicks: 1234, percentage: 10 },
    { country: "Canada", clicks: 987, percentage: 8 },
  ],
  topDevices: [
    { device: "Desktop", clicks: 7108, percentage: 55 },
    { device: "Mobile", clicks: 5139, percentage: 40 },
    { device: "Tablet", clicks: 600, percentage: 5 },
  ],
  hourlyDistribution: [
    { hour: "9am", clicks: 1234 },
    { hour: "10am", clicks: 1567 },
    { hour: "11am", clicks: 1890 },
    { hour: "12pm", clicks: 2100 },
    { hour: "1pm", clicks: 1980 },
    { hour: "2pm", clicks: 1756 },
    { hour: "3pm", clicks: 1523 },
    { hour: "4pm", clicks: 1289 },
  ],
};

export const DEMO_RECENT_LINKS = [
  {
    id: "demo-1",
    title: "Summer Campaign 2025",
    shortUrl: "utm.one/summer25",
    clicks: 3456,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2", 
    title: "Product Launch Landing",
    shortUrl: "utm.one/launch",
    clicks: 2891,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    title: "LinkedIn Webinar Signup",
    shortUrl: "utm.one/webinar",
    clicks: 1987,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
