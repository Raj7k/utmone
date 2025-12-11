import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * PredictiveWaveform - Animated line chart showing historical data + AI forecast
 * Visual representation of predictive analytics capability
 */
export const PredictiveWaveform = () => {
  const [particles, setParticles] = useState<{ id: number; progress: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => {
        const updated = prev
          .map(p => ({ ...p, progress: p.progress + 0.02 }))
          .filter(p => p.progress < 1);
        
        if (Math.random() > 0.7) {
          updated.push({ id: Date.now(), progress: 0 });
        }
        return updated;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Historical data points (solid line)
  const historicalPath = "M 40 180 Q 80 160, 120 170 T 200 150 T 280 140 T 360 120 T 440 100";
  
  // Forecast zone (dashed line with confidence interval)
  const forecastPath = "M 440 100 Q 480 85, 520 75 T 600 60";
  const confidenceUpper = "M 440 100 Q 480 70, 520 55 T 600 40";
  const confidenceLower = "M 440 100 Q 480 100, 520 95 T 600 80";

  const getPointOnPath = (progress: number) => {
    const totalLength = 560;
    const x = 40 + progress * totalLength;
    const y = 180 - progress * 120 + Math.sin(progress * Math.PI * 4) * 15;
    return { x: Math.min(x, 600), y: Math.max(y, 60) };
  };

  return (
    <div className="relative w-full h-full min-h-[300px] flex items-center justify-center">
      <svg viewBox="0 0 640 240" className="w-full h-full max-w-[500px]">
        {/* Grid lines */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="70%" stopColor="rgba(255,255,255,0.8)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.4)" />
          </linearGradient>
          <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
          </linearGradient>
        </defs>

        {/* Subtle grid */}
        {[60, 100, 140, 180].map((y) => (
          <line
            key={y}
            x1="40"
            y1={y}
            x2="600"
            y2={y}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}

        {/* Confidence interval fill */}
        <motion.path
          d={`${confidenceUpper} L 600 80 ${confidenceLower.replace('M 440 100', 'L 440 100')} Z`}
          fill="url(#confidenceGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        />

        {/* Historical line (solid) */}
        <motion.path
          d={historicalPath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {/* Forecast line (dashed) */}
        <motion.path
          d={forecastPath}
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          strokeDasharray="8 4"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8, ease: "easeOut" }}
        />

        {/* Divider line between historical and forecast */}
        <motion.line
          x1="440"
          y1="60"
          x2="440"
          y2="200"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="1"
          strokeDasharray="4 4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        />

        {/* Labels */}
        <motion.text
          x="240"
          y="220"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="monospace"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          HISTORICAL
        </motion.text>
        <motion.text
          x="520"
          y="220"
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="monospace"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          PREDICTED
        </motion.text>

        {/* Animated particles */}
        {particles.map((particle) => {
          const pos = getPointOnPath(particle.progress);
          return (
            <motion.circle
              key={particle.id}
              cx={pos.x}
              cy={pos.y}
              r="3"
              fill="white"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
              transition={{ duration: 0.5 }}
              style={{
                filter: "drop-shadow(0 0 6px rgba(255,255,255,0.8))",
              }}
            />
          );
        })}

        {/* Current point indicator */}
        <motion.circle
          cx="440"
          cy="100"
          r="6"
          fill="white"
          initial={{ scale: 0 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ delay: 1, duration: 1.5, repeat: Infinity }}
          style={{
            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.6))",
          }}
        />

        {/* Forecast endpoint */}
        <motion.circle
          cx="600"
          cy="60"
          r="4"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        />

        {/* Value labels */}
        <motion.text
          x="460"
          y="85"
          fill="white"
          fontSize="12"
          fontFamily="monospace"
          fontWeight="bold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6 }}
        >
          +34%
        </motion.text>
      </svg>

      {/* Legend */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-white/60" />
          <span>actual</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0.5 bg-white/40 border-t border-dashed border-white/40" />
          <span>forecast</span>
        </div>
      </motion.div>
    </div>
  );
};
