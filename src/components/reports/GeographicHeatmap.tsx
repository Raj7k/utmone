import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";

interface CityData {
  city: string;
  state: string;
  medianSalary: number;
  multiplier: number;
  costOfLiving: number;
  remoteJobs: number;
}

const topCities: CityData[] = [
  { city: "San Francisco", state: "CA", medianSalary: 142000, multiplier: 1.49, costOfLiving: 178, remoteJobs: 892 },
  { city: "New York", state: "NY", medianSalary: 128000, multiplier: 1.35, costOfLiving: 168, remoteJobs: 1247 },
  { city: "Seattle", state: "WA", medianSalary: 118000, multiplier: 1.24, costOfLiving: 142, remoteJobs: 654 },
  { city: "Boston", state: "MA", medianSalary: 115000, multiplier: 1.21, costOfLiving: 148, remoteJobs: 487 },
  { city: "Los Angeles", state: "CA", medianSalary: 112000, multiplier: 1.18, costOfLiving: 156, remoteJobs: 723 },
  { city: "Austin", state: "TX", medianSalary: 102000, multiplier: 1.07, costOfLiving: 119, remoteJobs: 534 },
  { city: "Denver", state: "CO", medianSalary: 98000, multiplier: 1.03, costOfLiving: 126, remoteJobs: 412 },
  { city: "Chicago", state: "IL", medianSalary: 96000, multiplier: 1.01, costOfLiving: 114, remoteJobs: 589 },
  { city: "Atlanta", state: "GA", medianSalary: 92000, multiplier: 0.97, costOfLiving: 106, remoteJobs: 478 },
  { city: "Remote (US avg)", state: "—", medianSalary: 88000, multiplier: 0.93, costOfLiving: 100, remoteJobs: 3421 },
];

export const GeographicHeatmap = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blazeOrange" />
          Top 20 Markets for Marketing Professionals
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Salary data adjusted for cost of living and remote work opportunities
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {topCities.map((city, index) => {
            const adjustedValue = (city.medianSalary / city.costOfLiving) * 100;
            const isRemote = city.city === "Remote (US avg)";
            
            return (
              <div 
                key={index}
                className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                  isRemote 
                    ? 'bg-blazeOrange/5 border-blazeOrange' 
                    : index < 3 
                    ? 'bg-deepSea/5 border-deepSea/30' 
                    : 'bg-wildSand/50 border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                      isRemote 
                        ? 'bg-blazeOrange text-white' 
                        : index < 3 
                        ? 'bg-deepSea text-white' 
                        : 'bg-mirage/10 text-mirage'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-semibold text-foreground">
                          {city.city}, {city.state}
                        </h4>
                        {city.multiplier > 1.2 && (
                          <Badge className="bg-blazeOrange">High Pay</Badge>
                        )}
                        {city.remoteJobs > 500 && (
                          <Badge variant="outline" className="border-deepSea text-deepSea">
                            {city.remoteJobs}+ Remote Jobs
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>CoL Index: {city.costOfLiving}</span>
                        <span>•</span>
                        <span>Multiplier: {city.multiplier}x</span>
                        <span>•</span>
                        <span className="text-deepSea font-medium">
                          Adjusted Value: ${(adjustedValue / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blazeOrange">
                      ${(city.medianSalary / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">median salary</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 bg-gradient-to-r from-deepSea/5 to-blazeOrange/5 rounded-lg border-2 border-deepSea/20">
          <div className="flex items-start gap-4">
            <TrendingUp className="h-6 w-6 text-deepSea mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-deepSea mb-2">Geographic Arbitrage Strategy</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Remote roles offer the best value proposition: earn coastal salaries ($88K+) while living in 
                lower cost-of-living areas. The adjusted purchasing power of remote work is equivalent to 
                $112K+ in high-cost markets. Over 3,400+ remote marketing positions currently available.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
