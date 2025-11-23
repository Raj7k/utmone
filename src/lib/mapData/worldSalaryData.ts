// Global salary data by country for interactive world map
// Median base salary in USD for Marketing Manager role (benchmark)

export interface CountrySalaryData {
  country: string;
  countryCode: string;
  medianSalary: number;  // USD
  region: "North America" | "Europe" | "Asia Pacific" | "Latin America" | "Middle East";
  coordinates: [number, number];  // [longitude, latitude]
  salaryRange: [number, number];  // [min, max]
  topCities: string[];
}

export const worldSalaryData: CountrySalaryData[] = [
  {
    country: "United States",
    countryCode: "US",
    medianSalary: 95000,
    region: "North America",
    coordinates: [-98.5795, 39.8283],
    salaryRange: [60000, 180000],
    topCities: ["San Francisco", "New York", "Seattle", "Boston", "Austin"]
  },
  {
    country: "Canada",
    countryCode: "CA",
    medianSalary: 75000,
    region: "North America",
    coordinates: [-106.3468, 56.1304],
    salaryRange: [50000, 130000],
    topCities: ["Toronto", "Vancouver", "Montreal"]
  },
  {
    country: "United Kingdom",
    countryCode: "GB",
    medianSalary: 65000,
    region: "Europe",
    coordinates: [-3.4360, 55.3781],
    salaryRange: [45000, 110000],
    topCities: ["London", "Manchester", "Edinburgh"]
  },
  {
    country: "Germany",
    countryCode: "DE",
    medianSalary: 68000,
    region: "Europe",
    coordinates: [10.4515, 51.1657],
    salaryRange: [48000, 115000],
    topCities: ["Berlin", "Munich", "Frankfurt", "Hamburg"]
  },
  {
    country: "France",
    countryCode: "FR",
    medianSalary: 60000,
    region: "Europe",
    coordinates: [2.2137, 46.2276],
    salaryRange: [42000, 105000],
    topCities: ["Paris", "Lyon", "Marseille"]
  },
  {
    country: "Netherlands",
    countryCode: "NL",
    medianSalary: 70000,
    region: "Europe",
    coordinates: [5.2913, 52.1326],
    salaryRange: [50000, 120000],
    topCities: ["Amsterdam", "Rotterdam", "Utrecht"]
  },
  {
    country: "Switzerland",
    countryCode: "CH",
    medianSalary: 105000,
    region: "Europe",
    coordinates: [8.2275, 46.8182],
    salaryRange: [75000, 180000],
    topCities: ["Zurich", "Geneva", "Basel"]
  },
  {
    country: "India",
    countryCode: "IN",
    medianSalary: 18000,
    region: "Asia Pacific",
    coordinates: [78.9629, 20.5937],
    salaryRange: [10000, 40000],
    topCities: ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Pune"]
  },
  {
    country: "Singapore",
    countryCode: "SG",
    medianSalary: 82000,
    region: "Asia Pacific",
    coordinates: [103.8198, 1.3521],
    salaryRange: [55000, 145000],
    topCities: ["Singapore"]
  },
  {
    country: "Australia",
    countryCode: "AU",
    medianSalary: 80000,
    region: "Asia Pacific",
    coordinates: [133.7751, -25.2744],
    salaryRange: [55000, 140000],
    topCities: ["Sydney", "Melbourne", "Brisbane"]
  },
  {
    country: "Japan",
    countryCode: "JP",
    medianSalary: 55000,
    region: "Asia Pacific",
    coordinates: [138.2529, 36.2048],
    salaryRange: [38000, 95000],
    topCities: ["Tokyo", "Osaka", "Nagoya"]
  },
  {
    country: "United Arab Emirates",
    countryCode: "AE",
    medianSalary: 72000,
    region: "Middle East",
    coordinates: [53.8478, 23.4241],
    salaryRange: [50000, 130000],
    topCities: ["Dubai", "Abu Dhabi"]
  },
  {
    country: "Brazil",
    countryCode: "BR",
    medianSalary: 22000,
    region: "Latin America",
    coordinates: [-51.9253, -14.2350],
    salaryRange: [12000, 48000],
    topCities: ["São Paulo", "Rio de Janeiro"]
  },
  {
    country: "Mexico",
    countryCode: "MX",
    medianSalary: 20000,
    region: "Latin America",
    coordinates: [-102.5528, 23.6345],
    salaryRange: [11000, 42000],
    topCities: ["Mexico City", "Guadalajara", "Monterrey"]
  },
  {
    country: "Spain",
    countryCode: "ES",
    medianSalary: 48000,
    region: "Europe",
    coordinates: [-3.7492, 40.4637],
    salaryRange: [32000, 85000],
    topCities: ["Madrid", "Barcelona", "Valencia"]
  }
];

export const getSalaryColorScale = (salary: number): string => {
  if (salary >= 90000) return "hsl(18, 100%, 51%)"; // Blaze Orange - highest
  if (salary >= 70000) return "hsl(184, 92%, 18%)"; // Deep Sea - high
  if (salary >= 50000) return "hsl(210, 29%, 12%)"; // Mirage - medium
  return "hsl(180, 25%, 93%)"; // Wild Sand - low
};
