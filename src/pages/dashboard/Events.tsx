import { useState, useEffect, lazy, Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Waves, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/hooks/useWorkspace";
import { 
  useFieldEvents, 
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
  const { currentWorkspace, isLoading: workspaceLoading, hasTimedOut, retry } = useWorkspace();
  const [activeTab, setActiveTab] = useState("halo");
  const [viewState, setViewState] = useState<ViewState>("overview");
  const [selectedEvent, setSelectedEvent] = useState<FieldEvent | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [qrDialogEvent, setQrDialogEvent] = useState<FieldEvent | null>(null);
  const [scannerEventId, setScannerEventId] = useState<string | null>(null);
  
  const { data: events, isLoading, isFetched, refetch } = useFieldEvents(currentWorkspace?.id || '');
  const { data: eventDetails } = useFieldEvent(selectedEvent?.id || '');
  const { data: badgeScans } = useEventBadgeScans(selectedEvent?.id || '');
  const calculateHalo = useCalculateEventHalo();
  const updateValueSettings = useUpdateEventValueSettings();
  const { data: inferredMetrics } = useInferEventMetrics(currentWorkspace?.id || '');
  const queryClient = useQueryClient();
  
  const haloResult = queryClient.getQueryData<EventHaloResult>(['event-halo-result', selectedEvent?.id]);

  // Complete navigation when data loads
  useEffect(() => {
    if (isFetched && currentWorkspace?.id) {
      completeNavigation();
    }
  }, [isFetched, currentWorkspace?.id]);

  // Show loading skeleton while workspace is loading
  if (workspaceLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div>
          <Skeleton className="h-7 w-32 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Show error state if workspace loading timed out
  if (hasTimedOut || (!workspaceLoading && !currentWorkspace)) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground mb-4">unable to load workspace data</p>
        <Button onClick={retry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          try again
        </Button>
      </div>
    );
  }

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
    if (!currentWorkspace?.id || !selectedEvent) return;
    try {
      await calculateHalo.mutateAsync({ eventId: selectedEvent.id, workspaceId: currentWorkspace.id });
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

  // Merge event details if available
  const currentEvent = eventDetails ? { ...selectedEvent, ...eventDetails } as FieldEvent : selectedEvent;

  return (
    <div className="space-y-6">
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
          <AnimatePresence mode="wait">
            {viewState === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* Header */}
                <div className="mb-6">
                  <h2 className="font-display text-xl font-semibold text-foreground">field events</h2>
                  <p className="text-muted-foreground text-sm">
                    track the invisible lift from conferences, trade shows, and meetups
                  </p>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-24">
                    <div className="text-center">
                      <Waves className="w-12 h-12 text-muted-foreground mb-4 mx-auto animate-pulse" />
                      <p className="text-muted-foreground">loading events...</p>
                    </div>
                  </div>
                ) : (
                  <EventsOverviewGrid
                    events={events || []}
                    onEventSelect={handleEventSelect}
                    onQRClick={handleQRClick}
                    onScanClick={handleScanClick}
                  />
                )}
              </motion.div>
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
          </AnimatePresence>
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
  );
};

export default Events;
