import { useEffect, useState } from "react";

// CSS-only customer journey with golden path highlight
export const JourneyFlowMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const pathNodes = [
    { x: 15, y: 30 },
    { x: 40, y: 18 },
    { x: 65, y: 25 },
    { x: 90, y: 35 },
    { x: 110, y: 30 },
  ];

  const altPathNodes = [
    { x: 15, y: 30 },
    { x: 40, y: 42 },
    { x: 65, y: 38 },
    { x: 90, y: 45 },
  ];

  const goldenPathD = `M ${pathNodes.map(n => `${n.x},${n.y}`).join(' L ')}`;
  const altPathD = `M ${altPathNodes.map(n => `${n.x},${n.y}`).join(' L ')}`;

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="goldenPath" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.3)" />
        </linearGradient>
        <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style>{`
        @keyframes pathDraw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes nodeScale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes particleMove {
          0% { offset-distance: 0%; }
          100% { offset-distance: 100%; }
        }
        @keyframes conversionPulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.3); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Alternative (dimmed) path */}
      <path
        d={altPathD}
        fill="none"
        stroke="rgba(255,255,255,0.15)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        style={{
          strokeDashoffset: isVisible ? 0 : 200,
          transition: 'stroke-dashoffset 1.2s 0.2s ease-out',
        }}
      />

      {/* Golden (primary) path */}
      <path
        d={goldenPathD}
        fill="none"
        stroke="url(#goldenPath)"
        strokeWidth="2"
        filter="url(#pathGlow)"
        strokeDasharray="200"
        style={{
          strokeDashoffset: isVisible ? 0 : 200,
          transition: 'stroke-dashoffset 1s ease-in-out',
        }}
      />

      {/* Path nodes with staggered appearance */}
      {pathNodes.map((node, i) => (
        <circle
          key={i}
          cx={node.x}
          cy={node.y}
          r={i === pathNodes.length - 1 ? 5 : 3}
          fill={i === pathNodes.length - 1 ? "white" : "rgba(255,255,255,0.6)"}
          style={{
            transformOrigin: `${node.x}px ${node.y}px`,
            animation: isVisible ? `nodeScale 0.3s ${0.3 + i * 0.15}s cubic-bezier(0.4, 0, 0.2, 1) forwards` : 'none',
            transform: isVisible ? undefined : 'scale(0)',
          }}
        />
      ))}

      {/* Traveling particle along golden path */}
      {isVisible && (
        <circle
          r="2.5"
          fill="white"
          filter="url(#pathGlow)"
          style={{
            offsetPath: `path("${goldenPathD}")`,
            animation: 'particleMove 2.5s 1s linear infinite',
          }}
        />
      )}

      {/* Conversion indicator at end */}
      {isVisible && (
        <circle
          cx="110"
          cy="30"
          r="8"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          style={{
            transformOrigin: '110px 30px',
            animation: 'conversionPulse 2s 1.5s ease-out infinite',
          }}
        />
      )}

      {/* "Golden Path" label */}
      <text
        x="60"
        y="8"
        fill="rgba(255,255,255,0.4)"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s 1.2s',
        }}
      >
        golden path
      </text>
    </svg>
  );
};
