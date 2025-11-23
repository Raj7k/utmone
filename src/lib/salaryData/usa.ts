// USA state-level salary data and adjustments
// Data sourced from BLS, Glassdoor, Indeed salary surveys

export interface StateData {
  state: string;
  stateCode: string;
  topCities: string[];
  medianSalary: number; // For Marketing Manager baseline
  costOfLivingIndex: number; // 100 = national average
  remoteWorkAdoption: number; // Percentage
  topIndustries: string[];
}

export const usaStateData: StateData[] = [
  {
    state: 'California',
    stateCode: 'CA',
    topCities: ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose'],
    medianSalary: 125000,
    costOfLivingIndex: 151,
    remoteWorkAdoption: 42,
    topIndustries: ['Technology', 'Entertainment', 'Healthcare']
  },
  {
    state: 'New York',
    stateCode: 'NY',
    topCities: ['New York City', 'Buffalo', 'Rochester', 'Albany'],
    medianSalary: 118000,
    costOfLivingIndex: 148,
    remoteWorkAdoption: 38,
    topIndustries: ['Financial Services', 'Technology', 'Media']
  },
  {
    state: 'Washington',
    stateCode: 'WA',
    topCities: ['Seattle', 'Bellevue', 'Tacoma', 'Spokane'],
    medianSalary: 115000,
    costOfLivingIndex: 118,
    remoteWorkAdoption: 45,
    topIndustries: ['Technology', 'Aerospace', 'Retail']
  },
  {
    state: 'Massachusetts',
    stateCode: 'MA',
    topCities: ['Boston', 'Cambridge', 'Worcester', 'Springfield'],
    medianSalary: 112000,
    costOfLivingIndex: 145,
    remoteWorkAdoption: 40,
    topIndustries: ['Technology', 'Healthcare', 'Education']
  },
  {
    state: 'Texas',
    stateCode: 'TX',
    topCities: ['Austin', 'Dallas', 'Houston', 'San Antonio'],
    medianSalary: 98000,
    costOfLivingIndex: 92,
    remoteWorkAdoption: 35,
    topIndustries: ['Technology', 'Energy', 'Healthcare']
  },
  {
    state: 'Illinois',
    stateCode: 'IL',
    topCities: ['Chicago', 'Aurora', 'Naperville', 'Peoria'],
    medianSalary: 95000,
    costOfLivingIndex: 98,
    remoteWorkAdoption: 32,
    topIndustries: ['Financial Services', 'Manufacturing', 'Technology']
  },
  {
    state: 'Colorado',
    stateCode: 'CO',
    topCities: ['Denver', 'Colorado Springs', 'Boulder', 'Fort Collins'],
    medianSalary: 102000,
    costOfLivingIndex: 105,
    remoteWorkAdoption: 48,
    topIndustries: ['Technology', 'Aerospace', 'Tourism']
  },
  {
    state: 'Georgia',
    stateCode: 'GA',
    topCities: ['Atlanta', 'Augusta', 'Savannah', 'Athens'],
    medianSalary: 92000,
    costOfLivingIndex: 89,
    remoteWorkAdoption: 30,
    topIndustries: ['Technology', 'Financial Services', 'Media']
  },
  {
    state: 'Florida',
    stateCode: 'FL',
    topCities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville'],
    medianSalary: 88000,
    costOfLivingIndex: 99,
    remoteWorkAdoption: 28,
    topIndustries: ['Tourism', 'Healthcare', 'Real Estate']
  },
  {
    state: 'North Carolina',
    stateCode: 'NC',
    topCities: ['Raleigh', 'Charlotte', 'Durham', 'Greensboro'],
    medianSalary: 90000,
    costOfLivingIndex: 94,
    remoteWorkAdoption: 33,
    topIndustries: ['Technology', 'Financial Services', 'Healthcare']
  }
];

export function getStateData(stateCode: string): StateData | undefined {
  return usaStateData.find(s => s.stateCode === stateCode);
}

export function getCityMultiplier(city: string, state: string): number {
  // City-specific multipliers relative to state median
  const cityMultipliers: Record<string, number> = {
    'San Francisco': 1.42,
    'New York City': 1.38,
    'San Jose': 1.40,
    'Seattle': 1.32,
    'Boston': 1.28,
    'Los Angeles': 1.25,
    'San Diego': 1.18,
    'Austin': 1.15,
    'Denver': 1.12,
    'Chicago': 1.08,
    'Atlanta': 1.05,
    'Dallas': 1.03,
    'Miami': 1.00,
    'Phoenix': 0.98,
  };

  return cityMultipliers[city] || 1.0;
}
