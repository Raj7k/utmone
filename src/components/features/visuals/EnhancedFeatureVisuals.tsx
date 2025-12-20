import { useState, useEffect } from "react";
import { Bot, Users, AlertTriangle, Link, TrendingUp, DollarSign, Clock, Zap, Target, BarChart3, Layers, Shield } from "lucide-react";

// Note: This file uses CSS animations instead of framer-motion for better performance.
// Components use inline styles with animation properties or className-based animations.

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

// ============ SHORT LINKS VISUALS ============

// AI Link Optimizer Visual - AI suggesting slug variations
export const AILinkOptimizerVisual = () => {
  const [activeSlug, setActiveSlug] = useState(0);
  const slugSuggestions = [
    { slug: "summer-sale", score: 94 },
    { slug: "sale-2024", score: 87 },
    { slug: "promo-summer", score: 82 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlug((prev) => (prev + 1) % slugSuggestions.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {/* Input indicator */}
      <motion.rect x="10" y="5" width="100" height="12" rx="2" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" />
      <text x="15" y="13" fill="rgba(255,255,255,0.3)" fontSize="4" fontFamily="monospace">https://store.acme.com/...</text>
      
      {/* AI Processing */}
      <motion.circle cx="60" cy="25" r="6" fill="rgba(255,255,255,0.1)" stroke="hsl(var(--primary))" strokeWidth="1"
        animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="60" y="27" textAnchor="middle" fill="hsl(var(--primary))" fontSize="4" fontWeight="600">AI</text>
      
      {/* Slug Suggestions */}
      {slugSuggestions.map((item, idx) => (
        <motion.g key={idx}
          animate={{ opacity: activeSlug === idx ? 1 : 0.4, scale: activeSlug === idx ? 1.02 : 1 }}
          transition={{ duration: 0.3 }}>
          <rect x="15" y={35 + idx * 8} width="70" height="7" rx="1" 
            fill={activeSlug === idx ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"} 
            stroke={activeSlug === idx ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)"} strokeWidth="0.5" />
          <text x="18" y={40 + idx * 8} fill="rgba(255,255,255,0.7)" fontSize="3.5" fontFamily="monospace">
            /{item.slug}
          </text>
          <text x="95" y={40 + idx * 8} textAnchor="middle" fill={activeSlug === idx ? "hsl(var(--primary))" : "rgba(255,255,255,0.4)"} fontSize="3.5" fontWeight="600">
            {item.score}%
          </text>
        </motion.g>
      ))}
    </svg>
  );
};

// Link Health Monitor Visual - Dashboard with health indicators
export const LinkHealthMonitorVisual = () => {
  const [pulseIndex, setPulseIndex] = useState(0);
  const links = [
    { name: "campaign-q4", status: "healthy" },
    { name: "webinar", status: "warning" },
    { name: "old-promo", status: "error" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % links.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy": return "74,222,128";
      case "warning": return "250,204,21";
      case "error": return "248,113,113";
      default: return "255,255,255";
    }
  };

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <text x="10" y="12" fill="rgba(255,255,255,0.6)" fontSize="5" fontWeight="600">Health Monitor</text>
      
      {links.map((link, idx) => {
        const color = getStatusColor(link.status);
        return (
          <motion.g key={idx} animate={{ opacity: pulseIndex === idx ? 1 : 0.6 }}>
            <rect x="10" y={18 + idx * 13} width="100" height="11" rx="2" 
              fill={pulseIndex === idx ? `rgba(${color},0.1)` : "rgba(255,255,255,0.03)"} 
              stroke={`rgba(${color},0.4)`} strokeWidth="0.5" />
            <motion.circle cx="18" cy={23.5 + idx * 13} r="2.5" fill={`rgb(${color})`}
              animate={pulseIndex === idx ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }} />
            <text x="25" y={25.5 + idx * 13} fill="rgba(255,255,255,0.7)" fontSize="4" fontFamily="monospace">
              /{link.name}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};

// Smart Redirect Engine Visual - Device routing
export const SmartRedirectVisual = () => {
  const [activeRoute, setActiveRoute] = useState(0);
  const routes = ["📱 iOS", "🤖 Android", "💻 Desktop"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRoute((prev) => (prev + 1) % routes.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 70" className="w-full h-full" overflow="visible">
      {/* Central Link */}
      <rect x="45" y="26" width="30" height="16" rx="3" fill="rgba(255,255,255,0.1)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <text x="60" y="36" textAnchor="middle" fill="hsl(var(--primary))" fontSize="4" fontWeight="600">/app</text>
      
      {/* Routes */}
      {routes.map((route, idx) => {
        const yPos = 14 + idx * 16;
        const isActive = activeRoute === idx;
        return (
          <motion.g key={idx}>
            <motion.path d={`M 75 34 Q 88 34 93 ${yPos + 7}`} fill="none"
              stroke={isActive ? "hsl(var(--primary))" : "rgba(255,255,255,0.2)"}
              strokeWidth={isActive ? 1.5 : 0.5} strokeDasharray={isActive ? "0" : "2,2"} />
            <motion.rect x="93" y={yPos} width="22" height="13" rx="2" 
              fill={isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"} 
              stroke={isActive ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)"} strokeWidth="0.5"
              animate={{ scale: isActive ? 1.03 : 1 }} />
            <text x="104" y={yPos + 8} textAnchor="middle" fontSize="5">{route.split(" ")[0]}</text>
          </motion.g>
        );
      })}
    </svg>
  );
};

// ===== QR CODE VISUALS =====

// QR Scan Analytics Visual - Animated scan heatmap
export const QRScanAnalyticsVisual = () => {
  const [scanPulse, setScanPulse] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScanPulse((prev) => (prev + 1) % 4);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {/* QR Code Base */}
      <rect x="10" y="10" width="40" height="40" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
      {/* QR Grid Pattern */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <motion.rect key={`${row}-${col}`} x={14 + col * 9} y={14 + row * 9} width="6" height="6" rx="1"
            fill={scanPulse === row ? "hsl(var(--primary))" : "rgba(255,255,255,0.3)"}
            animate={{ opacity: scanPulse === row ? [0.5, 1, 0.5] : 0.3 }}
            transition={{ duration: 0.5 }} />
        ))
      )}
      
      {/* Scan Pulse Ring */}
      <motion.circle cx="30" cy="30" r="22" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"
        animate={{ r: [22, 28, 22], opacity: [0.5, 0, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      
      {/* Analytics Panel */}
      <rect x="58" y="8" width="55" height="44" rx="3" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <text x="63" y="18" fill="rgba(255,255,255,0.5)" fontSize="4">Scans Today</text>
      <motion.text x="63" y="28" fill="hsl(var(--primary))" fontSize="8" fontWeight="700"
        key={scanPulse} initial={{ opacity: 0.7 }} animate={{ opacity: 1 }}>
        {1247 + scanPulse}
      </motion.text>
      
      {/* Device breakdown */}
      {[
        { device: "iPhone", pct: 62, color: "rgba(74,222,128,0.6)" },
        { device: "Android", pct: 31, color: "rgba(59,130,246,0.6)" },
        { device: "Other", pct: 7, color: "rgba(255,255,255,0.3)" },
      ].map((item, idx) => (
        <motion.g key={item.device} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.1 }}>
          <text x="63" y={38 + idx * 6} fill="rgba(255,255,255,0.4)" fontSize="3.5">{item.device}</text>
          <motion.rect x="83" y={35 + idx * 6} rx="1" height="3" fill={item.color}
            initial={{ width: 0 }} animate={{ width: item.pct * 0.25 }} transition={{ delay: 0.3, duration: 0.4 }} />
          <text x={85 + item.pct * 0.25 + 2} y={38 + idx * 6} fill="rgba(255,255,255,0.5)" fontSize="3">{item.pct}%</text>
        </motion.g>
      ))}
    </svg>
  );
};

// Dynamic QR Redirect Visual - Change destination without reprinting
export const DynamicQRRedirectVisual = () => {
  const [destination, setDestination] = useState(0);
  const destinations = ["/summer-sale", "/fall-promo", "/holiday-deals"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setDestination((prev) => (prev + 1) % destinations.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {/* Static Printed QR */}
      <rect x="10" y="10" width="35" height="35" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <rect key={`${row}-${col}`} x={15 + col * 10} y={15 + row * 10} width="7" height="7" rx="1" fill="rgba(255,255,255,0.4)" />
        ))
      )}
      <text x="27.5" y="52" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="4">Printed QR</text>
      
      {/* Arrow */}
      <motion.path d="M 50 27 L 62 27" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" markerEnd="url(#qrArrow)"
        animate={{ x: [0, 3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
      
      {/* Dynamic Destination Panel */}
      <rect x="68" y="8" width="45" height="44" rx="3" fill="rgba(255,255,255,0.05)" stroke="hsl(var(--primary))" strokeWidth="1" />
      <text x="73" y="18" fill="rgba(255,255,255,0.5)" fontSize="4">Destination</text>
      
      {destinations.map((dest, idx) => (
        <motion.g key={dest}>
          <motion.rect x="73" y={22 + idx * 10} width="35" height="8" rx="2"
            fill={destination === idx ? "rgba(74,222,128,0.15)" : "rgba(255,255,255,0.03)"}
            stroke={destination === idx ? "rgba(74,222,128,0.5)" : "rgba(255,255,255,0.1)"}
            strokeWidth="0.5" />
          <text x="90.5" y={28 + idx * 10} textAnchor="middle"
            fill={destination === idx ? "rgba(74,222,128,0.9)" : "rgba(255,255,255,0.4)"} fontSize="4">
            {dest}
          </text>
        </motion.g>
      ))}
      
      <defs>
        <marker id="qrArrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <polygon points="0 0, 6 3, 0 6" fill="hsl(var(--primary))" />
        </marker>
      </defs>
    </svg>
  );
};

// QR Brand Studio Visual - Customization preview
export const QRBrandStudioVisual = () => {
  const [colorIdx, setColorIdx] = useState(0);
  const colors = ["hsl(var(--primary))", "rgba(239,68,68,0.8)", "rgba(59,130,246,0.8)", "rgba(168,85,247,0.8)"];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setColorIdx((prev) => (prev + 1) % colors.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {/* QR Preview */}
      <rect x="10" y="8" width="44" height="44" rx="4" fill="rgba(255,255,255,0.1)" stroke={colors[colorIdx]} strokeWidth="1.5" />
      {/* QR Pattern with brand color */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3].map((col) => {
          const isCorner = (row === 0 && col === 0) || (row === 0 && col === 3) || (row === 3 && col === 0);
          return (
            <motion.rect key={`${row}-${col}`} x={15 + col * 9} y={13 + row * 9} width="7" height="7" rx={isCorner ? 2 : 1}
              fill={isCorner ? colors[colorIdx] : "rgba(255,255,255,0.4)"}
              animate={isCorner ? { scale: [1, 1.1, 1] } : {}} transition={{ duration: 0.5 }} />
          );
        })
      )}
      {/* Center Logo */}
      <motion.circle cx="32" cy="30" r="8" fill="rgba(0,0,0,0.8)" stroke={colors[colorIdx]} strokeWidth="1"
        animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} />
      <text x="32" y="33" textAnchor="middle" fill={colors[colorIdx]} fontSize="6" fontWeight="700">★</text>
      
      {/* Controls Panel */}
      <rect x="60" y="8" width="52" height="44" rx="3" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <text x="65" y="18" fill="rgba(255,255,255,0.5)" fontSize="4">Brand Colors</text>
      
      {/* Color Swatches */}
      {colors.map((color, idx) => (
        <motion.circle key={idx} cx={70 + idx * 10} cy="26" r="4"
          fill={color} stroke={colorIdx === idx ? "white" : "transparent"} strokeWidth="1"
          animate={colorIdx === idx ? { scale: 1.2 } : { scale: 1 }} />
      ))}
      
      {/* Shape Options */}
      <text x="65" y="38" fill="rgba(255,255,255,0.5)" fontSize="4">Corner Style</text>
      {["Square", "Round", "Dot"].map((shape, idx) => (
        <motion.rect key={shape} x={65 + idx * 16} y={42} width="14" height="8" rx="2"
          fill={idx === 1 ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"}
          stroke={idx === 1 ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)"} strokeWidth="0.5" />
      ))}
      <text x="72" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="3">▢</text>
      <text x="88" y="48" textAnchor="middle" fill="hsl(var(--primary))" fontSize="3">◯</text>
      <text x="104" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="3">●</text>
    </svg>
  );
};

// Click Fraud Shield Visual - Bot filtering
export const ClickFraudShieldVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    {/* Shield */}
    <motion.path
      d="M60,8 L85,18 L85,35 C85,45 72,52 60,55 C48,52 35,45 35,35 L35,18 Z"
      fill="rgba(74,222,128,0.1)"
      stroke="rgba(74,222,128,0.5)"
      strokeWidth="1"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    />
    <circle cx="60" cy="28" r="8" fill="rgba(255,255,255,0.1)" stroke="hsl(var(--primary))" strokeWidth="0.5" />
    <text x="60" y="30" textAnchor="middle" fill="hsl(var(--primary))" fontSize="5" fontWeight="600">ML</text>
    <text x="60" y="42" textAnchor="middle" fill="rgba(74,222,128,0.9)" fontSize="6" fontWeight="700">98.7%</text>
    <text x="60" y="48" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="3.5">Bot Detection</text>
  </svg>
);

// Deep Link Intelligence Visual - App deep linking
export const DeepLinkVisual = () => {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStage((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {/* Flow Steps */}
      {["Check", "Found", "Deep", "Done"].map((label, idx) => (
        <motion.g key={idx}>
          <motion.rect x={10 + idx * 28} y="8" width="22" height="12" rx="2"
            fill={stage >= idx ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)"}
            stroke={stage === idx ? "hsl(var(--primary))" : "rgba(255,255,255,0.1)"} strokeWidth="0.5"
            animate={{ scale: stage === idx ? 1.05 : 1 }} />
          <text x={21 + idx * 28} y="16" textAnchor="middle" fill={stage >= idx ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.3)"} fontSize="4">{label}</text>
        </motion.g>
      ))}
      
      {/* App Icon */}
      <motion.rect x="40" y="28" width="40" height="28" rx="6" fill="rgba(255,255,255,0.1)" stroke="hsl(var(--primary))" strokeWidth="1"
        animate={{ scale: stage >= 2 ? [1, 1.02, 1] : 1 }}
        transition={{ duration: 0.5, repeat: stage >= 2 ? Infinity : 0 }} />
      <text x="60" y="42" textAnchor="middle" fontSize="10">📱</text>
      <text x="60" y="52" textAnchor="middle" fill="hsl(var(--primary))" fontSize="3.5">/products</text>
    </svg>
  );
};

// A/B Link Testing Visual - Split funnel
export const ABLinkTestVisual = () => {
  const [variantA, setVariantA] = useState(52);

  useEffect(() => {
    const interval = setInterval(() => {
      setVariantA(50 + Math.floor(Math.random() * 10) - 5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const variantB = 100 - variantA;

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      {/* Source */}
      <rect x="45" y="5" width="30" height="12" rx="2" fill="rgba(255,255,255,0.1)" stroke="hsl(var(--primary))" strokeWidth="0.5" />
      <text x="60" y="13" textAnchor="middle" fill="hsl(var(--primary))" fontSize="4">/sale</text>
      
      {/* Split Lines */}
      <path d="M 45 17 Q 25 25 20 30" fill="none" stroke="rgba(59,130,246,0.6)" strokeWidth="1" />
      <path d="M 75 17 Q 95 25 100 30" fill="none" stroke="rgba(168,85,247,0.6)" strokeWidth="1" />
      
      {/* Variant A */}
      <rect x="5" y="30" width="35" height="25" rx="3" fill="rgba(59,130,246,0.1)" stroke="rgba(59,130,246,0.4)" strokeWidth="0.5" />
      <text x="22.5" y="40" textAnchor="middle" fill="rgba(59,130,246,0.9)" fontSize="5" fontWeight="700">A</text>
      <motion.text x="22.5" y="50" textAnchor="middle" fill="rgba(59,130,246,0.9)" fontSize="6" fontWeight="700"
        key={variantA} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {variantA}%
      </motion.text>
      
      {/* Variant B */}
      <rect x="80" y="30" width="35" height="25" rx="3" fill="rgba(168,85,247,0.1)" stroke="rgba(168,85,247,0.4)" strokeWidth="0.5" />
      <text x="97.5" y="40" textAnchor="middle" fill="rgba(168,85,247,0.9)" fontSize="5" fontWeight="700">B</text>
      <motion.text x="97.5" y="50" textAnchor="middle" fill="rgba(168,85,247,0.9)" fontSize="6" fontWeight="700"
        key={variantB} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {variantB}%
      </motion.text>
    </svg>
  );
};
