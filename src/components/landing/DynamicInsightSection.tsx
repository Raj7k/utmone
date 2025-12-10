import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./SideNavHero";

interface DynamicInsightSectionProps {
  selectedUseCase: UseCaseType;
}

const INSIGHT_CONTENT: Record<UseCaseType, {
  insight: string;
  explanation: string;
  principles: string[];
  caption: string;
}> = {
  attribution: {
    insight: "attribution isn't about the last touch. it's about measuring influence.",
    explanation: "every touchpoint that contributed to a sale deserves credit proportional to its influence. not just the last one that happened to be there when the customer clicked 'buy'.",
    principles: ["Clean Track Intelligence™", "30-day windows", "Lift analysis"],
    caption: "influence flows to revenue",
  },
  journey: {
    insight: "every visitor leaves breadcrumbs. the question is whether you're collecting them.",
    explanation: "identity isn't binary — known or unknown. it's probabilistic. we stitch anonymous visits to known customers using behavioral fingerprints, not just cookies.",
    principles: ["Probabilistic matching", "Cross-device linking", "18-month memory"],
    caption: "many sessions → one identity",
  },
  links: {
    insight: "a link isn't just a redirect. it's a data contract between you and your future self.",
    explanation: "when you create a link carelessly, you're writing corrupted data to a database you'll query in 6 months. every link should be validated before it exists.",
    principles: ["Validation first", "Naming conventions", "Template-driven"],
    caption: "clean input → clean output",
  },
  intelligence: {
    insight: "the best analytics don't wait for you to log in. they come to you.",
    explanation: "by the time you notice a problem, it's already cost you money. proactive alerts catch anomalies in real-time using statistical analysis — not arbitrary thresholds.",
    principles: ["Z-score detection", "Probabilistic forecasts", "Real-time alerts"],
    caption: "insights that find you",
  },
  governance: {
    insight: "clean data isn't about rules. it's about making the right thing the easy thing.",
    explanation: "if creating a bad link is easier than creating a good one, people will create bad links. governance should be invisible — defaults that guide without blocking.",
    principles: ["Templates as guardrails", "Approval workflows", "Audit trails"],
    caption: "chaos → order",
  },
};

// Unified Visual Container - consistent 16:9 aspect ratio
const VisualContainer = ({ children, caption }: { children: React.ReactNode; caption: string }) => (
  <div className="relative">
    <div className="aspect-video bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
      {children}
    </div>
    <motion.p
      className="text-center text-xs text-white/40 font-mono mt-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}
    >
      {caption}
    </motion.p>
  </div>
);

// Attribution: Clean Horizontal Flow
const AttributionVisual = () => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="flowLine" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
      </linearGradient>
    </defs>
    
    {/* Source nodes */}
    {[
      { y: 80, label: "linkedin", value: "32%" },
      { y: 140, label: "google", value: "28%" },
      { y: 200, label: "email", value: "24%" },
      { y: 260, label: "direct", value: "16%" },
    ].map((node, i) => (
      <g key={i}>
        {/* Node circle */}
        <motion.circle
          cx={80}
          cy={node.y}
          r={6}
          fill="white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
        {/* Label */}
        <motion.text
          x={95}
          y={node.y + 4}
          fill="rgba(255,255,255,0.5)"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.2 }}
        >
          {node.label}
        </motion.text>
        {/* Value */}
        <motion.text
          x={170}
          y={node.y + 4}
          fill="rgba(255,255,255,0.3)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 + 0.3 }}
        >
          {node.value}
        </motion.text>
        {/* Flow curve */}
        <motion.path
          d={`M 200 ${node.y} C 350 ${node.y}, 400 180, 500 180`}
          stroke="url(#flowLine)"
          strokeWidth="1"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.3, duration: 0.8 }}
        />
        {/* Animated particle */}
        <motion.circle
          r={2}
          fill="white"
          filter="drop-shadow(0 0 4px white)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ 
            delay: i * 0.2 + 0.8, 
            duration: 1.5, 
            repeat: Infinity, 
            repeatDelay: 2 
          }}
          style={{ 
            offsetPath: `path("M 200 ${node.y} C 350 ${node.y}, 400 180, 500 180")` 
          }}
        />
      </g>
    ))}
    
    {/* Revenue node */}
    <motion.circle
      cx={540}
      cy={180}
      r={24}
      fill="none"
      stroke="white"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
    />
    <motion.text
      x={540}
      y={176}
      fill="white"
      fontSize="14"
      fontFamily="ui-monospace, monospace"
      textAnchor="middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    >
      $1.2M
    </motion.text>
    <motion.text
      x={540}
      y={192}
      fill="rgba(255,255,255,0.4)"
      fontSize="9"
      fontFamily="ui-monospace, monospace"
      textAnchor="middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      revenue
    </motion.text>
  </svg>
);

