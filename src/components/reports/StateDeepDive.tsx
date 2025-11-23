import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, DollarSign, TrendingUp, Home } from "lucide-react";
import { formatCurrency } from "@/lib/salaryData";

export const StateDeepDive = () => {
  const [selectedCountry, setSelectedCountry] = useState<'usa' | 'india'>('usa');

  const usaStates = [
    { state: 'California', topCity: 'San Francisco', avgSalary: 132000, costOfLiving: 180, growth: '+14%' },
    { state: 'New York', topCity: 'New York City', avgSalary: 127000, costOfLiving: 175, growth: '+11%' },
    { state: 'Texas', topCity: 'Austin', avgSalary: 104000, costOfLiving: 105, growth: '+18%' },
    { state: 'Washington', topCity: 'Seattle', avgSalary: 118000, costOfLiving: 140, growth: '+13%' },
    { state: 'Massachusetts', topCity: 'Boston', avgSalary: 113000, costOfLiving: 145, growth: '+9%' },
    { state: 'Illinois', topCity: 'Chicago', avgSalary: 99000, costOfLiving: 108, growth: '+7%' },
    { state: 'Florida', topCity: 'Miami', avgSalary: 92000, costOfLiving: 110, growth: '+16%' },
    { state: 'Colorado', topCity: 'Denver', avgSalary: 102000, costOfLiving: 115, growth: '+12%' }
  ];

  const indiaStates = [
    { state: 'Karnataka', topCity: 'Bangalore', avgSalary: 1680000, costOfLiving: 115, growth: '+22%' },
    { state: 'Maharashtra', topCity: 'Mumbai', avgSalary: 1750000, costOfLiving: 130, growth: '+19%' },
    { state: 'Haryana', topCity: 'Gurgaon', avgSalary: 1650000, costOfLiving: 120, growth: '+20%' },
    { state: 'Telangana', topCity: 'Hyderabad', avgSalary: 1550000, costOfLiving: 105, growth: '+24%' },
    { state: 'Tamil Nadu', topCity: 'Chennai', avgSalary: 1450000, costOfLiving: 100, growth: '+18%' },
    { state: 'Delhi', topCity: 'New Delhi', avgSalary: 1600000, costOfLiving: 125, growth: '+17%' }
  ];

  const data = selectedCountry === 'usa' ? usaStates : indiaStates;

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-deepSea/10">
            <MapPin className="h-6 w-6 text-deepSea" />
          </div>
          <div>
            <CardTitle className="text-2xl font-display">State & Province Deep Dive</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Regional salary variations within each country
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usa" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="usa" onClick={() => setSelectedCountry('usa')}>
              United States
            </TabsTrigger>
            <TabsTrigger value="india" onClick={() => setSelectedCountry('india')}>
              India
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedCountry} className="space-y-4">
            {data.map((location, idx) => (
              <div
                key={location.state}
                className="p-5 rounded-lg border-2 border-deepSea/10 hover:border-deepSea/30 transition-all hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-bold text-xl">{location.state}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      Top City: {location.topCity}
                    </div>
                  </div>
                  <Badge variant="default" className="bg-deepSea">
                    Rank #{idx + 1}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>Avg Salary</span>
                    </div>
                    <div className="text-2xl font-display font-bold text-deepSea">
                      {selectedCountry === 'usa' 
                        ? formatCurrency(location.avgSalary)
                        : `₹${(location.avgSalary / 100000).toFixed(1)}L`
                      }
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Home className="h-4 w-4" />
                      <span>Cost of Living</span>
                    </div>
                    <div className="text-2xl font-display font-bold">
                      {location.costOfLiving}
                      <span className="text-base text-muted-foreground ml-1">index</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>YoY Growth</span>
                    </div>
                    <div className="text-2xl font-display font-bold text-green-600">
                      {location.growth}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <div className="mt-6 p-4 bg-wildSand/50 rounded-lg text-sm text-muted-foreground">
          <strong className="text-foreground">Data Coverage:</strong> USA includes all 50 states. 
          India covers 15 major states and union territories. Cost of living index: 100 = national average.
        </div>
      </CardContent>
    </Card>
  );
};
