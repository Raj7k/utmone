import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useClickHeatmap } from "@/hooks/useClickHeatmap";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface ClickHeatmapProps {
  workspaceId: string;
  linkId?: string;
  days?: number;
}

const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIMEZONES = [
  { value: "local", label: "Local Time" },
  { value: "UTC", label: "UTC" },
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "Europe/London", label: "London" },
  { value: "Asia/Kolkata", label: "India" }
];

export const ClickHeatmap = ({ workspaceId, linkId, days = 30 }: ClickHeatmapProps) => {
  const [timezone, setTimezone] = useState("local");
  const { heatmapData, isLoading } = useClickHeatmap({ workspaceId, linkId, days });

  if (isLoading) {
    return (
      <Card variant="glass">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getIntensityStyle = (intensity: number) => {
    if (intensity === 0) return { background: 'rgba(255,255,255,0.05)' };
    if (intensity < 0.25) return { background: 'rgba(255,255,255,0.15)' };
    if (intensity < 0.5) return { background: 'rgba(255,255,255,0.3)' };
    if (intensity < 0.75) return { background: 'rgba(255,255,255,0.5)' };
    return { background: 'rgba(255,255,255,0.8)' };
  };

  return (
    <Card variant="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Click Activity Heatmap</CardTitle>
            <CardDescription>When your audience is most active</CardDescription>
          </div>
          <Select value={timezone} onValueChange={setTimezone}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TIMEZONES.map(tz => (
                <SelectItem key={tz.value} value={tz.value}>
                  {tz.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Hour labels */}
              <div className="flex mb-2">
                <div className="w-12" /> {/* Spacer for day labels */}
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="w-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {i % 3 === 0 ? `${i}` : ""}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {DAYS_SHORT.map((day, dayIndex) => (
                <div key={dayIndex} className="flex items-center mb-1">
                  <div className="w-12 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    {day}
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: 24 }, (_, hourIndex) => {
                      const cell = heatmapData.find(
                        c => c.day === dayIndex && c.hour === hourIndex
                      );
                      const clicks = cell?.clicks || 0;
                      const intensity = cell?.intensity || 0;

                      return (
                        <div
                          key={hourIndex}
                          className="w-8 h-8 rounded transition-all hover:ring-2 hover:ring-white/50 hover:ring-offset-1 hover:ring-offset-transparent cursor-pointer group relative"
                          style={getIntensityStyle(intensity)}
                          title={`${day}, ${hourIndex}:00 - ${clicks} clicks`}
                        >
                          {/* Tooltip on hover */}
                          <div 
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10"
                            style={{ 
                              background: 'rgba(24,24,27,0.95)', 
                              color: 'rgba(255,255,255,0.9)',
                              border: '1px solid rgba(255,255,255,0.1)'
                            }}
                          >
                            {day}, {hourIndex}:00
                            <br />
                            <span className="font-semibold">{clicks} clicks</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs pt-4" style={{ color: 'rgba(255,255,255,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,255,0.05)' }} />
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,255,0.15)' }} />
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,255,0.5)' }} />
              <div className="w-4 h-4 rounded" style={{ background: 'rgba(255,255,255,0.8)' }} />
            </div>
            <span>More</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
