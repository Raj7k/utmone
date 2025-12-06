import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usStateSalaryData, getUSStateColor } from "@/lib/mapData/usStateSalaryData";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

// This component is lazy-loaded by its parent
export const USStateMap = () => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const stateData = selectedState
    ? usStateSalaryData.find((s) => s.state === selectedState)
    : hoveredState
    ? usStateSalaryData.find((s) => s.state === hoveredState)
    : null;

  return (
    <Card className="border-2 border-deepSea/20">
      <CardHeader>
        <CardTitle className="text-2xl">US State Salary Comparison</CardTitle>
        <p className="text-sm text-muted-foreground">
          Cost-of-living adjusted salaries. Click a state for city-level breakdown.
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ComposableMap projection="geoAlbersUsa" className="w-full h-[400px]">
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const stateName = geo.properties.name;
                  const salaryInfo = usStateSalaryData.find((s) => s.state === stateName);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (salaryInfo) setHoveredState(salaryInfo.state);
                      }}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => {
                        if (salaryInfo) {
                          setSelectedState(
                            selectedState === salaryInfo.state ? null : salaryInfo.state
                          );
                        }
                      }}
                      style={{
                        default: {
                          fill: salaryInfo
                            ? getUSStateColor(salaryInfo.colAdjustedSalary)
                            : "#E4EEF0",
                          stroke: "#FFFFFF",
                          strokeWidth: 0.75,
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
          </ComposableMap>

          {/* State Detail Panel */}
          {stateData && (
            <div className="mt-6 p-6 bg-gradient-to-r from-blazeOrange/5 to-deepSea/5 rounded-xl border-2 border-blazeOrange/20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-foreground">{stateData.state}</h3>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">CoL Adjusted Salary</p>
                  <p className="text-4xl font-bold text-blazeOrange">
                    ${stateData.colAdjustedSalary.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground mb-2">Nominal Salary</p>
                <p className="text-2xl font-semibold text-deepSea">
                  ${stateData.medianSalary.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-3">Top Cities:</p>
                <div className="space-y-2">
                  {stateData.topCities.map((city, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 bg-card rounded-lg border border-border"
                    >
                      <span className="font-medium">{city.city}</span>
                      <div className="text-right">
                        <p className="font-semibold text-blazeOrange">
                          ${city.medianSalary.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">CoL: {city.colIndex}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
            <span className="text-xs">&lt;$75K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(184, 92%, 18%)" }} />
            <span className="text-xs">$75K-$85K</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: "hsl(18, 100%, 51%)" }} />
            <span className="text-xs">$85K-$95K</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
