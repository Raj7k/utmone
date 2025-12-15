import { Instagram, Twitter, Youtube, LinkIcon } from "lucide-react";

export const LinkPagesVisual = () => {
  const fiberOffsets = [-0.8, -0.4, 0, 0.4, 0.8];

  const destinations = [
    { y: 40, icon: Instagram, color: "#E1306C", label: "Instagram" },
    { y: 80, icon: Twitter, color: "#1DA1F2", label: "Twitter" },
    { y: 120, icon: Youtube, color: "#FF0000", label: "YouTube" },
    { y: 160, icon: LinkIcon, color: "#F97316", label: "Website" },
  ];

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    path: i % 4,
    delay: i * 0.2,
  }));

  return (
    <svg viewBox="0 0 460 200" className="w-full h-full">
      <defs>
        <filter id="lpGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="lpPortal" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#F97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="lpDotGrid" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="0.5" fill="white" fillOpacity="0.1" />
        </pattern>

        {/* Define paths for particles */}
        {destinations.map((dest, i) => (
          <path
            key={`path-${i}`}
            id={`lpPath${i}`}
            d={`M 107 100 Q 211 ${(100 + dest.y + 7) / 2}, 315 ${dest.y + 7}`}
            fill="none"
          />
        ))}
      </defs>
      
      <rect x="0" y="0" width="460" height="200" fill="url(#lpDotGrid)" opacity="0.3" />

      <style>{`
        @keyframes lpCircleScale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes lpPathDraw {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes lpRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes lpPulse {
          0%, 100% { r: 19; opacity: 0.5; }
          50% { r: 27; opacity: 0.1; }
        }
        @keyframes lpFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .lp-rotating-ring {
          transform-origin: 77px 100px;
          animation: lpRotate 12s linear infinite;
        }
        .lp-portal-circle {
          animation: lpCircleScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards;
          transform: scale(0);
          transform-origin: 77px 100px;
        }
        .lp-pulse-ring {
          animation: lpPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .lp-text-fade {
          animation: lpFadeIn 0.3s ease-out 0.5s forwards;
          opacity: 0;
        }
        .lp-fiber-path {
          stroke-dasharray: 400;
          animation: lpPathDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .lp-dest-circle {
          animation: lpCircleScale 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform: scale(0);
        }
      `}</style>

      {/* Central link portal with rotating ring */}
      <circle
        cx="77"
        cy="100"
        r="30"
        fill="none"
        stroke="#F97316"
        strokeWidth="1.5"
        strokeDasharray="8,12"
        className="lp-rotating-ring"
      />
      
      <circle
        cx="77"
        cy="100"
        r="19"
        fill="url(#lpPortal)"
        filter="url(#lpGlow)"
        className="lp-portal-circle"
      />
      
      <circle
        cx="77"
        cy="100"
        r="19"
        fill="none"
        stroke="#F97316"
        strokeWidth="1.5"
        className="lp-pulse-ring"
      />
      
      <text
        x="77"
        y="107"
        fill="white"
        fontSize="16"
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
          const destY = dest.y + 7;
          return (
            <path
              key={`fiber-${destIdx}-${strandIdx}`}
              d={`M 107 ${100 + offset * 7} Q 211 ${(100 + destY) / 2 + offset * 3}, 315 ${destY + offset * 1.7}`}
              fill="none"
              stroke={isCenter ? dest.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 3 : 1}
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
            cx="330"
            cy={dest.y + 7}
            r="8"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="1.5"
            className="lp-dest-circle"
            style={{ animationDelay: `${0.8 + i * 0.1}s` }}
          />
          
          {/* Label text */}
          <text
            x="345"
            y={dest.y + 11}
            fill="rgba(161,161,170,0.8)"
            fontSize="12"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {dest.label}
          </text>
          
          {/* Icon outside */}
          <foreignObject x="430" y={dest.y - 4} width="24" height="24">
            <div className="flex items-center justify-center w-full h-full">
              <dest.icon className="w-5 h-5 text-zinc-400" />
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
            r="4"
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
