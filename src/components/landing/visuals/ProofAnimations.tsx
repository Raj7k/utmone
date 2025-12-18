import { useEffect, useState } from "react";

// CSS-only mini attribution flow animation
export const AttributionFlowMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const nodes = [
    { x: 20, label: "LI", delay: 0 },
    { x: 50, label: "G", delay: 0.2 },
    { x: 80, label: "EM", delay: 0.4 },
  ];

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <style>{`
          @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes pathDraw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
          @keyframes particleMove { 0% { offset-distance: 0%; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { offset-distance: 100%; opacity: 0; } }
        `}</style>
        
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={15}
              r={8}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
              style={{
                transformOrigin: `${node.x}px 15px`,
                animation: isVisible ? `scaleIn 0.3s ${node.delay}s cubic-bezier(0.4,0,0.2,1) forwards` : 'none',
                transform: isVisible ? undefined : 'scale(0)',
              }}
            />
            <text
              x={node.x}
              y={18}
              textAnchor="middle"
              fill="rgba(255,255,255,0.5)"
              fontSize={6}
              style={{ opacity: isVisible ? 1 : 0, transition: `opacity 0.3s ${node.delay + 0.2}s` }}
            >
              {node.label}
            </text>
            <path
              d={`M${node.x},23 Q${node.x + 40},35 ${160},45`}
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={1}
              strokeDasharray="200"
              style={{ strokeDashoffset: isVisible ? 0 : 200, transition: `stroke-dashoffset 0.8s ${node.delay + 0.3}s ease-out` }}
            />
            {isVisible && (
              <circle
                r={2}
                fill="white"
                style={{
                  offsetPath: `path('M${node.x},23 Q${node.x + 40},35 160,45')`,
                  animation: `particleMove 2s ${node.delay + 0.5}s ease-in-out infinite`,
                }}
              />
            )}
          </g>
        ))}
        <circle
          cx={170}
          cy={45}
          r={12}
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth={1.5}
          style={{
            transformOrigin: '170px 45px',
            animation: isVisible ? 'scaleIn 0.3s 1s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
            transform: isVisible ? undefined : 'scale(0)',
          }}
        />
        <text
          x={170}
          y={48}
          textAnchor="middle"
          fill="white"
          fontSize={7}
          fontWeight="bold"
          style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s 1.2s' }}
        >
          $
        </text>
      </svg>
    </div>
  );
};

// CSS-only mini identity stitching animation
export const IdentityStitchMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const nodes = [
    { x: 30, icon: "📱", delay: 0 },
    { x: 60, icon: "💻", delay: 0.2 },
    { x: 90, icon: "📧", delay: 0.4 },
  ];

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <style>{`
          @keyframes scaleIn { from { transform: scale(0); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          @keyframes scaleSpring { 0% { transform: scale(0); } 70% { transform: scale(1.2); } 100% { transform: scale(1); } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes lineDraw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
        `}</style>
        
        {nodes.map((node, i) => (
          <g key={i}>
            <circle
              cx={node.x}
              cy={30}
              r={12}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
              strokeDasharray="3 2"
              style={{
                transformOrigin: `${node.x}px 30px`,
                animation: isVisible ? `scaleIn 0.3s ${node.delay}s cubic-bezier(0.4,0,0.2,1) forwards` : 'none',
                opacity: isVisible ? undefined : 0,
              }}
            />
            <text
              x={node.x}
              y={34}
              textAnchor="middle"
              fontSize={10}
              style={{ opacity: isVisible ? 1 : 0, transition: `opacity 0.3s ${node.delay + 0.2}s` }}
            >
              {node.icon}
            </text>
            <line
              x1={node.x + 12}
              y1={30}
              x2={150}
              y2={30}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              strokeDasharray="4 4"
              style={{ strokeDashoffset: isVisible ? 0 : 200, transition: `stroke-dashoffset 0.5s ${0.8 + i * 0.1}s ease-out` }}
            />
          </g>
        ))}
        <circle
          cx={165}
          cy={30}
          r={15}
          fill="rgba(255,255,255,0.1)"
          stroke="white"
          strokeWidth={2}
          style={{
            transformOrigin: '165px 30px',
            animation: isVisible ? 'scaleSpring 0.4s 1.3s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
            transform: isVisible ? undefined : 'scale(0)',
          }}
        />
        <text
          x={165}
          y={34}
          textAnchor="middle"
          fontSize={12}
          style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s 1.5s' }}
        >
          👤
        </text>
        <g style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s 1.7s' }}>
          <rect x={140} y={48} width={50} height={12} rx={6} fill="rgba(34,197,94,0.2)" />
          <text x={165} y={57} textAnchor="middle" fill="rgb(34,197,94)" fontSize={7}>
            &lt;100ms
          </text>
        </g>
      </svg>
    </div>
  );
};

