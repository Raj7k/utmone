import { useEffect, useState } from "react";
import { LinkedInIcon, GoogleIcon, MetaIcon, HubSpotIcon } from "@/components/icons/SocialIcons";

// CSS-only Attribution Sankey: Fiber-optic bundles → heartbeat pulse → bloom revenue
export const AttributionSankeyMini = () => {
  const [isVisible, setIsVisible] = useState(false);
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const sources = [
    { y: 12, width: 50, icon: LinkedInIcon, color: "#0A66C2", label: "LinkedIn" },
    { y: 24, width: 38, icon: GoogleIcon, color: "#4285F4", label: "Google" },
    { y: 36, width: 55, icon: MetaIcon, color: "#0668E1", label: "Meta" },
    { y: 48, width: 30, icon: HubSpotIcon, color: "#FF7A59", label: "Email" },
  ];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <filter id="attrBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        <filter id="attrFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {sources.map((source, i) => (
          <linearGradient key={`attrFlow-${i}`} id={`attrFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={source.color} stopOpacity="0.7" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#FFB800" stopOpacity="0.4" />
          </linearGradient>
        ))}
        
        <radialGradient id="goldRevenue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FFB800" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#FFB800" stopOpacity="0.2" />
        </radialGradient>
        
        <pattern id="attrDotGrid" patternUnits="userSpaceOnUse" width="4" height="4">
          <circle cx="2" cy="2" r="0.12" fill="white" fillOpacity="0.1" />
        </pattern>
      </defs>
      
      <style>{`
        @keyframes barGrow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        @keyframes barPulse {
          0%, 100% { stroke-opacity: 0.3; }
          50% { stroke-opacity: 0.7; }
        }
        @keyframes pathDraw {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes particleMove {
          0% { offset-distance: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { offset-distance: 100%; opacity: 0; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes ringPulse {
          0%, 100% { r: 10; opacity: 0.6; }
          50% { r: 14; opacity: 0.1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      
      <rect x="0" y="0" width="120" height="60" fill="url(#attrDotGrid)" opacity="0.3" />

      {sources.map((source, i) => (
        <g key={i}>
          <rect
            x="16"
            y={source.y}
            width={source.width}
            height="6"
            rx="2"
            fill={source.color}
            fillOpacity={0.2}
            stroke={source.color}
            strokeOpacity={0.5}
            strokeWidth="0.4"
            style={{
              transformOrigin: '16px center',
              animation: isVisible ? `barGrow 0.6s ${i * 0.1}s cubic-bezier(0.4, 0, 0.2, 1) forwards` : 'none',
              transform: isVisible ? undefined : 'scaleX(0)',
            }}
          />
          <rect
            x="16"
            y={source.y}
            width={source.width}
            height="6"
            rx="2"
            fill="none"
            stroke={source.color}
            strokeWidth="0.3"
            style={{
              animation: isVisible ? `barPulse 1s ${i * 0.25}s cubic-bezier(0.4, 0, 0.2, 1) infinite` : 'none',
            }}
          />
          <foreignObject x="4" y={source.y - 1} width="10" height="8">
            <div className="flex items-center justify-center w-full h-full">
              <source.icon className="w-2 h-2" />
            </div>
          </foreignObject>
        </g>
      ))}

      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 3;
          return (
            <path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M ${16 + source.width} ${baseY + offset * 0.8} Q 80 ${baseY + offset * 0.4}, 100 30`}
              fill="none"
              stroke={isCenter ? `url(#attrFlow-${srcIdx})` : source.color}
              strokeWidth={isCenter ? 1 : 0.3}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.8 : 0.2}
              filter={isCenter ? "url(#attrFiberGlow)" : undefined}
              strokeDasharray="100"
              style={{
                strokeDashoffset: isVisible ? 0 : 100,
                transition: `stroke-dashoffset 0.8s ${0.3 + srcIdx * 0.1}s cubic-bezier(0.4, 0, 0.2, 1)`,
              }}
            />
          );
        })
      ))}

      {isVisible && sources.map((source, i) => (
        <circle
          key={`particle-${i}`}
          r="2"
          fill={source.color}
          filter="url(#attrFiberGlow)"
          style={{
            offsetPath: `path("M ${16 + source.width} ${source.y + 3} Q 80 ${source.y + 3}, 100 30")`,
            animation: `particleMove 1.5s ${i * 0.25}s cubic-bezier(0.4, 0, 0.2, 1) infinite`,
          }}
        />
      ))}

      <circle
        cx="108"
        cy="30"
        r="10"
        fill="url(#goldRevenue)"
        filter="url(#attrBloom)"
        style={{
          transformOrigin: '108px 30px',
          animation: isVisible ? 'scaleIn 0.4s 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
          transform: isVisible ? undefined : 'scale(0)',
        }}
      />
      
      <circle
        cx="108"
        cy="30"
        r="10"
        fill="none"
        stroke="#FFB800"
        strokeWidth="0.5"
        style={{
          animation: isVisible ? 'ringPulse 1s 1s cubic-bezier(0.4, 0, 0.2, 1) infinite' : 'none',
        }}
      />
      
      <circle cx="108" cy="30" r="6" fill="rgba(255,184,0,0.3)" stroke="#FFB800" strokeWidth="0.5" />
      
      <text
        x="108"
        y="32"
        fill="white"
        fontSize="5"
        textAnchor="middle"
        fontFamily="ui-monospace"
        fontWeight="bold"
        style={{
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s 1s',
        }}
      >
        $
      </text>
    </svg>
  );
};
