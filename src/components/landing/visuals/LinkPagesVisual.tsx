import { Instagram, Twitter, Youtube, LinkIcon } from "lucide-react";

export const LinkPagesVisual = () => {
  const fiberOffsets = [-0.8, -0.4, 0, 0.4, 0.8];

  const destinations = [
    { y: 12, icon: Instagram, color: "#E1306C", label: "Instagram" },
    { y: 24, icon: Twitter, color: "#1DA1F2", label: "Twitter" },
    { y: 36, icon: Youtube, color: "#FF0000", label: "YouTube" },
    { y: 48, icon: LinkIcon, color: "#F97316", label: "Website" },
  ];

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    path: i % 4,
    delay: i * 0.2,
  }));

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="lpGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="lpPortal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="lpDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>

        {/* Define paths for particles */}
        {destinations.map((dest, i) => (
          <path
            key={`path-${i}`}
            id={`lpPath${i}`}
            d={`M 28 30 Q 55 ${(30 + dest.y + 2) / 2}, 82 ${dest.y + 2}`}
            fill="none"
          />
        ))}
      </defs>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#lpDotGrid)" opacity="0.3" />

      <style>{`
        @keyframes lpCircleScale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes lpPathDraw {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes lpRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes lpPulse {
          0%, 100% { r: 5; opacity: 0.5; }
          50% { r: 7; opacity: 0.1; }
        }
        @keyframes lpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lp-rotating-ring {
          transform-origin: 20px 30px;
          animation: lpRotate 12s linear infinite;
        }
        .lp-portal-circle {
          animation: lpCircleScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
          transform: scale(0);
          transform-origin: 20px 30px;
        }
        .lp-pulse-ring {
          animation: lpPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .lp-text-fade {
          animation: lpFadeIn 0.3s ease-out 0.5s forwards;
          opacity: 0;
        }
        .lp-fiber-path {
          stroke-dasharray: 100;
          animation: lpPathDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .lp-dest-circle {
          animation: lpCircleScale 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform: scale(0);
        }
      `}</style>

      {/* Central link portal with rotating ring */}
      <circle
        cx="20"
        cy="30"
        r="8"
        fill="none"
        stroke="#F97316"
        strokeWidth="0.4"
        strokeDasharray="2,3"
        className="lp-rotating-ring"
      />
      
      <circle
        cx="20"
        cy="30"
        r="5"
        fill="url(#lpPortal)"
        filter="url(#lpGlow)"
        className="lp-portal-circle"
      />
      
      <circle
        cx="20"
        cy="30"
        r="5"
        fill="none"
        stroke="#F97316"
        strokeWidth="0.4"
        className="lp-pulse-ring"
      />
      
      <text
        x="20"
        y="32"
        fill="white"
        fontSize="4"
        textAnchor="middle"
        fontFamily="'SF Mono', ui-monospace"
        fontWeight="bold"
        className="lp-text-fade"
      >
        1
      </text>

      {/* Super thin grey fiber lines to destinations */}
      {destinations.map((dest, destIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const destY = dest.y + 2;
          return (
            <path
              key={`fiber-${destIdx}-${strandIdx}`}
              d={`M 28 ${30 + offset * 2} Q 55 ${(30 + destY) / 2 + offset}, 82 ${destY + offset * 0.5}`}
              fill="none"
              stroke={isCenter ? dest.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 0.8 : 0.25}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#lpGlow)" : undefined}
              className="lp-fiber-path"
              style={{ animationDelay: `${0.4 + destIdx * 0.1}s` }}
            />
          );
        })
      ))}

      {/* Destination icons + labels OUTSIDE */}
      {destinations.map((dest, i) => (
        <g key={i}>
          {/* Small hollow circle connector */}
          <circle
            cx="86"
            cy={dest.y + 2}
            r="2"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="0.4"
            className="lp-dest-circle"
            style={{ animationDelay: `${0.8 + i * 0.1}s` }}
          />
          
          {/* Label text */}
          <text
            x="90"
            y={dest.y + 3}
            fill="rgba(161,161,170,0.8)"
            fontSize="3"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {dest.label}
          </text>
          
          {/* Icon outside */}
          <foreignObject x="112" y={dest.y - 1} width="6" height="6">
            <div className="flex items-center justify-center w-full h-full">
              <dest.icon className="w-1.5 h-1.5 text-zinc-400" />
            </div>
          </foreignObject>
        </g>
      ))}

      {/* Particles flowing from center to destinations */}
      {particles.map((particle) => {
        const dest = destinations[particle.path];
        return (
          <circle
            key={particle.id}
            r="1"
            fill={dest.color}
            filter="url(#lpGlow)"
          >
            <animateMotion
              dur="1s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            >
              <mpath href={`#lpPath${particle.path}`} />
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
    </svg>
  );
};
