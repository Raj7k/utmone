import { motion } from "framer-motion";

export const EventHaloVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <defs>
      <linearGradient id="haloGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10B981" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
      </linearGradient>
    </defs>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <rect x="8" y="24" width="18" height="12" rx="1.5" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
      <text x="17" y="32" fill="white" fontSize="3" textAnchor="middle" fontFamily="ui-monospace" opacity="0.6">Booth</text>
      <text x="17" y="44" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" opacity="0.35">100 scans</text>
    </motion.g>
    <motion.path d="M 26 30 C 40 30, 55 30, 68 30" fill="none" stroke="url(#haloGrad)" strokeWidth="1" strokeDasharray="2 1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 }} />
    {[20, 14, 8].map((r, i) => (
      <motion.circle key={i} cx="88" cy="30" r={r} fill="none" stroke="#10B981" strokeWidth="0.3" strokeOpacity={0.15 + i * 0.05} animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.05, 0.2] }} transition={{ duration: 2.5, delay: 0.5 + i * 0.2, repeat: Infinity }} />
    ))}
    <motion.circle cx="88" cy="30" r="4" fill="rgba(16,185,129,0.25)" stroke="#10B981" strokeWidth="0.4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
    <motion.text x="88" y="31.5" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.8 }}>halo</motion.text>
    {[{ x: 78, y: 18 }, { x: 95, y: 22 }, { x: 82, y: 42 }, { x: 98, y: 38 }, { x: 75, y: 30 }, { x: 102, y: 30 }].map((dot, i) => (
      <motion.circle key={i} cx={dot.x} cy={dot.y} r="1" fill="#10B981" initial={{ scale: 0 }} animate={{ scale: 1, opacity: 0.7 }} transition={{ delay: 0.9 + i * 0.08 }} />
    ))}
    <motion.text x="88" y="56" fill="white" fontSize="2.5" fontFamily="ui-monospace" textAnchor="middle" fillOpacity="0.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>+847 halo visitors</motion.text>
  </svg>
);
