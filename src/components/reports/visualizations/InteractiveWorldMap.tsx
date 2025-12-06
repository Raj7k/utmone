import { useState } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { worldSalaryData, getSalaryColorScale } from "@/lib/mapData/worldSalaryData";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// This component is lazy-loaded by its parent
export const InteractiveWorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const countryData = selectedCountry 
    ? worldSalaryData.find(c => c.country === selectedCountry)
    : hoveredCountry
    ? worldSalaryData.find(c => c.country === hoveredCountry)
    : null;

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <CardTitle className="text-2xl">Global Salary Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Click a country to see detailed salary data. Darker colors indicate higher salaries.
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ scale: 120 }}
            className="w-full h-[400px]"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryName = geo.properties.name;
                  const salaryInfo = worldSalaryData.find(
                    (c) => c.country === countryName || c.countryCode === geo.id
                  );
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (salaryInfo) setHoveredCountry(salaryInfo.country);
                      }}
                      onMouseLeave={() => setHoveredCountry(null)}
                      onClick={() => {
                        if (salaryInfo) {
                          setSelectedCountry(
                            selectedCountry === salaryInfo.country ? null : salaryInfo.country
                          );
                        }
                      }}
                      style={{
                        default: {
                          fill: salaryInfo ? getSalaryColorScale(salaryInfo.medianSalary) : "#E4EEF0",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.5,
                          outline: "none",
                        },
                        hover: {
                          fill: salaryInfo ? "#FF5B04" : "#E4EEF0",
                          stroke: "#FFFFFF",
                          strokeWidth: 1,
                          outline: "none",
                          cursor: salaryInfo ? "pointer" : "default",
                        },
                        pressed: {
                          fill: "#075056",
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
            {/* Markers for key cities */}
            {worldSalaryData.map((country) => (
              <Marker key={country.country} coordinates={country.coordinates}>
                <circle
                  r={4}
                  fill="#FF5B04"
                  stroke="#fff"
                  strokeWidth={1}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    setSelectedCountry(
                      selectedCountry === country.country ? null : country.country
                    )
                  }
                />
              </Marker>
            ))}
          </ComposableMap>

          {/* Tooltip/Detail Panel */}
          {countryData && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blazeOrange/5 to-deepSea/5 rounded-xl border-2 border-blazeOrange/20">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-mirage">{countryData.country}</h3>
                  <Badge className="mt-1">{countryData.region}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Median Salary</p>
                  <p className="text-4xl font-bold text-blazeOrange">
                    ${countryData.medianSalary.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Salary Range</p>
                  <p className="font-semibold text-deepSea">
                    ${countryData.salaryRange[0].toLocaleString()} - $
                    {countryData.salaryRange[1].toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Cities</p>
                  <p className="font-semibold text-mirage">
                    {countryData.topCities.slice(0, 3).join(", ")}
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Click map to deselect. Data represents Marketing Manager median base salary.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(180, 25%, 93%)" }} />
            <span className="text-xs">No Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(210, 29%, 12%)" }} />
            <span className="text-xs">$50K-70K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(184, 92%, 18%)" }} />
            <span className="text-xs">$70K-90K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(18, 100%, 51%)" }} />
            <span className="text-xs">$90K+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
