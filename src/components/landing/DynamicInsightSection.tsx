import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./SideNavHero";
import { Lightbulb, Zap, Fingerprint, Code2, Bell, CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface DynamicInsightSectionProps {
  selectedUseCase: UseCaseType;
}

const INSIGHT_CONTENT: Record<UseCaseType, {
  insight: string;
  explanation: string;
  principles: string[];
}> = {
  attribution: {
    insight: "attribution isn't about the last touch. it's about measuring influence.",
    explanation: "every touchpoint that contributed to a sale deserves credit proportional to its influence. not just the last one that happened to be there when the customer clicked 'buy'.",
    principles: [
      "Bayesian probability calculates true influence",
      "Credit distributed across 30+ day windows",
      "Lift analysis isolates channel impact",
    ],
  },
  journey: {
    insight: "every visitor leaves breadcrumbs. the question is whether you're collecting them.",
    explanation: "identity isn't binary — known or unknown. it's probabilistic. we stitch anonymous visits to known customers using behavioral fingerprints, not just cookies.",
    principles: [
      "Probabilistic identity matching",
      "Cross-device session linking",
      "18-month visitor memory",
    ],
  },
  links: {
    insight: "a link isn't just a redirect. it's a data contract between you and your future self.",
    explanation: "when you create a link carelessly, you're writing corrupted data to a database you'll query in 6 months. every link should be validated before it exists.",
    principles: [
      "Validation before creation",
      "Enforced naming conventions",
      "Template-driven consistency",
    ],
  },
  intelligence: {
    insight: "the best analytics don't wait for you to log in. they come to you.",
    explanation: "by the time you notice a problem, it's already cost you money. proactive alerts catch anomalies in real-time using statistical analysis — not arbitrary thresholds.",
    principles: [
      "Z-score anomaly detection",
      "Probabilistic forecasting",
      "Real-time alert dispatch",
    ],
  },
  governance: {
    insight: "clean data isn't about rules. it's about making the right thing the easy thing.",
    explanation: "if creating a bad link is easier than creating a good one, people will create bad links. governance should be invisible — defaults that guide without blocking.",
    principles: [
      "Templates as guardrails",
      "Approval workflows for exceptions",
      "Audit trails for accountability",
    ],
  },
};

// Attribution: Influence Flow Visualization
const AttributionVisual = () => (
  <div className="relative h-64 w-full">
    {/* Flow lines */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
      <defs>
        <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
        </linearGradient>
      </defs>
      {/* Source nodes */}
      {[
        { x: 50, y: 40, label: "LinkedIn", delay: 0 },
        { x: 50, y: 80, label: "Google", delay: 0.1 },
        { x: 50, y: 120, label: "Email", delay: 0.2 },
        { x: 50, y: 160, label: "Direct", delay: 0.3 },
      ].map((node, i) => (
        <g key={i}>
          <motion.circle
            cx={node.x}
            cy={node.y}
            r="6"
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: node.delay, duration: 0.3 }}
          />
          <motion.text
            x={node.x + 15}
            y={node.y + 4}
            fill="rgba(255,255,255,0.6)"
            fontSize="10"
            fontFamily="monospace"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: node.delay + 0.2 }}
          >
            {node.label}
          </motion.text>
          {/* Flow line to center */}
          <motion.path
            d={`M ${node.x + 10} ${node.y} Q 200 ${node.y} 320 100`}
            stroke="url(#flowGradient)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: node.delay + 0.3, duration: 1 }}
          />
          {/* Animated particle */}
          <motion.circle
            r="3"
            fill="white"
            filter="drop-shadow(0 0 6px white)"
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ delay: node.delay + 0.5, duration: 2, repeat: Infinity, repeatDelay: 1 }}
            style={{ offsetPath: `path("M ${node.x + 10} ${node.y} Q 200 ${node.y} 320 100")` }}
          />
        </g>
      ))}
      {/* Revenue node */}
      <motion.circle
        cx="350"
        cy="100"
        r="20"
        fill="none"
        stroke="white"
        strokeWidth="1"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      />
      <motion.text
        x="350"
        y="105"
        fill="white"
        fontSize="12"
        fontFamily="monospace"
        textAnchor="middle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        $$$
      </motion.text>
    </svg>
    <motion.div
      className="absolute bottom-0 left-0 right-0 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <span className="text-xs text-white/40 font-mono">influence flows to revenue</span>
    </motion.div>
  </div>
);