// Journey: Horizontal Timeline with Identity Stitching
const JourneyVisual = () => (
  <svg className="w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid meet">
    {/* Timeline base line */}
    <motion.line
      x1={80}
      y1={180}
      x2={480}
      y2={180}
      stroke="rgba(255,255,255,0.1)"
      strokeWidth="1"
      strokeDasharray="4 4"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.6 }}
    />
    
    {/* Device nodes */}
    {[
      { x: 120, icon: "M120 165 L120 195 M110 165 L130 165 M115 195 L125 195", label: "mobile", sessions: "3" },
      { x: 280, icon: "M265 165 L295 165 L295 195 L265 195 Z M275 195 L285 195 L285 200", label: "desktop", sessions: "5" },
      { x: 440, icon: "M425 165 L455 180 L425 195 Z", label: "email", sessions: "2" },
    ].map((node, i) => (
      <g key={i}>
        {/* Device icon container */}
        <motion.rect
          x={node.x - 24}
          y={156}
          width={48}
          height={48}
          rx={8}
          fill="rgba(255,255,255,0.05)"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.2 + 0.3 }}
        />
        {/* Simple device icon */}
        <motion.path
          d={node.icon}
          stroke="white"
          strokeWidth="1.5"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: i * 0.2 + 0.5 }}
        />
        {/* Label */}
        <motion.text
          x={node.x}
          y={225}
          fill="rgba(255,255,255,0.4)"
          fontSize="10"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.2 + 0.6 }}
        >
          {node.label}
        </motion.text>
        <motion.text
          x={node.x}
          y={240}
          fill="rgba(255,255,255,0.25)"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
          textAnchor="middle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.2 + 0.7 }}
        >
          {node.sessions} visits
        </motion.text>
      </g>
    ))}
    
    {/* Stitching arrow */}
    <motion.path
      d="M 490 180 L 540 180"
      stroke="rgba(255,255,255,0.3)"
      strokeWidth="1"
      fill="none"
      markerEnd="url(#arrowhead)"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ delay: 1, duration: 0.4 }}
    />
    <defs>
      <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 Z" fill="rgba(255,255,255,0.3)" />
      </marker>
    </defs>
    
    {/* Unified identity */}
    <motion.circle
      cx={570}
      cy={180}
      r={24}
      fill="rgba(255,255,255,0.05)"
      stroke="white"
      strokeWidth="1"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1.2, type: "spring" }}
    />
    <motion.text
      x={570}
      y={184}
      fill="white"
      fontSize="16"
      textAnchor="middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.8 }}
      transition={{ delay: 1.4 }}
    >
      ●
    </motion.text>
    <motion.text
      x={570}
      y={225}
      fill="rgba(255,255,255,0.4)"
      fontSize="10"
      fontFamily="ui-monospace, monospace"
      textAnchor="middle"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
    >
      1 identity
    </motion.text>
  </svg>
);

