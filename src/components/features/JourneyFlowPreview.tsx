import { motion } from "framer-motion";
import { LinkedInIcon, GoogleIcon, HubSpotIcon, ZoomIcon } from "@/components/icons/SocialIcons";
import { DollarSign } from "lucide-react";

export const JourneyFlowPreview = () => {
  const nodes = [
    { id: "linkedin", label: "LinkedIn", x: 40, y: 30, value: "2,400", icon: LinkedInIcon, color: "#0A66C2" },
    { id: "email", label: "HubSpot", x: 40, y: 70, value: "1,800", icon: HubSpotIcon, color: "#FF7A59" },
    { id: "google", label: "Google Ads", x: 40, y: 110, value: "3,200", icon: GoogleIcon, color: "#4285F4" },
    { id: "webinar", label: "Webinar", x: 180, y: 50, value: "1,600", icon: ZoomIcon, color: "#2D8CFF" },
    { id: "demo", label: "Demo", x: 180, y: 90, value: "890", icon: null, color: "#10B981" },
    { id: "revenue", label: "$127K", x: 320, y: 70, value: "", icon: null, color: "#FFFFFF" },
  ];

  const flows = [
    { from: "linkedin", to: "webinar", width: 3, delay: 0, color: "#0A66C2" },
    { from: "linkedin", to: "demo", width: 2, delay: 0.2, color: "#0A66C2" },
    { from: "email", to: "webinar", width: 2, delay: 0.4, color: "#FF7A59" },
    { from: "email", to: "demo", width: 3, delay: 0.6, color: "#FF7A59" },
    { from: "google", to: "demo", width: 4, delay: 0.8, color: "#4285F4" },
    { from: "webinar", to: "revenue", width: 4, delay: 1.0, color: "#2D8CFF" },
    { from: "demo", to: "revenue", width: 5, delay: 1.2, color: "#10B981" },
  ];

  const getNodePos = (id: string) => nodes.find(n => n.id === id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl p-8 shadow-xl bg-zinc-900/40 border-2 border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground mb-1">
            customer journey flow
          </h3>
          <p className="text-sm text-white/50">last 30 days • 7,400 touchpoints</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-white/80">live</span>
        </div>
      </div>

      {/* Sankey-style Flow Diagram */}
      <div className="relative h-48 rounded-xl overflow-hidden bg-white/5 p-4">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 150">
          {/* Flow paths with brand colors */}
          {flows.map((flow, i) => {
            const from = getNodePos(flow.from);
            const to = getNodePos(flow.to);
            if (!from || !to) return null;
            
            const midX = (from.x + to.x) / 2;
            
            return (
              <motion.path
                key={i}
                d={`M ${from.x + 50} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                fill="none"
                stroke={flow.color}
                strokeOpacity={0.3}
                strokeWidth={flow.width}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: flow.delay }}
              />
            );
          })}

          {/* Animated particles along paths */}
          {flows.map((flow, i) => {
            const from = getNodePos(flow.from);
            const to = getNodePos(flow.to);
            if (!from || !to) return null;
            
            const midX = (from.x + to.x) / 2;
            const pathId = `path-${i}`;
            
            return (
              <g key={`particle-${i}`}>
                <defs>
                  <path
                    id={pathId}
                    d={`M ${from.x + 50} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                  />
                </defs>
                <motion.circle
                  r="3"
                  fill={flow.color}
                  filter="drop-shadow(0 0 4px white)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 1, 0] }}
                  transition={{
                    duration: 2,
                    delay: flow.delay + 1,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    begin={`${flow.delay + 1}s`}
                  >
                    <mpath href={`#${pathId}`} />
                  </animateMotion>
                </motion.circle>
              </g>
            );
          })}

          {/* Nodes with brand icons */}
          {nodes.map((node, i) => (
            <g key={node.id}>
              {node.id === "revenue" ? (
                <>
                  <motion.circle
                    cx={node.x}
                    cy={node.y}
                    r="28"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.4, type: "spring" }}
                  />
                  <motion.text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="fill-white font-bold text-sm"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1.6 }}
                  >
                    {node.label}
                  </motion.text>
                </>
              ) : (
                <>
                  <motion.rect
                    x={node.x - 5}
                    y={node.y - 12}
                    width="60"
                    height="24"
                    rx="4"
                    fill={`${node.color}20`}
                    stroke={node.color}
                    strokeOpacity={0.4}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  />
                  {/* Brand icon using foreignObject */}
                  {node.icon && (
                    <foreignObject x={node.x - 2} y={node.y - 9} width="18" height="18">
                      <div className="flex items-center justify-center w-full h-full">
                        <node.icon className="w-3.5 h-3.5" />
                      </div>
                    </foreignObject>
                  )}
                  <motion.text
                    x={node.icon ? node.x + 32 : node.x + 22}
                    y={node.y + 4}
                    textAnchor="middle"
                    className="fill-white/80 text-[9px] font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    {node.label}
                  </motion.text>
                </>
              )}
            </g>
          ))}
        </svg>
      </div>

      {/* Stats Row */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-4 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-foreground">3.2</div>
          <div className="text-xs text-white/50">avg touchpoints</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/10">
          <div className="text-2xl font-bold text-white/90">42%</div>
          <div className="text-xs text-white/80">webinar path</div>
        </div>
        <div className="text-center p-4 rounded-lg bg-white/5">
          <div className="text-2xl font-bold text-foreground">$127K</div>
          <div className="text-xs text-white/50">attributed revenue</div>
        </div>
      </div>
    </motion.div>
  );
};