// Journey: Timeline & Identity Stitching
const JourneyVisual = () => (
  <div className="relative h-64 w-full flex items-center justify-center">
    {/* Devices */}
    <div className="flex items-center gap-8">
      {[
        { icon: "📱", label: "Mobile", sessions: 3 },
        { icon: "💻", label: "Desktop", sessions: 5 },
        { icon: "📧", label: "Email", sessions: 2 },
      ].map((device, i) => (
        <motion.div
          key={i}
          className="flex flex-col items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <div className="w-16 h-16 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
            {device.icon}
          </div>
          <span className="text-xs text-white/40 mt-2 font-mono">{device.label}</span>
          <span className="text-xs text-white/60">{device.sessions} visits</span>
        </motion.div>
      ))}
    </div>
    
    {/* Stitching lines */}
    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 200">
      <motion.path
        d="M 80 100 L 200 100 L 320 100"
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="2"
        strokeDasharray="4 4"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.6, duration: 1 }}
      />
    </svg>
    
    {/* Unified profile */}
    <motion.div
      className="absolute right-8 top-1/2 -translate-y-1/2"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring" }}
    >
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/20 flex items-center justify-center">
        <Fingerprint className="w-8 h-8 text-white" />
      </div>
      <div className="text-center mt-2">
        <span className="text-xs text-white/60 font-mono">1 identity</span>
      </div>
    </motion.div>
  </div>
);

// Links: Code Block Aesthetic
const LinksVisual = () => {
  const codeLines = [
    { text: "// utm.one link contract", color: "text-white/40" },
    { text: "const link = {", color: "text-white" },
    { text: "  short: 'utm.one/abc123',", color: "text-white/80" },
    { text: "  utm_source: 'linkedin',", color: "text-white/80" },
    { text: "  utm_medium: 'social',", color: "text-white/80" },
    { text: "  utm_campaign: 'q4-launch',", color: "text-white/80" },
    { text: "  validated: true ✓", color: "text-emerald-400" },
    { text: "}", color: "text-white" },
  ];

  return (
    <div className="relative">
      <motion.div
        className="bg-zinc-900/80 border border-white/10 rounded-lg p-4 font-mono text-sm overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="text-white/40 text-xs ml-2">link-contract.js</span>
        </div>
        {codeLines.map((line, i) => (
          <motion.div
            key={i}
            className={line.color}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            {line.text}
          </motion.div>
        ))}
      </motion.div>
      <motion.div
        className="absolute -bottom-2 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-white/40 font-mono">clean input → clean output</span>
      </motion.div>
    </div>
  );
};

// Intelligence: Alert/Notification Style
const IntelligenceVisual = () => {
  const alerts = [
    { type: "spike", message: "Traffic spike detected: +340%", time: "2m ago", icon: Zap },
    { type: "alert", message: "LinkedIn campaign underperforming", time: "1h ago", icon: Bell },
    { type: "insight", message: "Best posting time: Tue 9am", time: "3h ago", icon: Lightbulb },
  ];

  return (
    <div className="space-y-3">
      {alerts.map((alert, i) => (
        <motion.div
          key={i}
          className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.2 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ delay: i * 0.2 + 0.5, duration: 0.5 }}
          >
            <alert.icon className="w-5 h-5 text-white" />
          </motion.div>
          <div className="flex-1">
            <p className="text-sm text-white/90">{alert.message}</p>
            <p className="text-xs text-white/40 font-mono">{alert.time}</p>
          </div>
          <motion.div
            className="w-2 h-2 rounded-full bg-white"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      ))}
      <motion.div
        className="text-center pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="text-xs text-white/40 font-mono">insights that find you</span>
      </motion.div>
    </div>
  );
};

// Governance: Before/After Comparison
const GovernanceVisual = () => (
  <div className="grid grid-cols-2 gap-4">
    {/* Before */}
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="text-xs text-white/40 mb-2 font-mono">before</div>
      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 space-y-2">
        {[
          "utm_source=LinkedIn",
          "utm_source=linkedin",
          "utm_source=li",
          "utm_source=LINKEDIN",
        ].map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-xs font-mono text-red-400/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <XCircle className="w-3 h-3" />
            {item}
          </motion.div>
        ))}
      </div>
      <div className="text-xs text-white/40 mt-2 text-center">4 variations = chaos</div>
    </motion.div>
    
    {/* After */}
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="text-xs text-white/40 mb-2 font-mono">after</div>
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 space-y-2">
        {[
          "utm_source=linkedin",
          "utm_source=linkedin",
          "utm_source=linkedin",
          "utm_source=linkedin",
        ].map((item, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-2 text-xs font-mono text-emerald-400/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <CheckCircle className="w-3 h-3" />
            {item}
          </motion.div>
        ))}
      </div>
      <div className="text-xs text-white/40 mt-2 text-center">1 template = order</div>
    </motion.div>
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
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Left: Quote & Explanation */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-xs font-medium uppercase tracking-widest text-white/40 mb-4">
                  the insight
                </p>
                <h2 
                  className="text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase leading-tight"
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
                className="text-lg text-white/50 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {content.explanation}
              </motion.p>

              {/* Principles as floating badges */}
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {content.principles.map((principle, i) => (
                  <motion.div
                    key={principle}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70 backdrop-blur-sm"
                  >
                    {principle}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Right: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8"
            >
              <VisualComponent />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
