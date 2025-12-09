import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, MapPin } from "lucide-react";

interface ControlGroupChartProps {
  targetCity: string;
  controlCity: string;
  targetData: number[];
  controlData: number[];
  eventDays: [number, number]; // start and end index
}

export const ControlGroupChart = ({
  targetCity = "Las Vegas",
  controlCity = "Phoenix",
  targetData = [45, 48, 42, 50, 180, 220, 195, 210, 52, 48, 45, 50],
  controlData = [42, 45, 40, 48, 44, 46, 42, 45, 48, 44, 42, 46],
  eventDays = [4, 7],
}: Partial<ControlGroupChartProps>) => {
  const maxValue = Math.max(...targetData, ...controlData);
  const chartHeight = 120;

  const getBarHeight = (value: number) => (value / maxValue) * chartHeight;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Target City */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="font-semibold text-foreground">{targetCity}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-auto">
            event city
          </span>
        </div>
        
        <div className="relative h-32 flex items-end gap-1">
          {/* Event highlight zone */}
          <motion.div
            className="absolute bg-primary/10 rounded"
            style={{
              left: `${(eventDays[0] / targetData.length) * 100}%`,
              width: `${((eventDays[1] - eventDays[0] + 1) / targetData.length) * 100}%`,
              top: 0,
              bottom: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          
          {targetData.map((value, i) => {
            const isEventDay = i >= eventDays[0] && i <= eventDays[1];
            return (
              <motion.div
                key={i}
                className={`flex-1 rounded-t ${isEventDay ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                initial={{ height: 0 }}
                animate={{ height: getBarHeight(value) }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              />
            );
          })}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">event period</span>
          <div className="flex items-center gap-1 text-primary">
            <TrendingUp className="w-4 h-4" />
            <span className="font-semibold">+380%</span>
          </div>
        </div>
      </Card>

      {/* Control City */}
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-muted-foreground" />
          <span className="font-semibold text-foreground">{controlCity}</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground ml-auto">
            control city
          </span>
        </div>
        
        <div className="relative h-32 flex items-end gap-1">
          {/* Same time period highlight */}
          <motion.div
            className="absolute bg-muted/30 rounded"
            style={{
              left: `${(eventDays[0] / controlData.length) * 100}%`,
              width: `${((eventDays[1] - eventDays[0] + 1) / controlData.length) * 100}%`,
              top: 0,
              bottom: 0,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          />
          
          {controlData.map((value, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-t bg-muted-foreground/30"
              initial={{ height: 0 }}
              animate={{ height: getBarHeight(value) }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            />
          ))}
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <span className="text-sm text-muted-foreground">same period</span>
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingDown className="w-4 h-4" />
            <span className="font-semibold">-2%</span>
          </div>
        </div>
      </Card>

      {/* Proof Statement */}
      <div className="md:col-span-2 text-center py-4">
        <p className="text-muted-foreground">
          <span className="text-primary font-semibold">{targetCity}</span> spiked during your event while{" "}
          <span className="text-muted-foreground font-semibold">{controlCity}</span> stayed flat.{" "}
          <span className="text-foreground font-medium">that's your proof.</span>
        </p>
      </div>
    </div>
  );
};