import { useEffect, useState } from "react";

// CSS-only traffic forecasting with historical + prediction + confidence interval
export const ForecastMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const historicalPath = "M10,45 L25,40 L40,42 L55,35 L70,30";
  const predictionPath = "M70,30 L85,25 L100,18 L110,12";
  
  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.5)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.8)" />
        </linearGradient>
        <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
        </linearGradient>
      </defs>

      <style>{`
        @keyframes pathDraw {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes particleMove {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0.5; }
        }
      `}</style>

      {/* Grid lines */}
      {[20, 35, 50].map((y) => (
        <line
          key={y}
          x1="10"
          y1={y}
          x2="110"
          y2={y}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="0.5"
        />
      ))}

      {/* Confidence interval band (prediction zone) */}
      <path
        d="M70,35 Q85,33 100,28 L110,22 L110,5 L100,10 Q85,18 70,25 Z"
        fill="url(#confidenceGradient)"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.5s 1s',
        }}
      />

      {/* Historical data line (solid) */}
      <path
        d={historicalPath}
        fill="none"
        stroke="url(#forecastGradient)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="100"
        style={{
          strokeDashoffset: isVisible ? 0 : 100,
          transition: 'stroke-dashoffset 0.8s ease-out',
        }}
      />

      {/* Prediction line (dashed) */}
      <path
        d={predictionPath}
        fill="none"
        stroke="rgba(255,255,255,0.6)"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.6s 0.8s ease-out',
        }}
      />

      {/* Transition point marker */}
      <circle
        cx="70"
        cy="30"
        r="4"
        fill="white"
        style={{
          transformOrigin: '70px 30px',
          animation: isVisible ? 'scaleIn 0.3s 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          transform: isVisible ? undefined : 'scale(0)',
        }}
      />

      {/* Historical/Prediction label line */}
      <line
        x1="70"
        y1="10"
        x2="70"
        y2="55"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        strokeDasharray="2 2"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s 0.6s',
        }}
      />

      {/* Labels */}
      <text
        x="40"
        y="55"
        fill="rgba(255,255,255,0.3)"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s 0.9s',
        }}
      >
        historical
      </text>
      <text
        x="90"
        y="55"
        fill="rgba(255,255,255,0.3)"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s 1.1s',
        }}
      >
        forecast
      </text>

      {/* Animated traveling dot on prediction */}
      {isVisible && (
        <circle
          r="2"
          fill="white"
          style={{
            offsetPath: `path("${predictionPath}")`,
            animation: 'particleMove 2s 1.3s linear infinite',
          }}
        />
      )}
    </svg>
  );
};
