import { QrCode } from "lucide-react";

// Cinematic Event Halo: Booth scanner → Halo core → ambient detection story
// Clear story: 100 scanned → 847 detected (9x more)
export const EventHaloVisual = () => {
  // Generate fiber strand offsets for multi-strand effect
  const fiberOffsets = [-1, -0.5, 0, 0.5, 1];
  
  return (
    <svg viewBox="0 0 460 200" className="w-full h-full">
      <defs>
        {/* Bloom effect filter */}
        <filter id="haloBloom" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur1" />
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Fiber glow */}
        <filter id="haloFiberGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>
        
        {/* Fiber gradient - white hot center to emerald edge */}
        <linearGradient id="haloFiberCore" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#10B981" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.2" />
        </linearGradient>
        
        {/* Halo ring gradient */}
        <linearGradient id="haloRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" stopOpacity="1" />
          <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.4" />
        </linearGradient>
        
        {/* Dot grid pattern */}
        <pattern id="haloDotGrid" patternUnits="userSpaceOnUse" width="16" height="16">
          <circle cx="8" cy="8" r="0.5" fill="white" fillOpacity="0.1" />
        </pattern>

        {/* Path for fiber particles */}
        <path
          id="haloFiberPath"
          d="M 85 100 C 154 100, 211 100, 268 100"
          fill="none"
        />
      </defs>

      <style>{`
        @keyframes haloFadeSlideIn {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes haloEdgePulse {
          0%, 100% { stroke-opacity: 0.2; }
          50% { stroke-opacity: 0.6; }
        }
        @keyframes haloPathDraw {
          from { stroke-dashoffset: 250; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes haloParticleFlow {
          from { offset-distance: 0%; opacity: 0.8; }
          to { offset-distance: 100%; opacity: 0; }
        }
        @keyframes haloRingRotateSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes haloRingRotateMed {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes haloRingRotateFast {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes haloSonarPulse {
          from { r: 15; opacity: 0.6; }
          to { r: 85; opacity: 0; }
        }
        @keyframes haloCorePulse {
          0%, 100% { r: 19; fill-opacity: 0.25; }
          50% { r: 23; fill-opacity: 0.4; }
        }
        @keyframes haloDetectDot {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        @keyframes haloTextFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .halo-booth {
          animation: haloFadeSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .halo-booth-edge {
          animation: haloEdgePulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .halo-fiber {
          stroke-dasharray: 250;
          animation: haloPathDraw 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .halo-particle {
          offset-path: path("M 85 100 C 154 100, 211 100, 268 100");
          animation: haloParticleFlow 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .halo-ring-outer {
          transform-origin: 326px 100px;
          animation: haloRingRotateSlow 20s linear infinite;
        }
        .halo-ring-mid {
          transform-origin: 326px 100px;
          animation: haloRingRotateMed 12s linear infinite;
        }
        .halo-ring-inner {
          transform-origin: 326px 100px;
          animation: haloRingRotateFast 6s linear infinite;
        }
        .halo-sonar {
          transform-origin: 326px 100px;
          animation: haloSonarPulse 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .halo-core-glow {
          animation: haloCorePulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        .halo-detect-dot {
          animation: haloDetectDot 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .halo-footer-text {
          animation: haloTextFadeIn 0.3s ease-out 1.5s forwards;
          opacity: 0;
        }
      `}</style>
      
      {/* Background dot grid */}
      <rect x="0" y="0" width="460" height="200" fill="url(#haloDotGrid)" opacity="0.3" />
      
      {/* Source: Booth node with QR icon */}
      <g className="halo-booth">
        <rect
          x="15"
          y="73"
          width="69"
          height="54"
          rx="8"
          fill="rgba(63,63,70,0.3)"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
        />
        {/* Glowing edge when active */}
        <rect
          x="15"
          y="73"
          width="69"
          height="54"
          rx="8"
          fill="none"
          stroke="#10B981"
          strokeWidth="1"
          className="halo-booth-edge"
        />
        {/* QR Icon */}
        <foreignObject x="31" y="80" width="38" height="38">
          <div className="flex items-center justify-center w-full h-full">
            <QrCode className="w-7 h-7" style={{ color: "#10B981" }} strokeWidth={1.5} />
          </div>
        </foreignObject>
        <text x="50" y="120" fill="white" fontSize="10" textAnchor="middle" fontFamily="ui-monospace" opacity="0.7">100</text>
      </g>
      
      {/* Multi-strand fiber-optic flow - 5 parallel strands */}
      {fiberOffsets.map((offset, i) => {
        const isCenter = i === 2;
        const opacity = isCenter ? 1 : 0.25 - Math.abs(offset) * 0.08;
        const strokeWidth = isCenter ? 3.5 : 1;
        
        return (
          <path
            key={`fiber-${i}`}
            d={`M 85 ${100 + offset * 3.3} C 154 ${100 + offset * 3.3}, 211 ${100 + offset * 1.7}, 268 100`}
            fill="none"
            stroke={isCenter ? "url(#haloFiberCore)" : "#10B981"}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeOpacity={opacity}
            filter={isCenter ? "url(#haloFiberGlow)" : undefined}
            className="halo-fiber"
            style={{ animationDelay: `${0.2 + i * 0.05}s` }}
          />
        );
      })}
      
      {/* Heartbeat pulse on fibers - using native SVG animation */}
      <ellipse
        cx="85"
        cy="100"
        rx="12"
        ry="5"
        fill="#FFFFFF"
        filter="url(#haloFiberGlow)"
        className="halo-particle"
      />
      
      {/* The Halo Core - rotating rings */}
      <g transform="translate(326, 100)">
        {/* Outer detection ring - slow rotation */}
        <circle
          cx="0"
          cy="0"
          r="69"
          fill="none"
          stroke="url(#haloRingGrad)"
          strokeWidth="1"
          strokeDasharray="12 23"
          strokeOpacity="0.3"
          className="halo-ring-outer"
        />
        
        {/* Middle ring - medium rotation */}
        <circle
          cx="0"
          cy="0"
          r="54"
          fill="none"
          stroke="#10B981"
          strokeWidth="1.5"
          strokeDasharray="8 15"
          strokeOpacity="0.4"
          className="halo-ring-mid"
        />
        
        {/* Inner ring - fast rotation */}
        <circle
          cx="0"
          cy="0"
          r="38"
          fill="none"
          stroke="#06B6D4"
          strokeWidth="2"
          strokeDasharray="6 12"
          strokeOpacity="0.6"
          className="halo-ring-inner"
        />
        
        {/* Sonar pulse rings - expanding outward */}
        {[0, 1, 2].map((ring) => (
          <circle
            key={`sonar-${ring}`}
            cx="0"
            cy="0"
            r="15"
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            className="halo-sonar"
            style={{ animationDelay: `${ring * 0.8}s` }}
          />
        ))}
        
        {/* Core glow */}
        <circle
          cx="0"
          cy="0"
          r="19"
          fill="rgba(16,185,129,0.25)"
          filter="url(#haloBloom)"
          className="halo-core-glow"
        />
        
        {/* Core center */}
        <circle cx="0" cy="0" r="15" fill="rgba(16,185,129,0.3)" stroke="#10B981" strokeWidth="2" />
        <text x="0" y="6" fill="white" fontSize="18" textAnchor="middle" fontFamily="ui-monospace" fontWeight="bold" opacity="0.9">847</text>
      </g>
      
      {/* Detection dots - representing walk-by visitors */}
      {[
        { x: 288, y: 53 }, { x: 365, y: 47 }, { x: 403, y: 67 },
        { x: 276, y: 147 }, { x: 376, y: 153 }, { x: 415, y: 133 },
      ].map((dot, i) => (
        <circle
          key={`detect-${i}`}
          cx={dot.x}
          cy={dot.y}
          r="4.5"
          fill="#10B981"
          className="halo-detect-dot"
          style={{ animationDelay: `${1.2 + i * 0.15}s` }}
        />
      ))}
      
      {/* Stats footer - clear story */}
      <text
        x="230"
        y="187"
        fill="white"
        fontSize="10"
        fontFamily="ui-monospace"
        textAnchor="middle"
        fillOpacity="0.4"
        className="halo-footer-text"
      >
        100 scanned · 847 detected
      </text>
    </svg>
  );
};
