// FeatureVisuals.tsx - CSS-only animations (no framer-motion)
// All components use native SVG animations and CSS keyframes

const appleEase = "cubic-bezier(0.16, 1, 0.3, 1)";

// Shared keyframes injected once
const sharedStyles = `
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
  @keyframes drawPath { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
  @keyframes growWidth { from { width: 0; } to { width: var(--target-width); } }
  @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.1); opacity: 1; } }
  @keyframes rotateSweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('feature-visuals-styles')) {
  const style = document.createElement('style');
  style.id = 'feature-visuals-styles';
  style.textContent = sharedStyles;
  document.head.appendChild(style);
}

// Custom Domain Visual
export const CustomDomainVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Browser frame */}
      <rect x="20" y="20" width="280" height="140" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ animation: `fadeIn 0.4s ${appleEase} forwards` }} />
      {/* Address bar */}
      <rect x="35" y="35" width="250" height="24" rx="4" fill="rgba(255,255,255,0.05)"
        style={{ animation: `fadeIn 0.4s ${appleEase} 0.1s both` }} />
      {/* Lock icon */}
      <circle cx="48" cy="47" r="5" fill="rgba(74,222,128,0.3)"
        style={{ animation: `scaleIn 0.3s ${appleEase} 0.2s both`, transformOrigin: '48px 47px' }} />
      {/* Domain text */}
      <text x="60" y="51" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="ui-monospace"
        style={{ animation: `fadeIn 0.3s ease-out 0.3s both` }}>acme.co/</text>
      <text x="112" y="51" fill="rgba(255,255,255,0.9)" fontSize="11" fontFamily="ui-monospace" fontWeight="bold"
        style={{ animation: `fadeIn 0.3s ease-out 0.4s both` }}>summer-sale</text>
      {/* Content placeholder */}
      <rect x="35" y="70" width="180" height="8" rx="2" fill="rgba(255,255,255,0.15)"
        style={{ animation: `fadeIn 0.5s ease-out 0.5s both` }} />
      <rect x="35" y="85" width="140" height="6" rx="2" fill="rgba(255,255,255,0.1)"
        style={{ animation: `fadeIn 0.4s ease-out 0.6s both` }} />
      <rect x="35" y="98" width="200" height="6" rx="2" fill="rgba(255,255,255,0.1)"
        style={{ animation: `fadeIn 0.4s ease-out 0.7s both` }} />
    </svg>
  </div>
);

// Security Shield Visual
export const SecurityShieldVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      {/* Shield path */}
      <path d="M100,15 L160,35 L160,85 C160,120 130,150 100,165 C70,150 40,120 40,85 L40,35 Z"
        fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="2"
        style={{ animation: `scaleIn 0.6s ${appleEase} both`, transformOrigin: '100px 90px' }} />
      {/* Inner glow */}
      <circle cx="100" cy="85" r="25" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.3)" strokeWidth="2"
        style={{ animation: `pulse 2s ease-in-out 0.3s infinite` }} />
      {/* Checkmark */}
      <path d="M85,85 L95,95 L115,75" stroke="rgba(74,222,128,0.9)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"
        strokeDasharray="50" strokeDashoffset="50"
        style={{ animation: `drawPath 0.5s ease-out 0.5s forwards` }} />
      {/* Scan lines */}
      {[0, 1, 2].map((i) => (
        <line key={i} x1="50" y1={50 + i * 20} x2="150" y2={50 + i * 20}
          stroke="rgba(74,222,128,0.2)" strokeWidth="1"
          style={{ animation: `fadeIn 1.5s ease-out ${0.8 + i * 0.2}s infinite alternate` }} />
      ))}
    </svg>
  </div>
);

// Analytics Chart Visual
export const AnalyticsChartVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <line key={i} x1="40" y1={40 + i * 35} x2="290" y2={40 + i * 35}
          stroke="rgba(255,255,255,0.05)" strokeWidth="1"
          style={{ animation: `fadeIn 0.2s ease-out ${i * 0.05}s both` }} />
      ))}
      {/* Bar chart */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const height = 30 + Math.sin(i * 0.8) * 50 + i * 8;
        return (
          <rect key={i} x={55 + i * 35} y={145 - height} width="20" height={height} rx="4"
            fill={`rgba(255,255,255,${0.1 + i * 0.08})`}
            style={{ animation: `scaleIn 0.6s ${appleEase} ${0.1 * i}s both`, transformOrigin: `${65 + i * 35}px 145px` }} />
        );
      })}
      {/* Trend line */}
      <path d="M65,110 Q100,95 135,85 T205,60 T275,45" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="200" strokeDashoffset="200"
        style={{ animation: `drawPath 1s ${appleEase} 0.6s forwards` }} />
      {/* Dot at end */}
      <circle cx="275" cy="45" r="5" fill="rgba(255,255,255,0.8)"
        style={{ animation: `scaleIn 0.3s ${appleEase} 1.5s both`, transformOrigin: '275px 45px' }} />
    </svg>
  </div>
);

// QR Code Visual
export const QRCodeVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      <g style={{ animation: `scaleIn 0.5s ${appleEase} both`, transformOrigin: '100px 90px' }}>
        {/* QR frame */}
        <rect x="40" y="30" width="120" height="120" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
        {/* QR pattern */}
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => {
            const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
            const show = isCorner || Math.random() > 0.4;
            return show ? (
              <rect key={`${row}-${col}`} x={50 + col * 14} y={40 + row * 14} width="12" height="12" rx="2"
                fill={isCorner ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)"}
                style={{ animation: `scaleIn 0.3s ease-out ${0.05 * (row + col)}s both`, transformOrigin: `${56 + col * 14}px ${46 + row * 14}px` }} />
            ) : null;
          })
        )}
        {/* Center logo */}
        <circle cx="100" cy="90" r="12" fill="rgba(255,255,255,0.9)"
          style={{ animation: `scaleIn 0.3s ${appleEase} 0.5s both`, transformOrigin: '100px 90px' }} />
      </g>
    </svg>
  </div>
);

// Expiration Clock Visual
export const ExpirationClockVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      {/* Clock face */}
      <circle cx="100" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4"
        style={{ animation: `fadeIn 0.3s ease-out both` }} />
      {/* Progress arc */}
      <circle cx="100" cy="90" r="60" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round"
        strokeDasharray="377" strokeDashoffset="377"
        style={{ animation: `drawPath 2s ${appleEase} forwards`, transform: 'rotate(-90deg)', transformOrigin: '100px 90px' }}>
        <animate attributeName="stroke-dashoffset" from="377" to="120" dur="2s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" />
      </circle>
      {/* Hour hand */}
      <line x1="100" y1="90" x2="100" y2="55" stroke="rgba(255,255,255,0.7)" strokeWidth="3" strokeLinecap="round"
        style={{ animation: `fadeIn 0.3s ease-out 0.5s both` }} />
      {/* Minute hand */}
      <line x1="100" y1="90" x2="130" y2="75" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"
        style={{ animation: `fadeIn 0.3s ease-out 0.7s both` }} />
      {/* Center dot */}
      <circle cx="100" cy="90" r="4" fill="rgba(255,255,255,0.8)"
        style={{ animation: `scaleIn 0.3s ${appleEase} 0.4s both`, transformOrigin: '100px 90px' }} />
      {/* Countdown text */}
      <text x="100" y="135" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="10"
        style={{ animation: `fadeIn 0.3s ease-out 1s both` }}>expires in 7 days</text>
    </svg>
  </div>
);

// Attribution Flow Visual
export const AttributionFlowVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Source nodes */}
      {[
        { x: 50, y: 40, label: "LinkedIn", pct: "32%" },
        { x: 50, y: 80, label: "Email", pct: "28%" },
        { x: 50, y: 120, label: "Blog", pct: "18%" },
        { x: 50, y: 160, label: "Google", pct: "22%" },
      ].map((node, i) => (
        <g key={i} style={{ animation: `slideInLeft 0.3s ease-out ${i * 0.1}s both` }}>
          <circle cx={node.x} cy={node.y} r="6" fill="rgba(255,255,255,0.3)" />
          <text x={node.x + 12} y={node.y + 4} fill="rgba(255,255,255,0.5)" fontSize="9">{node.label}</text>
        </g>
      ))}
      {/* Flow paths */}
      {[40, 80, 120, 160].map((y, i) => (
        <path key={i} d={`M56,${y} Q160,${y} 250,90`} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5"
          strokeDasharray="200" strokeDashoffset="200"
          style={{ animation: `drawPath 0.8s ease-out ${0.3 + i * 0.1}s forwards` }} />
      ))}
      {/* Particles using native SVG animation */}
      {[40, 80, 120, 160].map((y, i) => (
        <circle key={`p-${i}`} r="2" fill="rgba(255,255,255,0.8)">
          <animateMotion dur="1.5s" repeatCount="indefinite" begin={`${0.5 + i * 0.15}s`}>
            <mpath href={`#flow-path-${i}`} />
          </animateMotion>
        </circle>
      ))}
      <defs>
        {[40, 80, 120, 160].map((y, i) => (
          <path key={i} id={`flow-path-${i}`} d={`M56,${y} Q160,${y} 250,90`} />
        ))}
      </defs>
      {/* Revenue node */}
      <circle cx="260" cy="90" r="20" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"
        style={{ animation: `scaleIn 0.3s ${appleEase} 0.8s both`, transformOrigin: '260px 90px' }} />
      <text x="260" y="94" textAnchor="middle" fill="rgba(255,255,255,0.9)" fontSize="10" fontWeight="bold"
        style={{ animation: `fadeIn 0.3s ease-out 1s both` }}>$150K</text>
    </svg>
  </div>
);

