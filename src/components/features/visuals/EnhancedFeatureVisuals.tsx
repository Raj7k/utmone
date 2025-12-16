import { motion } from "framer-motion";
import { Bot, Users, AlertTriangle, Link, TrendingUp, DollarSign, Clock, Zap, Target, BarChart3, Layers, Shield } from "lucide-react";

// ===== UTM BUILDER VISUALS =====

// AI UTM Generator Visual - typing animation with AI generating UTMs
export const AIUTMGeneratorVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="8" width="100" height="44" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    {/* AI prompt input */}
    <motion.rect x="15" y="13" width="90" height="14" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <motion.text x="20" y="23" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="ui-monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      "black friday email..."
    </motion.text>
    {/* AI sparkle */}
    <motion.circle cx="98" cy="20" r="4" fill="rgba(147,51,234,0.3)"
      animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 2, repeat: Infinity }} />
    {/* Generated UTM output */}
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
      <motion.rect x="15" y="32" width="90" height="16" rx="3" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
      <motion.text x="20" y="42" fill="rgba(74,222,128,0.8)" fontSize="5" fontFamily="ui-monospace">
        utm_source=email&utm_campaign=bf24
      </motion.text>
    </motion.g>
  </svg>
);

// Team Velocity Visual - animated bar chart racing
export const TeamVelocityVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {[
      { name: "Sarah", count: 47, delay: 0 },
      { name: "Mike", count: 32, delay: 0.1 },
      { name: "Emma", count: 28, delay: 0.2 },
    ].map((member, i) => (
      <motion.g key={member.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: member.delay }}>
        <text x="12" y={18 + i * 16} fill="rgba(255,255,255,0.5)" fontSize="7">{member.name}</text>
        <rect x="42" y={12 + i * 16} width="70" height="10" rx="2" fill="rgba(255,255,255,0.05)" />
        <motion.rect x="42" y={12 + i * 16} rx="2" height="10"
          fill={i === 0 ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.2)"}
          initial={{ width: 0 }} animate={{ width: member.count * 1.3 }} transition={{ delay: 0.3 + member.delay, duration: 0.6 }} />
        <motion.text x={48 + member.count * 1.3} y={20 + i * 16} fill="rgba(255,255,255,0.7)" fontSize="6" fontWeight="bold"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + member.delay }}>
          {member.count}
        </motion.text>
      </motion.g>
    ))}
  </svg>
);

// Conflict Detection Visual
export const ConflictDetectionVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="15" y="10" width="90" height="18" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    <motion.text x="20" y="22" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="ui-monospace">utm_campaign=launch</motion.text>
    <motion.rect x="15" y="32" width="90" height="18" rx="3" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.3)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
    <motion.text x="20" y="44" fill="rgba(239,68,68,0.8)" fontSize="6" fontFamily="ui-monospace"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      utm_campaign=launch ⚠️
    </motion.text>
    <motion.circle cx="100" cy="41" r="6" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }} />
    <motion.text x="98" y="43" fill="rgba(239,68,68,0.9)" fontSize="8" fontWeight="bold"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>!</motion.text>
  </svg>
);

// UTM Inheritance Visual
export const UTMInheritanceVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Parent campaign */}
    <motion.rect x="35" y="5" width="50" height="14" rx="3" fill="rgba(147,51,234,0.2)" stroke="rgba(147,51,234,0.4)" strokeWidth="1" />
    <motion.text x="60" y="14" textAnchor="middle" fill="rgba(147,51,234,0.8)" fontSize="6">Campaign</motion.text>
    {/* Lines to children */}
    <motion.path d="M45,19 L45,28 M60,19 L60,28 M75,19 L75,28" stroke="rgba(255,255,255,0.2)" strokeWidth="1" strokeDasharray="2 2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.4 }} />
    {/* Child links */}
    {[30, 50, 70].map((x, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
        <rect x={x} y="30" width="20" height="10" rx="2" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <text x={x + 10} y="37" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5">Link {i + 1}</text>
      </motion.g>
    ))}
    {/* Inherited UTM badge */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <rect x="25" y="45" width="70" height="10" rx="2" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
      <text x="60" y="52" textAnchor="middle" fill="rgba(74,222,128,0.7)" fontSize="5">✓ UTMs inherited</text>
    </motion.g>
  </svg>
);

