// India salary benchmark data
// Data sourced from Naukri, 6figr, AmbitionBox, Glassdoor India
// All salaries in INR (Indian Rupees) with USD equivalents

export interface IndiaSalaryData {
  role: string;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'director' | 'vp';
  experienceYears: string;
  baseSalaryINR: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  baseSalaryUSD: {
    p10: number;
    p25: number;
    p50: number;
    p75: number;
    p90: number;
  };
  totalCompINR: { p50: number; p90: number };
  totalCompUSD: { p50: number; p90: number };
}

export const indiaSalaryData: IndiaSalaryData[] = [
  {
    role: 'Marketing Manager',
    level: 'senior',
    experienceYears: '4-7',
    baseSalaryINR: { p10: 800000, p25: 1000000, p50: 1400000, p75: 1800000, p90: 2400000 },
    baseSalaryUSD: { p10: 9600, p25: 12000, p50: 16800, p75: 21600, p90: 28800 },
    totalCompINR: { p50: 1600000, p90: 2800000 },
    totalCompUSD: { p50: 19200, p90: 33600 }
  },
  {
    role: 'Senior Marketing Manager',
    level: 'senior',
    experienceYears: '7-10',
    baseSalaryINR: { p10: 1500000, p25: 1800000, p50: 2400000, p75: 3200000, p90: 4000000 },
    baseSalaryUSD: { p10: 18000, p25: 21600, p50: 28800, p75: 38400, p90: 48000 },
    totalCompINR: { p50: 2800000, p90: 4800000 },
    totalCompUSD: { p50: 33600, p90: 57600 }
  },
  {
    role: 'Marketing Director',
    level: 'director',
    experienceYears: '10-15',
    baseSalaryINR: { p10: 2500000, p25: 3200000, p50: 4000000, p75: 5000000, p90: 6500000 },
    baseSalaryUSD: { p10: 30000, p25: 38400, p50: 48000, p75: 60000, p90: 78000 },
    totalCompINR: { p50: 5000000, p90: 8000000 },
    totalCompUSD: { p50: 60000, p90: 96000 }
  },
  {
    role: 'Marketing Operations Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseSalaryINR: { p10: 900000, p25: 1200000, p50: 1600000, p75: 2000000, p90: 2600000 },
    baseSalaryUSD: { p10: 10800, p25: 14400, p50: 19200, p75: 24000, p90: 31200 },
    totalCompINR: { p50: 1800000, p90: 3000000 },
    totalCompUSD: { p50: 21600, p90: 36000 }
  },
  {
    role: 'Sales Operations Manager',
    level: 'senior',
    experienceYears: '5-8',
    baseSalaryINR: { p10: 1000000, p25: 1300000, p50: 1700000, p75: 2200000, p90: 2800000 },
    baseSalaryUSD: { p10: 12000, p25: 15600, p50: 20400, p75: 26400, p90: 33600 },
    totalCompINR: { p50: 2000000, p90: 3200000 },
    totalCompUSD: { p50: 24000, p90: 38400 }
  }
];

export const indiaLocationMultipliers = [
  { city: 'Bangalore', state: 'Karnataka', multiplier: 1.15 },
  { city: 'Mumbai', state: 'Maharashtra', multiplier: 1.20 },
  { city: 'Gurgaon', state: 'Haryana', multiplier: 1.18 },
  { city: 'Pune', state: 'Maharashtra', multiplier: 1.10 },
  { city: 'Hyderabad', state: 'Telangana', multiplier: 1.08 },
  { city: 'Chennai', state: 'Tamil Nadu', multiplier: 1.05 },
  { city: 'Delhi', state: 'Delhi', multiplier: 1.12 },
  { city: 'Noida', state: 'Uttar Pradesh', multiplier: 1.08 },
  { city: 'Kolkata', state: 'West Bengal', multiplier: 0.95 },
  { city: 'Ahmedabad', state: 'Gujarat', multiplier: 0.92 }
];
