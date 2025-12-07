import { PlanTier } from './planConfig';

export interface Addon {
  key: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  unitAmount: number;
  applicableTiers: PlanTier[];
  category: 'limits' | 'features' | 'support';
}

export const ADDONS_CONFIG: Addon[] = [
  {
    key: 'extra_links',
    name: 'extra links',
    description: 'add more monthly links to your plan',
    price: 10,
    unit: 'links',
    unitAmount: 500,
    applicableTiers: ['starter', 'growth', 'business'],
    category: 'limits',
  },
  {
    key: 'extra_domains',
    name: 'extra domains',
    description: 'add more custom domains',
    price: 15,
    unit: 'domains',
    unitAmount: 1,
    applicableTiers: ['starter', 'growth', 'business'],
    category: 'limits',
  },
  {
    key: 'extra_team_seats',
    name: 'extra team seats',
    description: 'add more team members',
    price: 10,
    unit: 'seats',
    unitAmount: 5,
    applicableTiers: ['starter', 'growth', 'business'],
    category: 'limits',
  },
  {
    key: 'extra_clicks',
    name: 'extra clicks',
    description: 'add more monthly click tracking',
    price: 20,
    unit: 'clicks',
    unitAmount: 100000,
    applicableTiers: ['starter', 'growth', 'business'],
    category: 'limits',
  },
  {
    key: 'priority_support',
    name: 'priority support',
    description: '4-hour response time with dedicated slack channel',
    price: 49,
    unit: 'month',
    unitAmount: 1,
    applicableTiers: ['starter', 'growth', 'business'],
    category: 'support',
  },
  {
    key: 'advanced_attribution',
    name: 'advanced attribution',
    description: 'unlock identity graph, lift analysis, and offline import',
    price: 99,
    unit: 'month',
    unitAmount: 1,
    applicableTiers: ['starter', 'growth', 'business'],
    category: 'features',
  },
];

export function getAddonByKey(key: string): Addon | undefined {
  return ADDONS_CONFIG.find(addon => addon.key === key);
}

export function getAddonsForTier(tier: PlanTier): Addon[] {
  return ADDONS_CONFIG.filter(addon => addon.applicableTiers.includes(tier));
}

export function formatAddonPrice(addon: Addon): string {
  return `$${addon.price}/${addon.unit === 'month' ? 'mo' : addon.unitAmount.toLocaleString() + ' ' + addon.unit}`;
}
