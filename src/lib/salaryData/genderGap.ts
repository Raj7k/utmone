// Gender pay gap analysis data
// Data sourced from Glassdoor, Payscale, SHRM studies

export interface GenderPayGapData {
  role: string;
  maleMedian: number;
  femaleMedian: number;
  gapPercentage: number;
  gapAmount: number;
  sampleSize: { male: number; female: number };
}

export const genderPayGapByRole: GenderPayGapData[] = [
  {
    role: 'Marketing Coordinator',
    maleMedian: 53000,
    femaleMedian: 51000,
    gapPercentage: 3.8,
    gapAmount: 2000,
    sampleSize: { male: 850, female: 1200 }
  },
  {
    role: 'Marketing Manager',
    maleMedian: 97000,
    femaleMedian: 92000,
    gapPercentage: 5.2,
    gapAmount: 5000,
    sampleSize: { male: 2400, female: 2100 }
  },
  {
    role: 'Senior Marketing Manager',
    maleMedian: 134000,
    femaleMedian: 126000,
    gapPercentage: 6.0,
    gapAmount: 8000,
    sampleSize: { male: 1800, female: 1400 }
  },
  {
    role: 'Marketing Director',
    maleMedian: 175000,
    femaleMedian: 163000,
    gapPercentage: 6.9,
    gapAmount: 12000,
    sampleSize: { male: 1200, female: 800 }
  },
  {
    role: 'VP Marketing',
    maleMedian: 248000,
    femaleMedian: 228000,
    gapPercentage: 8.1,
    gapAmount: 20000,
    sampleSize: { male: 650, female: 380 }
  },
  {
    role: 'Marketing Operations Manager',
    maleMedian: 118000,
    femaleMedian: 112000,
    gapPercentage: 5.1,
    gapAmount: 6000,
    sampleSize: { male: 1100, female: 950 }
  },
  {
    role: 'Sales Operations Manager',
    maleMedian: 123000,
    femaleMedian: 116000,
    gapPercentage: 5.7,
    gapAmount: 7000,
    sampleSize: { male: 1400, female: 900 }
  }
];

export interface GenderPayGapByIndustry {
  industry: string;
  gapPercentage: number;
  maleAvg: number;
  femaleAvg: number;
}

export const genderPayGapByIndustry: GenderPayGapByIndustry[] = [
  { industry: 'Technology/SaaS', gapPercentage: 5.2, maleAvg: 115000, femaleAvg: 109000 },
  { industry: 'Financial Services', gapPercentage: 7.8, maleAvg: 128000, femaleAvg: 118000 },
  { industry: 'Healthcare', gapPercentage: 4.1, maleAvg: 102000, femaleAvg: 98000 },
  { industry: 'E-commerce/Retail', gapPercentage: 6.3, maleAvg: 98000, femaleAvg: 92000 },
  { industry: 'Consulting', gapPercentage: 6.9, maleAvg: 122000, femaleAvg: 114000 },
  { industry: 'Agency', gapPercentage: 3.5, maleAvg: 88000, femaleAvg: 85000 },
  { industry: 'Manufacturing', gapPercentage: 8.2, maleAvg: 95000, femaleAvg: 87000 },
  { industry: 'Non-profit', gapPercentage: 2.1, maleAvg: 72000, femaleAvg: 71000 }
];

export function getGenderPayGap(role: string): GenderPayGapData | undefined {
  return genderPayGapByRole.find(d => d.role === role);
}

export function calculateGapPercentage(maleMedian: number, femaleMedian: number): number {
  return Math.round(((maleMedian - femaleMedian) / maleMedian) * 1000) / 10;
}
