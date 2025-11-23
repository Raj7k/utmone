import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Globe, TrendingUp, MapPin, DollarSign } from "lucide-react";
import { GeographicMultiplierMap } from "./visualizations/GeographicMultiplierMap";
import { GeographicArbitrageCalculator } from "./tools/GeographicArbitrageCalculator";
import { InteractiveWorldMap } from "./visualizations/InteractiveWorldMap";
import { USStateMap } from "./visualizations/USStateMap";
import { IndiaStateMap } from "./visualizations/IndiaStateMap";

interface RegionalData {
  region: string;
  summary: string;
  salaryHighlights: Array<{ role: string; range: string }>;
  trends: Array<{ title: string; description: string; impact: string }>;
  topCities: Array<{ city: string; premium: string }>;
}

const regionalData: RegionalData[] = [
  {
    region: "United States",
    summary: "The world's highest-paying GTM market with strongest AI adoption and geographic wage compression accelerating.",
    salaryHighlights: [
      { role: "Product Marketing Manager", range: "$115K-$150K" },
      { role: "Demand Generation Manager", range: "$105K-$135K" },
      { role: "Revenue Operations Manager", range: "$110K-$145K" },
      { role: "Enterprise AE", range: "$110K-$160K base ($220K-$400K+ OTE)" },
      { role: "VP Marketing", range: "$240K-$340K" },
    ],
    trends: [
      { 
        title: "AI Proficiency = Highest Salary Uplift", 
        description: "AI usage adds $20K-$40K for Marketing, $15K-$30K for Ops, $40K-$70K OTE for Enterprise Sales",
        impact: "+22-41%" 
      },
      { 
        title: "Geographic Wage Compression", 
        description: "Remote-friendly companies shifting away from SF/NY salary premiums toward Austin, Denver markets",
        impact: "-8-15% SF/NY premium" 
      },
      { 
        title: "Middle-Tier Markets Rising", 
        description: "Austin, Denver, Salt Lake City showing strong GTM talent inflow with competitive salaries",
        impact: "+12-18% YoY" 
      },
    ],
    topCities: [
      { city: "San Francisco Bay Area", premium: "1.35x national avg" },
      { city: "New York City", premium: "1.30x" },
      { city: "Seattle", premium: "1.25x" },
      { city: "Austin", premium: "1.10x" },
      { city: "Denver", premium: "1.08x" },
    ]
  },
  {
    region: "India",
    summary: "Fastest-growing GTM talent hub globally with explosive RevOps/MarkOps density and 86% AI adoption rate.",
    salaryHighlights: [
      { role: "Product Marketing Manager", range: "₹18-28L ($22K-$35K)" },
      { role: "Demand Generation Manager", range: "₹15-25L ($18K-$30K)" },
      { role: "Revenue Operations Manager", range: "₹20-40L ($25K-$50K)" },
      { role: "Global-facing AE", range: "₹16-32L base ($20K-$40K base, $30K-$70K OTE)" },
      { role: "Director RevOps", range: "₹36-68L ($45K-$85K)" },
    ],
    trends: [
      { 
        title: "Fastest YoY Salary Growth", 
        description: "RevOps salaries growing +32% YoY, MarkOps +28%, PMM +24% due to global SaaS hiring",
        impact: "+24-32% YoY" 
      },
      { 
        title: "Global RevOps Capital", 
        description: "Demand from US SaaS companies creating explosive salary growth in operations roles",
        impact: "Highest density globally" 
      },
      { 
        title: "AI Adoption Highest", 
        description: "86% self-reported AI tool usage—higher than US/EU markets",
        impact: "Skill premium +15-22%" 
      },
    ],
    topCities: [
      { city: "Bangalore", premium: "Highest tech salaries" },
      { city: "Mumbai", premium: "Financial services hub" },
      { city: "Delhi NCR (Gurgaon)", premium: "Enterprise-focused" },
      { city: "Hyderabad", premium: "RevOps/MarkOps" },
      { city: "Pune", premium: "Tier-2 rising" },
    ]
  },
  {
    region: "Europe (UK, DACH, Nordics)",
    summary: "More stable than US with 20-40% lower compensation, strong RevOps demand but talent gap persists.",
    salaryHighlights: [
      { role: "PMM Manager (UK)", range: "£50K-£70K ($65K-$90K)" },
      { role: "Demand Gen Manager (Germany)", range: "€55K-€75K ($60K-$85K)" },
      { role: "RevOps Manager (Nordics)", range: "€65K-€95K ($75K-$110K)" },
      { role: "AE (UK)", range: "£60K-£90K base ($80K-$120K base)" },
      { role: "Marketing Director (DACH)", range: "€110K-€140K ($130K-$160K)" },
    ],
    trends: [
      { 
        title: "RevOps Talent Gap", 
        description: "Germany + UK + Nordics showing huge shortages in operations roles",
        impact: "Demand > supply" 
      },
      { 
        title: "Marketing Automation Maturing", 
        description: "Marketo + HubSpot talent in high demand but still catching up to US adoption",
        impact: "+12-18% premium" 
      },
      { 
        title: "Lower Job Switching", 
        description: "Longer job tenure compared to US means slower salary inflation",
        impact: "Stability factor" 
      },
    ],
    topCities: [
      { city: "London", premium: "Highest UK salaries" },
      { city: "Berlin", premium: "Tech hub rising" },
      { city: "Munich", premium: "Enterprise Germany" },
      { city: "Stockholm", premium: "Nordic leader" },
      { city: "Amsterdam", premium: "SaaS center" },
    ]
  },
  {
    region: "APAC (Singapore, Australia, Japan)",
    summary: "Region of contrasts—Singapore talent hub with highest salaries, Australia stable high-cost, Japan cultural complexity.",
    salaryHighlights: [
      { role: "PMM (Singapore)", range: "S$60K-$100K ($45K-$75K)" },
      { role: "Demand Gen (Australia)", range: "A$60K-$95K ($45K-$70K)" },
      { role: "RevOps Manager (Singapore)", range: "S$100K-$160K ($75K-$120K)" },
      { role: "Enterprise AE (Japan)", range: "¥14M-¥20M ($120K-$180K)" },
      { role: "AE (Australia)", range: "A$95K-$150K ($70K-$110K)" },
    ],
    trends: [
      { 
        title: "Singapore Leads Tech Salaries", 
        description: "Highest APAC salaries for operations and PMM roles due to regional HQ concentration",
        impact: "Regional leader" 
      },
      { 
        title: "Japan Cultural Premium", 
        description: "Highest base pay for senior roles but demands strong language/cultural fluency",
        impact: "+18-25% senior roles" 
      },
      { 
        title: "Australia High Floor", 
        description: "Highest minimum salaries due to cost of living and labor regulations",
        impact: "Stable baseline" 
      },
    ],
    topCities: [
      { city: "Singapore", premium: "Regional hub" },
      { city: "Sydney", premium: "Australia leader" },
      { city: "Tokyo", premium: "Japan premium" },
      { city: "Melbourne", premium: "Tech center" },
      { city: "Hong Kong", premium: "Financial hub" },
    ]
  },
  {
    region: "LATAM (Brazil, Mexico, Argentina)",
    summary: "Fastest-rising remote talent market for US/EU companies with strong bilingual talent pool and cost arbitrage.",
    salaryHighlights: [
      { role: "PMM", range: "$15K-$26K" },
      { role: "Demand Gen Manager", range: "$14K-$22K" },
      { role: "RevOps Specialist", range: "$18K-$35K" },
      { role: "AE", range: "$20K-$45K" },
      { role: "Enterprise AE", range: "$30K-$60K" },
    ],
    trends: [
      { 
        title: "Bilingual Talent Premium", 
        description: "Strong English + Portuguese/Spanish speakers commanding higher demand from global companies",
        impact: "+20-35% premium" 
      },
      { 
        title: "Remote Hiring Boom", 
        description: "Cost arbitrage driving aggressive hiring by US/EU companies at 40-60% US salary levels",
        impact: "+20-25% YoY growth" 
      },
      { 
        title: "High Turnover", 
        description: "Professionals jumping frequently for USD-paying roles creating wage inflation",
        impact: "Retention challenge" 
      },
    ],
    topCities: [
      { city: "São Paulo", premium: "Brazil tech hub" },
      { city: "Mexico City", premium: "US proximity" },
      { city: "Buenos Aires", premium: "Talent depth" },
      { city: "Guadalajara", premium: "Tech corridor" },
      { city: "Bogotá", premium: "Rising star" },
    ]
  },
  {
    region: "MENA (UAE, Saudi Arabia, Israel)",
    summary: "High-cash, low-equity market with UAE as regional HQ hub, Saudi enterprise focus, Israel cybersecurity density.",
    salaryHighlights: [
      { role: "PMM", range: "$20K-$30K" },
      { role: "Demand Gen", range: "$25K-$35K" },
      { role: "RevOps Manager", range: "$30K-$60K" },
      { role: "Enterprise AE", range: "$40K-$75K" },
      { role: "Sales Director", range: "$55K-$100K" },
    ],
    trends: [
      { 
        title: "Enterprise & Government Sales", 
        description: "High reliance on B2B services and enterprise sales especially in Saudi Arabia",
        impact: "Long sales cycles" 
      },
      { 
        title: "Israel Tech Premium", 
        description: "Highest MENA salaries due to cybersecurity and tech startup density",
        impact: "+30-50% vs region" 
      },
      { 
        title: "Saudi Modernization", 
        description: "Fastest expansion driven by Saudi tech modernization initiatives and Vision 2030",
        impact: "+18-22% YoY" 
      },
    ],
    topCities: [
      { city: "Dubai", premium: "Regional HQ hub" },
      { city: "Tel Aviv", premium: "Tech/security" },
      { city: "Riyadh", premium: "Enterprise Saudi" },
      { city: "Abu Dhabi", premium: "Government" },
      { city: "Doha", premium: "Emerging" },
    ]
  },
];

