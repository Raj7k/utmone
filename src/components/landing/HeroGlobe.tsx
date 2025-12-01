import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

interface Arc {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: [string, string];
}

export const HeroGlobe = () => {
  const globeEl = useRef<any>();
  const [arcs, setArcs] = useState<Arc[]>([]);

  useEffect(() => {
    // Generate random arcs simulating link clicks around the world
    const generateArcs = () => {
      const cities = [
        { lat: 40.7128, lng: -74.0060, name: 'New York' },
        { lat: 51.5074, lng: -0.1278, name: 'London' },
        { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
        { lat: -33.8688, lng: 151.2093, name: 'Sydney' },
        { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
        { lat: 48.8566, lng: 2.3522, name: 'Paris' },
        { lat: -23.5505, lng: -46.6333, name: 'São Paulo' },
        { lat: 19.0760, lng: 72.8777, name: 'Mumbai' },
        { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
        { lat: 52.5200, lng: 13.4050, name: 'Berlin' }
      ];

      const newArcs: Arc[] = [];
      for (let i = 0; i < 20; i++) {
        const start = cities[Math.floor(Math.random() * cities.length)];
        const end = cities[Math.floor(Math.random() * cities.length)];
        if (start !== end) {
          newArcs.push({
            startLat: start.lat,
            startLng: start.lng,
            endLat: end.lat,
            endLng: end.lng,
            color: ['#FFCC00', '#FF5500']
          });
        }
      }
      setArcs(newArcs);
    };

    generateArcs();

    // Regenerate arcs every 5 seconds for dynamic feel
    const interval = setInterval(generateArcs, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      // Auto-rotate
      globeEl.current.controls().autoRotate = true;
      globeEl.current.controls().autoRotateSpeed = 0.5;
      globeEl.current.controls().enableZoom = false;
    }
  }, []);

  return (
    <div className="absolute inset-0 w-full h-[600px] bg-black">
      <Globe
        ref={globeEl}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={arcs}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        arcsTransitionDuration={0}
        atmosphereColor="#5B21B6"
        atmosphereAltitude={0.25}
        width={typeof window !== 'undefined' ? window.innerWidth : 1920}
        height={600}
      />
    </div>
  );
};
