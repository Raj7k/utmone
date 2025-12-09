import { useMemo } from "react";
import { motion } from "framer-motion";
import { format, isWithinInterval, isFuture, differenceInDays } from "date-fns";
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

interface EventsOverviewGridProps {
  events: FieldEvent[];
  onEventSelect: (event: FieldEvent) => void;
  onQRClick: (event: FieldEvent) => void;
  onScanClick: (event: FieldEvent) => void;
}

interface GroupedEvents {
  [monthYear: string]: FieldEvent[];
}

export const EventsOverviewGrid = ({
  events,
  onEventSelect,
  onQRClick,
  onScanClick,
}: EventsOverviewGridProps) => {
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

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Calendar className="w-16 h-16 text-muted-foreground mb-6" />
        <h3 className="font-display text-xl font-semibold text-foreground mb-2">no events yet</h3>
        <p className="text-muted-foreground max-w-md">
          create your first event to start tracking the invisible lift from conferences and trade shows
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
        <div key={monthYear}>
          {/* Month Header */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground lowercase">
              {monthYear}
            </h2>
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">
              {monthEvents.length} event{monthEvents.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Events Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {monthEvents.map((event, index) => {
              const status = getEventStatus(event);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onEventSelect(event)}
                  className={cn(
                    "group p-5 rounded-2xl border bg-card cursor-pointer transition-all",
                    "hover:border-primary/30 hover:shadow-md hover:shadow-primary/5",
                    status === "live" && "border-emerald-500/30 bg-emerald-500/5"
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground truncate mb-1">
                        {event.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{event.location_city}</span>
                      </div>
                    </div>
                    {getStatusBadge(event)}
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {format(new Date(event.start_date), "MMM d")} - {format(new Date(event.end_date), "MMM d, yyyy")}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm mb-4 p-3 rounded-xl bg-muted/30">
                    <div className="flex items-center gap-1.5">
                      <QrCode className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="font-medium text-foreground">{event.direct_scans}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Waves className="w-3.5 h-3.5 text-primary" />
                      <span className="font-medium text-foreground">{event.halo_visitors.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="font-medium text-emerald-500">+{event.lift_percentage}%</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        onQRClick(event);
                      }}
                    >
                      <QrCode className="w-3.5 h-3.5 mr-1.5" />
                      QR
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 h-9"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScanClick(event);
                      }}
                    >
                      <Scan className="w-3.5 h-3.5 mr-1.5" />
                      scan
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-9 w-9 p-0 group-hover:bg-primary/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventSelect(event);
                      }}
                    >
                      <ChevronRight className="w-4 h-4 group-hover:text-primary transition-colors" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
