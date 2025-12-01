import { useEffect, useRef } from "react";
import Globe from "react-globe.gl";

interface HeroGlobeProps {
  className?: string;
}

export const HeroGlobe = ({ className = "" }: HeroGlobeProps) => {
  const globeEl = useRef<any>();

  useEffect(() => {
    if (!globeEl.current) return;

    // Auto-rotate
    globeEl.current.controls().autoRotate = true;
    globeEl.current.controls().autoRotateSpeed = 0.5;

    // Generate random arcs between major cities
    const cities = [
      { lat: 40.7128, lng: -74.006, name: "New York" },
      { lat: 51.5074, lng: -0.1278, name: "London" },
      { lat: 35.6762, lng: 139.6503, name: "Tokyo" },
      { lat: -33.8688, lng: 151.2093, name: "Sydney" },
      { lat: 37.7749, lng: -122.4194, name: "San Francisco" },
      { lat: 1.3521, lng: 103.8198, name: "Singapore" },
      { lat: 52.52, lng: 13.405, name: "Berlin" },
      { lat: -23.5505, lng: -46.6333, name: "São Paulo" },
    ];

    const arcs = [];
    for (let i = 0; i < 15; i++) {
      const start = cities[Math.floor(Math.random() * cities.length)];
      const end = cities[Math.floor(Math.random() * cities.length)];
      if (start !== end) {
        arcs.push({
          startLat: start.lat,
          startLng: start.lng,
          endLat: end.lat,
          endLng: end.lng,
        });
      }
    }

    globeEl.current.arcsData(arcs);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={[]}
        arcColor={() => ["#FFCC00", "#FF5500"]}
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        atmosphereColor="#4A90E2"
        atmosphereAltitude={0.25}
        width={800}
        height={600}
      />
    </div>
  );
};
