import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Arc {
  id: number;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
}

export const HeroGlobe = () => {
  const [rotation, setRotation] = useState(0);
  const [arcs, setArcs] = useState<Arc[]>([]);

  // Slow globe rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Generate random arcs
  useEffect(() => {
    const cities = [
      { lat: 40.7, lng: -74 },   // NYC
      { lat: 51.5, lng: -0.1 },  // London
      { lat: 35.7, lng: 139.7 }, // Tokyo
      { lat: -33.9, lng: 18.4 }, // Cape Town
      { lat: 22.3, lng: 114.2 }, // Hong Kong
      { lat: 48.9, lng: 2.3 },   // Paris
      { lat: 1.3, lng: 103.8 },  // Singapore
    ];

    const generateArcs = () => {
      const newArcs: Arc[] = [];
      for (let i = 0; i < 4; i++) {
        const start = cities[Math.floor(Math.random() * cities.length)];
        let end = cities[Math.floor(Math.random() * cities.length)];
        while (end === start) {
          end = cities[Math.floor(Math.random() * cities.length)];
        }
        newArcs.push({
          id: i,
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
        });
      }
      setArcs(newArcs);
    };

    generateArcs();
    const interval = setInterval(generateArcs, 4000);
    return () => clearInterval(interval);
  }, []);

  // Convert lat/lng to 2D position on globe
  const latLngTo2D = (lat: number, lng: number, r: number) => {
    const adjustedLng = lng + rotation;
    const x = r * Math.cos(lat * Math.PI / 180) * Math.sin(adjustedLng * Math.PI / 180);
    const y = -r * Math.sin(lat * Math.PI / 180);
    const z = r * Math.cos(lat * Math.PI / 180) * Math.cos(adjustedLng * Math.PI / 180);
    return { x: 100 + x, y: 100 + y, visible: z > 0 };
  };

  return (
    <div className="relative w-[200px] h-[200px]">
      <svg className="w-full h-full" viewBox="0 0 200 200">
        {/* Globe outline */}
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="1"
        />

        {/* Latitude lines */}
        {[-60, -30, 0, 30, 60].map(lat => {
          const r = 80 * Math.cos(lat * Math.PI / 180);
          const y = 100 - 80 * Math.sin(lat * Math.PI / 180);
          return (
            <ellipse
              key={lat}
              cx="100"
              cy={y}
              rx={r}
              ry={r * 0.3}
              fill="none"
              stroke="rgba(255, 255, 255, 0.05)"
              strokeWidth="0.5"
            />
          );
        })}

        {/* Longitude lines */}
        {[0, 30, 60, 90, 120, 150].map(lng => (
          <ellipse
            key={lng}
            cx="100"
            cy="100"
            rx={80 * Math.sin((lng + rotation) * Math.PI / 180)}
            ry="80"
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="0.5"
          />
        ))}

        {/* Arcs connecting cities */}
        {arcs.map(arc => {
          const start = latLngTo2D(arc.startLat, arc.startLng, 80);
          const end = latLngTo2D(arc.endLat, arc.endLng, 80);
          
          if (!start.visible && !end.visible) return null;
          
          const midX = (start.x + end.x) / 2;
          const midY = (start.y + end.y) / 2 - 30;
          
          return (
            <g key={arc.id}>
              <motion.path
                d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                fill="none"
                stroke="rgba(255, 255, 255, 0.4)"
                strokeWidth="1"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
              />
              {start.visible && (
                <motion.circle
                  cx={start.x}
                  cy={start.y}
                  r="2"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ filter: 'drop-shadow(0 0 4px white)' }}
                />
              )}
              {end.visible && (
                <motion.circle
                  cx={end.x}
                  cy={end.y}
                  r="2"
                  fill="white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.5 }}
                  style={{ filter: 'drop-shadow(0 0 4px white)' }}
                />
              )}
            </g>
          );
        })}

        {/* Glow effect */}
        <circle
          cx="100"
          cy="100"
          r="82"
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth="4"
          style={{ filter: 'blur(4px)' }}
        />
      </svg>

      {/* Label */}
      <motion.div
        className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
          global tracking
        </div>
      </motion.div>
    </div>
  );
};
