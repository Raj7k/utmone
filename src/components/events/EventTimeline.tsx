import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, isToday, isFuture, isPast, differenceInDays, isWithinInterval } from "date-fns";
import { MapPin, QrCode, Scan, Waves, TrendingUp, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface EventTimelineProps {
  events: FieldEvent[];
  selectedEventId: string | null;
  onEventSelect: (id: string) => void;
  onQRClick: (event: FieldEvent) => void;
  onScanClick: (event: FieldEvent) => void;
}

interface GroupedEvents {
  [monthYear: string]: FieldEvent[];
}

export const EventTimeline = ({
  events,
  selectedEventId,
  onEventSelect,
  onQRClick,
  onScanClick,
}: EventTimelineProps) => {
  // Group events by month and sort chronologically
  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => 
      new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );

    return sorted.reduce<GroupedEvents>((acc, event) => {
      const monthYear = format(new Date(event.start_date), "MMMM yyyy");
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(event);
      return acc;
    }, {});
  }, [events]);

  const getEventStatus = (event: FieldEvent) => {
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const now = new Date();

    if (isWithinInterval(now, { start, end })) return "live";
    if (isFuture(start)) return "upcoming";
    return "completed";
  };

  const getStatusBadge = (event: FieldEvent) => {
    const status = getEventStatus(event);
    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const now = new Date();

    if (status === "live") {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          live now
        </Badge>
      );
    }
    if (status === "upcoming") {
      const days = differenceInDays(start, now);
      return <Badge variant="outline" className="text-muted-foreground">in {days} days</Badge>;
    }
    const days = differenceInDays(now, end);
    return <Badge variant="secondary">{days}d ago</Badge>;
  };

  // Find if today falls within any month group
  const todayMonthYear = format(new Date(), "MMMM yyyy");

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">no events yet</h3>
        <p className="text-muted-foreground text-sm max-w-sm">
          create your first event to start tracking the invisible lift from conferences and trade shows
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([monthYear, monthEvents], groupIndex) => (
        <div key={monthYear} className="relative">
          {/* Month Header */}
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-sm font-medium text-muted-foreground">
              {monthYear}
            </h3>
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">
              {monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Timeline */}
          <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />

            {/* Today Marker (if this month contains today) */}
            {monthYear === todayMonthYear && (
              <div className="absolute left-0 -translate-x-[1px] flex items-center gap-2 text-xs text-primary z-10" style={{ top: "50%" }}>
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                </div>
                <span className="font-medium">today</span>
              </div>
            )}

            {/* Events */}
            <div className="space-y-3">
              {monthEvents.map((event, eventIndex) => {
                const isSelected = event.id === selectedEventId;
                const status = getEventStatus(event);

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: eventIndex * 0.05 }}
                    className="relative"
                  >
                    {/* Timeline Dot */}
                    <div 
                      className={cn(
                        "absolute left-[-21px] top-4 w-3.5 h-3.5 rounded-full border-2 bg-background z-10",
                        status === "live" && "border-emerald-500 bg-emerald-500",
                        status === "upcoming" && "border-primary bg-background",
                        status === "completed" && "border-muted-foreground bg-muted"
                      )}
                    >
                      {status === "live" && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-emerald-500"
                          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      )}
                    </div>

                    {/* Event Card */}
                    <div
                      onClick={() => onEventSelect(event.id)}
                      className={cn(
                        "p-4 rounded-xl border cursor-pointer transition-all",
                        isSelected 
                          ? "bg-primary/5 border-primary/30 shadow-sm" 
                          : "bg-card border-border hover:border-primary/20 hover:bg-muted/30"
                      )}
                    >
                      {/* Header Row */}
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(event.start_date), "MMM d")} - {format(new Date(event.end_date), "d")}
                            </span>
                          </div>
                          <h4 className="font-display font-semibold text-foreground truncate">{event.name}</h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{event.location_city}, {event.location_country}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {getStatusBadge(event)}
                          <ChevronRight className={cn(
                            "w-4 h-4 text-muted-foreground transition-transform",
                            isSelected && "rotate-90 text-primary"
                          )} />
                        </div>
                      </div>

                      {/* Stats Row */}
                      <div className="flex items-center gap-4 text-sm mt-3 pt-3 border-t border-border">
                        <div className="flex items-center gap-1.5">
                          <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{event.direct_scans}</span>
                          <span className="text-muted-foreground text-xs">scans</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Waves className="w-3.5 h-3.5 text-primary" />
                          <span className="font-medium text-foreground">{event.halo_visitors.toLocaleString()}</span>
                          <span className="text-muted-foreground text-xs">halo</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="font-medium text-emerald-500">+{event.lift_percentage}%</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onQRClick(event);
                          }}
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          QR Code
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs gap-1.5"
                          onClick={(e) => {
                            e.stopPropagation();
                            onScanClick(event);
                          }}
                        >
                          <Scan className="w-3.5 h-3.5" />
                          Scan
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
