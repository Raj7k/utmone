import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from "recharts";
import { format, parseISO, isWithinInterval } from "date-fns";

interface TimeseriesPoint {
  visit_date: string;
  unique_visitors: number;
}

interface EventHaloSpikeChartProps {
  timeseries: TimeseriesPoint[];
  eventStart: string;
  eventEnd: string;
  baselineDailyAverage: number;
  className?: string;
}

export const EventHaloSpikeChart = ({
  timeseries,
  eventStart,
  eventEnd,
  baselineDailyAverage,
  className = ""
}: EventHaloSpikeChartProps) => {
  const chartData = useMemo(() => {
    if (!timeseries || timeseries.length === 0) return [];

    const eventStartDate = parseISO(eventStart);
    const eventEndDate = parseISO(eventEnd);

    return timeseries.map(point => {
      const date = parseISO(point.visit_date);
      const isEventPeriod = isWithinInterval(date, { start: eventStartDate, end: eventEndDate });
      
      return {
        date: point.visit_date,
        visitors: point.unique_visitors,
        baseline: Math.round(baselineDailyAverage),
        isEventPeriod,
        // For dual-area effect: split visitors into baseline and halo portions
        baselineVisitors: Math.min(point.unique_visitors, Math.round(baselineDailyAverage)),
        haloVisitors: isEventPeriod ? Math.max(0, point.unique_visitors - Math.round(baselineDailyAverage)) : 0
      };
    });
  }, [timeseries, eventStart, eventEnd, baselineDailyAverage]);

  if (chartData.length === 0) {
    return (
      <div className={`flex items-center justify-center h-[200px] obsidian-glass-60 rounded-xl border border-white/10 ${className}`}>
        <p className="text-white/40 text-sm">No visitor data available yet</p>
      </div>
    );
  }

  const eventStartStr = eventStart.split('T')[0];
  const eventEndStr = eventEnd.split('T')[0];

  return (
    <div className={`obsidian-glass-60 rounded-xl border border-white/10 p-4 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white/80 lowercase">visitor spike analysis</h3>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white/30" />
            <span className="text-white/50">baseline</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-white/50">halo effect</span>
          </div>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="baselineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(255,255,255,0.3)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="rgba(255,255,255,0.1)" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="haloGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.6}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(parseISO(date), 'MMM d')}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={30}
          />
          
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const data = payload[0].payload;
              return (
                <div className="obsidian-glass-80 border border-white/20 rounded-lg p-3 shadow-xl">
                  <p className="text-xs text-white/60 mb-1">
                    {format(parseISO(label), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm font-semibold text-white">
                    {data.visitors} visitors
                  </p>
                  {data.isEventPeriod && data.haloVisitors > 0 && (
                    <p className="text-xs text-primary mt-1">
                      +{data.haloVisitors} halo effect
                    </p>
                  )}
                </div>
              );
            }}
          />
          
          {/* Event period highlight */}
          <ReferenceArea
            x1={eventStartStr}
            x2={eventEndStr}
            fill="hsl(var(--primary))"
            fillOpacity={0.1}
            stroke="hsl(var(--primary))"
            strokeOpacity={0.3}
            strokeDasharray="3 3"
          />
          
          {/* Baseline reference line */}
          <ReferenceLine 
            y={Math.round(baselineDailyAverage)} 
            stroke="rgba(255,255,255,0.4)" 
            strokeDasharray="5 5"
            label={{ 
              value: 'baseline', 
              position: 'right', 
              fill: 'rgba(255,255,255,0.4)',
              fontSize: 10
            }}
          />
          
          {/* Baseline area (grey) */}
          <Area
            type="monotone"
            dataKey="baselineVisitors"
            stackId="1"
            stroke="rgba(255,255,255,0.4)"
            fill="url(#baselineGradient)"
            strokeWidth={1}
          />
          
          {/* Halo area (primary color - the spike above baseline) */}
          <Area
            type="monotone"
            dataKey="haloVisitors"
            stackId="1"
            stroke="hsl(var(--primary))"
            fill="url(#haloGradient)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
      
      <p className="text-xs text-white/40 mt-3 text-center">
        The highlighted area shows the event period. Traffic above the baseline = halo visitors.
      </p>
    </div>
  );
};

export default EventHaloSpikeChart;
