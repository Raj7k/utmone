import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useState, useEffect } from "react";

export const useDemoMode = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const [isDismissed, setIsDismissed] = useState(false);

  // Check localStorage for dismissal
  useEffect(() => {
    const dismissed = localStorage.getItem(`demo-mode-dismissed-${currentWorkspace?.id}`);
    setIsDismissed(!!dismissed);
  }, [currentWorkspace?.id]);

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

  const dismissDemoMode = () => {
    if (currentWorkspace?.id) {
      localStorage.setItem(`demo-mode-dismissed-${currentWorkspace.id}`, "true");
      setIsDismissed(true);
    }
  };

  return {
    showDemoMode,
    hasNoLinks,
    linksCount: linksCount || 0,
    isLoading,
    dismissDemoMode,
  };
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
