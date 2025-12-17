import { useState, useEffect } from "react";
import { Activity, CheckCircle2, Clock, Zap, XCircle, AlertCircle, Wifi, WifiOff, Send, RefreshCw, FlaskConical, DollarSign, User } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

interface TrackedEvent {
  id: string;
  event_type: string;
  event_name: string | null;
  visitor_id: string;
  landing_page: string | null;
  revenue: number | null;
  created_at: string;
  user_identifier?: string | null;
}

type SubscriptionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
type TestType = 'basic' | 'revenue' | 'identify';

export const PixelDebugger = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { toast } = useToast();
  const [status, setStatus] = useState<'not_installed' | 'waiting' | 'active'>('not_installed');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>('connecting');
  const [lastEvent, setLastEvent] = useState<TrackedEvent | null>(null);
  const [recentEvents, setRecentEvents] = useState<TrackedEvent[]>([]);
  const [secondsSinceLastEvent, setSecondsSinceLastEvent] = useState<number | null>(null);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testType, setTestType] = useState<TestType>('basic');
  const [testRevenue, setTestRevenue] = useState('99.99');
  const [testEmail, setTestEmail] = useState('');

  // Fetch pixel_id for this workspace
  const { data: pixelConfig } = useQuery({
    queryKey: ['pixel-config', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return null;
      const { data, error } = await supabase
        .from('pixel_configs')
        .select('pixel_id')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_active', true)
        .single();
      
      if (error) {
        console.log('[PixelDebugger] No pixel config found:', error.message);
        return null;
      }
      return data as { pixel_id: string } | null;
    },
    enabled: !!currentWorkspace?.id,
  });

  // Fetch recent events on mount
  const { data: initialEvents, refetch: refetchEvents } = useQuery({
    queryKey: ['recent-conversion-events', currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      
      const { data, error } = await supabase
        .from('conversion_events')
        .select('id, event_type, event_name, visitor_id, user_identifier, event_value, created_at, attributed_at, metadata')
        .eq('workspace_id', currentWorkspace.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.log('[PixelDebugger] Error fetching recent events:', error.message);
        return [];
      }
      
      console.log('[PixelDebugger] Fetched recent events:', data?.length || 0);
      return (data || []).map((raw: any) => ({
        id: raw.id,
        event_type: raw.event_type,
        event_name: raw.event_name,
        visitor_id: raw.visitor_id || raw.user_identifier || 'unknown',
        landing_page: raw.metadata?.referrer || null,
        revenue: raw.event_value,
        created_at: raw.created_at || raw.attributed_at,
      }));
    },
    enabled: !!currentWorkspace?.id,
  });

  // Set initial events and status when data loads
  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setRecentEvents(initialEvents);
      setLastEvent(initialEvents[0]);
      setStatus('active');
      console.log('[PixelDebugger] Loaded', initialEvents.length, 'historical events');
    }
  }, [initialEvents]);

  useEffect(() => {
    if (!currentWorkspace?.id) return;

    console.log('[PixelDebugger] Setting up realtime subscription for workspace:', currentWorkspace.id);
    setSubscriptionStatus('connecting');

    // Subscribe to realtime conversion_events for this workspace
    const channel = supabase
      .channel(`pixel-debugger-${currentWorkspace.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'conversion_events',
          filter: `workspace_id=eq.${currentWorkspace.id}`
        },
        (payload) => {
          console.log('[PixelDebugger] 🎉 New conversion event received:', payload);
          const raw = payload.new as any;
          
          // Map conversion_events columns to TrackedEvent interface
          const newEvent: TrackedEvent = {
            id: raw.id,
            event_type: raw.event_type,
            event_name: raw.event_name,
            visitor_id: raw.visitor_id || raw.user_identifier || 'unknown',
            landing_page: raw.metadata?.referrer || null,
            revenue: raw.event_value,
            created_at: raw.created_at || raw.attributed_at,
          };
          
          setStatus('active');
          setLastEvent(newEvent);
          setSecondsSinceLastEvent(0);
          setRecentEvents(prev => [newEvent, ...prev].slice(0, 5));
          // Visual feedback already provided by UI state changes - no toast needed
        }
      )
      .subscribe((status) => {
        console.log(`[PixelDebugger] Subscription status: ${status}`);
        
        if (status === 'SUBSCRIBED') {
          console.log('[PixelDebugger] ✅ Realtime connected successfully!');
          setSubscriptionStatus('connected');
        } else if (status === 'CLOSED') {
          console.log('[PixelDebugger] ❌ Realtime connection closed');
          setSubscriptionStatus('disconnected');
        } else if (status === 'CHANNEL_ERROR') {
          console.log('[PixelDebugger] ❌ Realtime channel error');
          setSubscriptionStatus('error');
        } else if (status === 'TIMED_OUT') {
          console.log('[PixelDebugger] ⏰ Realtime connection timed out');
          setSubscriptionStatus('error');
        }
      });

    // After 5 seconds of no events, show "waiting" state
    const waitingTimeout = setTimeout(() => {
      if (status === 'not_installed' && !lastEvent) {
        setStatus('waiting');
      }
    }, 5000);

    return () => {
      console.log('[PixelDebugger] Cleaning up subscription');
      supabase.removeChannel(channel);
      clearTimeout(waitingTimeout);
    };
  }, [currentWorkspace?.id]);

  // Update "seconds since" every second when active
  useEffect(() => {
    if (!lastEvent) return;
    
    const interval = setInterval(() => {
      const seconds = Math.floor((Date.now() - new Date(lastEvent.created_at).getTime()) / 1000);
      setSecondsSinceLastEvent(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, [lastEvent]);

  const sendTestEvent = async () => {
    if (!pixelConfig?.pixel_id) {
      toast({
        title: "No pixel configured",
        description: "Please set up your tracking pixel first",
        variant: "destructive",
      });
      return;
    }

    // Validate email for identify test
    if (testType === 'identify' && !testEmail.trim()) {
      toast({
        title: "Email required",
        description: "Please enter an email address for the identify test",
        variant: "destructive",
      });
      return;
    }

    setIsSendingTest(true);
    console.log('[PixelDebugger] Sending', testType, 'test event with pixel_id:', pixelConfig.pixel_id);

    try {
      const testParams = new URLSearchParams({
        pixel_id: pixelConfig.pixel_id,
        visitor_id: `test-${Date.now()}`,
        referrer: window.location.href,
      });

      // Set event type and params based on testType
      if (testType === 'revenue') {
        testParams.set('event', 'purchase');
        testParams.set('revenue', testRevenue);
      } else if (testType === 'identify') {
        testParams.set('event', 'identify');
        testParams.set('email', testEmail.trim());
      } else {
        testParams.set('event', 'custom');
        testParams.set('event_name', 'debug_test');
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-pixel?${testParams.toString()}`,
        { method: 'GET' }
      );

      const result = await response.json();
      console.log('[PixelDebugger] Test event response:', result);

      if (response.ok) {
        const eventLabel = testType === 'revenue' ? 'Revenue' : testType === 'identify' ? 'Identify' : 'Test';
        toast({
          title: `${eventLabel} event sent!`,
          description: "Check if it appears below within a few seconds",
        });
        // Refetch events after a short delay
        setTimeout(() => refetchEvents(), 1000);
      } else {
        throw new Error(result.error || 'Failed to send test event');
      }
    } catch (error) {
      console.error('[PixelDebugger] Test event error:', error);
      toast({
        title: "Failed to send test event",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsSendingTest(false);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getEventBadgeVariant = (eventType: string) => {
    switch (eventType) {
      case 'pageview':
        return 'secondary';
      case 'identify':
        return 'default';
      case 'purchase':
      case 'conversion':
        return 'default';
      default:
        return 'outline';
    }
  };

  const getTimeSinceText = () => {
    if (secondsSinceLastEvent === null) return '';
    if (secondsSinceLastEvent < 5) return 'just now';
    if (secondsSinceLastEvent < 60) return `${secondsSinceLastEvent}s ago`;
    if (secondsSinceLastEvent < 3600) return `${Math.floor(secondsSinceLastEvent / 60)}m ago`;
    return `${Math.floor(secondsSinceLastEvent / 3600)}h ago`;
  };

  const ConnectionIndicator = () => {
    switch (subscriptionStatus) {
      case 'connecting':
        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>connecting...</span>
          </div>
        );
      case 'connected':
        return (
          <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
            <Wifi className="h-3 w-3" />
            <span>realtime connected</span>
          </div>
        );
      case 'disconnected':
        return (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <WifiOff className="h-3 w-3" />
            <span>disconnected</span>
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
            <WifiOff className="h-3 w-3" />
            <span>connection error</span>
          </div>
        );
    }
  };

  const StatusIndicator = () => {
    switch (status) {
      case 'not_installed':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
            <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-sm font-medium text-red-700 dark:text-red-300">no events received</span>
          </div>
        );
      case 'waiting':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
            </span>
            <span className="text-sm font-medium text-amber-700 dark:text-amber-300">waiting for events...</span>
          </div>
        );
      case 'active':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-green-700 dark:text-green-300">
              pixel working! {getTimeSinceText() && `• ${getTimeSinceText()}`}
            </span>
          </div>
        );
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-semibold heading">real-time pixel debugger</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <ConnectionIndicator />
          <StatusIndicator />
        </div>
      </div>

      {/* Test Event Configuration */}
      <div className="mb-4 p-4 bg-muted/50 rounded-lg border border-border">
        <div className="flex items-center gap-2 mb-3">
          <FlaskConical className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">test your pixel</p>
        </div>
        
        {/* Test Type Selector */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <button 
            onClick={() => setTestType('basic')}
            className={cn(
              "p-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
              testType === 'basic' 
                ? "bg-primary/10 border-primary text-primary" 
                : "bg-card border-border hover:bg-muted"
            )}
          >
            <Zap className="h-3.5 w-3.5" />
            Basic
          </button>
          <button 
            onClick={() => setTestType('revenue')}
            className={cn(
              "p-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
              testType === 'revenue' 
                ? "bg-green-500/10 border-green-500 text-green-600 dark:text-green-400" 
                : "bg-card border-border hover:bg-muted"
            )}
          >
            <DollarSign className="h-3.5 w-3.5" />
            Revenue
          </button>
          <button 
            onClick={() => setTestType('identify')}
            className={cn(
              "p-2 rounded-lg border text-xs font-medium transition-colors flex items-center justify-center gap-1.5",
              testType === 'identify' 
                ? "bg-blue-500/10 border-blue-500 text-blue-600 dark:text-blue-400" 
                : "bg-card border-border hover:bg-muted"
            )}
          >
            <User className="h-3.5 w-3.5" />
            Identify
          </button>
        </div>

        {/* Conditional inputs based on test type */}
        {testType === 'revenue' && (
          <div className="mb-4 space-y-2">
            <Label className="text-xs">Revenue Amount ($)</Label>
            <Input 
              type="number" 
              value={testRevenue} 
              onChange={(e) => setTestRevenue(e.target.value)}
              placeholder="99.99"
              className="h-8"
              step="0.01"
              min="0"
            />
            <p className="text-xs text-muted-foreground">
              Tests: <code className="bg-muted px-1 py-0.5 rounded">utmone('track', 'purchase', {`{ revenue: ${testRevenue} }`})</code>
            </p>
          </div>
        )}

        {testType === 'identify' && (
          <div className="mb-4 space-y-2">
            <Label className="text-xs">Email Address</Label>
            <Input 
              type="email" 
              value={testEmail} 
              onChange={(e) => setTestEmail(e.target.value)}
              placeholder="user@example.com"
              className="h-8"
            />
            <p className="text-xs text-muted-foreground">
              Tests: <code className="bg-muted px-1 py-0.5 rounded">utmone('identify', '{testEmail || 'email'}')</code> for 100% cross-device accuracy
            </p>
          </div>
        )}

        {testType === 'basic' && (
          <p className="text-xs text-muted-foreground mb-4">
            Sends a basic test event to verify your pixel is installed correctly.
          </p>
        )}

        <div className="flex items-center justify-between">
          <Button 
            size="sm" 
            onClick={sendTestEvent}
            disabled={isSendingTest || !pixelConfig?.pixel_id}
            className={cn(
              testType === 'revenue' && "bg-green-600 hover:bg-green-700",
              testType === 'identify' && "bg-blue-600 hover:bg-blue-700"
            )}
          >
            {isSendingTest ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                send {testType === 'revenue' ? 'revenue' : testType === 'identify' ? 'identify' : 'test'} event
              </>
            )}
          </Button>
        </div>

        {!pixelConfig?.pixel_id && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-3">
            ⚠️ no pixel configured for this workspace
          </p>
        )}
      </div>

      {/* Last Event Summary */}
      {lastEvent && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              pixel detected!
            </span>
            <span className="text-xs text-green-600 dark:text-green-400">
              last ping: {formatTime(lastEvent.created_at)}
            </span>
          </div>
          <div className="text-xs text-green-700 dark:text-green-300 space-y-1">
            <p><strong>Event:</strong> {lastEvent.event_name || lastEvent.event_type}</p>
            <p><strong>Visitor:</strong> {lastEvent.visitor_id}</p>
            {lastEvent.revenue && (
              <p><strong>Revenue:</strong> ${lastEvent.revenue.toFixed(2)}</p>
            )}
          </div>
        </div>
      )}

      {/* Recent Events */}
      {recentEvents.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              recent events
            </p>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => refetchEvents()}
              className="h-6 text-xs"
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              refresh
            </Button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {recentEvents.map((event) => (
              <div 
                key={event.id} 
                className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={getEventBadgeVariant(event.event_type)} className="text-xs">
                    {event.event_name || event.event_type}
                  </Badge>
                  {event.revenue && (
                    <span className="text-green-600 dark:text-green-400 font-medium">
                      ${event.revenue.toFixed(2)}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatTime(event.created_at)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions when not installed */}
      {status === 'not_installed' && recentEvents.length === 0 && (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <XCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">pixel not detected yet</p>
          <p className="text-xs text-muted-foreground mb-3">
            install the tracking pixel on your website, then visit a page to verify
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-xs text-muted-foreground">
            <Activity className="h-3 w-3" />
            listening for events...
          </div>
        </div>
      )}

      {/* Instructions when waiting */}
      {status === 'waiting' && recentEvents.length === 0 && (
        <div className="text-center py-6">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">still waiting for events...</p>
          <p className="text-xs text-muted-foreground">
            open your website with the pixel installed to see events appear here in real-time
          </p>
        </div>
      )}
    </Card>
  );
};