export const RegionalDeepDives = () => {
  const [selectedRegion, setSelectedRegion] = useState("United States");
  
  const currentData = regionalData.find(r => r.region === selectedRegion) || regionalData[0];

  return (
    <section id="section-5" className="py-32 bg-background">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge className="bg-blazeOrange text-white text-base px-4 py-2">Section 05</Badge>
            <Badge variant="outline" className="text-sm">15 min read</Badge>
          </div>
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-deepSea/10">
              <Globe className="h-8 w-8 text-deepSea" />
            </div>
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6">
            Regional Compensation Deep Dives
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-[1.7]">
            Detailed salary breakdowns, trends, and insights across 6 global regions
          </p>
        </div>

        {/* Geographic Arbitrage Calculator Tool */}
        <div className="mb-16">
          <GeographicArbitrageCalculator />
        </div>

        {/* Geographic Multiplier Visualization */}
        <div className="mb-12">
          <GeographicMultiplierMap />
        </div>

        <Tabs defaultValue="United States" className="space-y-8" onValueChange={setSelectedRegion}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="United States">United States</TabsTrigger>
            <TabsTrigger value="India">India</TabsTrigger>
            <TabsTrigger value="Europe (UK, DACH, Nordics)">Europe</TabsTrigger>
            <TabsTrigger value="APAC (Singapore, Australia, Japan)">APAC</TabsTrigger>
            <TabsTrigger value="LATAM (Brazil, Mexico, Argentina)">LATAM</TabsTrigger>
            <TabsTrigger value="MENA (UAE, Saudi Arabia, Israel)">MENA</TabsTrigger>
          </TabsList>

          {regionalData.map((region) => (
            <TabsContent key={region.region} value={region.region} className="space-y-8">
              {/* Summary Card */}
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-blazeOrange/10 shrink-0">
                      <MapPin className="h-6 w-6 text-blazeOrange" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-bold mb-3">{region.region}</h3>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {region.summary}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Salary Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-blazeOrange" />
                    Key Salary Benchmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {region.salaryHighlights.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                        <span className="font-medium">{item.role}</span>
                        <Badge className="bg-deepSea text-sm">{item.range}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Regional Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blazeOrange" />
                    Regional Trends
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    {region.trends.map((trend, idx) => (
                      <div key={idx} className="space-y-3 p-6 rounded-lg border-2 border-border/50 hover:border-deepSea/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <h4 className="font-display font-semibold text-lg">{trend.title}</h4>
                          <Badge variant="outline" className="text-blazeOrange border-blazeOrange">
                            {trend.impact}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {trend.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Cities */}
              <Card>
                <CardHeader>
                  <CardTitle>Top Cities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {region.topCities.map((city, idx) => (
                      <div key={idx} className="text-center p-4 rounded-lg bg-deepSea/5 border border-deepSea/20">
                        <div className="font-semibold mb-1">{city.city}</div>
                        <div className="text-sm text-muted-foreground">{city.premium}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        {/* Interactive Global Salary Map */}
        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            Interactive Global Salary Map
          </h3>
          <p className="text-lg text-muted-foreground text-center max-w-[750px] mx-auto mb-8">
            Click any country to see detailed salary data, cost of living, and top cities. Explore how compensation varies across 15+ countries.
          </p>
          <InteractiveWorldMap />
        </div>

        {/* US State Salary Breakdown */}
        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            United States: State-Level Breakdown
          </h3>
          <p className="text-lg text-muted-foreground text-center max-w-[750px] mx-auto mb-8">
            Cost-of-living adjusted salaries across all 50 states. Click any state to see city-level comparisons.
          </p>
          <USStateMap />
        </div>

        {/* India Tech Hub Breakdown */}
        <div className="mt-16">
          <h3 className="text-3xl md:text-4xl font-display font-bold mb-8 text-center">
            India: Tech Hub Salary Analysis
          </h3>
          <p className="text-lg text-muted-foreground text-center max-w-[750px] mx-auto mb-8">
            Compare salaries across India's top 15 tech hubs. Click any state to see city-level breakdowns in INR and USD.
          </p>
          <IndiaStateMap />
        </div>

        <div className="mt-12 p-6 bg-background rounded-2xl border border-border">
          <p className="text-center text-sm text-muted-foreground">
            <strong className="text-foreground">Data Sources:</strong> LinkedIn Salaries, Glassdoor, Payscale, Naukri, SHRM, 2,000+ job postings analyzed across all regions. All ranges represent base salary unless otherwise specified (OTE noted for sales roles).
          </p>
        </div>
      </div>
    </section>
  );
};