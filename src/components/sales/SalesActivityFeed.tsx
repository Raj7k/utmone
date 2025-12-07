import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { formatDistanceToNow } from "date-fns";
import { Activity, Monitor, Smartphone, Tablet, MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

export const SalesActivityFeed = () => {
  const { currentWorkspace } = useWorkspace();
  const [realtimeEvents, setRealtimeEvents] = useState<ClickEvent[]>([]);

  const { data: initialEvents = [] } = useQuery({
    queryKey: ["sales-activity", currentWorkspace?.id],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !currentWorkspace?.id) return [];

      const { data, error } = await supabase
        .from("link_clicks")
        .select(`
          id,
          clicked_at,
          device_type,
          city,
          country,
          link:links!inner(
            title,
            prospect_name,
            slug,
            created_by,
            link_type,
            workspace_id
          )
        `)
        .eq("link.workspace_id", currentWorkspace.id)
        .eq("link.created_by", user.id)
        .eq("link.link_type", "sales")
        .order("clicked_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        link: Array.isArray(item.link) ? item.link[0] : item.link
      })) as ClickEvent[];
    },
    enabled: !!currentWorkspace?.id,
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
          // Fetch the full click data with link info
          const { data } = await supabase
            .from("link_clicks")
            .select(`
              id,
              clicked_at,
              device_type,
              city,
              country,
              link:links!inner(
                title,
                prospect_name,
                slug,
                created_by,
                link_type
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (data && data.link) {
            const linkData = Array.isArray(data.link) ? data.link[0] : data.link;
            if (linkData.link_type === "sales") {
              setRealtimeEvents(prev => [{
                ...data,
                link: linkData
              } as ClickEvent, ...prev.slice(0, 19)]);
            }
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
        return <Smartphone className="h-3 w-3" />;
      case "tablet":
        return <Tablet className="h-3 w-3" />;
      default:
        return <Monitor className="h-3 w-3" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="font-semibold text-foreground">live activity</h3>
          {realtimeEvents.length > 0 && (
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        {allEvents.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-muted-foreground text-sm">
              no activity yet. clicks will appear here in real-time.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {allEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 mt-0.5">
                    {getDeviceIcon(event.device_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">
                      {event.link.prospect_name || event.link.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <span>{event.device_type || "Desktop"}</span>
                      {(event.city || event.country) && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[event.city, event.country].filter(Boolean).join(", ")}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(event.clicked_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