// Performance Prediction Visual
export const PerformancePredictionVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="8" width="100" height="44" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    {/* Prediction bars */}
    {[
      { label: "google", ctr: 3.2, color: "rgba(74,222,128,0.5)" },
      { label: "linkedin", ctr: 2.1, color: "rgba(255,255,255,0.3)" },
      { label: "twitter", ctr: 1.8, color: "rgba(255,255,255,0.2)" },
    ].map((item, i) => (
      <motion.g key={item.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
        <text x="18" y={22 + i * 13} fill="rgba(255,255,255,0.5)" fontSize="6">{item.label}</text>
        <motion.rect x="48" y={16 + i * 13} rx="2" height="8" fill={item.color}
          initial={{ width: 0 }} animate={{ width: item.ctr * 15 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} />
        <motion.text x={55 + item.ctr * 15} y={22 + i * 13} fill="rgba(255,255,255,0.7)" fontSize="6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + i * 0.1 }}>
          {item.ctr}%
        </motion.text>
      </motion.g>
    ))}
  </svg>
);

// Ad Platform Sync Visual
export const AdPlatformSyncVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Platform icons */}
    {[
      { label: "Google", x: 20, color: "rgba(251,191,36,0.4)" },
      { label: "Meta", x: 50, color: "rgba(59,130,246,0.4)" },
      { label: "LinkedIn", x: 80, color: "rgba(10,102,194,0.4)" },
    ].map((platform, i) => (
      <motion.g key={platform.label} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
        <circle cx={platform.x} cy="18" r="10" fill={platform.color} />
        <text x={platform.x} y="21" textAnchor="middle" fill="rgba(255,255,255,0.8)" fontSize="5">{platform.label.slice(0, 1)}</text>
      </motion.g>
    ))}
    {/* Sync arrows */}
    <motion.path d="M30,30 L30,38 M50,30 L50,38 M70,30 L70,38" stroke="rgba(74,222,128,0.5)" strokeWidth="1.5" markerEnd="url(#syncArrow)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.3 }} />
    {/* utm.one box */}
    <motion.rect x="20" y="40" width="60" height="14" rx="3" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.3)" strokeWidth="1"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
    <motion.text x="50" y="49" textAnchor="middle" fill="rgba(74,222,128,0.8)" fontSize="6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>utm.one</motion.text>
    <defs>
      <marker id="syncArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <polygon points="0 0, 6 3, 0 6" fill="rgba(74,222,128,0.5)" />
      </marker>
    </defs>
  </svg>
);

// ===== ANALYTICS VISUALS =====

// Revenue Waterfall Visual
export const RevenueWaterfallVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {[
      { label: "Start", value: 100, y: 35, color: "rgba(255,255,255,0.2)" },
      { label: "+Paid", value: 30, y: 25, color: "rgba(74,222,128,0.5)" },
      { label: "+Organic", value: 20, y: 18, color: "rgba(74,222,128,0.4)" },
      { label: "-Churn", value: -15, y: 28, color: "rgba(239,68,68,0.4)" },
      { label: "End", value: 135, y: 15, color: "rgba(147,51,234,0.5)" },
    ].map((item, i) => (
      <motion.g key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
        <motion.rect x={15 + i * 20} y={item.y} width="15" rx="2"
          fill={item.color}
          initial={{ height: 0 }} animate={{ height: Math.abs(item.value) * 0.35 }} transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }} />
        <text x={22 + i * 20} y="55" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5">{item.label}</text>
      </motion.g>
    ))}
  </svg>
);

