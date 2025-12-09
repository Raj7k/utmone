import { motion } from "framer-motion";
import { MapPin, Calendar, Users, Waves, TrendingUp, MoreVertical, QrCode } from "lucide-react";
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
import QRCode from "react-qr-code";

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
  booth_link_id?: string;
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

  // Generate booth QR URL with event UTMs
  const boothUrl = `https://utm.one/e/${event.id.slice(0, 8)}?utm_source=event&utm_medium=booth&utm_campaign=${encodeURIComponent(event.name.toLowerCase().replace(/\s+/g, '-'))}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="p-4 cursor-pointer hover:border-primary/30 transition-colors group relative overflow-hidden"
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
            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity z-10">
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
        
        {/* Mission Layout: QR + Sonar */}
        <div className="grid grid-cols-2 gap-4 my-4">
          {/* Left: QR Code */}
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-muted/30">
            <div className="bg-white p-2 rounded-md">
              <QRCode 
                value={boothUrl} 
                size={64} 
                level="M"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">booth qr</p>
          </div>
          
          {/* Right: Mini Sonar Visualization */}
          <div className="relative flex items-center justify-center">
            {/* Ripple Waves */}
            {isActive && [1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                className="absolute rounded-full border border-primary/30"
                style={{ width: 20, height: 20 }}
                animate={{
                  width: [20, 60],
                  height: [20, 60],
                  opacity: [0.6, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: ring * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
            
            {/* Static rings for non-active */}
            {!isActive && [25, 40, 55].map((size) => (
              <div
                key={size}
                className="absolute rounded-full border border-muted-foreground/20"
                style={{ width: size, height: size }}
              />
            ))}
            
            {/* Central Booth Dot */}
            <motion.div 
              className="w-4 h-4 rounded-full bg-primary flex items-center justify-center z-10"
              animate={isActive ? {
                boxShadow: [
                  "0 0 8px hsl(var(--primary) / 0.3)",
                  "0 0 16px hsl(var(--primary) / 0.5)",
                  "0 0 8px hsl(var(--primary) / 0.3)",
                ]
              } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Waves className="w-2 h-2 text-primary-foreground" />
            </motion.div>
          </div>
        </div>
        
        {/* Digital Footprint Metric */}
        <div className="bg-primary/5 rounded-lg p-3 mb-3">
          <p className="text-xs text-muted-foreground mb-1">digital footprint</p>
          <p className="text-lg font-bold text-foreground">
            <span className="text-primary">+{event.lift_percentage}%</span>
            <span className="text-sm font-normal text-muted-foreground ml-1">lift in {event.location_city}</span>
          </p>
        </div>
        
        {/* Dates */}
        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
          <Calendar className="w-3 h-3" />
          <span>
            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
          </span>
        </div>
        
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <QrCode className="w-3 h-3 text-muted-foreground" />
              <span className="text-lg font-bold text-foreground">{event.direct_scans}</span>
            </div>
            <p className="text-xs text-muted-foreground">scans</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Waves className="w-3 h-3 text-primary" />
              <span className="text-lg font-bold text-foreground">{event.halo_visitors.toLocaleString()}</span>
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
