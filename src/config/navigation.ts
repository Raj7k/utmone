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
  LucideIcon
} from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
  isNew?: boolean;
}

export interface NavCategory {
  label: string;
  items: NavItem[];
}

// APP - Core application features
export const appNavigation: NavItem[] = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
  { name: "Links", href: "/dashboard/links", icon: Link2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Sales", href: "/dashboard/sales", icon: DollarSign },
  { name: "Approvals", href: "/dashboard/approvals", icon: Clock, badge: true },
];

// TOOLS - Link creation and management tools
export const toolsNavigation: NavItem[] = [
  { name: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { name: "Targeting", href: "/dashboard/targeting", icon: Target },
  { name: "Bulk Create", href: "/dashboard/bulk-create", icon: Layers },
  { name: "OneLink Validator", href: "/dashboard/onelink-validator", icon: Brain },
  { name: "Experiments", href: "/dashboard/experiments", icon: Beaker },
];

// INTELLIGENCE - Analytics and attribution features
export const intelligenceNavigation: NavItem[] = [
  { name: "Clean-Track Attribution", href: "/dashboard/attribution", icon: Network },
  { name: "Cache Monitoring", href: "/dashboard/cache-monitoring", icon: Zap },
  { name: "Analytics Performance", href: "/dashboard/analytics-performance", icon: TrendingUp },
  { name: "Link Health", href: "/dashboard/link-health", icon: Shield },
];

// GROWTH - Campaign and marketing features
export const growthNavigation: NavItem[] = [
  { name: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
];

// SETTINGS - Configuration and account settings
export const settingsNavigation: NavItem[] = [
  { name: "Workspace", href: "/settings/workspace", icon: Briefcase },
  { name: "Billing", href: "/settings/billing", icon: CreditCard },
  { name: "Account", href: "/settings/profile", icon: User },
];

// All navigation items flattened with categories for search
export const allNavigationWithCategories = [
  ...appNavigation.map(item => ({ ...item, category: "App" })),
  ...toolsNavigation.map(item => ({ ...item, category: "Tools" })),
  ...intelligenceNavigation.map(item => ({ ...item, category: "Intelligence" })),
  ...growthNavigation.map(item => ({ ...item, category: "Growth" })),
  ...settingsNavigation.map(item => ({ ...item, category: "Settings" })),
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
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];
