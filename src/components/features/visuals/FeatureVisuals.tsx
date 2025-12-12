import { motion } from "framer-motion";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Custom Domain Visual
export const CustomDomainVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Browser frame */}
      <motion.rect
        x="20" y="20" width="280" height="140" rx="8"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
      {/* Address bar */}
      <motion.rect
        x="35" y="35" width="250" height="24" rx="4"
        fill="rgba(255,255,255,0.05)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      />
      {/* Lock icon */}
      <motion.circle
        cx="48" cy="47" r="5"
        fill="rgba(74,222,128,0.3)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
      />
      {/* Domain text */}
      <motion.text
        x="60" y="51" fill="rgba(255,255,255,0.6)"
        fontSize="11" fontFamily="ui-monospace"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        acme.co/
      </motion.text>
      <motion.text
        x="112" y="51" fill="rgba(255,255,255,0.9)"
        fontSize="11" fontFamily="ui-monospace" fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        summer-sale
      </motion.text>
      {/* Content placeholder */}
      <motion.rect x="35" y="70" width="180" height="8" rx="2" fill="rgba(255,255,255,0.15)"
        initial={{ width: 0 }} animate={{ width: 180 }} transition={{ delay: 0.5, duration: 0.5 }} />
      <motion.rect x="35" y="85" width="140" height="6" rx="2" fill="rgba(255,255,255,0.1)"
        initial={{ width: 0 }} animate={{ width: 140 }} transition={{ delay: 0.6, duration: 0.4 }} />
      <motion.rect x="35" y="98" width="200" height="6" rx="2" fill="rgba(255,255,255,0.1)"
        initial={{ width: 0 }} animate={{ width: 200 }} transition={{ delay: 0.7, duration: 0.4 }} />
    </svg>
  </div>
);

// Security Shield Visual
export const SecurityShieldVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      {/* Shield path */}
      <motion.path
        d="M100,15 L160,35 L160,85 C160,120 130,150 100,165 C70,150 40,120 40,85 L40,35 Z"
        fill="rgba(255,255,255,0.05)"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: appleEase }}
      />
      {/* Inner glow */}
      <motion.circle
        cx="100" cy="85" r="25"
        fill="rgba(74,222,128,0.1)"
        stroke="rgba(74,222,128,0.3)"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ delay: 0.3, duration: 2, repeat: Infinity, repeatDelay: 1 }}
      />
      {/* Checkmark */}
      <motion.path
        d="M85,85 L95,95 L115,75"
        stroke="rgba(74,222,128,0.9)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      />
      {/* Scan lines */}
      {[0, 1, 2].map((i) => (
        <motion.line
          key={i}
          x1="50" y1={50 + i * 20}
          x2="150" y2={50 + i * 20}
          stroke="rgba(74,222,128,0.2)"
          strokeWidth="1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: [0, 0.5, 0], x: 0 }}
          transition={{ delay: 0.8 + i * 0.2, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
        />
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
        <motion.line
          key={i}
          x1="40" y1={40 + i * 35}
          x2="290" y2={40 + i * 35}
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
        />
      ))}
      {/* Bar chart */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <motion.rect
          key={i}
          x={55 + i * 35}
          y={145 - (30 + Math.sin(i * 0.8) * 50 + i * 8)}
          width="20"
          height={30 + Math.sin(i * 0.8) * 50 + i * 8}
          rx="4"
          fill={`rgba(255,255,255,${0.1 + i * 0.08})`}
          initial={{ height: 0, y: 145 }}
          animate={{ height: 30 + Math.sin(i * 0.8) * 50 + i * 8, y: 145 - (30 + Math.sin(i * 0.8) * 50 + i * 8) }}
          transition={{ delay: 0.1 * i, duration: 0.6, ease: appleEase }}
        />
      ))}
      {/* Trend line */}
      <motion.path
        d="M65,110 Q100,95 135,85 T205,60 T275,45"
        fill="none"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 1, ease: appleEase }}
      />
      {/* Dot at end */}
      <motion.circle
        cx="275" cy="45" r="5"
        fill="rgba(255,255,255,0.8)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      />
    </svg>
  </div>
);

