import { useState, useEffect, lazy, Suspense } from "react";
import { Plus, Waves, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/hooks/workspace";
import { getCachedWorkspaceId } from "@/contexts/AppSessionContext";
import { useDashboardUnified } from "@/hooks/dashboard";
import { 
  useFieldEvent, 
  useCalculateEventHalo, 
  useDeleteFieldEvent, 
  useEventBadgeScans, 
  useUpdateEventValueSettings, 
  useInferEventMetrics, 
  EventHaloResult 
} from "@/hooks/useFieldEvents";
import { EventsOverviewGrid } from "@/components/events/EventsOverviewGrid";
import { EventDashboardView } from "@/components/events/EventDashboardView";
import { LeadsFullScreen } from "@/components/events/LeadsFullScreen";
import { CreateEventDialog } from "@/components/events/CreateEventDialog";
import { ScannerModal } from "@/components/events/ScannerModal";
import { BoothQRDialog } from "@/components/events/BoothQRDialog";
import { toast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DashboardContentLoader } from "@/components/loading/DashboardContentLoader";
import { StaleIndicator } from "@/components/loading/CardSkeleton";

// Lazy load EventBridgeTab - it's only shown when user clicks the tab
const EventBridgeTab = lazy(() => import("@/components/events/EventBridge/EventBridgeTab").then(m => ({ default: m.EventBridgeTab })));

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

type ViewState = "overview" | "dashboard" | "leads";

const Events = () => {
  const { currentWorkspace, hasTimedOut, retry } = useWorkspace();
  const [activeTab, setActiveTab] = useState("halo");
  const [viewState, setViewState] = useState<ViewState>("overview");
  const [selectedEvent, setSelectedEvent] = useState<FieldEvent | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogEvent, setQrDialogEvent] = useState<FieldEvent | null>(null);
  const [scannerEventId, setScannerEventId] = useState<string | null>(null);

  // Use cached workspace ID for immediate query start
  const effectiveWorkspaceId = currentWorkspace?.id || getCachedWorkspaceId() || '';
  
  // Use unified dashboard data for events
  const { events, isFetching, isFetched, isLoading, isStale, refetch: refetchUnified } = useDashboardUnified();
  
  // Detail queries (only when viewing a specific event)
  const { data: eventDetails } = useFieldEvent(selectedEvent?.id || '');
  const { data: badgeScans } = useEventBadgeScans(selectedEvent?.id || '');
  const calculateHalo = useCalculateEventHalo();
  const updateValueSettings = useUpdateEventValueSettings();
  const { data: inferredMetrics } = useInferEventMetrics(effectiveWorkspaceId);
  const queryClient = useQueryClient();
  
  const haloResult = queryClient.getQueryData<EventHaloResult>(['event-halo-result', selectedEvent?.id]);

  // Complete navigation when data loads
  useEffect(() => {
    if ((isFetched && effectiveWorkspaceId) || hasTimedOut) {
      completeNavigation();
    }
  }, [isFetched, effectiveWorkspaceId, hasTimedOut]);

  const handleEventSelect = (event: FieldEvent) => {
    setSelectedEvent(event);
    setViewState("dashboard");
  };

  const handleBackToOverview = () => {
    setViewState("overview");
    setSelectedEvent(null);
  };

  const handleBackToDashboard = () => {
    setViewState("dashboard");
  };

  const handleViewLeads = () => {
    setViewState("leads");
  };

  const handleRecalculate = async () => {
    if (!effectiveWorkspaceId || !selectedEvent) return;
    try {
      await calculateHalo.mutateAsync({ eventId: selectedEvent.id, workspaceId: effectiveWorkspaceId });
      toast({ title: "halo recalculated", description: "event metrics have been updated" });
    } catch (error) {
      toast({ title: "calculation failed", description: "please try again", variant: "destructive" });
    }
  };

  const handleQRClick = (event: FieldEvent) => {
    setQrDialogEvent(event);
  };

  const handleScanClick = (event: FieldEvent) => {
    setSelectedEvent(event);
    setScannerEventId(event.id);
  };

  const refetch = () => {
    refetchUnified();
  };

  // Merge event details if available
  const currentEvent = eventDetails ? { ...selectedEvent, ...eventDetails } as FieldEvent : selectedEvent;

  // Cast events to FieldEvent type
  const typedEvents = events as FieldEvent[];

  // Show loading state when data is loading
  if (isLoading && !isFetched) {
    return (
      <div className="p-6 lg:p-8 max-w-5xl mx-auto">
        <DashboardContentLoader context="events" minHeight="60vh" />
      </div>
    );
  }

  // Progressive render with fade-in
  return (
    <ErrorBoundary fallback={<div className="p-8 text-center text-muted-foreground">Something went wrong loading events. Please refresh the page.</div>}>
      <div className="space-y-6 relative animate-fade-in">
        {/* Stale data indicator */}
        <div className="absolute top-2 right-2 z-10">
          <StaleIndicator visible={isStale || isFetching} />
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="halo" className="flex items-center gap-2">
                <Waves className="h-4 w-4" />
                event halo
              </TabsTrigger>
              <TabsTrigger value="bridge" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                event bridge
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "halo" && viewState === "overview" && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                create event
              </Button>
            )}
          </div>

          <TabsContent value="halo" className="mt-0">
            {viewState === "overview" && (
              <div className="animate-fade-in">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">field events</h2>
                  <p className="text-muted-foreground text-sm">
                    track the invisible lift from conferences, trade shows, and meetups
                  </p>
                </div>

                {/* Content - render immediately with data or empty state */}
                <EventsOverviewGrid
                  events={typedEvents}
                  onEventSelect={handleEventSelect}
                  onQRClick={handleQRClick}
                  onScanClick={handleScanClick}
                />

                {/* Error state */}
                {hasTimedOut && !currentWorkspace && (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-muted-foreground mb-4">unable to load workspace data</p>
                    <Button onClick={retry} variant="outline" size="sm" className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      try again
                    </Button>
                  </div>
                )}
              </div>
            )}

              {viewState === "dashboard" && currentEvent && (
                <EventDashboardView
                  key="dashboard"
                  event={currentEvent}
                  haloResult={haloResult}
                  inferredMetrics={inferredMetrics}
                  leadsCount={badgeScans?.length || 0}
                  onBack={handleBackToOverview}
                  onQRClick={() => setQrDialogEvent(currentEvent)}
                  onScanClick={() => setScannerEventId(currentEvent.id)}
                  onRecalculate={handleRecalculate}
                  onViewLeads={handleViewLeads}
                  onValueSettingsSave={async (values) => {
                    await updateValueSettings.mutateAsync({ eventId: currentEvent.id, ...values });
                    refetch();
                  }}
                  onUploadComplete={() => {
                    refetch();
                    handleRecalculate();
                  }}
                  isRecalculating={calculateHalo.isPending}
                />
              )}

            {viewState === "leads" && currentEvent && badgeScans && (
              <LeadsFullScreen
                key="leads"
                eventName={currentEvent.name}
                eventId={currentEvent.id}
                badgeScans={badgeScans}
                workspaceId={currentWorkspace?.id}
                onBack={handleBackToDashboard}
                onRefresh={refetch}
              />
            )}
          </TabsContent>

          <TabsContent value="bridge" className="mt-0">
            <Suspense fallback={
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <Zap className="w-12 h-12 text-muted-foreground mb-4 mx-auto animate-pulse" />
                  <p className="text-muted-foreground">loading event bridge...</p>
                </div>
              </div>
            }>
              <EventBridgeTab />
            </Suspense>
          </TabsContent>
        </Tabs>

        {/* Dialogs */}
        <CreateEventDialog
          open={createDialogOpen}
          onOpenChange={setCreateDialogOpen}
          workspaceId={effectiveWorkspaceId}
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

        {scannerEventId && currentEvent && (
          <ScannerModal
            open={!!scannerEventId}
            onOpenChange={(open) => !open && setScannerEventId(null)}
            eventId={scannerEventId}
            eventName={currentEvent.name}
            onScanComplete={() => {
              refetch();
              handleRecalculate();
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default Events;
