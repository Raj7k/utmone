import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, RefreshCw, AlertCircle, Waves, QrCode, Scan } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useFieldEvents, useFieldEvent, useCalculateEventHalo, useDeleteFieldEvent, useEventBadgeScans, useUpdateEventValueSettings, useInferEventMetrics, EventHaloResult } from "@/hooks/useFieldEvents";
import { EventTimeline } from "@/components/events/EventTimeline";
import { SonarVisualization } from "@/components/events/SonarVisualization";
import { EventImpactFunnel } from "@/components/events/EventImpactFunnel";
import { EventHaloSpikeChart } from "@/components/events/EventHaloSpikeChart";
import { BadgeScanUploader } from "@/components/events/BadgeScanUploader";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { EventValueSettings } from "@/components/events/EventValueSettings";
import { ScannerModal } from "@/components/events/ScannerModal";
import { EventLeadsPanel } from "@/components/events/EventLeadsPanel";
import { BoothQRDialog } from "@/components/events/BoothQRDialog";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

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
}

const Events = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogEvent, setQrDialogEvent] = useState<FieldEvent | null>(null);
  const [scannerEventId, setScannerEventId] = useState<string | null>(null);
  
  const { data: events, isLoading, refetch } = useFieldEvents(currentWorkspace?.id || '');
  const { data: selectedEvent } = useFieldEvent(selectedEventId || '');
  const { data: badgeScans } = useEventBadgeScans(selectedEventId || '');
  const calculateHalo = useCalculateEventHalo();
  const deleteEvent = useDeleteFieldEvent();
  const updateValueSettings = useUpdateEventValueSettings();
  const { data: inferredMetrics } = useInferEventMetrics(currentWorkspace?.id || '');
  const queryClient = useQueryClient();
  
  const haloResult = queryClient.getQueryData<EventHaloResult>(['event-halo-result', selectedEventId]);

  const handleRecalculate = async (eventId: string) => {
    if (!currentWorkspace?.id) return;
    try {
      await calculateHalo.mutateAsync({ eventId, workspaceId: currentWorkspace.id });
      toast({ title: "halo recalculated", description: "event metrics have been updated" });
    } catch (error) {
      toast({ title: "calculation failed", description: "please try again", variant: "destructive" });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!currentWorkspace?.id) return;
    try {
      await deleteEvent.mutateAsync({ eventId, workspaceId: currentWorkspace.id });
      setSelectedEventId(null);
      toast({ title: "event deleted" });
    } catch (error) {
      toast({ title: "delete failed", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">field events</h1>
          <p className="text-muted-foreground">track the invisible lift from conferences, trade shows, and meetups</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          create event
        </Button>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Timeline (Left - 2 cols) */}
        <div className="lg:col-span-2">
          <Card className="p-4">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">
              event timeline
            </h2>
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">loading events...</div>
            ) : (
              <EventTimeline
                events={events || []}
                selectedEventId={selectedEventId}
                onEventSelect={setSelectedEventId}
                onQRClick={(event) => setQrDialogEvent(event)}
                onScanClick={(event) => {
                  setSelectedEventId(event.id);
                  setScannerEventId(event.id);
                }}
              />
            )}
          </Card>
        </div>

        {/* Event Detail (Right - 3 cols) */}
        <div className="lg:col-span-3">
          {selectedEvent ? (
            <motion.div
              key={selectedEvent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Event Header */}
              <Card className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">{selectedEvent.name}</h2>
                    <p className="text-muted-foreground">
                      {selectedEvent.location_city}, {selectedEvent.location_country} • 
                      {format(new Date(selectedEvent.start_date), " MMM d")} - 
                      {format(new Date(selectedEvent.end_date), " MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      size="sm"
                      onClick={() => setScannerEventId(selectedEvent.id)}
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      scan badge
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setQrDialogEvent(selectedEvent as unknown as FieldEvent)}
                    >
                      <QrCode className="w-4 h-4 mr-2" />
                      QR
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRecalculate(selectedEvent.id)}
                      disabled={calculateHalo.isPending}
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${calculateHalo.isPending ? 'animate-spin' : ''}`} />
                      recalculate
                    </Button>
                  </div>
                </div>

                {haloResult && !haloResult.has_sufficient_data && (
                  <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-muted border border-border">
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      insufficient data for reliable analysis. need more pixel events from {selectedEvent.location_city}.
                    </p>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="flex justify-center">
                    <SonarVisualization
                      haloVisitors={selectedEvent.halo_visitors}
                      liftPercentage={selectedEvent.lift_percentage}
                      city={selectedEvent.location_city}
                      isActive={selectedEvent.status === 'active'}
                    />
                  </div>
                  <EventImpactFunnel
                    directScans={selectedEvent.direct_scans}
                    haloVisitors={selectedEvent.halo_visitors}
                    avgDealValue={selectedEvent.avg_deal_value || inferredMetrics?.avg_deal_value || 10000}
                    conversionRate={selectedEvent.conversion_rate || inferredMetrics?.conversion_rate || 0.15}
                  />
                </div>
              </Card>

              <EventValueSettings
                eventId={selectedEvent.id}
                currentAvgDealValue={selectedEvent.avg_deal_value}
                currentConversionRate={selectedEvent.conversion_rate}
                useInferredValues={selectedEvent.use_inferred_values}
                inferredAvgDealValue={inferredMetrics?.avg_deal_value}
                inferredConversionRate={inferredMetrics?.conversion_rate}
                inferredConfidence={inferredMetrics?.confidence}
                onSave={async (values) => {
                  await updateValueSettings.mutateAsync({ eventId: selectedEvent.id, ...values });
                  refetch();
                }}
              />

              {haloResult?.comparison_timeseries && haloResult.comparison_timeseries.length > 0 && (
                <EventHaloSpikeChart
                  timeseries={haloResult.comparison_timeseries.map(p => ({
                    visit_date: p.visit_date,
                    unique_visitors: p.target_visitors
                  }))}
                  eventStart={haloResult.event_start}
                  eventEnd={haloResult.event_end}
                  baselineDailyAverage={haloResult.baseline_daily_average}
                />
              )}

              {/* Scanner is now a modal, triggered by button above */}

              <BadgeScanUploader
                eventId={selectedEvent.id}
                onUploadComplete={() => {
                  refetch();
                  handleRecalculate(selectedEvent.id);
                }}
              />

              {badgeScans && badgeScans.length > 0 && (
                <EventLeadsPanel
                  eventId={selectedEvent.id}
                  badgeScans={badgeScans}
                  workspaceId={currentWorkspace?.id}
                  onRefresh={refetch}
                />
              )}
            </motion.div>
          ) : (
            <Card className="p-12 text-center h-full flex flex-col items-center justify-center min-h-[500px]">
              <Waves className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">select an event</h3>
              <p className="text-muted-foreground max-w-md mb-6">
                choose an event from the timeline to view its "halo" impact and manage badge scans
              </p>
              {(!events || events.length === 0) && (
                <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  create your first event
                </Button>
              )}
            </Card>
          )}
        </div>
      </div>

      <CreateEventDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        workspaceId={currentWorkspace?.id || ''}
        onEventCreated={refetch}
      />

      {qrDialogEvent && (
        <BoothQRDialog
          open={!!qrDialogEvent}
          onOpenChange={(open) => !open && setQrDialogEvent(null)}
          eventId={qrDialogEvent.id}
          eventName={qrDialogEvent.name}
          city={qrDialogEvent.location_city}
        />
      )}

      {scannerEventId && selectedEvent && (
        <ScannerModal
          open={!!scannerEventId}
          onOpenChange={(open) => !open && setScannerEventId(null)}
          eventId={scannerEventId}
          eventName={selectedEvent.name}
          onScanComplete={() => {
            refetch();
            handleRecalculate(scannerEventId);
          }}
        />
      )}
    </div>
  );
};

export default Events;
