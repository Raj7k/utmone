import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DEMO_ANALYTICS_DATA, getDemoFeaturesForPlan } from "@/hooks/useDemoMode";
import { motion } from "framer-motion";
import { MousePointer, Users, Globe, Monitor, Smartphone, Tablet, Lock } from "lucide-react";
import { PlanTier } from "@/lib/planConfig";

interface DemoAnalyticsTileProps {
  planTier?: PlanTier;
}

export const DemoAnalyticsTile = ({ planTier = 'free' }: DemoAnalyticsTileProps) => {
  const { totalClicks, uniqueVisitors, clicksChange, topCountries, topDevices } = DEMO_ANALYTICS_DATA;
  const features = getDemoFeaturesForPlan(planTier);

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "desktop": return <Monitor className="h-4 w-4" />;
      case "mobile": return <Smartphone className="h-4 w-4" />;
      case "tablet": return <Tablet className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">
            analytics pulse
          </CardTitle>
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            demo · {planTier}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Stats Row - Always visible */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <MousePointer className="h-4 w-4" />
              <span className="text-xs">clicks</span>
            </div>
            <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
            <p className="text-xs text-green-500">+{clicksChange}% vs last week</p>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">visitors</span>
            </div>
            <p className="text-2xl font-bold">{uniqueVisitors.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">unique</p>
          </div>
        </div>

        {/* Top Countries - Available on Starter+ */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
              <Globe className="h-3 w-3" />
              top countries
            </div>
            {!features.countries && (
              <Badge variant="outline" className="text-xs">
                <Lock className="h-2.5 w-2.5 mr-1" />
                starter+
              </Badge>
            )}
          </div>
          {features.countries ? (
            topCountries.slice(0, 3).map((country, index) => (
              <motion.div
                key={country.country}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-24 text-sm truncate">{country.country}</div>
                <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${country.percentage}%` }}
                    transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
                    className="h-full bg-blue-500 rounded-full"
                  />
                </div>
                <div className="w-12 text-right text-xs text-muted-foreground">
                  {country.percentage}%
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-3 rounded-lg bg-muted/30 text-center">
              <p className="text-sm text-muted-foreground">
                upgrade to starter to see country breakdown
              </p>
            </div>
          )}
        </div>

        {/* Device Split - Available on Starter+ */}
        {features.devices ? (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
            {topDevices.map((device) => (
              <div key={device.device} className="flex items-center gap-2 text-sm">
                {getDeviceIcon(device.device)}
                <span className="text-muted-foreground">{device.device}</span>
                <span className="font-medium">{device.percentage}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Monitor className="h-4 w-4" />
              device breakdown
            </div>
            <Badge variant="outline" className="text-xs">
              <Lock className="h-2.5 w-2.5 mr-1" />
              starter+
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
