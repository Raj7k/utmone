import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BarChart2, Link2, Users } from "lucide-react";

export const AIInsightPipelineVisual = () => {
  const [pulses, setPulses] = useState<{ id: number; delay: number }[]>([]);
  useEffect(() => { setPulses(Array.from({ length: 6 }, (_, i) => ({ id: i, delay: i * 0.6 }))); }, []);
  const inputs = [{ y: 12, icon: BarChart2, label: "Metrics" }, { y: 27, icon: Link2, label: "Links" }, { y: 42, icon: Users, label: "Audience" }];
  const processors = [{ x: 50, y: 20, label: "Predict" }, { x: 50, y: 38, label: "Attribute" }];

  return (
    <svg viewBox="0 0 120 60" className="w-full h-full">
      <defs>
        <linearGradient id="aiFlow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.5" /><stop offset="100%" stopColor="#EC4899" stopOpacity="0.3" /></linearGradient>
        <linearGradient id="aiOutput" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#EC4899" stopOpacity="0.5" /><stop offset="100%" stopColor="#22C55E" stopOpacity="0.4" /></linearGradient>
        <filter id="aiGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="1" /><feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      {inputs.map((input, i) => (<motion.g key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}><rect x="6" y={input.y} width="14" height="6" rx="1" fill="rgba(139,92,246,0.15)" stroke="#8B5CF6" strokeOpacity="0.4" strokeWidth="0.3" /><foreignObject x="7.5" y={input.y + 0.8} width="4" height="4"><input.icon className="w-full h-full text-purple-400" style={{ opacity: 0.7 }} /></foreignObject><text x="15" y={input.y + 4.2} fill="white" fontSize="2" fontFamily="ui-monospace" opacity="0.5">{input.label}</text></motion.g>))}
      {inputs.map((input, i) => (<motion.path key={i} d={`M 20 ${input.y + 3} Q 35 ${input.y + 3}, 48 ${i === 1 ? 30 : i === 0 ? 23 : 41}`} fill="none" stroke="url(#aiFlow)" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} />))}
      {processors.map((proc, i) => (<motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + i * 0.1 }}><rect x={proc.x} y={proc.y} width="18" height="8" rx="1.5" fill="rgba(236,72,153,0.15)" stroke="#EC4899" strokeOpacity="0.4" strokeWidth="0.3" /><text x={proc.x + 9} y={proc.y + 5.5} fill="white" fontSize="2.5" textAnchor="middle" fontFamily="ui-monospace" opacity="0.7">{proc.label}</text></motion.g>))}
      {processors.map((proc, i) => (<motion.path key={i} d={`M 68 ${proc.y + 4} Q 78 ${proc.y + 4}, 88 30`} fill="none" stroke="url(#aiOutput)" strokeWidth="0.8" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.7 + i * 0.1 }} />))}
      <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }}><circle cx="100" cy="30" r="8" fill="rgba(34,197,94,0.2)" stroke="#22C55E" strokeWidth="0.5" filter="url(#aiGlow)" /><text x="100" y="28.5" fill="white" fontSize="3" textAnchor="middle" fontFamily="ui-monospace" opacity="0.9">AI</text><text x="100" y="33" fill="white" fontSize="2" textAnchor="middle" fontFamily="ui-monospace" opacity="0.5">insight</text></motion.g>
      {pulses.map((p) => (<motion.circle key={p.id} r="1" fill="#EC4899" filter="url(#aiGlow)" initial={{ offsetDistance: "0%", opacity: 0 }} animate={{ offsetDistance: ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 2, delay: p.delay, repeat: Infinity, repeatDelay: 2 }} style={{ offsetPath: `path("M 20 ${15 + (p.id % 3) * 15} Q 35 ${15 + (p.id % 3) * 15}, 59 ${p.id % 2 === 0 ? 24 : 42} Q 78 ${p.id % 2 === 0 ? 24 : 42}, 92 30")` }} />))}
      <motion.text x="60" y="56" fill="white" fontSize="2.5" fontFamily="ui-monospace" textAnchor="middle" fillOpacity="0.4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>Predict · Attribute · Optimize</motion.text>
    </svg>
  );
};
