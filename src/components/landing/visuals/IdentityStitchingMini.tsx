import { useEffect, useState } from "react";

// CSS-only identity stitching: 3 devices → 1 unified identity
export const IdentityStitchingMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const devices = [
    { x: 20, y: 15, icon: "M16 8v8M12 12h8", label: "📱" },
    { x: 20, y: 30, icon: "M8 20h16v12H8zM12 32v4", label: "💻" },
    { x: 20, y: 45, icon: "M10 35h12v8H10z", label: "📧" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="stitchGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes lineDraw {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes particleTravel {
          0% { opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes scaleSpring {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes ringPulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {devices.map((device, i) => (
        <g key={i}>
          <circle
            cx={device.x}
            cy={device.y}
            r="6"
            fill="rgba(255,255,255,0.1)"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="2 2"
            style={{
              transformOrigin: `${device.x}px ${device.y}px`,
              animation: isVisible ? `scaleIn 0.3s ${i * 0.15}s cubic-bezier(0.4, 0, 0.2, 1) forwards` : 'none',
              opacity: isVisible ? undefined : 0,
              transform: isVisible ? undefined : 'scale(0)',
            }}
          />
          
          <line
            x1={device.x + 6}
            y1={device.y}
            x2="90"
            y2="30"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1"
            strokeDasharray="3 3"
            style={{
              strokeDashoffset: isVisible ? 0 : 100,
              transition: `stroke-dashoffset 0.5s ${0.4 + i * 0.15}s ease-out`,
            }}
          />

          {isVisible && (
            <circle
              r="2"
              fill="white"
              filter="url(#stitchGlow)"
              style={{
                offsetPath: `path("M ${device.x + 6} ${device.y} L 90 30")`,
                animation: `particleTravel 1.5s ${0.8 + i * 0.3}s ease-in-out infinite`,
                offsetDistance: '100%',
              }}
            />
          )}
        </g>
      ))}

      <circle
        cx="90"
        cy="30"
        r="10"
        fill="rgba(255,255,255,0.05)"
        stroke="white"
        strokeWidth="1.5"
        style={{
          transformOrigin: '90px 30px',
          animation: isVisible ? 'scaleSpring 0.4s 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          transform: isVisible ? undefined : 'scale(0)',
        }}
      />
      
      <circle
        cx="90"
        cy="30"
        r="3"
        fill="white"
        style={{
          transformOrigin: '90px 30px',
          animation: isVisible ? 'scaleSpring 0.4s 1.1s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          transform: isVisible ? undefined : 'scale(0)',
        }}
      />

      {isVisible && (
        <circle
          cx="90"
          cy="30"
          r="14"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1"
          style={{
            transformOrigin: '90px 30px',
            animation: 'ringPulse 1.5s 1.3s ease-out infinite',
          }}
        />
      )}

      <text
        x="90"
        y="48"
        fill="rgba(255,255,255,0.4)"
        fontSize="6"
        textAnchor="middle"
        fontFamily="ui-monospace"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s 1.2s',
        }}
      >
        1 identity
      </text>
    </svg>
  );
};
