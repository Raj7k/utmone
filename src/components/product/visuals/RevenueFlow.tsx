/**
 * RevenueFlow - Pure SVG/CSS animated revenue attribution visualization
 * Uses SVG <animateMotion> and CSS animations - no JS animation loops
 */
export const RevenueFlow = () => {
  // Source labels and positions
  const sources = [
    { label: "PAID ADS", y: 40 },
    { label: "ORGANIC", y: 90 },
    { label: "EMAIL", y: 140 },
    { label: "REFERRAL", y: 190 },
  ];

  // Bezier paths for each source flowing to center
  const paths = [
    "M 80 40 C 160 40, 200 110, 320 110",
    "M 80 90 C 160 90, 200 110, 320 110",
    "M 80 140 C 160 140, 200 110, 320 110",
    "M 80 190 C 160 190, 200 110, 320 110",
  ];

  return (
    <div className="relative w-[400px] h-[220px]">
      <svg className="w-full h-full" viewBox="0 0 400 220">
        <defs>
          {/* Gradient for photon tail effect */}
          <linearGradient id="photonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(0 0% 100% / 0)" />
            <stop offset="100%" stopColor="hsl(0 0% 100% / 0.9)" />
          </linearGradient>
          
          {/* Glow filter for destination */}
          <filter id="revenueGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          
          {/* Particle glow */}
          <filter id="particleGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Wire paths - draw animation via stroke-dasharray */}
        {paths.map((d, i) => (
          <path
            key={`path-${i}`}
            d={d}
            fill="none"
            className="stroke-white/10"
            strokeWidth="1"
            strokeDasharray="300"
            strokeDashoffset="300"
            style={{
              animation: `drawPath 0.8s ease-out ${i * 0.08}s forwards`,
            }}
          />
        ))}

        {/* Source nodes - scale-in animation */}
        {sources.map((source, i) => (
          <circle
            key={`source-${i}`}
            cx="80"
            cy={source.y}
            r="3"
            className="fill-white"
            style={{
              transform: 'scale(0)',
              transformOrigin: '80px ' + source.y + 'px',
              animation: `scaleIn 0.3s ease-out ${i * 0.08}s forwards`,
            }}
          />
        ))}

        {/* Revenue destination ring */}
        <circle
          cx="320"
          cy="110"
          r="20"
          fill="none"
          className="stroke-white"
          strokeWidth="1"
          filter="url(#revenueGlow)"
          style={{
            transform: 'scale(0)',
            transformOrigin: '320px 110px',
            animation: 'scaleIn 0.4s ease-out 0.4s forwards, pulseRing 2s ease-in-out 1s infinite',
          }}
        />

        {/* Animated photon particles using animateMotion */}
        {paths.map((d, pathIndex) => (
          // Multiple particles per path with staggered timing
          [0, 1, 2].map((particleIndex) => (
            <g key={`photon-${pathIndex}-${particleIndex}`}>
              {/* Particle head */}
              <circle r="2.5" className="fill-white" filter="url(#particleGlow)">
                <animateMotion
                  path={d}
                  dur="2s"
                  begin={`${pathIndex * 0.3 + particleIndex * 0.7}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>
              {/* Particle tail (offset slightly behind) */}
              <circle r="1.5" className="fill-white/50">
                <animateMotion
                  path={d}
                  dur="2s"
                  begin={`${pathIndex * 0.3 + particleIndex * 0.7 - 0.05}s`}
                  repeatCount="indefinite"
                  calcMode="spline"
                  keySplines="0.4 0 0.2 1"
                />
              </circle>
            </g>
          ))
        ))}
      </svg>

      {/* Source labels - CSS fade in */}
      {sources.map((source, i) => (
        <div
          key={`label-${i}`}
          className="absolute left-0 text-[10px] font-mono uppercase tracking-wider text-white/50 opacity-0"
          style={{ 
            top: source.y - 6,
            animation: `fadeSlideIn 0.3s ease-out ${i * 0.08 + 0.2}s forwards`,
          }}
        >
          {source.label}
        </div>
      ))}

      {/* Revenue label */}
      <div 
        className="absolute right-0 top-1/2 -translate-y-1/2 text-center opacity-0"
        style={{ animation: 'fadeSlideInRight 0.4s ease-out 0.6s forwards' }}
      >
        <div className="text-2xl font-bold font-mono hero-gradient">
          $1.2M
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/40">
          revenue
        </div>
      </div>

      {/* Inline keyframes for component-specific animations */}
      <style>{`
        @keyframes drawPath {
          to { stroke-dashoffset: 0; }
        }
        @keyframes scaleIn {
          to { transform: scale(1); }
        }
        @keyframes pulseRing {
          0%, 100% { filter: url(#revenueGlow) drop-shadow(0 0 4px rgba(255,255,255,0.3)); }
          50% { filter: url(#revenueGlow) drop-shadow(0 0 12px rgba(255,255,255,0.6)); }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeSlideInRight {
          from { opacity: 0; transform: translate(20px, -50%); }
          to { opacity: 1; transform: translate(0, -50%); }
        }
      `}</style>
    </div>
  );
};
