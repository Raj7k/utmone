import { 
  LayoutGrid, 
  Link2, 
  BarChart3, 
  QrCode, 
  Target,
  Layers,
  Brain,
  Clock,
  Briefcase, 
  CreditCard, 
  User,
  Beaker,
  Network,
  Zap,
  TrendingUp,
  Shield,
  DollarSign,
  Megaphone,
  Globe,
  Palette,
  Users,
  Activity,
  Code2,
  Webhook,
  Chrome,
  Bell,
  ShieldCheck,
  CalendarDays,
  Waves,
  Scan,
  Boxes,
  LucideIcon
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean | string;
  isNew?: boolean;
  category?: string;
}

export interface NavCategory {
  label: string;
  items: NavItem[];
}

// APP - Core application features
export const appNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: BarChart3 },
  { name: "Sales", href: "/dashboard/sales", icon: DollarSign },
  { name: "Events", href: "/dashboard/events", icon: CalendarDays, isNew: true },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, badge: true },
];

// TOOLS - Link creation and management tools
export const toolsNavigation: NavItem[] = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Geo Targeting", href: "/dashboard/targeting", icon: Target },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers },
  { name: "Link Validator", href: "/dashboard/onelink-validator", icon: Brain },
  { name: "A/B Testing", href: "/dashboard/experiments", icon: Beaker },
  { name: "Event Halo", href: "/dashboard/events", icon: Waves, isNew: true },
  { name: "One-Tap Scanner", href: "/scan", icon: Scan, isNew: true },
];

// INTELLIGENCE - Analytics and attribution features (deep links into unified hub)
export const intelligenceNavigation: NavItem[] = [
  { name: "Attribution", href: "/dashboard/analytics?tab=attribution", icon: Network },
  { name: "Performance", href: "/dashboard/cache-monitoring", icon: Zap },
  { name: "Insights", href: "/dashboard/analytics-performance", icon: TrendingUp },
  { name: "Link Health", href: "/dashboard/link-health", icon: Shield },
];

// GROWTH - Campaign and marketing features
export const growthNavigation: NavItem[] = [
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
];

// SETTINGS - All settings sub-pages grouped by category
export interface SettingsGroup {
  name: string;
  items: NavItem[];
}

export const settingsGroups: SettingsGroup[] = [
  {
    name: "General",
    items: [
      { name: "Domains", href: "/settings?tab=domains", icon: Globe },
      { name: "Branding", href: "/settings?tab=branding", icon: Palette },
      { name: "Team", href: "/settings?tab=team", icon: Users },
    ],
  },
  {
    name: "Billing",
    items: [
      { name: "Plans & Billing", href: "/settings?tab=billing", icon: CreditCard },
    ],
  },
  {
    name: "Tracking",
    items: [
      { name: "Tracking Pixel", href: "/settings?tab=tracking", icon: Activity, badge: "!" },
      { name: "Pipeline Sync", href: "/settings?tab=pipeline", icon: TrendingUp },
    ],
  },
  {
    name: "Developer",
    items: [
      { name: "API Keys", href: "/settings?tab=developers", icon: Code2 },
      { name: "Integrations", href: "/settings?tab=integrations", icon: Webhook },
      { name: "Chrome Extension", href: "/settings?tab=extension", icon: Chrome, isNew: true },
    ],
  },
  {
    name: "Alerts",
    items: [
      { name: "Notifications", href: "/settings?tab=notifications", icon: Bell },
    ],
  },
  {
    name: "Security",
    items: [
      { name: "Security", href: "/settings?tab=security", icon: ShieldCheck },
      { name: "Data & Privacy", href: "/settings?tab=privacy", icon: Shield },
    ],
  },
];

// Flattened settings for quick access in sidebar
export const settingsNavigation: NavItem[] = [
  { name: "Workspace", href: "/settings?tab=domains", icon: Briefcase },
  { name: "Billing", href: "/settings?tab=billing", icon: CreditCard },
  { name: "Account", href: "/settings/profile", icon: User },
];

// All navigation items flattened with categories for search
export const allNavigationWithCategories = [
  ...appNavigation.map(item => ({ ...item, category: "App" })),
  ...toolsNavigation.map(item => ({ ...item, category: "Tools" })),
  ...intelligenceNavigation.map(item => ({ ...item, category: "Intelligence" })),
  ...growthNavigation.map(item => ({ ...item, category: "Growth" })),
  ...settingsGroups.flatMap(group => 
    group.items.map(item => ({ ...item, category: `Settings / ${group.name}` }))
  ),
];

// Navigation categories for sidebar
export const navigationCategories: NavCategory[] = [
  { label: "App", items: appNavigation },
  { label: "Tools", items: toolsNavigation },
  { label: "Intelligence", items: intelligenceNavigation },
  { label: "Growth", items: growthNavigation },
];

// Mobile navigation - core items only
export const mobileNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Intelligence", href: "/dashboard/intelligence", icon: BarChart3 },
];
