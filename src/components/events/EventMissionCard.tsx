import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Waves, TrendingUp, MoreVertical } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, differenceInDays, isPast, isFuture, isWithinInterval } from "date-fns";

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

interface EventMissionCardProps {
  event: FieldEvent;
  onClick: () => void;
  onRecalculate: () => void;
  onDelete: () => void;
}

export const EventMissionCard = ({
  event,
  onClick,
  onRecalculate,
  onDelete
}: EventMissionCardProps) => {
  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const now = new Date();
  
  const isUpcoming = isFuture(startDate);
  const isActive = isWithinInterval(now, { start: startDate, end: endDate });
  const isCompleted = isPast(endDate);
  
  const daysUntil = differenceInDays(startDate, now);
  const daysAgo = differenceInDays(now, endDate);
  
  const getStatusBadge = () => {
    if (isActive) return <Badge className="bg-primary/20 text-primary border-primary/30">live now</Badge>;
    if (isUpcoming) return <Badge variant="outline">in {daysUntil} days</Badge>;
    return <Badge variant="secondary">{daysAgo} days ago</Badge>;
  };

  const totalImpact = event.direct_scans + event.halo_visitors;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-4 cursor-pointer hover:border-primary/30 transition-colors group relative"
        onClick={onClick}
      >
        {/* Active pulse indicator */}
        {isActive && (
          <motion.div
            className="absolute top-3 right-12 w-2 h-2 rounded-full bg-primary"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
        
        {/* Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRecalculate(); }}>
              Recalculate Halo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-destructive">
              Delete Event
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-foreground">{event.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location_city}, {event.location_country}</span>
            </div>
          </div>
          {getStatusBadge()}
        </div>
        
        {/* Dates */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
          <Calendar className="w-3 h-3" />
          <span>
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </span>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Users className="w-3 h-3 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{event.direct_scans}</span>
            </div>
            <p className="text-xs text-muted-foreground">direct</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Waves className="w-3 h-3 text-primary" />
              <span className="text-lg font-bold text-foreground">{event.halo_visitors}</span>
            </div>
            <p className="text-xs text-muted-foreground">halo</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3 text-primary" />
              <span className="text-lg font-bold text-primary">+{event.lift_percentage}%</span>
            </div>
            <p className="text-xs text-muted-foreground">lift</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
