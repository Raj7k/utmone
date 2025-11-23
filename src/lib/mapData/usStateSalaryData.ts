// US state-level salary data for Marketing Manager role
// Includes cost-of-living-adjusted salaries and top cities

export interface USStateSalaryData {
  state: string;
  stateCode: string;
  medianSalary: number;  // USD
  colAdjustedSalary: number;  // Cost of living adjusted
  topCities: Array<{
    city: string;
    medianSalary: number;
    colIndex: number;  // 100 = national average
  }>;
}

export const usStateSalaryData: USStateSalaryData[] = [
  {
    state: "California",
    stateCode: "CA",
    medianSalary: 125000,
    colAdjustedSalary: 87500,
    topCities: [
      { city: "San Francisco", medianSalary: 145000, colIndex: 165 },
      { city: "San Jose", medianSalary: 140000, colIndex: 160 },
      { city: "Los Angeles", medianSalary: 115000, colIndex: 145 },
      { city: "San Diego", medianSalary: 108000, colIndex: 140 },
      { city: "Sacramento", medianSalary: 98000, colIndex: 120 }
    ]
  },
  {
    state: "New York",
    stateCode: "NY",
    medianSalary: 115000,
    colAdjustedSalary: 82500,
    topCities: [
      { city: "New York City", medianSalary: 125000, colIndex: 155 },
      { city: "Buffalo", medianSalary: 85000, colIndex: 95 },
      { city: "Rochester", medianSalary: 82000, colIndex: 92 }
    ]
  },
  {
    state: "Washington",
    stateCode: "WA",
    medianSalary: 118000,
    colAdjustedSalary: 89200,
    topCities: [
      { city: "Seattle", medianSalary: 125000, colIndex: 142 },
      { city: "Bellevue", medianSalary: 122000, colIndex: 140 },
      { city: "Tacoma", medianSalary: 95000, colIndex: 115 }
    ]
  },
  {
    state: "Massachusetts",
    stateCode: "MA",
    medianSalary: 112000,
    colAdjustedSalary: 86000,
    topCities: [
      { city: "Boston", medianSalary: 118000, colIndex: 145 },
      { city: "Cambridge", medianSalary: 120000, colIndex: 148 },
      { city: "Worcester", medianSalary: 92000, colIndex: 108 }
    ]
  },
  {
    state: "Texas",
    stateCode: "TX",
    medianSalary: 95000,
    colAdjustedSalary: 98750,
    topCities: [
      { city: "Austin", medianSalary: 105000, colIndex: 118 },
      { city: "Dallas", medianSalary: 98000, colIndex: 105 },
      { city: "Houston", medianSalary: 96000, colIndex: 102 },
      { city: "San Antonio", medianSalary: 85000, colIndex: 95 }
    ]
  },
  {
    state: "Colorado",
    stateCode: "CO",
    medianSalary: 102000,
    colAdjustedSalary: 92000,
    topCities: [
      { city: "Denver", medianSalary: 108000, colIndex: 125 },
      { city: "Boulder", medianSalary: 112000, colIndex: 130 },
      { city: "Colorado Springs", medianSalary: 88000, colIndex: 105 }
    ]
  },
  {
    state: "Illinois",
    stateCode: "IL",
    medianSalary: 98000,
    colAdjustedSalary: 92500,
    topCities: [
      { city: "Chicago", medianSalary: 105000, colIndex: 115 },
      { city: "Naperville", medianSalary: 102000, colIndex: 118 }
    ]
  },
  {
    state: "Georgia",
    stateCode: "GA",
    medianSalary: 92000,
    colAdjustedSalary: 97000,
    topCities: [
      { city: "Atlanta", medianSalary: 98000, colIndex: 108 },
      { city: "Alpharetta", medianSalary: 100000, colIndex: 110 }
    ]
  },
  {
    state: "North Carolina",
    stateCode: "NC",
    medianSalary: 88000,
    colAdjustedSalary: 94000,
    topCities: [
      { city: "Raleigh", medianSalary: 95000, colIndex: 105 },
      { city: "Charlotte", medianSalary: 92000, colIndex: 103 },
      { city: "Durham", medianSalary: 93000, colIndex: 104 }
    ]
  },
  {
    state: "Florida",
    stateCode: "FL",
    medianSalary: 85000,
    colAdjustedSalary: 88000,
    topCities: [
      { city: "Miami", medianSalary: 92000, colIndex: 118 },
      { city: "Tampa", medianSalary: 82000, colIndex: 98 },
      { city: "Orlando", medianSalary: 80000, colIndex: 95 }
    ]
  }
];

export const getUSStateColor = (colAdjustedSalary: number): string => {
  if (colAdjustedSalary >= 95000) return "hsl(18, 100%, 51%)"; // Blaze Orange
  if (colAdjustedSalary >= 85000) return "hsl(184, 92%, 18%)"; // Deep Sea
  if (colAdjustedSalary >= 75000) return "hsl(210, 29%, 12%)"; // Mirage
  return "hsl(180, 25%, 93%)"; // Wild Sand
};
