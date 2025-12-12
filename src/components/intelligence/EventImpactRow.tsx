import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, ChevronRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface EventImpactRowProps {
  workspaceId?: string;
  days: number;
}

interface EventData {
  id: string;
  name: string;
  city: string;
  lift: number;
  haloVisitors: number;
  date: string;
}

// Cache helpers
const CACHE_KEY = 'event-impact-cache';
const CACHE_EXPIRY = 2 * 60 * 1000; // 2 minutes

function getCached(workspaceId: string, days: number): EventData[] | undefined {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return undefined;
    const { data, timestamp, wid, d } = JSON.parse(cached);
    if (wid !== workspaceId || d !== days) return undefined;
    if (Date.now() - timestamp > CACHE_EXPIRY) return undefined;
    return data;
  } catch {
    return undefined;
  }
}

function setCache(workspaceId: string, days: number, data: EventData[]) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data,
      timestamp: Date.now(),
      wid: workspaceId,
      d: days,
    }));
  } catch {}
}

export default function EventImpactRow({ workspaceId, days }: EventImpactRowProps) {
  const { data: events, isFetching } = useQuery({
    queryKey: ["event-impact", workspaceId, days],
    queryFn: async () => {
      if (!workspaceId) return [];

      const { data, error } = await supabase
        .from("field_events")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("start_date", { ascending: false })
        .limit(5);

      if (error) throw error;

      const result = (data || []).map((event: any) => ({
        id: event.id,
        name: event.name || "Untitled Event",
        city: event.location_city || "Unknown",
        lift: event.lift_percentage || 0,
        haloVisitors: event.halo_visitors || 0,
        date: event.start_date,
      }));
      
      if (workspaceId) setCache(workspaceId, days, result);
      return result;
    },
    initialData: () => workspaceId ? getCached(workspaceId, days) : undefined,
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return (
    <Card className="relative">
      {/* Subtle loading indicator */}
      {isFetching && (
        <div className="absolute top-3 right-3 h-2 w-2 rounded-full bg-primary animate-pulse" />
      )}
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            event impact
          </CardTitle>
          <Link
            to="/dashboard/events"
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
          >
            view all
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {events && events.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mb-2 scrollbar-hide">
            {events.map((event, index) => (
              <EventMiniCard key={event.id} event={event} index={index} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CalendarDays className="w-10 h-10 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">no events tracked yet</p>
            <Link
              to="/dashboard/events/new"
              className="text-xs text-primary hover:underline mt-1"
            >
              track your first event
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EventMiniCard({ event, index }: { event: EventData; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative shrink-0 w-48 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
    >
      {/* Sonar Animation */}
      <div className="absolute top-3 right-3">
        <SonarPulse />
      </div>

      <div className="space-y-2">
        <div className="pr-8">
          <div className="font-medium text-foreground text-sm truncate group-hover:text-primary transition-colors">
            {event.name}
          </div>
          <div className="text-xs text-muted-foreground">{event.city}</div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-emerald-500">
            <TrendingUp className="w-3 h-3" />
            <span className="text-lg font-bold tabular-nums">+{event.lift}%</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {event.haloVisitors.toLocaleString()} halo visitors
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SonarPulse() {
  return (
    <div className="relative w-6 h-6">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-2 h-2 rounded-full bg-primary" />
      </div>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/30"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.6,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
