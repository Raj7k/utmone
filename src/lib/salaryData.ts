// Salary benchmark data for marketing and sales operations roles
// Data sourced from 2025 Global Marketing & Sales Operations Salary Benchmark Report

export interface SalaryData {
  role: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'director' | 'vp' | 'c-level';
  baseCompensation: {
    p10: number;  // 10th percentile
    p25: number;  // 25th percentile
    p50: number;  // 50th percentile (median)
    p75: number;  // 75th percentile
    p90: number;  // 90th percentile
  };
  equity?: {
    typical: number;  // Typical equity value
    range: [number, number];  // Min-max range
  };
  totalComp: {
    p50: number;  // Median total compensation
    p90: number;  // 90th percentile total comp
  };
  experienceYears: string;
  skills?: string[];
}

export interface LocationMultiplier {
  location: string;
  region: 'US' | 'Europe' | 'APAC' | 'Remote';
  multiplier: number;  // Multiply base salary by this
}

export interface CompanySizeMultiplier {
  size: string;
  employeeRange: string;
  multiplier: number;
}

// Base salary data (US market, mid-sized company baseline)
export const salaryBenchmarks: SalaryData[] = [
  // Marketing Roles
  {
    role: 'Marketing Coordinator',
    level: 'junior',
    experienceYears: '0-2',
    baseCompensation: { p10: 40000, p25: 45000, p50: 52000, p75: 60000, p90: 68000 },
    totalComp: { p50: 55000, p90: 72000 },
    skills: ['Social Media', 'Content Writing', 'Email Marketing']
  },
  {
    role: 'Marketing Specialist',
    level: 'mid',
    experienceYears: '2-4',
    baseCompensation: { p10: 55000, p25: 62000, p50: 70000, p75: 80000, p90: 90000 },
    totalComp: { p50: 75000, p90: 95000 },
    skills: ['Campaign Management', 'Analytics', 'Marketing Automation']
  },
  {
    role: 'Marketing Manager',
    level: 'senior',
    experienceYears: '4-7',
    baseCompensation: { p10: 75000, p25: 85000, p50: 95000, p75: 110000, p90: 125000 },
    equity: { typical: 15000, range: [5000, 30000] },
    totalComp: { p50: 110000, p90: 145000 },
    skills: ['Team Leadership', 'Budget Management', 'Strategy']
  },
  {
    role: 'Senior Marketing Manager',
    level: 'senior',
    experienceYears: '7-10',
    baseCompensation: { p10: 100000, p25: 115000, p50: 130000, p75: 150000, p90: 170000 },
    equity: { typical: 25000, range: [10000, 50000] },
    totalComp: { p50: 155000, p90: 200000 },
    skills: ['Multi-Channel Strategy', 'P&L Management', 'Executive Communication']
  },
  {
    role: 'Marketing Director',
    level: 'director',
    experienceYears: '10-15',
    baseCompensation: { p10: 130000, p25: 150000, p50: 170000, p75: 195000, p90: 220000 },
    equity: { typical: 40000, range: [20000, 80000] },
    totalComp: { p50: 210000, p90: 280000 },
    skills: ['Department Leadership', 'Cross-Functional Strategy', 'ROI Optimization']
  },
  {
    role: 'VP Marketing',
    level: 'vp',
    experienceYears: '15+',
    baseCompensation: { p10: 180000, p25: 210000, p50: 240000, p75: 280000, p90: 320000 },
    equity: { typical: 80000, range: [40000, 150000] },
    totalComp: { p50: 320000, p90: 450000 },
    skills: ['Executive Leadership', 'Strategic Planning', 'Board Communication']
  },
  {
    role: 'Chief Marketing Officer',
    level: 'c-level',
    experienceYears: '20+',
    baseCompensation: { p10: 240000, p25: 280000, p50: 320000, p75: 380000, p90: 450000 },
    equity: { typical: 150000, range: [80000, 300000] },
    totalComp: { p50: 470000, p90: 700000 },
    skills: ['C-Suite Leadership', 'Company-Wide Strategy', 'Revenue Growth']
  },

  // Demand Gen / Growth Roles
  {
    role: 'Demand Generation Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 85000, p25: 95000, p50: 110000, p75: 130000, p90: 150000 },
    equity: { typical: 20000, range: [8000, 40000] },
    totalComp: { p50: 130000, p90: 175000 },
    skills: ['Paid Media', 'Lead Generation', 'Marketing Attribution']
  },
  {
    role: 'Growth Marketing Manager',
    level: 'senior',
    experienceYears: '4-7',
    baseCompensation: { p10: 90000, p25: 105000, p50: 120000, p75: 140000, p90: 160000 },
    equity: { typical: 25000, range: [10000, 50000] },
    totalComp: { p50: 145000, p90: 195000 },
    skills: ['A/B Testing', 'Product-Led Growth', 'Funnel Optimization']
  },

  // Product Marketing
  {
    role: 'Product Marketing Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 95000, p25: 110000, p50: 125000, p75: 145000, p90: 165000 },
    equity: { typical: 30000, range: [15000, 60000] },
    totalComp: { p50: 155000, p90: 210000 },
    skills: ['Go-to-Market Strategy', 'Competitive Analysis', 'Product Positioning']
  },

  // Marketing Ops
  {
    role: 'Marketing Operations Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 85000, p25: 98000, p50: 115000, p75: 135000, p90: 155000 },
    equity: { typical: 18000, range: [8000, 35000] },
    totalComp: { p50: 133000, p90: 180000 },
    skills: ['Marketing Automation', 'CRM Management', 'Data Analytics']
  },
  {
    role: 'Director of Marketing Operations',
    level: 'director',
    experienceYears: '10-15',
    baseCompensation: { p10: 125000, p25: 145000, p50: 165000, p75: 190000, p90: 215000 },
    equity: { typical: 35000, range: [18000, 70000] },
    totalComp: { p50: 200000, p90: 270000 },
    skills: ['Marketing Technology Stack', 'Process Optimization', 'Team Leadership']
  },

  // Sales Operations
  {
    role: 'Sales Operations Analyst',
    level: 'mid',
    experienceYears: '2-4',
    baseCompensation: { p10: 60000, p25: 68000, p50: 78000, p75: 90000, p90: 102000 },
    totalComp: { p50: 85000, p90: 110000 },
    skills: ['Salesforce', 'Data Analysis', 'Reporting']
  },
  {
    role: 'Sales Operations Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 90000, p25: 105000, p50: 120000, p75: 140000, p90: 160000 },
    equity: { typical: 20000, range: [10000, 40000] },
    totalComp: { p50: 140000, p90: 185000 },
    skills: ['Sales Process Optimization', 'Forecasting', 'Territory Planning']
  },
  {
    role: 'Director of Sales Operations',
    level: 'director',
    experienceYears: '10-15',
    baseCompensation: { p10: 135000, p25: 155000, p50: 180000, p75: 210000, p90: 240000 },
    equity: { typical: 40000, range: [20000, 80000] },
    totalComp: { p50: 220000, p90: 300000 },
    skills: ['Strategic Planning', 'Cross-Functional Leadership', 'Revenue Operations']
  }
];