// UTM Decay Alert Visual
export const UTMDecayAlertVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Declining trend line */}
    <motion.path d="M15,20 Q40,22 60,30 T105,45" fill="none" stroke="rgba(239,68,68,0.5)" strokeWidth="2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
    {/* Alert indicator */}
    <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6, type: "spring" }}>
      <circle cx="90" cy="38" r="10" fill="rgba(239,68,68,0.1)" stroke="rgba(239,68,68,0.4)" strokeWidth="1.5" />
      <text x="90" y="42" textAnchor="middle" fill="rgba(239,68,68,0.9)" fontSize="10">↓</text>
    </motion.g>
    {/* Alert badge */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x="60" y="5" width="55" height="12" rx="6" fill="rgba(239,68,68,0.2)" />
      <text x="87" y="13" textAnchor="middle" fill="rgba(239,68,68,0.8)" fontSize="6">⚠️ -32% CTR</text>
    </motion.g>
  </svg>
);

// Budget Reallocation AI Visual
export const BudgetReallocationVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Current vs Recommended */}
    {[
      { channel: "Paid", current: 50, recommended: 35, y: 12 },
      { channel: "Email", current: 25, recommended: 40, y: 28 },
      { channel: "Social", current: 25, recommended: 25, y: 44 },
    ].map((item, i) => (
      <motion.g key={item.channel} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 }}>
        <text x="10" y={item.y + 5} fill="rgba(255,255,255,0.5)" fontSize="6">{item.channel}</text>
        {/* Current (faded) */}
        <motion.rect x="38" y={item.y} width={item.current * 0.8} height="5" rx="1" fill="rgba(255,255,255,0.15)"
          initial={{ width: 0 }} animate={{ width: item.current * 0.8 }} transition={{ delay: 0.2 + i * 0.1 }} />
        {/* Recommended (bright) */}
        <motion.rect x="38" y={item.y + 6} width={item.recommended * 0.8} height="5" rx="1"
          fill={item.recommended > item.current ? "rgba(74,222,128,0.5)" : "rgba(239,68,68,0.4)"}
          initial={{ width: 0 }} animate={{ width: item.recommended * 0.8 }} transition={{ delay: 0.4 + i * 0.1 }} />
      </motion.g>
    ))}
    {/* AI badge */}
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}>
      <rect x="80" y="20" width="35" height="20" rx="4" fill="rgba(147,51,234,0.2)" stroke="rgba(147,51,234,0.4)" strokeWidth="1" />
      <text x="97" y="33" textAnchor="middle" fill="rgba(147,51,234,0.8)" fontSize="7">AI</text>
    </motion.g>
  </svg>
);

