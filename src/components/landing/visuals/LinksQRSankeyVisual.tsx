import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export const LinksQRSankeyVisual = () => {
  const [particles, setParticles] = useState<{ id: number; path: number; delay: number }[]>([]);
  useEffect(() => { setParticles(Array.from({ length: 6 }, (_, i) => ({ id: i, path: i % 3, delay: i * 0.5 }))); }, []);
  const sources = [{ y: 15, color: "#0A66C2", label: "linkedin" }, { y: 30, color: "#EA4335", label: "email" }, { y: 45, color: "#FFFFFF", label: "qr" }];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        {sources.map((src, i) => (<linearGradient key={i} id={`linksFlow-${i}`} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor={src.color} stopOpacity="0.6" /><stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.3" /></linearGradient>))}
        <filter id="linksGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="0.8" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {sources.map((src, i) => (<motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}><rect x="6" y={src.y} width="16" height="6" rx="1" fill={src.color} fillOpacity="0.15" stroke={src.color} strokeOpacity="0.4" strokeWidth="0.3" /><text x="14" y={src.y + 4.2} fill="white" fontSize="2" fontFamily="ui-monospace" opacity="0.5">{src.label}</text></motion.g>))}
      {sources.map((src, i) => (<motion.path key={i} d={`M 22 ${src.y + 3} Q 50 ${src.y + 3}, 65 30`} fill="none" stroke={`url(#linksFlow-${i})`} strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }} />))}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }}><rect x="62" y="24" width="18" height="12" rx="2" fill="rgba(139,92,246,0.2)" stroke="#8B5CF6" strokeWidth="0.4" /><text x="71" y="31.5" fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" opacity="0.8">UTM</text></motion.g>
      <motion.path d="M 80 30 L 95 30" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeOpacity="0.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}><rect x="96" y="23" width="18" height="14" rx="2" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" /><g transform="translate(99, 25)">{[0,1,2,3].map(r=>[0,1,2,3].map(c=>(<rect key={`${r}-${c}`} x={c*2.5} y={r*2.5} width="2" height="2" fill="white" fillOpacity={(r+c)%2===0?0.6:0.2} />)))}</g></motion.g>
      {particles.map((p) => (<motion.circle key={p.id} r="1" fill={sources[p.path].color} filter="url(#linksGlow)" initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.2, delay: p.delay, repeat: Infinity, repeatDelay: 2 }} style={{ offsetPath: `path("M 22 ${sources[p.path].y + 3} Q 50 ${sources[p.path].y + 3}, 65 30")` }} />))}
      <motion.text x="60" y="56" fill="white" fontSize="2.5" fontFamily="ui-monospace" textAnchor="middle" fillOpacity="0.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>100% UTM compliant</motion.text>
    </svg>
  );
};
