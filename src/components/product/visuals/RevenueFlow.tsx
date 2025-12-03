import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Photon {
  id: number;
  pathIndex: number;
  progress: number;
}

export const RevenueFlow = () => {
  const [photons, setPhotons] = useState<Photon[]>([]);
  const [pulseRevenue, setPulseRevenue] = useState(false);

  // Source labels
  const sources = [
    { label: "PAID ADS", y: 40 },
    { label: "ORGANIC", y: 90 },
    { label: "EMAIL", y: 140 },
    { label: "REFERRAL", y: 190 },
  ];

  // Bezier paths for each source
  const paths = [
    "M 80 40 C 160 40, 200 110, 320 110",
    "M 80 90 C 160 90, 200 110, 320 110",
    "M 80 140 C 160 140, 200 110, 320 110",
    "M 80 190 C 160 190, 200 110, 320 110",
  ];

  // Spawn photons at random intervals
  useEffect(() => {
    let id = 0;
    const interval = setInterval(() => {
      const pathIndex = Math.floor(Math.random() * 4);
      setPhotons(prev => [...prev, { id: id++, pathIndex, progress: 0 }]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Animate photons
  useEffect(() => {
    const animation = setInterval(() => {
      setPhotons(prev => {
        const updated = prev.map(p => ({ ...p, progress: p.progress + 0.02 }));
        const arrived = updated.filter(p => p.progress >= 1);
        if (arrived.length > 0) {
          setPulseRevenue(true);
          setTimeout(() => setPulseRevenue(false), 200);
        }
        return updated.filter(p => p.progress < 1);
      });
    }, 16);

    return () => clearInterval(animation);
  }, []);

  // Get point on bezier path
  const getPointOnPath = (pathIndex: number, t: number) => {
    const sourceY = sources[pathIndex].y;
    const targetY = 110;
    
    const x = 80 + t * 240;
    const y = sourceY + (targetY - sourceY) * Math.sin(t * Math.PI / 2);
    
    return { x, y };
  };

  return (
    <div className="relative w-[400px] h-[220px]">
      <svg className="w-full h-full" viewBox="0 0 400 220">
        {/* Thin wire paths */}
        {paths.map((d, i) => (
          <motion.path
            key={i}
            d={d}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: i * 0.1 }}
          />
        ))}

        {/* Source nodes - small filled circles */}
        {sources.map((source, i) => (
          <motion.circle
            key={i}
            cx="80"
            cy={source.y}
            r="3"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.1, type: "spring" }}
          />
        ))}

        {/* Revenue destination - hollow ring */}
        <motion.circle
          cx="320"
          cy="110"
          r="20"
          fill="none"
          stroke="white"
          strokeWidth="1"
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            filter: pulseRevenue ? 'drop-shadow(0 0 12px white)' : 'drop-shadow(0 0 4px rgba(255,255,255,0.3))'
          }}
          transition={{ delay: 0.5, type: "spring" }}
        />

        {/* Photon particles */}
        {photons.map(photon => {
          const pos = getPointOnPath(photon.pathIndex, photon.progress);
          const tailPos = getPointOnPath(photon.pathIndex, Math.max(0, photon.progress - 0.1));
          
          return (
            <g key={photon.id}>
              {/* Tail gradient */}
              <motion.line
                x1={tailPos.x}
                y1={tailPos.y}
                x2={pos.x}
                y2={pos.y}
                stroke="url(#photonGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Head */}
              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="2"
                fill="white"
                style={{ filter: 'drop-shadow(0 0 4px white)' }}
              />
            </g>
          );
        })}

        {/* Gradient definition for photon tail */}
        <defs>
          <linearGradient id="photonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
          </linearGradient>
        </defs>
      </svg>

      {/* Source labels */}
      {sources.map((source, i) => (
        <motion.div
          key={i}
          className="absolute left-0 text-[10px] font-mono uppercase tracking-wider"
          style={{ top: source.y - 6, color: 'rgba(255,255,255,0.5)' }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 + 0.3 }}
        >
          {source.label}
        </motion.div>
      ))}

      {/* Revenue label */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 text-center"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
      >
        <div 
          className="text-2xl font-bold font-mono"
          style={{
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          $1.2M
        </div>
        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
          revenue
        </div>
      </motion.div>
    </div>
  );
};