// CSS-only mini link creation animation
export const LinkCreateMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const outputs = [
    { y: 10, label: "utm.one/abc", color: "rgba(255,255,255,0.6)", delay: 0.8 },
    { y: 28, label: "utm_source=...", color: "rgba(255,255,255,0.4)", delay: 1.0 },
    { y: 46, label: "📱 QR", color: "rgba(255,255,255,0.5)", delay: 1.2 },
  ];

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <style>{`
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(10px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes pathDraw { from { stroke-dashoffset: 50; } to { stroke-dashoffset: 0; } }
          @keyframes scaleSpring { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.1); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
        
        <g style={{ animation: isVisible ? 'slideInLeft 0.3s ease-out forwards' : 'none', opacity: isVisible ? undefined : 0 }}>
          <rect x={5} y={22} width={55} height={16} rx={3} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" />
          <text x={10} y={33} fill="rgba(255,255,255,0.4)" fontSize={6} style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s 0.3s' }}>
            long-url.com/page
          </text>
        </g>
        
        <path
          d="M65,30 L80,30 M75,25 L80,30 L75,35"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
          strokeDasharray="50"
          style={{ strokeDashoffset: isVisible ? 0 : 50, transition: 'stroke-dashoffset 0.3s 0.5s ease-out' }}
        />
        
        {outputs.map((item, i) => (
          <g key={i} style={{ animation: isVisible ? `slideInRight 0.3s ${item.delay}s ease-out forwards` : 'none', opacity: isVisible ? undefined : 0 }}>
            <rect x={90} y={item.y} width={60} height={14} rx={3} fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" />
            <text x={95} y={item.y + 10} fill={item.color} fontSize={6}>
              {item.label}
            </text>
          </g>
        ))}
        
        {[0, 1, 2].map((i) => (
          <text
            key={i}
            x={155}
            y={18 + i * 18}
            fill="rgb(34,197,94)"
            fontSize={10}
            style={{
              transformOrigin: `155px ${18 + i * 18}px`,
              animation: isVisible ? `scaleSpring 0.3s ${1.4 + i * 0.15}s cubic-bezier(0.4,0,0.2,1) forwards` : 'none',
              opacity: isVisible ? undefined : 0,
            }}
          >
            ✓
          </text>
        ))}
        
        <g style={{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.3s 1.8s' }}>
          <rect x={165} y={22} width={32} height={16} rx={8} fill="rgba(34,197,94,0.2)" />
          <text x={181} y={33} textAnchor="middle" fill="rgb(34,197,94)" fontSize={7} fontWeight="bold">
            &lt;5s
          </text>
        </g>
      </svg>
    </div>
  );
};

// CSS-only mini anomaly detection animation
export const AnomalyAlertMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <style>{`
          @keyframes ekgDraw { from { stroke-dashoffset: 200; } to { stroke-dashoffset: 0; } }
          @keyframes spikeAppear { 0% { transform: scale(0); opacity: 0; } 50% { transform: scale(1.5); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes ringPulse { 0% { transform: scale(1); } 50% { transform: scale(1.5); } 100% { transform: scale(1); } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        `}</style>
        
        <path
          d="M10,35 L40,35 L50,35 L60,15 L70,50 L80,35 L120,35 L130,35"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth={1.5}
          strokeDasharray="200"
          style={{ strokeDashoffset: isVisible ? 0 : 200, transition: 'stroke-dashoffset 1.5s ease-out' }}
        />
        
        <circle
          cx={65}
          cy={15}
          r={8}
          fill="none"
          stroke="rgb(239,68,68)"
          strokeWidth={1.5}
          style={{
            transformOrigin: '65px 15px',
            animation: isVisible ? 'spikeAppear 0.5s 1.2s cubic-bezier(0.4,0,0.2,1) forwards' : 'none',
            opacity: isVisible ? undefined : 0,
          }}
        />
        {isVisible && (
          <circle
            cx={65}
            cy={15}
            r={12}
            fill="none"
            stroke="rgb(239,68,68)"
            strokeWidth={1}
            opacity={0.3}
            style={{
              transformOrigin: '65px 15px',
              animation: 'ringPulse 1s 1.4s ease-out infinite',
            }}
          />
        )}
        
        <g style={{ animation: isVisible ? 'slideIn 0.3s 1.8s ease-out forwards' : 'none', opacity: isVisible ? undefined : 0 }}>
          <rect x={145} y={20} width={50} height={20} rx={4} fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" />
          <text x={170} y={33} textAnchor="middle" fill="rgb(239,68,68)" fontSize={8}>
            🔔 Alert
          </text>
        </g>
      </svg>
    </div>
  );
};

// CSS-only mini audit trail animation
export const AuditTrailMini = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const entries = [
    { y: 8, text: "user@team created link", delay: 0 },
    { y: 24, text: "admin approved link", delay: 0.3 },
    { y: 40, text: "link clicked 1,234×", delay: 0.6 },
  ];

  return (
    <div className="relative h-16 w-full overflow-hidden">
      <svg viewBox="0 0 200 60" className="w-full h-full">
        <style>{`
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes scaleIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        `}</style>
        
        {entries.map((entry, i) => (
          <g
            key={i}
            style={{
              animation: isVisible ? `slideInLeft 0.3s ${entry.delay}s ease-out forwards` : 'none',
              opacity: isVisible ? undefined : 0,
            }}
          >
            <rect x={10} y={entry.y} width={140} height={14} rx={2} fill="rgba(255,255,255,0.03)" />
            <circle cx={20} cy={entry.y + 7} r={3} fill="rgba(34,197,94,0.5)" />
            <text x={28} y={entry.y + 10} fill="rgba(255,255,255,0.5)" fontSize={6} fontFamily="monospace">
              {entry.text}
            </text>
          </g>
        ))}
        
        <g style={{ animation: isVisible ? 'scaleIn 0.3s 1.2s ease-out forwards' : 'none', opacity: isVisible ? undefined : 0 }}>
          <rect x={160} y={22} width={35} height={16} rx={8} fill="rgba(255,255,255,0.1)" />
          <text x={177} y={33} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={7}>
            forever
          </text>
        </g>
      </svg>
    </div>
  );
};