// Conversion Lag Heatmap Visual
export const ConversionLagHeatmapVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Heatmap grid */}
    {[0, 1, 2, 3, 4].map((col) =>
      [0, 1, 2].map((row) => {
        const intensity = Math.random() * 0.6 + 0.1;
        const delay = col * 0.05 + row * 0.08;
        return (
          <motion.rect
            key={`${col}-${row}`}
            x={15 + col * 20}
            y={10 + row * 15}
            width="18"
            height="13"
            rx="2"
            fill={`rgba(147,51,234,${intensity})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay }}
          />
        );
      })
    )}
    {/* Labels */}
    <text x="60" y="57" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="5">Days to Convert →</text>
  </svg>
);

// Channel Saturation Curve Visual
export const SaturationCurveVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Axis */}
    <line x1="15" y1="50" x2="110" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <line x1="15" y1="50" x2="15" y2="8" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    {/* Saturation curve */}
    <motion.path
      d="M15,48 Q35,45 50,35 T75,20 Q90,15 110,14"
      fill="none"
      stroke="rgba(74,222,128,0.6)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    {/* Diminishing returns zone */}
    <motion.rect x="70" y="8" width="40" height="42" fill="rgba(239,68,68,0.1)" rx="2"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
    <motion.text x="90" y="20" textAnchor="middle" fill="rgba(239,68,68,0.6)" fontSize="5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      Saturation
    </motion.text>
  </svg>
);

// Real-Time UTM Pulse Visual
export const RealTimePulseVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Heartbeat line */}
    <motion.path
      d="M10,30 L30,30 L35,20 L40,40 L45,25 L50,35 L55,30 L110,30"
      fill="none"
      stroke="rgba(74,222,128,0.6)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
    />
    {/* Pulse dot */}
    <motion.circle
      cx="40"
      cy="30"
      r="4"
      fill="rgba(74,222,128,0.8)"
      animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0.4, 0.8] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    {/* Status badges */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x="70" y="10" width="40" height="16" rx="8" fill="rgba(74,222,128,0.2)" />
      <circle cx="78" cy="18" r="3" fill="rgba(74,222,128,0.8)" />
      <text x="92" y="21" fill="rgba(74,222,128,0.8)" fontSize="6">healthy</text>
    </motion.g>
  </svg>
);

// ===== ATTRIBUTION GRAPH VISUALS =====

// Incremental Lift Visual
export const IncrementalLiftVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Control group */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x="15" y="20" width="40" height="30" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      <text x="35" y="14" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="6">Control</text>
      <motion.rect x="20" y="35" width="30" height="10" rx="2" fill="rgba(255,255,255,0.2)"
        initial={{ width: 0 }} animate={{ width: 30 }} transition={{ delay: 0.3, duration: 0.5 }} />
    </motion.g>
    {/* Test group */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <rect x="65" y="20" width="40" height="30" rx="3" fill="rgba(74,222,128,0.1)" stroke="rgba(74,222,128,0.3)" strokeWidth="1" />
      <text x="85" y="14" textAnchor="middle" fill="rgba(74,222,128,0.6)" fontSize="6">Test</text>
      <motion.rect x="70" y="35" width="30" height="10" rx="2" fill="rgba(74,222,128,0.5)"
        initial={{ width: 0 }} animate={{ width: 30 }} transition={{ delay: 0.5, duration: 0.5 }} />
    </motion.g>
    {/* Lift indicator */}
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
      <text x="60" y="57" textAnchor="middle" fill="rgba(74,222,128,0.8)" fontSize="7" fontWeight="bold">+23% lift</text>
    </motion.g>
  </svg>
);

// Marketing Mix Model Visual
export const MarketingMixVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Pie chart segments */}
    <motion.circle cx="40" cy="30" r="22" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
    {[
      { offset: 0, pct: 35, color: "rgba(59,130,246,0.6)" },
      { offset: 35, pct: 25, color: "rgba(74,222,128,0.5)" },
      { offset: 60, pct: 20, color: "rgba(251,191,36,0.5)" },
      { offset: 80, pct: 20, color: "rgba(147,51,234,0.5)" },
    ].map((seg, i) => (
      <motion.circle
        key={i}
        cx="40" cy="30" r="22"
        fill="none"
        stroke={seg.color}
        strokeWidth="12"
        strokeDasharray={`${seg.pct * 1.38} 138`}
        strokeDashoffset={-seg.offset * 1.38}
        initial={{ strokeDasharray: "0 138" }}
        animate={{ strokeDasharray: `${seg.pct * 1.38} 138` }}
        transition={{ delay: 0.2 + i * 0.15, duration: 0.5 }}
      />
    ))}
    {/* Legend */}
    {["Paid", "Organic", "Social", "Email"].map((label, i) => (
      <motion.g key={label} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 + i * 0.1 }}>
        <circle cx="75" cy={12 + i * 12} r="3" fill={["rgba(59,130,246,0.6)", "rgba(74,222,128,0.5)", "rgba(251,191,36,0.5)", "rgba(147,51,234,0.5)"][i]} />
        <text x="82" y={14 + i * 12} fill="rgba(255,255,255,0.5)" fontSize="6">{label}</text>
      </motion.g>
    ))}
  </svg>
);

// Causal Inference Visual
export const CausalInferenceVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Timeline */}
    <motion.line x1="15" y1="30" x2="105" y2="30" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      initial={{ x2: 15 }} animate={{ x2: 105 }} transition={{ duration: 0.5 }} />
    {/* Events */}
    {[
      { x: 25, label: "Ad", color: "rgba(59,130,246,0.6)" },
      { x: 50, label: "Email", color: "rgba(147,51,234,0.5)" },
      { x: 75, label: "Visit", color: "rgba(251,191,36,0.5)" },
      { x: 100, label: "Buy", color: "rgba(74,222,128,0.6)" },
    ].map((event, i) => (
      <motion.g key={event.label} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.15 }}>
        <circle cx={event.x} cy="30" r="6" fill={event.color} />
        <text x={event.x} y="45" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="5">{event.label}</text>
      </motion.g>
    ))}
    {/* Causal arrow */}
    <motion.path d="M30,20 Q60,5 95,20" fill="none" stroke="rgba(74,222,128,0.4)" strokeWidth="1.5" strokeDasharray="4 2"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.5 }} />
    <motion.text x="60" y="10" textAnchor="middle" fill="rgba(74,222,128,0.6)" fontSize="5"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      causal path
    </motion.text>
  </svg>
);

// Model Comparison Visual
export const ModelComparisonVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {[
      { model: "Last-Click", linkedin: 0, email: 0, google: 100 },
      { model: "Linear", linkedin: 33, email: 33, google: 34 },
      { model: "Clean Track", linkedin: 45, email: 35, google: 20 },
    ].map((row, i) => (
      <motion.g key={row.model} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
        <text x="8" y={16 + i * 18} fill="rgba(255,255,255,0.5)" fontSize="5">{row.model}</text>
        {/* Stacked bar */}
        <motion.rect x="45" y={10 + i * 18} width={row.linkedin * 0.6} height="10" rx="1" fill="rgba(10,102,194,0.5)"
          initial={{ width: 0 }} animate={{ width: row.linkedin * 0.6 }} transition={{ delay: 0.3 + i * 0.1 }} />
        <motion.rect x={45 + row.linkedin * 0.6} y={10 + i * 18} width={row.email * 0.6} height="10" rx="1" fill="rgba(147,51,234,0.5)"
          initial={{ width: 0 }} animate={{ width: row.email * 0.6 }} transition={{ delay: 0.4 + i * 0.1 }} />
        <motion.rect x={45 + (row.linkedin + row.email) * 0.6} y={10 + i * 18} width={row.google * 0.6} height="10" rx="1" fill="rgba(251,191,36,0.5)"
          initial={{ width: 0 }} animate={{ width: row.google * 0.6 }} transition={{ delay: 0.5 + i * 0.1 }} />
      </motion.g>
    ))}
  </svg>
);

// Holdout Test Visual
export const HoldoutTestVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Map outline */}
    <motion.rect x="10" y="10" width="100" height="40" rx="4" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    {/* Regions */}
    {[
      { x: 20, y: 20, type: "test", label: "NYC" },
      { x: 50, y: 25, type: "control", label: "CHI" },
      { x: 80, y: 18, type: "test", label: "LA" },
      { x: 35, y: 38, type: "control", label: "DEN" },
    ].map((region, i) => (
      <motion.g key={region.label} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 + i * 0.1, type: "spring" }}>
        <circle cx={region.x} cy={region.y} r="8"
          fill={region.type === "test" ? "rgba(74,222,128,0.3)" : "rgba(255,255,255,0.1)"}
          stroke={region.type === "test" ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.2)"}
          strokeWidth="1" />
        <text x={region.x} y={region.y + 2} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="4">{region.label}</text>
      </motion.g>
    ))}
  </svg>
);

// Diminishing Returns Visual
export const DiminishingReturnsVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <line x1="15" y1="50" x2="105" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <line x1="15" y1="50" x2="15" y2="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    {/* Curve */}
    <motion.path
      d="M15,48 Q30,40 45,32 T65,22 Q80,18 95,16 L105,15"
      fill="none"
      stroke="rgba(74,222,128,0.6)"
      strokeWidth="2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1 }}
    />
    {/* Optimal point */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <circle cx="65" cy="22" r="5" fill="rgba(147,51,234,0.3)" stroke="rgba(147,51,234,0.6)" strokeWidth="1.5" />
      <text x="65" y="10" textAnchor="middle" fill="rgba(147,51,234,0.8)" fontSize="5">optimal</text>
    </motion.g>
    {/* Labels */}
    <text x="60" y="58" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="5">Spend →</text>
  </svg>
);