// Cross Device Visual
export const CrossDeviceVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Phone */}
      <g style={{ animation: `fadeIn 0.3s ease-out 0s both` }}>
        <rect x="40" y="50" width="40" height="70" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="48" y="58" width="24" height="45" rx="2" fill="rgba(255,255,255,0.1)" />
        <circle cx="60" cy="112" r="3" fill="rgba(255,255,255,0.2)" />
      </g>
      {/* Tablet */}
      <g style={{ animation: `fadeIn 0.3s ease-out 0.1s both` }}>
        <rect x="120" y="40" width="70" height="90" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="128" y="48" width="54" height="70" rx="2" fill="rgba(255,255,255,0.1)" />
        <circle cx="155" cy="125" r="3" fill="rgba(255,255,255,0.2)" />
      </g>
      {/* Desktop */}
      <g style={{ animation: `fadeIn 0.3s ease-out 0.2s both` }}>
        <rect x="220" y="45" width="80" height="55" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="228" y="52" width="64" height="40" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="250" y="100" width="20" height="6" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="240" y="106" width="40" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      </g>
      {/* Connection lines */}
      <path d="M80,85 L120,85 M190,85 L220,72" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeDasharray="4 4"
        strokeDashoffset="100" style={{ animation: `drawPath 0.8s ease-out 0.4s forwards` }} />
      {/* Identity badge */}
      <g style={{ animation: `scaleIn 0.3s ${appleEase} 0.8s both`, transformOrigin: '160px 145px' }}>
        <circle cx="160" cy="145" r="12" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.5)" strokeWidth="1.5" />
        <text x="160" y="149" textAnchor="middle" fill="rgba(74,222,128,0.9)" fontSize="8" fontWeight="bold">ID</text>
      </g>
    </svg>
  </div>
);

