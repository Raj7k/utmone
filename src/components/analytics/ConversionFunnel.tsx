import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConversionFunnelProps {
  clicks: number;
  leads: number;
  signups: number;
  purchases: number;
  revenue: number;
  className?: string;
}

export const ConversionFunnel = ({ 
  clicks, 
  leads, 
  signups, 
  purchases, 
  revenue,
  className 
}: ConversionFunnelProps) => {
  const stages = [
    { 
      label: 'Clicks', 
      value: clicks, 
      icon: TrendingUp, 
      color: 'bg-primary',
      percentage: 100 
    },
    { 
      label: 'Leads', 
      value: leads, 
      icon: Users, 
      color: 'bg-purple-500',
      percentage: clicks > 0 ? (leads / clicks) * 100 : 0
    },
    { 
      label: 'Signups', 
      value: signups, 
      icon: Users, 
      color: 'bg-yellow-500',
      percentage: clicks > 0 ? (signups / clicks) * 100 : 0
    },
    { 
      label: 'Purchases', 
      value: purchases, 
      icon: ShoppingCart, 
      color: 'bg-green-500',
      percentage: clicks > 0 ? (purchases / clicks) * 100 : 0
    },
  ];

  const conversionRate = clicks > 0 ? ((purchases / clicks) * 100).toFixed(2) : '0.00';
  const avgOrderValue = purchases > 0 ? (revenue / purchases).toFixed(2) : '0.00';

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Conversion Funnel
        </CardTitle>
        <CardDescription>
          Track user journey from click to purchase
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Funnel visualization */}
        <div className="space-y-3">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const widthPercentage = Math.max((stage.value / clicks) * 100, 5);
            
            return (
              <div key={stage.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-secondary-label" />
                    <span className="font-medium">{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-secondary-label">
                      {stage.percentage.toFixed(1)}%
                    </span>
                    <span className="font-bold min-w-[60px] text-right">
                      {stage.value.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="relative h-12 bg-fill-tertiary rounded-md overflow-hidden">
                  <div
                    className={cn(
                      "h-full flex items-center justify-end px-4 text-white font-semibold transition-all duration-500",
                      stage.color
                    )}
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {stage.value > 0 && (
                      <span className="text-sm">
                        {stage.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                {index < stages.length - 1 && (
                  <div className="flex items-center justify-center">
                    <div className="text-xs text-secondary-label">
                      ↓ {((stages[index + 1].value / stage.value) * 100).toFixed(1)}% convert
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-secondary-label">
              <TrendingUp className="h-4 w-4" />
              Conversion Rate
            </div>
            <div className="text-2xl font-bold">{conversionRate}%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm text-secondary-label">
              <DollarSign className="h-4 w-4" />
              Avg Order Value
            </div>
            <div className="text-2xl font-bold">${avgOrderValue}</div>
          </div>
          <div className="space-y-1 col-span-2">
            <div className="flex items-center gap-2 text-sm text-secondary-label">
              <ShoppingCart className="h-4 w-4" />
              Total Revenue
            </div>
            <div className="text-3xl font-bold text-green-600">
              ${revenue.toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
