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
  },
  // Additional 40 states
  {
    state: "Pennsylvania",
    stateCode: "PA",
    medianSalary: 89000,
    colAdjustedSalary: 92000,
    topCities: [
      { city: "Philadelphia", medianSalary: 95000, colIndex: 110 },
      { city: "Pittsburgh", medianSalary: 85000, colIndex: 95 }
    ]
  },
  {
    state: "New Jersey",
    stateCode: "NJ",
    medianSalary: 105000,
    colAdjustedSalary: 85000,
    topCities: [
      { city: "Jersey City", medianSalary: 110000, colIndex: 135 },
      { city: "Newark", medianSalary: 100000, colIndex: 125 }
    ]
  },
  {
    state: "Connecticut",
    stateCode: "CT",
    medianSalary: 102000,
    colAdjustedSalary: 87000,
    topCities: [
      { city: "Stamford", medianSalary: 115000, colIndex: 130 },
      { city: "Hartford", medianSalary: 95000, colIndex: 110 }
    ]
  },
  {
    state: "Virginia",
    stateCode: "VA",
    medianSalary: 93000,
    colAdjustedSalary: 95000,
    topCities: [
      { city: "Arlington", medianSalary: 108000, colIndex: 120 },
      { city: "Richmond", medianSalary: 88000, colIndex: 98 }
    ]
  },
  {
    state: "Ohio",
    stateCode: "OH",
    medianSalary: 82000,
    colAdjustedSalary: 89000,
    topCities: [
      { city: "Columbus", medianSalary: 88000, colIndex: 98 },
      { city: "Cleveland", medianSalary: 80000, colIndex: 92 }
    ]
  },
  {
    state: "Michigan",
    stateCode: "MI",
    medianSalary: 80000,
    colAdjustedSalary: 87000,
    topCities: [
      { city: "Detroit", medianSalary: 85000, colIndex: 95 },
      { city: "Ann Arbor", medianSalary: 90000, colIndex: 105 }
    ]
  },
  {
    state: "Arizona",
    stateCode: "AZ",
    medianSalary: 87000,
    colAdjustedSalary: 92000,
    topCities: [
      { city: "Phoenix", medianSalary: 90000, colIndex: 102 },
      { city: "Scottsdale", medianSalary: 95000, colIndex: 108 }
    ]
  },
  {
    state: "Minnesota",
    stateCode: "MN",
    medianSalary: 91000,
    colAdjustedSalary: 93000,
    topCities: [
      { city: "Minneapolis", medianSalary: 98000, colIndex: 108 },
      { city: "St. Paul", medianSalary: 92000, colIndex: 105 }
    ]
  },
  {
    state: "Wisconsin",
    stateCode: "WI",
    medianSalary: 78000,
    colAdjustedSalary: 86000,
    topCities: [
      { city: "Milwaukee", medianSalary: 82000, colIndex: 95 },
      { city: "Madison", medianSalary: 85000, colIndex: 98 }
    ]
  },
  {
    state: "Missouri",
    stateCode: "MO",
    medianSalary: 76000,
    colAdjustedSalary: 84000,
    topCities: [
      { city: "Kansas City", medianSalary: 82000, colIndex: 95 },
      { city: "St. Louis", medianSalary: 78000, colIndex: 92 }
    ]
  },
  {
    state: "Tennessee",
    stateCode: "TN",
    medianSalary: 79000,
    colAdjustedSalary: 87000,
    topCities: [
      { city: "Nashville", medianSalary: 88000, colIndex: 105 },
      { city: "Memphis", medianSalary: 75000, colIndex: 90 }
    ]
  },
  {
    state: "Oregon",
    stateCode: "OR",
    medianSalary: 97000,
    colAdjustedSalary: 91000,
    topCities: [
      { city: "Portland", medianSalary: 102000, colIndex: 118 },
      { city: "Eugene", medianSalary: 85000, colIndex: 98 }
    ]
  },
  {
    state: "Nevada",
    stateCode: "NV",
    medianSalary: 86000,
    colAdjustedSalary: 89000,
    topCities: [
      { city: "Las Vegas", medianSalary: 88000, colIndex: 100 },
      { city: "Reno", medianSalary: 82000, colIndex: 95 }
    ]
  },
  {
    state: "Utah",
    stateCode: "UT",
    medianSalary: 84000,
    colAdjustedSalary: 90000,
    topCities: [
      { city: "Salt Lake City", medianSalary: 90000, colIndex: 102 },
      { city: "Provo", medianSalary: 78000, colIndex: 92 }
    ]
  },
  {
    state: "Indiana",
    stateCode: "IN",
    medianSalary: 75000,
    colAdjustedSalary: 83000,
    topCities: [
      { city: "Indianapolis", medianSalary: 80000, colIndex: 95 }
    ]
  },
  {
    state: "Maryland",
    stateCode: "MD",
    medianSalary: 96000,
    colAdjustedSalary: 88000,
    topCities: [
      { city: "Baltimore", medianSalary: 92000, colIndex: 105 },
      { city: "Bethesda", medianSalary: 105000, colIndex: 120 }
    ]
  },
  {
    state: "South Carolina",
    stateCode: "SC",
    medianSalary: 74000,
    colAdjustedSalary: 82000,
    topCities: [
      { city: "Charleston", medianSalary: 80000, colIndex: 98 },
      { city: "Columbia", medianSalary: 72000, colIndex: 90 }
    ]
  },
  {
    state: "Alabama",
    stateCode: "AL",
    medianSalary: 71000,
    colAdjustedSalary: 80000,
    topCities: [
      { city: "Birmingham", medianSalary: 75000, colIndex: 92 }
    ]
  },
  {
    state: "Louisiana",
    stateCode: "LA",
    medianSalary: 73000,
    colAdjustedSalary: 81000,
    topCities: [
      { city: "New Orleans", medianSalary: 78000, colIndex: 95 },
      { city: "Baton Rouge", medianSalary: 70000, colIndex: 88 }
    ]
  },
  {
    state: "Kentucky",
    stateCode: "KY",
    medianSalary: 72000,
    colAdjustedSalary: 81000,
    topCities: [
      { city: "Louisville", medianSalary: 76000, colIndex: 92 }
    ]
  },
  {
    state: "Oklahoma",
    stateCode: "OK",
    medianSalary: 70000,
    colAdjustedSalary: 79000,
    topCities: [
      { city: "Oklahoma City", medianSalary: 74000, colIndex: 90 }
    ]
  },
  {
    state: "Arkansas",
    stateCode: "AR",
    medianSalary: 68000,
    colAdjustedSalary: 77000,
    topCities: [
      { city: "Little Rock", medianSalary: 72000, colIndex: 88 }
    ]
  },
  {
    state: "Iowa",
    stateCode: "IA",
    medianSalary: 73000,
    colAdjustedSalary: 82000,
    topCities: [
      { city: "Des Moines", medianSalary: 78000, colIndex: 92 }
    ]
  },
  {
    state: "Kansas",
    stateCode: "KS",
    medianSalary: 74000,
    colAdjustedSalary: 83000,
    topCities: [
      { city: "Overland Park", medianSalary: 80000, colIndex: 95 }
    ]
  },
  {
    state: "Nebraska",
    stateCode: "NE",
    medianSalary: 72000,
    colAdjustedSalary: 81000,
    topCities: [
      { city: "Omaha", medianSalary: 76000, colIndex: 90 }
    ]
  },
  {
    state: "New Mexico",
    stateCode: "NM",
    medianSalary: 71000,
    colAdjustedSalary: 79000,
    topCities: [
      { city: "Albuquerque", medianSalary: 74000, colIndex: 88 }
    ]
  },
  {
    state: "West Virginia",
    stateCode: "WV",
    medianSalary: 67000,
    colAdjustedSalary: 76000,
    topCities: [
      { city: "Charleston", medianSalary: 70000, colIndex: 85 }
    ]
  },
  {
    state: "Idaho",
    stateCode: "ID",
    medianSalary: 75000,
    colAdjustedSalary: 83000,
    topCities: [
      { city: "Boise", medianSalary: 80000, colIndex: 95 }
    ]
  },
  {
    state: "Hawaii",
    stateCode: "HI",
    medianSalary: 94000,
    colAdjustedSalary: 68000,
    topCities: [
      { city: "Honolulu", medianSalary: 98000, colIndex: 150 }
    ]
  },
  {
    state: "New Hampshire",
    stateCode: "NH",
    medianSalary: 91000,
    colAdjustedSalary: 88000,
    topCities: [
      { city: "Manchester", medianSalary: 88000, colIndex: 105 }
    ]
  },
  {
    state: "Maine",
    stateCode: "ME",
    medianSalary: 77000,
    colAdjustedSalary: 82000,
    topCities: [
      { city: "Portland", medianSalary: 82000, colIndex: 98 }
    ]
  },
  {
    state: "Rhode Island",
    stateCode: "RI",
    medianSalary: 87000,
    colAdjustedSalary: 83000,
    topCities: [
      { city: "Providence", medianSalary: 90000, colIndex: 108 }
    ]
  },
  {
    state: "Montana",
    stateCode: "MT",
    medianSalary: 69000,
    colAdjustedSalary: 77000,
    topCities: [
      { city: "Billings", medianSalary: 72000, colIndex: 88 }
    ]
  },
  {
    state: "Delaware",
    stateCode: "DE",
    medianSalary: 86000,
    colAdjustedSalary: 87000,
    topCities: [
      { city: "Wilmington", medianSalary: 90000, colIndex: 100 }
    ]
  },
  {
    state: "South Dakota",
    stateCode: "SD",
    medianSalary: 68000,
    colAdjustedSalary: 77000,
    topCities: [
      { city: "Sioux Falls", medianSalary: 72000, colIndex: 88 }
    ]
  },
  {
    state: "North Dakota",
    stateCode: "ND",
    medianSalary: 70000,
    colAdjustedSalary: 78000,
    topCities: [
      { city: "Fargo", medianSalary: 74000, colIndex: 90 }
    ]
  },
  {
    state: "Alaska",
    stateCode: "AK",
    medianSalary: 92000,
    colAdjustedSalary: 78000,
    topCities: [
      { city: "Anchorage", medianSalary: 95000, colIndex: 125 }
    ]
  },
  {
    state: "Vermont",
    stateCode: "VT",
    medianSalary: 76000,
    colAdjustedSalary: 80000,
    topCities: [
      { city: "Burlington", medianSalary: 80000, colIndex: 98 }
    ]
  },
  {
    state: "Wyoming",
    stateCode: "WY",
    medianSalary: 71000,
    colAdjustedSalary: 79000,
    topCities: [
      { city: "Cheyenne", medianSalary: 74000, colIndex: 88 }
    ]
  },
  {
    state: "Mississippi",
    stateCode: "MS",
    medianSalary: 65000,
    colAdjustedSalary: 75000,
    topCities: [
      { city: "Jackson", medianSalary: 68000, colIndex: 85 }
    ]
  }
];

export const getUSStateColor = (colAdjustedSalary: number): string => {
  if (colAdjustedSalary >= 95000) return "hsl(18, 100%, 51%)"; // Blaze Orange
  if (colAdjustedSalary >= 85000) return "hsl(184, 92%, 18%)"; // Deep Sea
  if (colAdjustedSalary >= 75000) return "hsl(210, 29%, 12%)"; // Mirage
  return "hsl(180, 25%, 93%)"; // Wild Sand
};
