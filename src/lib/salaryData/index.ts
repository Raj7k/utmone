// Central salary data aggregator
// Combines data from all regional and specialized data files

import { indiaSalaryData } from './india';
import { industryMultipliers, getIndustryMultiplier } from './industries';
import { genderPayGapByRole, genderPayGapByIndustry } from './genderGap';

// Base salary data for roles (US market baseline)
export interface SalaryData {
  role: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'director' | 'vp';
  experienceYears: string;
  baseCompensation: {
    p10: number; // 10th percentile
    p25: number; // 25th percentile
    p50: number; // Median
    p75: number; // 75th percentile
    p90: number; // 90th percentile
  };
  totalCompensation: {
    p50: number; // Median with benefits/bonus
    p90: number; // 90th percentile with benefits/bonus
  };
  topSkills?: string[];
}

export const usaSalaryData: SalaryData[] = [
  {
    role: 'Marketing Coordinator',
    level: 'junior',
    experienceYears: '0-2',
    baseCompensation: { p10: 40000, p25: 45000, p50: 52000, p75: 58000, p90: 65000 },
    totalCompensation: { p50: 55000, p90: 70000 },
    topSkills: ['Social Media', 'Content Creation', 'Email Marketing']
  },
  {
    role: 'Marketing Specialist',
    level: 'mid',
    experienceYears: '2-4',
    baseCompensation: { p10: 55000, p25: 62000, p50: 68000, p75: 74000, p90: 82000 },
    totalCompensation: { p50: 72000, p90: 88000 },
    topSkills: ['Campaign Management', 'Analytics', 'Marketing Automation']
  },
  {
    role: 'Marketing Manager',
    level: 'senior',
    experienceYears: '4-7',
    baseCompensation: { p10: 75000, p25: 85000, p50: 95000, p75: 108000, p90: 125000 },
    totalCompensation: { p50: 105000, p90: 140000 },
    topSkills: ['Strategy', 'Team Leadership', 'Budget Management']
  },
  {
    role: 'Senior Marketing Manager',
    level: 'senior',
    experienceYears: '7-10',
    baseCompensation: { p10: 100000, p25: 115000, p50: 127000, p75: 142000, p90: 160000 },
    totalCompensation: { p50: 140000, p90: 180000 },
    topSkills: ['Strategic Planning', 'Cross-functional Leadership', 'P&L Ownership']
  },
  {
    role: 'Marketing Director',
    level: 'director',
    experienceYears: '10-15',
    baseCompensation: { p10: 130000, p25: 148000, p50: 165000, p75: 185000, p90: 210000 },
    totalCompensation: { p50: 185000, p90: 240000 },
    topSkills: ['Executive Leadership', 'Revenue Accountability', 'Vision Setting']
  },
  {
    role: 'VP Marketing',
    level: 'vp',
    experienceYears: '15+',
    baseCompensation: { p10: 180000, p25: 210000, p50: 240000, p75: 280000, p90: 350000 },
    totalCompensation: { p50: 280000, p90: 450000 },
    topSkills: ['C-Level Leadership', 'Board Reporting', 'Company-wide Strategy']
  },
  {
    role: 'Marketing Operations Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 85000, p25: 95000, p50: 105000, p75: 118000, p90: 135000 },
    totalCompensation: { p50: 115000, p90: 150000 },
    topSkills: ['Marketing Automation', 'CRM', 'Analytics']
  },
  {
    role: 'Sales Operations Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 88000, p25: 98000, p50: 110000, p75: 125000, p90: 145000 },
    totalCompensation: { p50: 125000, p90: 165000 },
    topSkills: ['Salesforce', 'Forecasting', 'Process Optimization']
  },
  {
    role: 'Revenue Operations Manager',
    level: 'senior',
    experienceYears: '6-10',
    baseCompensation: { p10: 95000, p25: 110000, p50: 125000, p75: 142000, p90: 165000 },
    totalCompensation: { p50: 140000, p90: 185000 },
    topSkills: ['Revenue Analytics', 'Systems Architecture', 'GTM Strategy']
  },
  {
    role: 'Demand Generation Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 90000, p25: 100000, p50: 110000, p75: 125000, p90: 145000 },
    totalCompensation: { p50: 120000, p90: 160000 },
    topSkills: ['Campaigns', 'Analytics', 'ABM']
  },
  {
    role: 'Product Marketing Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseCompensation: { p10: 95000, p25: 108000, p50: 120000, p75: 135000, p90: 155000 },
    totalCompensation: { p50: 132000, p90: 175000 },
    topSkills: ['Positioning', 'GTM Strategy', 'Competitive Analysis']
  },
];

// Location multipliers for US states and cities
export const locationMultipliers: Record<string, number> = {
  'San Francisco, CA': 1.35,
  'New York, NY': 1.30,
  'Seattle, WA': 1.25,
  'Boston, MA': 1.22,
  'Los Angeles, CA': 1.20,
  'Austin, TX': 1.10,
  'Denver, CO': 1.08,
  'Chicago, IL': 1.05,
  'Atlanta, GA': 1.02,
  'Dallas, TX': 1.00,
  'Phoenix, AZ': 0.95,
  'Miami, FL': 0.93,
  'Remote (US)': 0.92,
};

// Company size multipliers
export const companySizeMultipliers: Record<string, number> = {
  'Startup': 0.90,
  'Small': 0.95,
  'Medium': 1.00,
  'Large': 1.08,
  'Enterprise': 1.15,
};

// Helper functions
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getSalaryForRole = (roleName: string): SalaryData | undefined => {
  return usaSalaryData.find(data => data.role === roleName);
};

export const getAdjustedSalary = (
  baseSalary: number,
  location: string,
  companySize: string
): number => {
  const locationMultiplier = locationMultipliers[location] || 1.0;
  const sizeMultiplier = companySizeMultipliers[companySize] || 1.0;
  return Math.round(baseSalary * locationMultiplier * sizeMultiplier);
};

export const getPercentile = (salary: number, role: string): number => {
  const roleData = getSalaryForRole(role);
  if (!roleData) return 50;

  const { p10, p25, p50, p75, p90 } = roleData.baseCompensation;

  if (salary <= p10) return 10;
  if (salary <= p25) return 10 + ((salary - p10) / (p25 - p10)) * 15;
  if (salary <= p50) return 25 + ((salary - p25) / (p50 - p25)) * 25;
  if (salary <= p75) return 50 + ((salary - p50) / (p75 - p50)) * 25;
  if (salary <= p90) return 75 + ((salary - p75) / (p90 - p75)) * 15;
  return 90 + Math.min(10, ((salary - p90) / p90) * 100);
};

// Export regional data
export { indiaSalaryData } from './india';
export { industryMultipliers, getIndustryMultiplier } from './industries';
export { genderPayGapByRole, genderPayGapByIndustry } from './genderGap';
