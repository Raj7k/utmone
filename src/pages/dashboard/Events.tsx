import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Calendar, Waves, RefreshCw, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useFieldEvents, useFieldEvent, useCalculateEventHalo, useDeleteFieldEvent, useEventBadgeScans, useUpdateEventValueSettings, useInferEventMetrics, EventHaloResult } from "@/hooks/useFieldEvents";
import { EventMissionCard } from "@/components/events/EventMissionCard";
import { SonarVisualization } from "@/components/events/SonarVisualization";
import { EventImpactFunnel } from "@/components/events/EventImpactFunnel";
import { EventHaloSpikeChart } from "@/components/events/EventHaloSpikeChart";
import { BadgeScanUploader } from "@/components/events/BadgeScanUploader";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { EventValueSettings } from "@/components/events/EventValueSettings";
import { UniversalScanner } from "@/components/events/scanner/UniversalScanner";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { useQueryClient } from "@tanstack/react-query";

const Events = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  const { data: events, isLoading, refetch } = useFieldEvents(currentWorkspace?.id || '');
  const { data: selectedEvent } = useFieldEvent(selectedEventId || '');
  const { data: badgeScans } = useEventBadgeScans(selectedEventId || '');
  const calculateHalo = useCalculateEventHalo();
  const deleteEvent = useDeleteFieldEvent();
  const updateValueSettings = useUpdateEventValueSettings();
  const { data: inferredMetrics } = useInferEventMetrics(currentWorkspace?.id || '');
  const queryClient = useQueryClient();
  
  // Get cached halo result with timeseries data
  const haloResult = queryClient.getQueryData<EventHaloResult>(['event-halo-result', selectedEventId]);

  const handleRecalculate = async (eventId: string) => {
    if (!currentWorkspace?.id) return;
    
    try {
      await calculateHalo.mutateAsync({ 
        eventId, 
        workspaceId: currentWorkspace.id 
      });
      toast({
        title: "halo recalculated",
        description: "event metrics have been updated",
      });
    } catch (error) {
      toast({
        title: "calculation failed",
        description: "please try again",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (eventId: string) => {
    if (!currentWorkspace?.id) return;
    
    try {
      await deleteEvent.mutateAsync({ 
        eventId, 
        workspaceId: currentWorkspace.id 
      });
      setSelectedEventId(null);
      toast({
        title: "event deleted",
      });
    } catch (error) {
      toast({
        title: "delete failed",
        description: "please try again",
        variant: "destructive",
      });
    }
  };

  const upcomingEvents = events?.filter(e => e.status === 'upcoming') || [];
  const activeEvents = events?.filter(e => e.status === 'active') || [];
  const completedEvents = events?.filter(e => e.status === 'completed') || [];

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">field events</h1>
            <p className="text-muted-foreground">track the invisible lift from conferences, trade shows, and meetups</p>
          </div>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            create event
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Event List */}
          <div className="lg:col-span-1 space-y-4">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="all">all</TabsTrigger>
                <TabsTrigger value="active">active</TabsTrigger>
                <TabsTrigger value="upcoming">upcoming</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-3 mt-4">
                {isLoading ? (
                  <div className="text-center py-8 text-muted-foreground">loading events...</div>
                ) : events?.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground mb-4">no events yet</p>
                    <Button onClick={() => setCreateDialogOpen(true)} variant="outline">
                      create your first event
                    </Button>
                  </Card>
                ) : (
                  events?.map(event => (
                    <EventMissionCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEventId(event.id)}
                      onRecalculate={() => handleRecalculate(event.id)}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="active" className="space-y-3 mt-4">
                {activeEvents.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">no active events</p>
                ) : (
                  activeEvents.map(event => (
                    <EventMissionCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEventId(event.id)}
                      onRecalculate={() => handleRecalculate(event.id)}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="upcoming" className="space-y-3 mt-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">no upcoming events</p>
                ) : (
                  upcomingEvents.map(event => (
                    <EventMissionCard
                      key={event.id}
                      event={event}
                      onClick={() => setSelectedEventId(event.id)}
                      onRecalculate={() => handleRecalculate(event.id)}
                      onDelete={() => handleDelete(event.id)}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Event Detail */}
          <div className="lg:col-span-2">
            {selectedEvent ? (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* Event Header */}
                <Card className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selectedEvent.name}</h2>
                      <p className="text-muted-foreground">
                        {selectedEvent.location_city}, {selectedEvent.location_country} • 
                        {format(new Date(selectedEvent.start_date), " MMM d")} - 
                        {format(new Date(selectedEvent.end_date), " MMM d, yyyy")}
                      </p>
                    </div>
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

                  {/* Insufficient Data Warning */}
                  {haloResult && !haloResult.has_sufficient_data && (
                    <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-muted border border-border">
                      <AlertCircle className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        insufficient data for reliable analysis. need more pixel events from {selectedEvent.location_city}.
                      </p>
                    </div>
                  )}

                  {/* Sonar + Funnel */}
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

                {/* Pipeline Settings */}
                <EventValueSettings
                  eventId={selectedEvent.id}
                  currentAvgDealValue={selectedEvent.avg_deal_value}
                  currentConversionRate={selectedEvent.conversion_rate}
                  useInferredValues={selectedEvent.use_inferred_values}
                  inferredAvgDealValue={inferredMetrics?.avg_deal_value}
                  inferredConversionRate={inferredMetrics?.conversion_rate}
                  inferredConfidence={inferredMetrics?.confidence}
                  onSave={async (values) => {
                    await updateValueSettings.mutateAsync({
                      eventId: selectedEvent.id,
                      ...values,
                    });
                    refetch();
                  }}
                />

                {/* Spike Chart - Baseline vs Event Traffic */}
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

                {/* Universal Scanner */}
                <UniversalScanner
                  eventId={selectedEvent.id}
                  eventName={selectedEvent.name}
                  onScanComplete={() => {
                    refetch();
                    handleRecalculate(selectedEvent.id);
                  }}
                />

                {/* CSV Badge Uploader */}
                <BadgeScanUploader
                  eventId={selectedEvent.id}
                  onUploadComplete={() => {
                    refetch();
                    handleRecalculate(selectedEvent.id);
                  }}
                />

                {/* Badge Scans Table */}
                {badgeScans && badgeScans.length > 0 && (
                  <Card className="p-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      badge scans ({badgeScans.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left">
                            <th className="pb-2 text-muted-foreground font-medium">email</th>
                            <th className="pb-2 text-muted-foreground font-medium">name</th>
                            <th className="pb-2 text-muted-foreground font-medium">company</th>
                            <th className="pb-2 text-muted-foreground font-medium">status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {badgeScans.slice(0, 10).map(scan => (
                            <tr key={scan.id} className="border-b border-border/50">
                              <td className="py-2 text-foreground">{scan.email}</td>
                              <td className="py-2 text-foreground">
                                {[scan.first_name, scan.last_name].filter(Boolean).join(' ') || '—'}
                              </td>
                              <td className="py-2 text-muted-foreground">{scan.company || '—'}</td>
                              <td className="py-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  scan.conversion_status === 'customer' ? 'bg-primary/20 text-primary' :
                                  scan.conversion_status === 'sql' ? 'bg-primary/10 text-primary' :
                                  scan.conversion_status === 'mql' ? 'bg-muted text-muted-foreground' :
                                  'text-muted-foreground'
                                }`}>
                                  {scan.conversion_status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {badgeScans.length > 10 && (
                        <p className="text-sm text-muted-foreground mt-2">
                          +{badgeScans.length - 10} more
                        </p>
                      )}
                    </div>
                  </Card>
                )}
              </motion.div>
            ) : (
              <Card className="p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                <Waves className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">select an event</h3>
                <p className="text-muted-foreground max-w-md">
                  choose an event from the list to view its "halo" impact and manage badge scans
                </p>
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
      </div>
  );
};

export default Events;
