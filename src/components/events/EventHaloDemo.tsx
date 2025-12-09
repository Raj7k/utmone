import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, TrendingUp, Users, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CityData {
  name: string;
  event: string;
  dates: string;
  haloVisitors: number;
  liftPercentage: number;
  directScans: number;
}

const cityData: Record<string, CityData> = {
  lasvegas: {
    name: "Las Vegas",
    event: "CES 2025",
    dates: "Jan 7-10, 2025",
    haloVisitors: 1847,
    liftPercentage: 450,
    directScans: 234,
  },
  sanfrancisco: {
    name: "San Francisco",
    event: "SaaStr Annual",
    dates: "Sep 10-12, 2025",
    haloVisitors: 1423,
    liftPercentage: 380,
    directScans: 189,
  },
  austin: {
    name: "Austin",
    event: "SXSW 2025",
    dates: "Mar 7-15, 2025",
    haloVisitors: 2156,
    liftPercentage: 520,
    directScans: 312,
  },
  newyork: {
    name: "New York",
    event: "Web Summit NYC",
    dates: "May 21-22, 2025",
    haloVisitors: 987,
    liftPercentage: 290,
    directScans: 156,
  },
};

export const EventHaloDemo = () => {
  const [selectedCity, setSelectedCity] = useState("lasvegas");
  const [animatedVisitors, setAnimatedVisitors] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const data = cityData[selectedCity];

  // Animate visitor count when city changes
  useEffect(() => {
    setIsAnimating(true);
    setAnimatedVisitors(0);
    
    const targetValue = data.haloVisitors;
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setAnimatedVisitors(targetValue);
        setIsAnimating(false);
        clearInterval(timer);
      } else {
        setAnimatedVisitors(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [selectedCity, data.haloVisitors]);

  return (
    <Card className="p-6 bg-card/50 backdrop-blur border-border overflow-hidden">
      {/* City Selector */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          <span>Select event:</span>
        </div>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(cityData).map(([key, city]) => (
              <SelectItem key={key} value={key}>
                {city.name} - {city.event}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Animated Visualization */}
      <div className="relative h-64 flex items-center justify-center">
        {/* Background ripples */}
        <div className="absolute inset-0 flex items-center justify-center">
          {[1, 2, 3, 4, 5].map((ring) => (
            <motion.div
              key={ring}
              className="absolute rounded-full border border-primary/20"
              initial={{ width: 40, height: 40, opacity: 0 }}
              animate={{
                width: [40, 280],
                height: [40, 280],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: ring * 0.5,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Floating visitor particles */}
        <AnimatePresence>
          {isAnimating && Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-primary"
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 0,
                scale: 0 
              }}
              animate={{ 
                x: (Math.random() - 0.5) * 200,
                y: (Math.random() - 0.5) * 200,
                opacity: [0, 1, 0],
                scale: [0, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </AnimatePresence>

        {/* Center stats */}
        <motion.div 
          className="relative z-10 text-center bg-card/80 backdrop-blur-sm rounded-2xl p-6 border border-border"
          key={selectedCity}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p 
            className="text-5xl font-bold text-foreground tabular-nums"
            animate={{ opacity: isAnimating ? [0.5, 1, 0.5] : 1 }}
            transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
          >
            {animatedVisitors.toLocaleString()}
          </motion.p>
          <p className="text-sm text-muted-foreground mt-1">halo visitors detected</p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-primary font-semibold">+{data.liftPercentage}% lift</span>
          </div>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xl font-semibold text-foreground">{data.directScans}</p>
          <p className="text-xs text-muted-foreground">direct scans</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-xl font-semibold text-primary">{data.haloVisitors}</p>
          <p className="text-xs text-muted-foreground">halo visitors</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-sm font-medium text-foreground">{data.dates}</p>
          <p className="text-xs text-muted-foreground">{data.event}</p>
        </div>
      </div>
    </Card>
  );
};