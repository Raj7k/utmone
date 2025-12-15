import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const JourneySankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: string; delay: number; isGolden: boolean }[]>([]);
  useEffect(() => { const paths = [{ path: "M 20 15 Q 45 15, 55 22 Q 75 30, 90 30", isGolden: true }, { path: "M 20 30 Q 45 30, 90 30", isGolden: false }, { path: "M 20 45 Q 45 45, 55 38 Q 75 30, 90 30", isGolden: false }]; setParticles(Array.from({ length: 9 }, (_, i) => ({ id: i, ...paths[i % 3], delay: i * 0.4 }))); }, []);
  const touchpoints = [{ y: 12, label: "Ad", isGolden: true }, { y: 27, label: "Blog" }, { y: 42, label: "Referral" }];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="goldenPath" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#F59E0B" stopOpacity="0.7" /><stop offset="100%" stopColor="#22C55E" stopOpacity="0.5" /></linearGradient>
        <linearGradient id="normalPath" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" /><stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" /></linearGradient>
        <filter id="goldenGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1.2" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {touchpoints.map((tp, i) => (<motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}><rect x="6" y={tp.y} width="14" height="6" rx="1" fill={tp.isGolden ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.08)"} stroke={tp.isGolden ? "#F59E0B" : "#FFFFFF"} strokeOpacity={tp.isGolden ? 0.6 : 0.3} strokeWidth="0.3" /><text x="13" y={tp.y + 4.2} fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" opacity={tp.isGolden ? 0.9 : 0.5}>{tp.label}</text></motion.g>))}
      <motion.path d="M 20 30 Q 45 30, 90 30" fill="none" stroke="url(#normalPath)" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.4 }} />
      <motion.path d="M 20 45 Q 45 45, 55 38 Q 75 30, 90 30" fill="none" stroke="url(#normalPath)" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.5 }} />
      <motion.path d="M 20 15 Q 45 15, 55 22 Q 75 30, 90 30" fill="none" stroke="url(#goldenPath)" strokeWidth="1.2" filter="url(#goldenGlow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.3 }} />
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }}><circle cx="100" cy="30" r="8" fill="rgba(34,197,94,0.2)" stroke="#22C55E" strokeWidth="0.5" /><text x="100" y="28" fill="white" fontSize="4" textAnchor="middle" fontFamily="ui-monospace" opacity="0.9">$</text><text x="100" y="33" fill="white" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" opacity="0.5">revenue</text></motion.g>
      {particles.map((p) => (<motion.circle key={p.id} r={p.isGolden ? "1.2" : "0.8"} fill={p.isGolden ? "#F59E0B" : "#FFFFFF"} filter={p.isGolden ? "url(#goldenGlow)" : undefined} initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: ["0%", "100%"], opacity: [0, p.isGolden ? 1 : 0.5, p.isGolden ? 1 : 0.5, 0] }} transition={{ duration: p.isGolden ? 1.8 : 2, delay: p.delay, repeat: Infinity, repeatDelay: 1.5 }} style={{ offsetPath: `path("${p.path}")` }} />))}
      <motion.text x="60" y="56" fill="white" fontSize="2.5" fontFamily="ui-monospace" textAnchor="middle" fillOpacity="0.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>4.2 avg touchpoints</motion.text>
    </svg>
  );
};
