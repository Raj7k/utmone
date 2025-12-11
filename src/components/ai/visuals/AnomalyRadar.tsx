import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * AnomalyRadar - Circular radar sweep with anomaly detection visualization
 * Shows real-time monitoring capability
 */
export const AnomalyRadar = () => {
  const [anomalies, setAnomalies] = useState<{ id: number; angle: number; distance: number; type: 'warning' | 'critical' }[]>([
    { id: 1, angle: 45, distance: 0.6, type: 'warning' },
    { id: 2, angle: 180, distance: 0.8, type: 'critical' },
    { id: 3, angle: 280, distance: 0.4, type: 'warning' },
  ]);
  
  const [sweepAngle, setSweepAngle] = useState(0);
  const [detectedAnomalies, setDetectedAnomalies] = useState<number[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Detect anomalies when sweep passes over them
    anomalies.forEach(anomaly => {
      const diff = Math.abs(sweepAngle - anomaly.angle);
      if (diff < 10 || diff > 350) {
        if (!detectedAnomalies.includes(anomaly.id)) {
          setDetectedAnomalies(prev => [...prev, anomaly.id]);
        }
      }
    });
  }, [sweepAngle, anomalies, detectedAnomalies]);

  const getPosition = (angle: number, distance: number, radius: number) => {
    const rad = (angle - 90) * (Math.PI / 180);
    return {
      x: 150 + Math.cos(rad) * radius * distance,
      y: 150 + Math.sin(rad) * radius * distance,
    };
  };

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      <svg viewBox="0 0 300 300" className="w-full h-full max-w-[300px]">
        <defs>
          {/* Sweep gradient */}
          <linearGradient id="sweepGradient" gradientTransform={`rotate(${sweepAngle}, 150, 150)`}>
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Warning glow */}
          <filter id="warningGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric rings */}
        {[0.25, 0.5, 0.75, 1].map((scale, i) => (
          <circle
            key={i}
            cx="150"
            cy="150"
            r={120 * scale}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Cross hairs */}
        <line x1="150" y1="30" x2="150" y2="270" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <line x1="30" y1="150" x2="270" y2="150" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

        {/* Sweep arc */}
        <motion.path
          d={`M 150 150 L ${getPosition(sweepAngle - 30, 1, 120).x} ${getPosition(sweepAngle - 30, 1, 120).y} A 120 120 0 0 1 ${getPosition(sweepAngle, 1, 120).x} ${getPosition(sweepAngle, 1, 120).y} Z`}
          fill="url(#sweepGradient)"
        />

        {/* Sweep line */}
        <motion.line
          x1="150"
          y1="150"
          x2={getPosition(sweepAngle, 1, 120).x}
          y2={getPosition(sweepAngle, 1, 120).y}
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="1"
          filter="url(#glow)"
        />

        {/* Anomaly points */}
        {anomalies.map((anomaly) => {
          const pos = getPosition(anomaly.angle, anomaly.distance, 120);
          const isDetected = detectedAnomalies.includes(anomaly.id);
          const color = anomaly.type === 'critical' ? 'rgb(239, 68, 68)' : 'rgb(251, 191, 36)';
          
          return (
            <g key={anomaly.id}>
              {/* Pulse ring for detected anomalies */}
              {isDetected && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="8"
                  fill="none"
                  stroke={color}
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}
              
              {/* Anomaly dot */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r={isDetected ? 5 : 3}
                fill={color}
                filter="url(#warningGlow)"
                initial={{ opacity: 0 }}
                animate={{ 
                  opacity: isDetected ? 1 : 0.3,
                  scale: isDetected ? [1, 1.2, 1] : 1
                }}
                transition={{ 
                  duration: 0.5,
                  scale: { duration: 0.8, repeat: Infinity }
                }}
              />
            </g>
          );
        })}

        {/* Center point */}
        <circle cx="150" cy="150" r="4" fill="white" filter="url(#glow)" />
        <circle cx="150" cy="150" r="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

        {/* Normal status dots */}
        {[120, 220, 320].map((angle, i) => {
          const pos = getPosition(angle, 0.5, 120);
          return (
            <circle
              key={i}
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill="rgb(34, 197, 94)"
              opacity="0.6"
            />
          );
        })}
      </svg>

      {/* Status indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-red-500"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {detectedAnomalies.length} anomalies
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            3 normal
          </span>
        </div>
      </motion.div>

      {/* Health score */}
      <motion.div
        className="absolute top-4 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
          system health
        </div>
        <div className="text-2xl font-mono font-bold text-foreground">
          94.2%
        </div>
      </motion.div>
    </div>
  );
};
