import { Search, Mail, MousePointer, Users } from "lucide-react";

export const JourneySankeyVisual = () => {
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  const sources = [
    { y: 12, icon: Search, color: "#F59E0B", label: "Paid" },
    { y: 24, icon: Users, color: "#22C55E", label: "Organic" },
    { y: 36, icon: Mail, color: "#8B5CF6", label: "Email" },
    { y: 48, icon: MousePointer, color: "#EC4899", label: "Referral" },
  ];

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    path: i % 4,
    delay: i * 0.25,
  }));

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="journeyGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="journeyRevenue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#22C55E" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="journeyDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>

        {/* Define paths for particles */}
        {sources.map((source, i) => (
          <path
            key={`path-${i}`}
            id={`journeyPath${i}`}
            d={`M 30 ${source.y + 2} Q 70 ${source.y + 2}, 98 30`}
            fill="none"
          />
        ))}
      </defs>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#journeyDotGrid)" opacity="0.3" />

      <style>{`
        @keyframes journeyCircleScale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes journeyPathDraw {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes journeyPulse {
          0%, 100% { r: 8; opacity: 0.5; }
          50% { r: 11; opacity: 0.1; }
        }
        @keyframes journeyFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .journey-source-circle {
          animation: journeyCircleScale 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: center;
        }
        .journey-fiber-path {
          stroke-dasharray: 100;
          animation: journeyPathDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .journey-dest-circle {
          animation: journeyCircleScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.8s forwards;
          transform: scale(0);
        }
        .journey-pulse-ring {
          animation: journeyPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .journey-text-fade {
          animation: journeyFadeIn 0.3s ease-out 1s forwards;
          opacity: 0;
        }
      `}</style>

      {/* Source icons + labels OUTSIDE, small hollow circles */}
      {sources.map((source, i) => (
        <g key={i}>
          {/* Icon outside */}
          <foreignObject x="2" y={source.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-1.5 h-1.5 text-zinc-400" />
            </div>
          </foreignObject>
          
          {/* Label text */}
          <text
            x="9"
            y={source.y + 3}
            fill="rgba(161,161,170,0.8)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {source.label}
          </text>
          
          {/* Small hollow circle connector */}
          <circle
            cx="28"
            cy={source.y + 2}
            r="2"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="0.4"
            className="journey-source-circle"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        </g>
      ))}

      {/* Super thin grey fiber lines */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 2;
          return (
            <path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 30 ${baseY + offset * 0.6} Q 70 ${baseY + offset * 0.3}, 98 30`}
              fill="none"
              stroke={isCenter ? source.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#journeyGlow)" : undefined}
              className="journey-fiber-path"
              style={{ animationDelay: `${0.3 + srcIdx * 0.1}s` }}
            />
          );
        })
      ))}

      {/* Particles using native SVG animateMotion */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <circle
            key={particle.id}
            r="1"
            fill={source.color}
            filter="url(#journeyGlow)"
          >
            <animateMotion
              dur="1s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            >
              <mpath href={`#journeyPath${particle.path}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="1s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
            />
          </circle>
        );
      })}

      {/* Destination node */}
      <circle
        cx="106"
        cy="30"
        r="8"
        fill="url(#journeyRevenue)"
        filter="url(#journeyGlow)"
        className="journey-dest-circle"
      />
      
      <circle
        cx="106"
        cy="30"
        r="8"
        fill="none"
        stroke="#22C55E"
        strokeWidth="0.4"
        className="journey-pulse-ring"
      />
      
      <text
        x="106"
        y="32"
        fill="white"
        fontSize="4"
        textAnchor="middle"
        fontFamily="'SF Mono', ui-monospace"
        fontWeight="bold"
        className="journey-text-fade"
      >
        $
      </text>
    </svg>
  );
};
