// Contextual help descriptions for navigation features
export const featureHelpDescriptions: Record<string, string> = {
  // Core
  "Dashboard": "Your command center with key metrics and quick actions",
  "Links": "Shortened URLs with built-in analytics and tracking",
  "Intelligence": "Deep analytics and performance insights",
  "Sales": "Track revenue attribution from your links",
  "Approvals": "Review and approve links before publishing",
  
  // Tools
  "QR Codes": "Print-ready QR codes for physical campaigns",
  "Geo Targeting": "Route visitors to different URLs by location",
  "Bulk Create": "Create hundreds of links at once via CSV",
  "Link Validator": "Check link health and UTM consistency",
  "A/B Testing": "Test different destinations to optimize CTR",
  "Event Halo": "Track field events and measure offline impact on web traffic",
  "One-Tap Scanner": "Scan badges and instantly capture leads",
  
  // Intelligence
  "Attribution": "See which channels drive revenue",
  "Performance": "Monitor redirect speed and uptime",
  "Insights": "AI-powered recommendations to improve results",
  "Link Health": "Track broken links and redirect chains",
  
  // Settings
  "Workspace": "Manage domains, branding, and team settings",
  "Billing": "View plans, usage, and payment details",
  "Account": "Update profile, security, and preferences",
};

// Features that should show "NEW" badge until user visits them
export const newFeatures = [
  "Event Halo", 
  "One-Tap Scanner",
];
