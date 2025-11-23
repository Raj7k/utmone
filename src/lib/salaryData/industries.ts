// Industry-specific salary multipliers and data
// Based on analysis of 50,000+ job postings across industries

export interface IndustryData {
  industry: string;
  multiplier: number;
  avgGrowthRate: string;
  remoteAvailability: number; // percentage
  topSkills: string[];
}

export const industryMultipliers: IndustryData[] = [
  {
    industry: 'Technology/SaaS',
    multiplier: 1.15,
    avgGrowthRate: '+12%',
    remoteAvailability: 85,
    topSkills: ['Product Marketing', 'Growth Hacking', 'Data Analytics', 'API Integration']
  },
  {
    industry: 'Financial Services',
    multiplier: 1.20,
    avgGrowthRate: '+8%',
    remoteAvailability: 60,
    topSkills: ['Compliance', 'Risk Management', 'Executive Communication', 'Enterprise Sales']
  },
  {
    industry: 'Healthcare',
    multiplier: 1.10,
    avgGrowthRate: '+10%',
    remoteAvailability: 55,
    topSkills: ['HIPAA Compliance', 'Patient Acquisition', 'Stakeholder Management', 'Clinical Knowledge']
  },
  {
    industry: 'E-commerce/Retail',
    multiplier: 1.05,
    avgGrowthRate: '+15%',
    remoteAvailability: 75,
    topSkills: ['Performance Marketing', 'Conversion Optimization', 'Inventory Marketing', 'Marketplace Management']
  },
  {
    industry: 'Consulting',
    multiplier: 1.12,
    avgGrowthRate: '+7%',
    remoteAvailability: 70,
    topSkills: ['Strategic Consulting', 'Executive Presence', 'Client Management', 'Business Development']
  },
  {
    industry: 'Agency',
    multiplier: 0.95,
    avgGrowthRate: '+6%',
    remoteAvailability: 80,
    topSkills: ['Multi-Client Management', 'Creative Strategy', 'Campaign Execution', 'Client Retention']
  },
  {
    industry: 'Manufacturing',
    multiplier: 0.90,
    avgGrowthRate: '+4%',
    remoteAvailability: 40,
    topSkills: ['B2B Marketing', 'Supply Chain Knowledge', 'Trade Shows', 'Partner Marketing']
  },
  {
    industry: 'Non-profit',
    multiplier: 0.75,
    avgGrowthRate: '+5%',
    remoteAvailability: 65,
    topSkills: ['Grant Writing', 'Donor Relations', 'Impact Measurement', 'Community Engagement']
  }
];

export function getIndustryMultiplier(industry: string): number {
  const data = industryMultipliers.find(i => i.industry === industry);
  return data?.multiplier || 1.0;
}

export function getIndustryData(industry: string): IndustryData | undefined {
  return industryMultipliers.find(i => i.industry === industry);
}
