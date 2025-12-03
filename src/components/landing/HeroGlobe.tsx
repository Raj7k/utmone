import { useEffect, useRef } from 'react';
import Globe from 'react-globe.gl';

// Major city coordinates for data arcs
const cities = [
  { name: 'New York', lat: 40.7128, lng: -74.006 },
  { name: 'London', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  { name: 'San Francisco', lat: 37.7749, lng: -122.4194 },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
  { name: 'Paris', lat: 48.8566, lng: 2.3522 },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777 },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333 },
  { name: 'Berlin', lat: 52.52, lng: 13.405 },
  { name: 'Seoul', lat: 37.5665, lng: 126.978 },
];

// Generate random arcs between cities
const generateArcs = () => {
  const arcs = [];
  for (let i = 0; i < 20; i++) {
    const startCity = cities[Math.floor(Math.random() * cities.length)];
    let endCity = cities[Math.floor(Math.random() * cities.length)];
    while (endCity.name === startCity.name) {
      endCity = cities[Math.floor(Math.random() * cities.length)];
    }
    arcs.push({
      startLat: startCity.lat,
      startLng: startCity.lng,
      endLat: endCity.lat,
      endLng: endCity.lng,
      color: [`rgba(255, 85, 0, 0.8)`, `rgba(255, 214, 0, 0.4)`],
    });
  }
  return arcs;
};

export const HeroGlobe = () => {
  const globeRef = useRef<any>(null);
  const arcsData = useRef(generateArcs());

  useEffect(() => {
    if (globeRef.current) {
      // Set initial position
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 2.5 });
      
      // Auto-rotate controls
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = false;
        controls.enablePan = false;
      }
    }
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Glow effect behind globe */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 80, 0, 0.15) 0%, transparent 50%)',
        }}
      />
      
      <Globe
        ref={globeRef}
        width={600}
        height={600}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        arcsData={arcsData.current}
        arcColor="color"
        arcDashLength={0.4}
        arcDashGap={0.2}
        arcDashAnimateTime={2000}
        arcStroke={0.5}
        atmosphereColor="rgba(255, 100, 0, 0.3)"
        atmosphereAltitude={0.25}
        enablePointerInteraction={false}
      />
    </div>
  );
};