// Links: Clean Code Block
const LinksVisual = () => {
  const lines = [
    { text: "// link data contract", dim: true },
    { text: "{", dim: false },
    { text: '  "short": "utm.one/abc",', dim: false },
    { text: '  "source": "linkedin",', dim: false },
    { text: '  "medium": "social",', dim: false },
    { text: '  "campaign": "q4-2024",', dim: false },
    { text: '  "valid": true', dim: false, highlight: true },
    { text: "}", dim: false },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <motion.div
        className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
          <span className="text-[10px] text-white/30 font-mono ml-2">contract.json</span>
        </div>
        {/* Code content */}
        <div className="p-4 font-mono text-sm leading-relaxed">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              className={`${line.dim ? 'text-white/30' : line.highlight ? 'text-white' : 'text-white/60'}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 + 0.3 }}
            >
              {line.text}
              {line.highlight && (
                <motion.span
                  className="ml-2 text-white/40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  ✓
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Intelligence: Stacked Alert Cards
const IntelligenceVisual = () => {
  const alerts = [
    { label: "spike", message: "+340% traffic detected", time: "2m" },
    { label: "drop", message: "linkedin underperforming", time: "1h" },
    { label: "insight", message: "best time: tue 9am", time: "3h" },
  ];

  return (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="w-full max-w-sm space-y-3">
        {alerts.map((alert, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-4 p-4 bg-white/[0.03] border border-white/10 rounded-xl"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 + 0.2 }}
          >
            {/* Pulse indicator */}
            <motion.div
              className="w-2 h-2 rounded-full bg-white"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
            />
            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white/80 truncate">{alert.message}</p>
              <p className="text-[10px] text-white/30 font-mono mt-0.5">{alert.label} · {alert.time} ago</p>
            </div>
            {/* Arrow */}
            <svg className="w-4 h-4 text-white/20" viewBox="0 0 16 16" fill="none">
              <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Governance: Before/After Split
const GovernanceVisual = () => (
  <div className="w-full h-full flex items-center justify-center p-8">
    <div className="w-full max-w-lg grid grid-cols-2 gap-6">
      {/* Before */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-[10px] text-white/30 font-mono mb-3 uppercase tracking-wider">before</p>
        <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          {["LinkedIn", "linkedin", "li", "LINKEDIN"].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-xs font-mono text-white/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3 }}
            >
              <span className="text-white/20">×</span>
              <span>utm_source={item}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 font-mono mt-2 text-center">4 variations</p>
      </motion.div>
      
      {/* After */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <p className="text-[10px] text-white/30 font-mono mb-3 uppercase tracking-wider">after</p>
        <div className="space-y-2 p-4 rounded-xl border border-white/10 bg-white/[0.02]">
          {[1, 2, 3, 4].map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-xs font-mono text-white/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.5 }}
            >
              <span className="text-white/40">✓</span>
              <span>utm_source=linkedin</span>
            </motion.div>
          ))}
        </div>
        <p className="text-[10px] text-white/20 font-mono mt-2 text-center">1 template</p>
      </motion.div>
    </div>
  </div>
);

const VISUAL_COMPONENTS: Record<UseCaseType, React.FC> = {
  attribution: AttributionVisual,
  journey: JourneyVisual,
  links: LinksVisual,
  intelligence: IntelligenceVisual,
  governance: GovernanceVisual,
};

export const DynamicInsightSection = ({ selectedUseCase }: DynamicInsightSectionProps) => {
  const content = INSIGHT_CONTENT[selectedUseCase];
  const VisualComponent = VISUAL_COMPONENTS[selectedUseCase];

  return (
    <motion.section 
      className="py-24 md:py-32 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ amount: 0.2, margin: "-50px" }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle ambient glow */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-white/[0.02] rounded-full blur-3xl" />
      </motion.div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-[45%_55%] gap-12 lg:gap-16 items-center"
          >
            {/* Left: Text Content with stacking effect */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 40, rotateX: -10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ amount: 0.3, margin: "-50px" }}
                transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <p className="text-xs font-medium uppercase tracking-widest text-white/30 mb-4">
                  the insight
                </p>
                <h2 
                  className="text-3xl md:text-4xl lg:text-[2.75rem] font-display font-bold leading-[1.15] tracking-tight"
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  "{content.insight}"
                </h2>
              </motion.div>

              <motion.p 
                className="text-base md:text-lg text-white/40 leading-relaxed"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.15, type: "spring", stiffness: 100 }}
              >
                {content.explanation}
              </motion.p>

              {/* Inline bullet-separated principles with stagger */}
              <motion.p
                className="text-sm text-white/25 font-mono"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ amount: 0.3, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.25, type: "spring", stiffness: 100 }}
              >
                {content.principles.map((principle, i) => (
                  <motion.span 
                    key={principle}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {i > 0 && <span className="mx-2">·</span>}
                    {principle}
                  </motion.span>
                ))}
              </motion.p>
            </div>

            {/* Right: Visual with slide-in and 3D effect */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotateY: -15 }}
              whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
              viewport={{ amount: 0.3, margin: "-50px" }}
              transition={{ duration: 0.7, delay: 0.2, type: "spring", stiffness: 80 }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            >
              <VisualContainer caption={content.caption}>
                <VisualComponent />
              </VisualContainer>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.section>
  );
};