// QR Code Visual
export const QRCodeVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: appleEase }}
      >
        {/* QR frame */}
        <rect x="40" y="30" width="120" height="120" rx="8" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" />
        {/* QR pattern */}
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 7 }).map((_, col) => {
            const isCorner = (row < 2 && col < 2) || (row < 2 && col > 4) || (row > 4 && col < 2);
            const show = isCorner || Math.random() > 0.4;
            return show ? (
              <motion.rect
                key={`${row}-${col}`}
                x={50 + col * 14}
                y={40 + row * 14}
                width="12"
                height="12"
                rx="2"
                fill={isCorner ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.25)"}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.05 * (row + col), duration: 0.3 }}
              />
            ) : null;
          })
        )}
        {/* Center logo */}
        <motion.circle
          cx="100" cy="90" r="12"
          fill="rgba(255,255,255,0.9)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        />
      </motion.g>
    </svg>
  </div>
);

// Expiration Clock Visual
export const ExpirationClockVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      {/* Clock face */}
      <motion.circle
        cx="100" cy="90" r="60"
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {/* Progress arc */}
      <motion.circle
        cx="100" cy="90" r="60"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="377"
        initial={{ strokeDashoffset: 377 }}
        animate={{ strokeDashoffset: 120 }}
        transition={{ duration: 2, ease: appleEase }}
        style={{ transform: "rotate(-90deg)", transformOrigin: "100px 90px" }}
      />
      {/* Hour hand */}
      <motion.line
        x1="100" y1="90" x2="100" y2="55"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      />
      {/* Minute hand */}
      <motion.line
        x1="100" y1="90" x2="130" y2="75"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
      />
      {/* Center dot */}
      <motion.circle
        cx="100" cy="90" r="4"
        fill="rgba(255,255,255,0.8)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.4, type: "spring" }}
      />
      {/* Countdown text */}
      <motion.text
        x="100" y="135" textAnchor="middle"
        fill="rgba(255,255,255,0.6)" fontSize="10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        expires in 7 days
      </motion.text>
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
        <motion.g key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <circle cx={node.x} cy={node.y} r="6" fill="rgba(255,255,255,0.3)" />
          <text x={node.x + 12} y={node.y + 4} fill="rgba(255,255,255,0.5)" fontSize="9">{node.label}</text>
        </motion.g>
      ))}
      {/* Flow paths */}
      {[40, 80, 120, 160].map((y, i) => (
        <motion.path
          key={i}
          d={`M56,${y} Q160,${y} 250,90`}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
        />
      ))}
      {/* Particles */}
      {[40, 80, 120, 160].map((y, i) => (
        <motion.circle
          key={`p-${i}`}
          r="2"
          fill="rgba(255,255,255,0.8)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ delay: 0.5 + i * 0.15, duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
          style={{ offsetPath: `path("M56,${y} Q160,${y} 250,90")` } as any}
        />
      ))}
      {/* Revenue node */}
      <motion.circle
        cx="260" cy="90" r="20"
        fill="rgba(255,255,255,0.1)"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      />
      <motion.text
        x="260" y="94" textAnchor="middle"
        fill="rgba(255,255,255,0.9)" fontSize="10" fontWeight="bold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        $150K
      </motion.text>
    </svg>
  </div>
);

