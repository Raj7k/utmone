import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { indiaStateSalaryData, top15IndiaCities, getIndiaStateColor } from "@/lib/mapData/indiaStateSalaryData";
import { MapPin, TrendingUp } from "lucide-react";

export const IndiaStateMap = () => {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const stateData = selectedState
    ? indiaStateSalaryData.find((s) => s.state === selectedState)
    : null;

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <CardTitle className="text-2xl">India Tech Hub Salary Breakdown</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click a state to see city-level data. Salaries in INR and USD.
        </p>
      </CardHeader>
      <CardContent>
        {/* State Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {indiaStateSalaryData.map((state) => (
            <button
              key={state.stateCode}
              onClick={() =>
                setSelectedState(selectedState === state.state ? null : state.state)
              }
              className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-lg ${
                selectedState === state.state
                  ? "border-blazeOrange bg-blazeOrange/5"
                  : "border-deepSea/10 hover:border-deepSea/30"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg text-foreground">{state.state}</h3>
                <Badge
                  style={{ backgroundColor: getIndiaStateColor(state.medianSalaryUSD) }}
                  className="text-white text-xs"
                >
                  {state.stateCode}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-blazeOrange">
                  ₹{(state.medianSalaryINR / 100000).toFixed(1)}L
                </p>
                <p className="text-sm text-muted-foreground">
                  ${state.medianSalaryUSD.toLocaleString()} USD
                </p>
                <p className="text-xs text-deepSea font-medium mt-2">
                  {state.topCities.length} major {state.topCities.length === 1 ? "city" : "cities"}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Selected State Details */}
        {stateData && (
          <div className="p-6 bg-gradient-to-r from-blazeOrange/5 to-deepSea/5 rounded-xl border-2 border-blazeOrange/20">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              {stateData.state} - City Breakdown
            </h3>
            <div className="space-y-3">
              {stateData.topCities.map((city, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-deepSea/10 hover:border-blazeOrange/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blazeOrange/10">
                      <MapPin className="h-5 w-5 text-blazeOrange" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{city.city}</p>
                      <p className="text-xs text-muted-foreground">
                        Tech Hub Rank: #{city.techHubRank}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blazeOrange">
                      ₹{(city.medianSalaryINR / 100000).toFixed(1)}L
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ${city.medianSalaryUSD.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 15 Cities Overall */}
        <div className="mt-8 p-6 bg-white rounded-xl border-2 border-deepSea/10">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-deepSea" />
            <h3 className="text-xl font-bold text-foreground">Top 15 Tech Hubs in India</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {top15IndiaCities.map((city, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-wildSand/30 rounded-lg border border-deepSea/5"
              >
                <div>
                  <p className="font-semibold text-sm text-foreground">
                    {idx + 1}. {city.city}
                  </p>
                  <p className="text-xs text-muted-foreground">{city.state}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-deepSea">
                    ₹{(city.medianSalaryINR / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ${(city.medianSalaryUSD / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(180, 25%, 93%)" }} />
            <span className="text-xs">&lt;$14K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(210, 29%, 12%)" }} />
            <span className="text-xs">$14K-$17K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(184, 92%, 18%)" }} />
            <span className="text-xs">$17K-$20K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(18, 100%, 51%)" }} />
            <span className="text-xs">$20K+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
