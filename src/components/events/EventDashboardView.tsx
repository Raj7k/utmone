import { motion } from "framer-motion";
import { format } from "date-fns";
import { ArrowLeft, MapPin, QrCode, Scan, RefreshCw, AlertCircle, Users, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SonarVisualization } from "./SonarVisualization";
import { EventImpactFunnel } from "./EventImpactFunnel";
import { EventHaloSpikeChart } from "./EventHaloSpikeChart";
import { EventValueSettings } from "./EventValueSettings";
import { BadgeScanUploader } from "./BadgeScanUploader";
import { EventHaloResult } from "@/hooks/useFieldEvents";

interface FieldEvent {
  id: string;
  name: string;
  location_city: string;
  location_country: string;
  start_date: string;
  end_date: string;
  direct_scans: number;
  halo_visitors: number;
  lift_percentage: number;
  status: string;
  avg_deal_value?: number;
  conversion_rate?: number;
  use_inferred_values?: boolean;
}

interface EventDashboardViewProps {
  event: FieldEvent;
  haloResult?: EventHaloResult;
  inferredMetrics?: {
    avg_deal_value?: number;
    conversion_rate?: number;
    confidence?: number;
  };
  leadsCount: number;
  onBack: () => void;
  onQRClick: () => void;
  onScanClick: () => void;
  onRecalculate: () => void;
  onViewLeads: () => void;
  onValueSettingsSave: (values: any) => Promise<void>;
  onUploadComplete: () => void;
  isRecalculating: boolean;
}

export const EventDashboardView = ({
  event,
  haloResult,
  inferredMetrics,
  leadsCount,
  onBack,
  onQRClick,
  onScanClick,
  onRecalculate,
  onViewLeads,
  onValueSettingsSave,
  onUploadComplete,
  isRecalculating,
}: EventDashboardViewProps) => {
  const isLive = event.status === 'active';

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Breadcrumb Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          events
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-semibold text-foreground truncate">
            {event.name}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-3.5 h-3.5" />
            <span>{event.location_city}, {event.location_country}</span>
            <span className="text-muted-foreground/50">•</span>
            <span>
              {format(new Date(event.start_date), "MMM d")} - {format(new Date(event.end_date), "MMM d, yyyy")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onScanClick}>
            <Scan className="w-4 h-4 mr-2" />
            scan badge
          </Button>
          <Button variant="outline" size="sm" onClick={onQRClick}>
            <QrCode className="w-4 h-4 mr-2" />
            QR
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onRecalculate}
            disabled={isRecalculating}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRecalculating ? 'animate-spin' : ''}`} />
            recalculate
          </Button>
        </div>
      </div>

      {/* Data Warning */}
      {haloResult && !haloResult.has_sufficient_data && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 border border-border">
          <AlertCircle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
          <p className="text-sm text-muted-foreground">
            insufficient data for reliable analysis. need more pixel events from {event.location_city}.
          </p>
        </div>
      )}

      {/* Main Analytics Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sonar Card */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">halo visualization</h2>
          <div className="flex justify-center py-4">
            <SonarVisualization
              haloVisitors={event.halo_visitors}
              liftPercentage={event.lift_percentage}
              city={event.location_city}
              isActive={isLive}
              size="lg"
            />
          </div>
        </Card>

        {/* Impact Funnel Card */}
        <Card className="p-6">
          <h2 className="font-display text-lg font-semibold text-foreground mb-6">impact funnel</h2>
          <EventImpactFunnel
            directScans={event.direct_scans}
            haloVisitors={event.halo_visitors}
            avgDealValue={event.avg_deal_value || inferredMetrics?.avg_deal_value || 10000}
            conversionRate={event.conversion_rate || inferredMetrics?.conversion_rate || 0.15}
          />
        </Card>
      </div>

      {/* Spike Chart - Full Width */}
      {haloResult?.comparison_timeseries && haloResult.comparison_timeseries.length > 0 && (
        <Card className="p-6">
          <EventHaloSpikeChart
            timeseries={haloResult.comparison_timeseries.map(p => ({
              visit_date: p.visit_date,
              unique_visitors: p.target_visitors
            }))}
            eventStart={haloResult.event_start}
            eventEnd={haloResult.event_end}
            baselineDailyAverage={haloResult.baseline_daily_average}
          />
        </Card>
      )}

      {/* Value Settings */}
      <EventValueSettings
        eventId={event.id}
        currentAvgDealValue={event.avg_deal_value}
        currentConversionRate={event.conversion_rate}
        useInferredValues={event.use_inferred_values}
        inferredAvgDealValue={inferredMetrics?.avg_deal_value}
        inferredConversionRate={inferredMetrics?.conversion_rate}
        inferredConfidence={inferredMetrics?.confidence}
        onSave={onValueSettingsSave}
      />

      {/* Badge Upload */}
      <BadgeScanUploader
        eventId={event.id}
        onUploadComplete={onUploadComplete}
      />

      {/* Leads Summary Card */}
      <Card 
        className="p-6 cursor-pointer hover:border-primary/30 transition-colors group"
        onClick={onViewLeads}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-lg font-semibold text-foreground">leads</h2>
              <p className="text-sm text-muted-foreground">
                {leadsCount} lead{leadsCount !== 1 ? 's' : ''} captured from badge scans
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {leadsCount > 0 && (
              <Badge variant="secondary">{leadsCount} total</Badge>
            )}
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