// Prediction Visual
export const PredictionVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Grid */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1="40" y1={30 + i * 30} x2="290" y2={30 + i * 30} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      ))}
      {/* Historical line */}
      <path d="M50,120 Q80,110 110,100 T170,75 T200,65" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"
        strokeDasharray="200" strokeDashoffset="200"
        style={{ animation: `drawPath 1s ${appleEase} forwards` }} />
      {/* Prediction zone */}
      <path d="M200,65 Q230,55 260,45 L260,75 Q230,65 200,65" fill="rgba(74,222,128,0.1)"
        style={{ animation: `fadeIn 0.5s ease-out 1s both` }} />
      {/* Prediction line */}
      <path d="M200,65 Q230,55 260,45" fill="none" stroke="rgba(74,222,128,0.6)" strokeWidth="2" strokeLinecap="round" strokeDasharray="6 4"
        strokeDashoffset="60" style={{ animation: `drawPath 0.6s ease-out 1.2s forwards` }} />
      {/* Prediction dots */}
      <circle cx="230" cy="55" r="4" fill="rgba(74,222,128,0.5)"
        style={{ animation: `scaleIn 0.3s ${appleEase} 1.5s both`, transformOrigin: '230px 55px' }} />
      <circle cx="260" cy="45" r="4" fill="rgba(74,222,128,0.5)"
        style={{ animation: `scaleIn 0.3s ${appleEase} 1.6s both`, transformOrigin: '260px 45px' }} />
      {/* Label */}
      <text x="260" y="35" textAnchor="middle" fill="rgba(74,222,128,0.8)" fontSize="9"
        style={{ animation: `fadeIn 0.3s ease-out 1.8s both` }}>85% conf.</text>
    </svg>
  </div>
);

