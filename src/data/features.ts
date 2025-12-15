export interface Feature {
  slug: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  category: 'intelligence' | 'core' | 'enterprise' | 'security';
}

export const features: Feature[] = [
  {
    slug: 'predictive-analytics',
    title: 'Predictive Analytics',
    description: 'Forecast traffic 7 days ahead with Gaussian Processes. See confidence bands and risk-adjusted ROI.',
    icon: 'TrendingUp',
    route: '/features/predictive-analytics',
    category: 'intelligence'
  },
  {
    slug: 'attribution-graph',
    title: 'Attribution Graph',
    description: 'Visualize the invisible connections in your user journey with Bayesian Influence Graph.',
    icon: 'Network',
    route: '/features/attribution-graph',
    category: 'intelligence'
  },
  {
    slug: 'smart-routing',
    title: 'Smart Routing',
    description: 'Contextual Bandit algorithm routes iOS users differently than Android automatically.',
    icon: 'Zap',
    route: '/features/smart-routing',
    category: 'intelligence'
  },
  {
    slug: 'link-immunity',
    title: 'Link Immunity',
    description: 'Zero broken links guaranteed. Hourly probes auto-flag 404s and route to fallback.',
    icon: 'Shield',
    route: '/features/link-immunity',
    category: 'intelligence'
  },
  {
    slug: 'short-links',
    title: 'Short Links',
    description: 'Transform long URLs into clean, branded short links on custom domains.',
    icon: 'Link',
    route: '/features/short-links',
    category: 'core'
  },
  {
    slug: 'utm-builder',
    title: 'UTM Builder',
    description: 'Smart autocomplete predicts high-impact UTM values with historical CTR.',
    icon: 'Tags',
    route: '/features/utm-builder',
    category: 'core'
  },
  {
    slug: 'qr-generator',
    title: 'QR Generator',
    description: 'Branded QR codes with custom colors, logos, and reliability scoring.',
    icon: 'QrCode',
    route: '/features/qr-generator',
    category: 'core'
  },
  {
    slug: 'analytics',
    title: 'Analytics',
    description: 'Real-time click tracking with device, browser, location, and referrer data.',
    icon: 'BarChart3',
    route: '/features/analytics',
    category: 'core'
  },
  {
    slug: 'governance',
    title: 'Enterprise Control',
    description: 'Link approval workflows, audit logs, and role-based access control.',
    icon: 'Lock',
    route: '/features/governance',
    category: 'enterprise'
  },
  {
    slug: 'link-guard',
    title: 'Link Guard',
    description: 'Security scanning with VirusTotal, SSL validation, and threat detection.',
    icon: 'ShieldCheck',
    route: '/features/link-guard',
    category: 'security'
  },
  {
    slug: 'geo-targeting',
    title: 'Geo Targeting',
    description: 'Route visitors to different URLs based on their country.',
    icon: 'Globe',
    route: '/features/geo-targeting',
    category: 'intelligence'
  },
  {
    slug: 'integrations',
    title: 'Integrations',
    description: 'Connect to HubSpot, Salesforce, Segment, Google Analytics, and more.',
    icon: 'Plug',
    route: '/features/integrations',
    category: 'enterprise'
  },
  {
    slug: 'link-pages',
    title: 'Link Pages',
    description: 'Link-in-bio pages with analytics, themes, and full UTM tracking.',
    icon: 'LayoutGrid',
    route: '/features/link-pages',
    category: 'core'
  }
];
