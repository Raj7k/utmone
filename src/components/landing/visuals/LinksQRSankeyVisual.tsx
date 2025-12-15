import { Link, QrCode, Share2, Globe } from "lucide-react";

export const LinksQRSankeyVisual = () => {
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  const sources = [
    { y: 40, icon: Link, color: "#0A66C2", label: "UTM" },
    { y: 80, icon: QrCode, color: "#4285F4", label: "QR" },
    { y: 120, icon: Share2, color: "#1DA1F2", label: "Social" },
    { y: 160, icon: Globe, color: "#6366F1", label: "Web" },
  ];

  const particles = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    path: i % 4,
    delay: i * 0.25,
  }));

  return (
    <svg viewBox="0 0 460 200" className="w-full h-full">
      <defs>
        <filter id="linksGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="linksHub" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#0A66C2" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0A66C2" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="linksDotGrid" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="0.5" fill="white" fillOpacity="0.1" />
        </pattern>

        {/* Define paths for particles */}
        {sources.map((source, i) => (
          <path
            key={`path-${i}`}
            id={`linksPath${i}`}
            d={`M 100 ${source.y + 7} Q 173 ${source.y + 7}, 222 100`}
            fill="none"
          />
        ))}
      </defs>
      
      <rect x="0" y="0" width="460" height="200" fill="url(#linksDotGrid)" opacity="0.3" />

      <style>{`
        @keyframes linksCircleScale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes linksPathDraw {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes linksPulse {
          0%, 100% { r: 24; opacity: 0.5; }
          50% { r: 32; opacity: 0.1; }
        }
        .links-source-circle {
          animation: linksCircleScale 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: center;
        }
        .links-fiber-path {
          stroke-dasharray: 400;
          animation: linksPathDraw 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .links-hub-circle {
          animation: linksCircleScale 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.5s forwards;
          transform: scale(0);
        }
        .links-pulse-ring {
          animation: linksPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .links-dest-circle {
          animation: linksCircleScale 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform: scale(0);
        }
      `}</style>

      {/* Source icons + labels OUTSIDE */}
      {sources.map((source, i) => (
        <g key={i}>
          <foreignObject x="8" y={source.y - 4} width="24" height="24">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-5 h-5 text-zinc-400" />
            </div>
          </foreignObject>
          
          <text
            x="38"
            y={source.y + 10}
            fill="rgba(161,161,170,0.8)"
            fontSize="12"
            fontFamily="'SF Mono', ui-monospace, monospace"
          >
            {source.label}
          </text>
          
          <circle
            cx="92"
            cy={source.y + 7}
            r="8"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="1.5"
            className="links-source-circle"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        </g>
      ))}

      {/* Super thin grey fiber lines to hub */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 7;
          return (
            <path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 100 ${baseY + offset * 2} Q 173 ${baseY + offset}, 222 100`}
              fill="none"
              stroke={isCenter ? source.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 3 : 1}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#linksGlow)" : undefined}
              className="links-fiber-path"
              style={{ animationDelay: `${0.2 + srcIdx * 0.1}s` }}
            />
          );
        })
      ))}

      {/* Central hub */}
      <circle
        cx="230"
        cy="100"
        r="24"
        fill="url(#linksHub)"
        filter="url(#linksGlow)"
        className="links-hub-circle"
      />
      
      <circle
        cx="230"
        cy="100"
        r="24"
        fill="none"
        stroke="#0A66C2"
        strokeWidth="1.5"
        className="links-pulse-ring"
      />

      {/* Output lines from hub */}
      {[50, 100, 150].map((destY, i) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          return (
            <path
              key={`out-${i}-${strandIdx}`}
              d={`M 254 ${100 + offset * 1.5} Q 326 ${(100 + destY) / 2 + offset}, 384 ${destY}`}
              fill="none"
              stroke={isCenter ? "#22C55E" : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 3 : 1}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#linksGlow)" : undefined}
              className="links-fiber-path"
              style={{ animationDelay: `${0.7 + i * 0.1}s` }}
            />
          );
        })
      ))}

      {/* Output hollow circles */}
      {[50, 100, 150].map((destY, i) => (
        <circle
          key={`dest-${i}`}
          cx="400"
          cy={destY}
          r="8"
          fill="none"
          stroke="rgba(34,197,94,0.5)"
          strokeWidth="1.5"
          className="links-dest-circle"
          style={{ animationDelay: `${0.9 + i * 0.1}s` }}
        />
      ))}

      {/* Particles */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <circle
            key={particle.id}
            r="4"
            fill={source.color}
            filter="url(#linksGlow)"
          >
            <animateMotion
              dur="0.8s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            >
              <mpath href={`#linksPath${particle.path}`} />
            </animateMotion>
            <animate
              attributeName="opacity"
              values="0;1;1;0"
              dur="0.8s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
            />
          </circle>
        );
      })}
    </svg>
  );
};
