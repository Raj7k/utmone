import { useEffect, useState } from "react";

// CSS-only EKG-style anomaly detection with spike and alert
export const AnomalyPulseMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const ekgPath = "M5,35 L15,35 L20,33 L25,37 L30,34 L35,36 L40,35 L48,35 L52,10 L56,45 L60,35 L65,35 L75,33 L85,36 L95,35 L115,35";

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="anomalyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="ekgGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
          <stop offset="40%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.8)" />
          <stop offset="60%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.2)" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes ekgDraw {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes spikeAppear {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes alertRing {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes alertRing2 {
          0% { transform: scale(0.5); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      {/* Grid lines for context */}
      {[20, 35, 50].map((y) => (
        <line
          key={y}
          x1="5"
          y1={y}
          x2="115"
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
          style={{
            opacity: isVisible ? 1 : 0,
            transition: 'opacity 0.3s 0.1s',
          }}
        />
      ))}

      {/* EKG line with animation */}
      <path
        d={ekgPath}
        fill="none"
        stroke="url(#ekgGradient)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="200"
        style={{
          strokeDashoffset: isVisible ? 0 : 200,
          transition: 'stroke-dashoffset 1.5s ease-in-out',
        }}
      />

      {/* Anomaly spike highlight */}
      <circle
        cx="52"
        cy="10"
        r="4"
        fill="rgba(255,255,255,0.8)"
        filter="url(#anomalyGlow)"
        style={{
          transformOrigin: '52px 10px',
          animation: isVisible ? 'spikeAppear 0.4s 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          opacity: isVisible ? undefined : 0,
          transform: isVisible ? undefined : 'scale(0)',
        }}
      />

      {/* Alert ring pulsing */}
      {isVisible && (
        <>
          <circle
            cx="52"
            cy="10"
            r="8"
            fill="none"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1"
            style={{
              transformOrigin: '52px 10px',
              animation: 'alertRing 1.5s 1.2s ease-out infinite',
            }}
          />
          <circle
            cx="52"
            cy="10"
            r="12"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            style={{
              transformOrigin: '52px 10px',
              animation: 'alertRing2 2s 1.5s ease-out infinite',
            }}
          />
        </>
      )}

      {/* Alert label */}
      <g
        style={{
          animation: isVisible ? 'slideIn 0.3s 1.3s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          opacity: isVisible ? undefined : 0,
        }}
      >
        <rect
          x="65"
          y="4"
          width="32"
          height="12"
          rx="6"
          fill="rgba(255,255,255,0.15)"
        />
        <text
          x="81"
          y="12"
          fill="white"
          fontSize="6"
          textAnchor="middle"
          fontFamily="ui-monospace"
        >
          +340%
        </text>
      </g>
    </svg>
  );
};