// Location-based salary adjustments
export const locationMultipliers: LocationMultiplier[] = [
  // US - Major Tech Hubs
  { location: 'San Francisco, CA', region: 'US', multiplier: 1.40 },
  { location: 'New York, NY', region: 'US', multiplier: 1.35 },
  { location: 'Seattle, WA', region: 'US', multiplier: 1.25 },
  { location: 'Boston, MA', region: 'US', multiplier: 1.20 },
  { location: 'Los Angeles, CA', region: 'US', multiplier: 1.18 },

  // US - Secondary Markets
  { location: 'Austin, TX', region: 'US', multiplier: 1.10 },
  { location: 'Denver, CO', region: 'US', multiplier: 1.08 },
  { location: 'Chicago, IL', region: 'US', multiplier: 1.05 },
  { location: 'Atlanta, GA', region: 'US', multiplier: 1.00 },
  { location: 'Phoenix, AZ', region: 'US', multiplier: 0.95 },
  { location: 'Remote (US)', region: 'US', multiplier: 0.90 },

  // Europe
  { location: 'London, UK', region: 'Europe', multiplier: 0.85 },
  { location: 'Dublin, Ireland', region: 'Europe', multiplier: 0.80 },
  { location: 'Amsterdam, Netherlands', region: 'Europe', multiplier: 0.75 },
  { location: 'Berlin, Germany', region: 'Europe', multiplier: 0.70 },
  { location: 'Remote (Europe)', region: 'Europe', multiplier: 0.65 },

  // APAC
  { location: 'Singapore', region: 'APAC', multiplier: 0.75 },
  { location: 'Sydney, Australia', region: 'APAC', multiplier: 0.70 },
  { location: 'Tokyo, Japan', region: 'APAC', multiplier: 0.65 },
  { location: 'Remote (APAC)', region: 'APAC', multiplier: 0.55 }
];

// Company size multipliers
export const companySizeMultipliers: CompanySizeMultiplier[] = [
  { size: 'Startup', employeeRange: '1-50', multiplier: 0.85 },
  { size: 'Small', employeeRange: '51-200', multiplier: 0.95 },
  { size: 'Medium', employeeRange: '201-500', multiplier: 1.00 },
  { size: 'Large', employeeRange: '501-2000', multiplier: 1.10 },
  { size: 'Enterprise', employeeRange: '2000+', multiplier: 1.25 }
];

// Utility functions
export function getSalaryForRole(roleName: string): SalaryData | undefined {
  return salaryBenchmarks.find(s => s.role.toLowerCase() === roleName.toLowerCase());
}

export function getAdjustedSalary(
  baseSalary: number,
  location: string,
  companySize: string
): number {
  const locationMult = locationMultipliers.find(l => l.location === location)?.multiplier || 1.0;
  const sizeMult = companySizeMultipliers.find(s => s.size === companySize)?.multiplier || 1.0;
  
  return Math.round(baseSalary * locationMult * sizeMult);
}

export function getPercentile(salary: number, role: string): number {
  const roleData = getSalaryForRole(role);
  if (!roleData) return 50;

  const { p10, p25, p50, p75, p90 } = roleData.baseCompensation;

  if (salary <= p10) return 10;
  if (salary <= p25) return 10 + ((salary - p10) / (p25 - p10)) * 15;
  if (salary <= p50) return 25 + ((salary - p25) / (p50 - p25)) * 25;
  if (salary <= p75) return 50 + ((salary - p50) / (p75 - p50)) * 25;
  if (salary <= p90) return 75 + ((salary - p75) / (p90 - p75)) * 15;
  return 90 + Math.min(10, ((salary - p90) / p90) * 20);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function getPromotionSalaryJump(currentRole: string, nextRole: string): number | null {
  const current = getSalaryForRole(currentRole);
  const next = getSalaryForRole(nextRole);
  
  if (!current || !next) return null;
  
  const jump = ((next.baseCompensation.p50 - current.baseCompensation.p50) / current.baseCompensation.p50) * 100;
  return Math.round(jump * 10) / 10;
}
