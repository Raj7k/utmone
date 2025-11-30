import { Card } from "@/components/ui/card";
import { TrendingUp, Users, ShoppingCart, DollarSign } from "lucide-react";
import { useConversionFunnel } from "@/hooks/useConversionFunnel";
import { Skeleton } from "@/components/ui/skeleton";

interface FunnelChartProps {
  linkId?: string;
  workspaceId?: string;
}

export function FunnelChart({ linkId, workspaceId }: FunnelChartProps) {
  const { data: funnel, isLoading } = useConversionFunnel(linkId, workspaceId);

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-8 w-48 mb-4" />
        <Skeleton className="h-64 w-full" />
      </Card>
    );
  }

  if (!funnel) return null;

  const maxWidth = 100;
  const clicksWidth = maxWidth;
  const leadsWidth = funnel.clicks > 0 ? (funnel.leads / funnel.clicks) * maxWidth : 0;
  const purchasesWidth = funnel.clicks > 0 ? (funnel.purchases / funnel.clicks) * maxWidth : 0;

  return (
    <Card className="p-6 bg-system-background border-separator">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-system-blue" />
        <h3 className="text-title-2 font-display font-semibold text-label">Conversion Funnel</h3>
      </div>

      <div className="space-y-6">
        {/* Clicks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-system-blue" />
              <span className="text-body-apple font-medium text-label">Clicks</span>
            </div>
            <span className="text-headline-apple font-semibold text-label">{funnel.clicks.toLocaleString()}</span>
          </div>
          <div className="h-12 rounded-lg bg-system-blue flex items-center justify-center" style={{ width: `${clicksWidth}%` }}>
            <span className="text-sm font-medium text-white">100%</span>
          </div>
        </div>

        {/* Leads */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-system-green" />
              <span className="text-body-apple font-medium text-label">Leads</span>
            </div>
            <div className="text-right">
              <span className="text-headline-apple font-semibold text-label">{funnel.leads.toLocaleString()}</span>
              <span className="text-caption-1 text-secondary-label ml-2">
                {funnel.clickToLeadRate.toFixed(1)}% conversion
              </span>
            </div>
          </div>
          <div 
            className="h-12 rounded-lg bg-system-green flex items-center justify-center transition-all" 
            style={{ width: `${leadsWidth}%`, minWidth: funnel.leads > 0 ? '80px' : '0' }}
          >
            {funnel.leads > 0 && (
              <span className="text-sm font-medium text-white">{funnel.clickToLeadRate.toFixed(1)}%</span>
            )}
          </div>
        </div>

        {/* Purchases */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-system-purple" />
              <span className="text-body-apple font-medium text-label">Purchases</span>
            </div>
            <div className="text-right">
              <span className="text-headline-apple font-semibold text-label">{funnel.purchases.toLocaleString()}</span>
              <span className="text-caption-1 text-secondary-label ml-2">
                {funnel.clickToPurchaseRate.toFixed(1)}% conversion
              </span>
            </div>
          </div>
          <div 
            className="h-12 rounded-lg bg-system-purple flex items-center justify-center transition-all" 
            style={{ width: `${purchasesWidth}%`, minWidth: funnel.purchases > 0 ? '80px' : '0' }}
          >
            {funnel.purchases > 0 && (
              <span className="text-sm font-medium text-white">{funnel.clickToPurchaseRate.toFixed(1)}%</span>
            )}
          </div>
        </div>

        {/* Revenue */}
        {funnel.revenue > 0 && (
          <div className="pt-4 border-t border-separator">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-system-green" />
                <span className="text-body-apple font-medium text-label">Total Revenue</span>
              </div>
              <span className="text-large-title font-display font-bold text-system-green">
                ${funnel.revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            {funnel.purchases > 0 && (
              <p className="text-caption-1 text-secondary-label mt-1 text-right">
                ${(funnel.revenue / funnel.purchases).toFixed(2)} avg order value
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}