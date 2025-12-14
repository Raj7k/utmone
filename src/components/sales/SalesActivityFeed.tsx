import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { formatDistanceToNow } from "date-fns";
import { Activity, Monitor, Smartphone, Tablet, MapPin, Zap } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesLink {
  id: string;
  title: string;
  prospect_name?: string;
  slug: string;
}

interface ClickEvent {
  id: string;
  clicked_at: string;
  device_type?: string;
  city?: string;
  country?: string;
  link: {
    title: string;
    prospect_name?: string;
    slug: string;
  };
}

interface SalesActivityFeedProps {
  salesLinks?: SalesLink[];
}

export const SalesActivityFeed = ({ salesLinks = [] }: SalesActivityFeedProps) => {
  const { currentWorkspace } = useWorkspace();
  const [realtimeEvents, setRealtimeEvents] = useState<ClickEvent[]>([]);
  const [newEventId, setNewEventId] = useState<string | null>(null);

  // Build link map from passed props (no duplicate query!)
  const linkIds = salesLinks.map(l => l.id);
  const linkMap = new Map(salesLinks.map(l => [l.id, { title: l.title, prospect_name: l.prospect_name, slug: l.slug }]));

  // Only fetch clicks - use passed salesLinks instead of re-fetching
  const { data: initialEvents = [], isLoading } = useQuery({
    queryKey: ["sales-activity-clicks", currentWorkspace?.id, linkIds.join(",")],
    queryFn: async () => {
      if (!currentWorkspace?.id || linkIds.length === 0) return [];

      const { data: clicks, error } = await supabase
        .from("link_clicks")
        .select("id, clicked_at, device_type, city, country, link_id")
        .eq("workspace_id", currentWorkspace.id)
        .in("link_id", linkIds)
        .order("clicked_at", { ascending: false })
        .limit(20);

      if (error) throw error;

      return (clicks || []).map(click => ({
        ...click,
        link: linkMap.get(click.link_id) || { title: "Unknown", slug: "" }
      })) as ClickEvent[];
    },
    enabled: !!currentWorkspace?.id && linkIds.length > 0,
    staleTime: 30000,
  });

  // Real-time subscription for new clicks
  useEffect(() => {
    if (!currentWorkspace?.id) return;

    const channel = supabase
      .channel("sales-clicks")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "link_clicks",
        },
        async (payload) => {
          // Get click data directly
          const { data: clickData } = await supabase
            .from("link_clicks")
            .select("id, clicked_at, device_type, city, country, link_id")
            .eq("id", payload.new.id)
            .single();

          if (!clickData) return;

          // Get link data separately
          const { data: linkData } = await supabase
            .from("links")
            .select("title, prospect_name, slug, link_type")
            .eq("id", clickData.link_id)
            .single();

          if (linkData && linkData.link_type === "sales") {
            const newEvent = {
              ...clickData,
              link: linkData
            } as ClickEvent;
            
            setNewEventId(newEvent.id);
            setRealtimeEvents(prev => [newEvent, ...prev.slice(0, 19)]);
            
            // Clear highlight after animation
            setTimeout(() => setNewEventId(null), 3000);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentWorkspace?.id]);

  const allEvents = [...realtimeEvents, ...initialEvents].slice(0, 20);

  const getDeviceIcon = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return Smartphone;
      case "tablet":
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getDeviceColor = (deviceType?: string) => {
    switch (deviceType?.toLowerCase()) {
      case "mobile":
        return "bg-purple-500/10 text-purple-500";
      case "tablet":
        return "bg-blue-500/10 text-blue-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-24" />
        </div>
        <div className="p-4 space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-9 w-9 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Activity className="h-4 w-4 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground">live activity</h3>
          {realtimeEvents.length > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-medium"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              live
            </motion.span>
          )}
        </div>
      </div>

      <ScrollArea className="h-[420px]">
        {allEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-8 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-4">
              <Zap className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              clicks will appear here in real-time
            </p>
          </motion.div>
        ) : (
          <div className="divide-y divide-border">
            <AnimatePresence mode="popLayout">
              {allEvents.map((event) => {
                const DeviceIcon = getDeviceIcon(event.device_type);
                const isNew = event.id === newEventId;
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20, height: 0 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0, 
                      height: "auto",
                      backgroundColor: isNew ? "hsl(var(--primary) / 0.05)" : "transparent"
                    }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={cn(
                      "p-4 transition-colors duration-500",
                      isNew && "ring-1 ring-inset ring-primary/20"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <motion.div
                        initial={isNew ? { scale: 0.8 } : false}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className={cn(
                          "p-2 rounded-xl flex-shrink-0",
                          getDeviceColor(event.device_type)
                        )}
                      >
                        <DeviceIcon className="h-4 w-4" />
                      </motion.div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm truncate">
                            {event.link.prospect_name || event.link.title}
                          </p>
                          {isNew && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            >
                              just now
                            </motion.span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <span className="capitalize">{event.device_type || "Desktop"}</span>
                          {(event.city || event.country) && (
                            <>
                              <span className="text-border">•</span>
                              <span className="flex items-center gap-1 truncate">
                                <MapPin className="h-3 w-3 flex-shrink-0" />
                                {[event.city, event.country].filter(Boolean).join(", ")}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground/70 mt-1.5">
                          {formatDistanceToNow(new Date(event.clicked_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