// AI Command Visual
export const AICommandVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Chat container */}
      <rect x="40" y="20" width="240" height="140" rx="12" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
        style={{ animation: `fadeIn 0.3s ease-out both` }} />
      {/* User message */}
      <g style={{ animation: `slideInRight 0.3s ease-out 0.2s both` }}>
        <rect x="140" y="35" width="120" height="28" rx="8" fill="rgba(255,255,255,0.1)" />
        <text x="200" y="53" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">best performing channel?</text>
      </g>
      {/* AI response */}
      <g style={{ animation: `slideInLeft 0.3s ease-out 0.6s both` }}>
        <rect x="60" y="75" width="150" height="45" rx="8" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
        <text x="70" y="93" fill="rgba(255,255,255,0.7)" fontSize="8">LinkedIn drives 32% of</text>
        <text x="70" y="106" fill="rgba(255,255,255,0.7)" fontSize="8">revenue with lowest CPA</text>
      </g>
      {/* Typing indicator */}
      <g style={{ animation: `fadeIn 1s ease-out 0.3s infinite alternate` }}>
        <circle cx="70" cy="140" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="82" cy="140" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="94" cy="140" r="3" fill="rgba(255,255,255,0.3)" />
      </g>
    </svg>
  </div>
);

// Anomaly Radar Visual
export const AnomalyRadarVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      {/* Radar circles */}
      {[20, 40, 60].map((r, i) => (
        <circle key={i} cx="100" cy="90" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
          style={{ animation: `scaleIn 0.3s ease-out ${i * 0.1}s both`, transformOrigin: '100px 90px' }} />
      ))}
      {/* Sweep line */}
      <line x1="100" y1="90" x2="100" y2="30" stroke="rgba(74,222,128,0.5)" strokeWidth="2"
        style={{ animation: `rotateSweep 4s linear infinite`, transformOrigin: '100px 90px' }} />
      {/* Anomaly dot */}
      <circle cx="130" cy="60" r="6" fill="rgba(239,68,68,0.3)" stroke="rgba(239,68,68,0.8)" strokeWidth="2"
        style={{ animation: `pulse 1s ease-in-out 1s infinite` }} />
      {/* Label */}
      <text x="100" y="165" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9"
        style={{ animation: `fadeIn 0.3s ease-out 0.5s both` }}>monitoring 24/7</text>
    </svg>
  </div>
);