// Cross Device Visual
export const CrossDeviceVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Phone */}
      <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
        <rect x="40" y="50" width="40" height="70" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="48" y="58" width="24" height="45" rx="2" fill="rgba(255,255,255,0.1)" />
        <circle cx="60" cy="112" r="3" fill="rgba(255,255,255,0.2)" />
      </motion.g>
      {/* Tablet */}
      <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <rect x="120" y="40" width="70" height="90" rx="6" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="128" y="48" width="54" height="70" rx="2" fill="rgba(255,255,255,0.1)" />
        <circle cx="155" cy="125" r="3" fill="rgba(255,255,255,0.2)" />
      </motion.g>
      {/* Desktop */}
      <motion.g initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <rect x="220" y="45" width="80" height="55" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <rect x="228" y="52" width="64" height="40" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="250" y="100" width="20" height="6" rx="2" fill="rgba(255,255,255,0.1)" />
        <rect x="240" y="106" width="40" height="4" rx="2" fill="rgba(255,255,255,0.1)" />
      </motion.g>
      {/* Connection lines */}
      <motion.path
        d="M80,85 L120,85 M190,85 L220,72"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="2"
        strokeDasharray="4 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      />
      {/* Identity badge */}
      <motion.g
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, type: "spring" }}
      >
        <circle cx="160" cy="145" r="12" fill="rgba(74,222,128,0.2)" stroke="rgba(74,222,128,0.5)" strokeWidth="1.5" />
        <text x="160" y="149" textAnchor="middle" fill="rgba(74,222,128,0.9)" fontSize="8" fontWeight="bold">ID</text>
      </motion.g>
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
      <motion.path
        d="M50,120 Q80,110 110,100 T170,75 T200,65"
        fill="none"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: appleEase }}
      />
      {/* Prediction zone */}
      <motion.path
        d="M200,65 Q230,55 260,45 L260,75 Q230,65 200,65"
        fill="rgba(74,222,128,0.1)"
        stroke="none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      />
      {/* Prediction line */}
      <motion.path
        d="M200,65 Q230,55 260,45"
        fill="none"
        stroke="rgba(74,222,128,0.6)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="6 4"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      />
      {/* Prediction dots */}
      <motion.circle
        cx="230" cy="55" r="4"
        fill="rgba(74,222,128,0.5)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      />
      <motion.circle
        cx="260" cy="45" r="4"
        fill="rgba(74,222,128,0.5)"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.6, type: "spring" }}
      />
      {/* Label */}
      <motion.text
        x="260" y="35" textAnchor="middle"
        fill="rgba(74,222,128,0.8)" fontSize="9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        85% conf.
      </motion.text>
    </svg>
  </div>
);

// AI Command Visual
export const AICommandVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 320 180" className="w-full h-full max-w-[320px]">
      {/* Chat container */}
      <motion.rect
        x="40" y="20" width="240" height="140" rx="12"
        fill="rgba(255,255,255,0.03)"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      />
      {/* User message */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <rect x="140" y="35" width="120" height="28" rx="8" fill="rgba(255,255,255,0.1)" />
        <text x="200" y="53" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="8">
          best performing channel?
        </text>
      </motion.g>
      {/* AI response */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
        <rect x="60" y="75" width="150" height="45" rx="8" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.2)" strokeWidth="1" />
        <text x="70" y="93" fill="rgba(255,255,255,0.7)" fontSize="8">LinkedIn drives 32% of</text>
        <text x="70" y="106" fill="rgba(255,255,255,0.7)" fontSize="8">revenue with lowest CPA</text>
      </motion.g>
      {/* Typing indicator */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }} transition={{ delay: 0.3, duration: 1, times: [0, 0.5, 1] }}>
        <circle cx="70" cy="140" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="82" cy="140" r="3" fill="rgba(255,255,255,0.3)" />
        <circle cx="94" cy="140" r="3" fill="rgba(255,255,255,0.3)" />
      </motion.g>
    </svg>
  </div>
);

// Anomaly Radar Visual
export const AnomalyRadarVisual = () => (
  <div className="w-full h-full flex items-center justify-center">
    <svg viewBox="0 0 200 180" className="w-full h-full max-w-[200px]">
      {/* Radar circles */}
      {[20, 40, 60].map((r, i) => (
        <motion.circle
          key={i}
          cx="100" cy="90" r={r}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        />
      ))}
      {/* Sweep line */}
      <motion.line
        x1="100" y1="90" x2="100" y2="30"
        stroke="rgba(74,222,128,0.5)"
        strokeWidth="2"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "100px 90px" }}
      />
      {/* Anomaly dot */}
      <motion.circle
        cx="130" cy="60" r="6"
        fill="rgba(239,68,68,0.3)"
        stroke="rgba(239,68,68,0.8)"
        strokeWidth="2"
        initial={{ scale: 0 }}
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ delay: 1, duration: 1, repeat: Infinity }}
      />
      {/* Label */}
      <motion.text
        x="100" y="165" textAnchor="middle"
        fill="rgba(255,255,255,0.5)" fontSize="9"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        monitoring 24/7
      </motion.text>
    </svg>
  </div>
);
