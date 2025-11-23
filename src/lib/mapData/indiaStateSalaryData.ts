// India state and city-level salary data for Marketing Manager role
// Salaries in both INR and USD

export interface IndiaCitySalaryData {
  city: string;
  state: string;
  medianSalaryINR: number;
  medianSalaryUSD: number;
  techHubRank: number;  // 1 = top tech hub
}

export interface IndiaStateSalaryData {
  state: string;
  stateCode: string;
  medianSalaryINR: number;
  medianSalaryUSD: number;
  topCities: IndiaCitySalaryData[];
}

export const indiaStateSalaryData: IndiaStateSalaryData[] = [
  {
    state: "Karnataka",
    stateCode: "KA",
    medianSalaryINR: 1680000,
    medianSalaryUSD: 20000,
    topCities: [
      { 
        city: "Bangalore", 
        state: "Karnataka",
        medianSalaryINR: 1800000, 
        medianSalaryUSD: 21500, 
        techHubRank: 1 
      }
    ]
  },
  {
    state: "Maharashtra",
    stateCode: "MH",
    medianSalaryINR: 1584000,
    medianSalaryUSD: 19000,
    topCities: [
      { 
        city: "Mumbai", 
        state: "Maharashtra",
        medianSalaryINR: 1680000, 
        medianSalaryUSD: 20000, 
        techHubRank: 2 
      },
      { 
        city: "Pune", 
        state: "Maharashtra",
        medianSalaryINR: 1488000, 
        medianSalaryUSD: 18000, 
        techHubRank: 4 
      }
    ]
  },
  {
    state: "Delhi",
    stateCode: "DL",
    medianSalaryINR: 1560000,
    medianSalaryUSD: 18500,
    topCities: [
      { 
        city: "Delhi NCR", 
        state: "Delhi",
        medianSalaryINR: 1560000, 
        medianSalaryUSD: 18500, 
        techHubRank: 3 
      },
      { 
        city: "Gurgaon", 
        state: "Haryana",
        medianSalaryINR: 1620000, 
        medianSalaryUSD: 19200, 
        techHubRank: 5 
      },
      { 
        city: "Noida", 
        state: "Uttar Pradesh",
        medianSalaryINR: 1440000, 
        medianSalaryUSD: 17200, 
        techHubRank: 8 
      }
    ]
  },
  {
    state: "Telangana",
    stateCode: "TG",
    medianSalaryINR: 1512000,
    medianSalaryUSD: 18000,
    topCities: [
      { 
        city: "Hyderabad", 
        state: "Telangana",
        medianSalaryINR: 1512000, 
        medianSalaryUSD: 18000, 
        techHubRank: 5 
      }
    ]
  },
  {
    state: "Tamil Nadu",
    stateCode: "TN",
    medianSalaryINR: 1392000,
    medianSalaryUSD: 16500,
    topCities: [
      { 
        city: "Chennai", 
        state: "Tamil Nadu",
        medianSalaryINR: 1392000, 
        medianSalaryUSD: 16500, 
        techHubRank: 6 
      }
    ]
  },
  {
    state: "West Bengal",
    stateCode: "WB",
    medianSalaryINR: 1200000,
    medianSalaryUSD: 14200,
    topCities: [
      { 
        city: "Kolkata", 
        state: "West Bengal",
        medianSalaryINR: 1200000, 
        medianSalaryUSD: 14200, 
        techHubRank: 9 
      }
    ]
  },
  {
    state: "Gujarat",
    stateCode: "GJ",
    medianSalaryINR: 1296000,
    medianSalaryUSD: 15400,
    topCities: [
      { 
        city: "Ahmedabad", 
        state: "Gujarat",
        medianSalaryINR: 1296000, 
        medianSalaryUSD: 15400, 
        techHubRank: 10 
      }
    ]
  }
];

export const top15IndiaCities: IndiaCitySalaryData[] = [
  { city: "Bangalore", state: "Karnataka", medianSalaryINR: 1800000, medianSalaryUSD: 21500, techHubRank: 1 },
  { city: "Mumbai", state: "Maharashtra", medianSalaryINR: 1680000, medianSalaryUSD: 20000, techHubRank: 2 },
  { city: "Delhi NCR", state: "Delhi", medianSalaryINR: 1560000, medianSalaryUSD: 18500, techHubRank: 3 },
  { city: "Pune", state: "Maharashtra", medianSalaryINR: 1488000, medianSalaryUSD: 18000, techHubRank: 4 },
  { city: "Hyderabad", state: "Telangana", medianSalaryINR: 1512000, medianSalaryUSD: 18000, techHubRank: 5 },
  { city: "Gurgaon", state: "Haryana", medianSalaryINR: 1620000, medianSalaryUSD: 19200, techHubRank: 5 },
  { city: "Chennai", state: "Tamil Nadu", medianSalaryINR: 1392000, medianSalaryUSD: 16500, techHubRank: 6 },
  { city: "Noida", state: "Uttar Pradesh", medianSalaryINR: 1440000, medianSalaryUSD: 17200, techHubRank: 8 },
  { city: "Kolkata", state: "West Bengal", medianSalaryINR: 1200000, medianSalaryUSD: 14200, techHubRank: 9 },
  { city: "Ahmedabad", state: "Gujarat", medianSalaryINR: 1296000, medianSalaryUSD: 15400, techHubRank: 10 },
  { city: "Chandigarh", state: "Punjab", medianSalaryINR: 1344000, medianSalaryUSD: 16000, techHubRank: 11 },
  { city: "Jaipur", state: "Rajasthan", medianSalaryINR: 1104000, medianSalaryUSD: 13200, techHubRank: 12 },
  { city: "Kochi", state: "Kerala", medianSalaryINR: 1152000, medianSalaryUSD: 13800, techHubRank: 13 },
  { city: "Indore", state: "Madhya Pradesh", medianSalaryINR: 1056000, medianSalaryUSD: 12600, techHubRank: 14 },
  { city: "Coimbatore", state: "Tamil Nadu", medianSalaryINR: 1008000, medianSalaryUSD: 12000, techHubRank: 15 }
];

export const getIndiaStateColor = (salaryUSD: number): string => {
  if (salaryUSD >= 20000) return "hsl(18, 100%, 51%)"; // Blaze Orange
  if (salaryUSD >= 17000) return "hsl(184, 92%, 18%)"; // Deep Sea
  if (salaryUSD >= 14000) return "hsl(210, 29%, 12%)"; // Mirage
  return "hsl(180, 25%, 93%)"; // Wild Sand
};
