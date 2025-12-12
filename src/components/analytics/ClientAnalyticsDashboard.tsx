import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, MapPin, Smartphone, TrendingUp } from "lucide-react";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface ClientAnalyticsDashboardProps {
  workspaceId: string;
  showClicks?: boolean;
  showGeography?: boolean;
  showDevices?: boolean;
  showCampaigns?: boolean;
  companyName?: string;
  primaryColor?: string;
  logoUrl?: string;
}

export const ClientAnalyticsDashboard = ({
  workspaceId,
  showClicks = true,
  showGeography = true,
  showDevices = true,
  showCampaigns = true,
  companyName,
  primaryColor = "#217BF4",
  logoUrl,
}: ClientAnalyticsDashboardProps) => {
  // In production, fetch real analytics data here
  const analytics = {
    totalClicks: 15234,
    uniqueVisitors: 8921,
    topCountries: [
      { country: "United States", clicks: 5234 },
      { country: "United Kingdom", clicks: 3421 },
      { country: "Canada", clicks: 2134 },
    ],
    devices: [
      { type: "Mobile", percentage: 62 },
      { type: "Desktop", percentage: 32 },
      { type: "Tablet", percentage: 6 },
    ],
  };

  return (
    <div className="space-y-6 p-6">
      {logoUrl && (
        <div className="flex items-center justify-between pb-6 border-b">
          <OptimizedImage src={logoUrl} alt={companyName || "Company"} height={40} className="h-10 w-auto object-contain" />
          <h1 className="text-2xl font-bold">{companyName} Analytics</h1>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {showClicks && (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Total Clicks</CardDescription>
                <CardTitle className="text-3xl" style={{ color: primaryColor }}>
                  {analytics.totalClicks.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>+12% from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Unique Visitors</CardDescription>
                <CardTitle className="text-3xl" style={{ color: primaryColor }}>
                  {analytics.uniqueVisitors.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>+8% from last month</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {showGeography && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" style={{ color: primaryColor }} />
                <CardTitle>Top Countries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCountries.map((country) => (
                  <div key={country.country} className="flex items-center justify-between">
                    <span className="font-medium">{country.country}</span>
                    <span className="text-muted-foreground">
                      {country.clicks.toLocaleString()} clicks
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {showDevices && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" style={{ color: primaryColor }} />
                <CardTitle>Device Breakdown</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.devices.map((device) => (
                  <div key={device.type} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{device.type}</span>
                      <span className="text-muted-foreground">{device.percentage}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${device.percentage}%`,
                          backgroundColor: primaryColor,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showCampaigns && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5" style={{ color: primaryColor }} />
              <CardTitle>Campaign Performance</CardTitle>
            </div>
            <CardDescription>Top performing campaigns this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-muted-foreground py-8">
              Campaign data will appear here
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
