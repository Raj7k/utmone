import { MousePointer, Activity, Target } from "lucide-react";

export const AIInsightPipelineVisual = () => {
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];

  const sources = [
    { y: 50, icon: MousePointer, color: "#10B981", label: "Clicks" },
    { y: 100, icon: Activity, color: "#22C55E", label: "Sessions" },
    { y: 150, icon: Target, color: "#34D399", label: "Leads" },
  ];

  const particles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    path: i % 3,
    delay: i * 0.3,
  }));

  // Icosahedron edges (2D projection) - scaled up
  const icosaEdges = [
    [[0, -20], [17, -7]], [[17, -7], [10, 17]], [[10, 17], [-10, 17]], 
    [[-10, 17], [-17, -7]], [[-17, -7], [0, -20]], [[0, -20], [10, 17]],
    [[0, -20], [-10, 17]], [[17, -7], [-10, 17]], [[-17, -7], [10, 17]],
  ];

  return (
    <svg viewBox="0 0 460 200" className="w-full h-full">
      <defs>
        <filter id="aiGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        <radialGradient id="aiCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#10B981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.1" />
        </radialGradient>
        
        <pattern id="aiDotGrid" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="0.5" fill="white" fillOpacity="0.1" />
        </pattern>

        {/* Define paths for particles */}
        {sources.map((source, i) => (
          <path
            key={`path-${i}`}
            id={`aiPath${i}`}
            d={`M 123 ${source.y + 7} Q 192 ${source.y + 7}, 230 100`}
            fill="none"
          />
        ))}
      </defs>
      
      <rect x="0" y="0" width="460" height="200" fill="url(#aiDotGrid)" opacity="0.3" />

      <style>{`
        @keyframes aiCircleScale {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes aiPathDraw {
          from { stroke-dashoffset: 400; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes aiRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes aiCorePulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes aiFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .ai-source-circle {
          animation: aiCircleScale 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: center;
        }
        .ai-fiber-path {
          stroke-dasharray: 400;
          animation: aiPathDraw 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .ai-icosa-group {
          transform-origin: 268px 100px;
          animation: aiRotate 20s linear infinite;
        }
        .ai-icosa-line {
          stroke-dasharray: 80;
          animation: aiPathDraw 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .ai-core {
          transform-origin: 268px 100px;
          animation: aiCorePulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .ai-beam {
          stroke-dasharray: 160;
          animation: aiPathDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) 1s forwards;
          stroke-dashoffset: 160;
        }
        .ai-text-fade {
          animation: aiFadeIn 0.3s ease-out 1.5s forwards;
          opacity: 0;
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
            cx="115"
            cy={source.y + 7}
            r="8"
            fill="none"
            stroke="rgba(113,113,122,0.4)"
            strokeWidth="1.5"
            className="ai-source-circle"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        </g>
      ))}

      {/* Super thin grey fiber lines to AI core */}
      {sources.map((source, srcIdx) => (
        fiberOffsets.map((offset, strandIdx) => {
          const isCenter = strandIdx === 2;
          const baseY = source.y + 7;
          return (
            <path
              key={`fiber-${srcIdx}-${strandIdx}`}
              d={`M 123 ${baseY + offset * 1.7} Q 192 ${baseY + offset}, 230 100`}
              fill="none"
              stroke={isCenter ? source.color : "rgba(113,113,122,0.3)"}
              strokeWidth={isCenter ? 3 : 1}
              strokeLinecap="round"
              strokeOpacity={isCenter ? 0.5 : 0.15}
              filter={isCenter ? "url(#aiGlow)" : undefined}
              className="ai-fiber-path"
              style={{ animationDelay: `${0.2 + srcIdx * 0.1}s` }}
            />
          );
        })
      ))}

      {/* AI Nexus - Rotating Icosahedron wireframe */}
      <g className="ai-icosa-group">
        {icosaEdges.map((edge, i) => (
          <line
            key={i}
            x1={268 + edge[0][0]}
            y1={100 + edge[0][1]}
            x2={268 + edge[1][0]}
            y2={100 + edge[1][1]}
            stroke="#10B981"
            strokeWidth="1"
            strokeOpacity="0.4"
            className="ai-icosa-line"
            style={{ animationDelay: `${0.5 + i * 0.05}s` }}
          />
        ))}
      </g>

      {/* Core energy ball */}
      <circle
        cx="268"
        cy="100"
        r="15"
        fill="url(#aiCore)"
        filter="url(#aiGlow)"
        className="ai-core"
      />

      {/* Prediction beam with phantom line */}
      <line
        x1="300"
        y1="100"
        x2="422"
        y2="67"
        stroke="#10B981"
        strokeWidth="2"
        strokeDasharray="8,8"
        strokeOpacity="0.5"
        className="ai-beam"
      />

      {/* Prediction label */}
      <text
        x="384"
        y="53"
        fill="#10B981"
        fontSize="12"
        fontFamily="'SF Mono', ui-monospace"
        fillOpacity="0.7"
        className="ai-text-fade"
      >
        +24%
      </text>

      {/* Particles */}
      {particles.map((particle) => {
        const source = sources[particle.path];
        return (
          <circle
            key={particle.id}
            r="4"
            fill={source.color}
            filter="url(#aiGlow)"
          >
            <animateMotion
              dur="0.8s"
              repeatCount="indefinite"
              begin={`${particle.delay}s`}
              calcMode="spline"
              keySplines="0.4 0 0.2 1"
            >
              <mpath href={`#aiPath${particle.path}`} />
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
