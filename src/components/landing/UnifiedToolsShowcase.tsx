import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Wrench, 
  Zap, 
  Target, 
  ClipboardCheck,
  Link as LinkIcon,
  Tags,
  QrCode,
  BarChart3,
  ShieldCheck,
  Users,
  FlaskConical,
  Globe,
  Layers,
  Scale,
  TrendingUp,
  Calculator,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "./AnimatedSection";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { ROICalculator } from "@/components/growth/ROICalculator";

// Tab definitions
const TOOL_TABS = [
  { id: "core", label: "core tools", icon: Wrench },
  { id: "power", label: "power tools", icon: Zap },
  { id: "strategic", label: "strategic", icon: Target },
  { id: "quiz", label: "data quality", icon: ClipboardCheck },
];

// Core Tools - Bento Grid
const CoreToolsContent = () => {
  const tools = [
    { id: "short-links", icon: LinkIcon, label: "short links", description: "Branded, memorable URLs" },
    { id: "utm-builder", icon: Tags, label: "UTM builder", description: "Consistent campaign tagging" },
    { id: "qr-codes", icon: QrCode, label: "QR codes", description: "Trackable, branded QR codes" },
    { id: "analytics", icon: BarChart3, label: "analytics", description: "Real-time click tracking" },
    { id: "clean-track", icon: ShieldCheck, label: "clean-track", description: "Data validation layer" },
    { id: "governance", icon: Users, label: "governance", description: "Team permissions & approval" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group p-4 rounded-xl cursor-pointer transition-all hover:scale-[1.02]"
            style={{
              background: 'rgba(24, 24, 27, 0.4)',
              backdropFilter: 'blur(40px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: 'rgba(255, 255, 255, 0.08)' }}
            >
              <Icon className="w-5 h-5" style={{ color: 'rgba(255, 255, 255, 0.8)' }} />
            </div>
            <h3 className="text-sm font-semibold lowercase mb-1" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
              {tool.label}
            </h3>
            <p className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
              {tool.description}
            </p>
          </motion.div>
        );
      })}
    </div>
  );
};

// Power Tools Content
const PowerToolsContent = () => {
  const [activeTool, setActiveTool] = useState("testing");
  
  const tools = [
    { 
      id: "testing", 
      icon: FlaskConical, 
      label: "A/B testing", 
      description: "Auto winner detection",
      preview: (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs w-6" style={{ color: 'rgba(255,255,255,0.5)' }}>A</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'rgba(255,255,255,0.4)', width: '45%' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>4.5%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-6" style={{ color: 'rgba(255,255,255,0.5)' }}>B</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div className="h-full rounded-full" style={{ background: 'rgba(255,255,255,0.8)', width: '72%' }} />
            </div>
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>7.2% ✓</span>
          </div>
          <div className="text-xs pt-1" style={{ color: 'rgba(255,255,255,0.6)' }}>92% confidence • Variant B wins</div>
        </div>
      )
    },
    { 
      id: "guard", 
      icon: ShieldCheck, 
      label: "link guard", 
      description: "Security scanning",
      preview: (
        <div className="space-y-1.5">
          {["tesla.com/model-s", "apple.com/iphone"].map((url, i) => (
            <div key={url} className="flex items-center gap-2 text-xs p-1.5 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'rgba(34,197,94,0.8)' }}>✓</span>
              <span className="font-mono" style={{ color: 'rgba(255,255,255,0.9)' }}>{url}</span>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: "geo", 
      icon: Globe, 
      label: "geo targeting", 
      description: "Route by country",
      preview: (
        <div className="flex gap-2">
          {["🇺🇸 US", "🇬🇧 UK", "🇩🇪 DE"].map((region) => (
            <div key={region} className="p-2 rounded-lg text-center flex-1" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-sm">{region}</div>
            </div>
          ))}
        </div>
      )
    },
    { 
      id: "bulk", 
      icon: Layers, 
      label: "bulk create", 
      description: "CSV upload",
      preview: (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Layers className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.6)' }} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>campaign_links.csv</span>
            <span className="ml-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>247 rows</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="h-full rounded-full" style={{ background: 'rgba(255,255,255,0.8)', width: '100%' }} />
          </div>
          <div className="text-xs" style={{ color: 'rgba(34,197,94,0.8)' }}>✓ All links created</div>
        </div>
      )
    },
  ];

  const active = tools.find(t => t.id === activeTool) || tools[0];

  return (
    <div className="space-y-4">
      {/* Tool Selector Pills */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm"
              style={isActive ? {
                background: 'rgba(255,255,255,0.9)',
                color: '#050505',
              } : {
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="lowercase">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="p-5 rounded-xl"
          style={{
            background: 'rgba(24, 24, 27, 0.4)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
              {(() => { const Icon = active.icon; return <Icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />; })()}
            </div>
            <div>
              <h3 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>{active.label}</h3>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{active.description}</p>
            </div>
          </div>
          <div className="max-w-md">{active.preview}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Strategic Tools Content
const StrategicToolsContent = () => {
  const [activeTool, setActiveTool] = useState("matrix");
  
  const tools = [
    { id: "matrix", icon: Scale, label: "decision matrix", description: "Weighted scoring for options" },
    { id: "roi", icon: TrendingUp, label: "ROI forecaster", description: "Project campaign returns" },
    { id: "calculator", icon: Calculator, label: "first principles", description: "Break down problems" },
  ];

  return (
    <div className="space-y-4">
      {/* Tool Selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm"
              style={isActive ? {
                background: 'rgba(255,255,255,0.9)',
                color: '#050505',
              } : {
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="lowercase">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Preview */}
      <motion.div
        className="p-5 rounded-xl text-center"
        style={{
          background: 'rgba(24, 24, 27, 0.4)',
          backdropFilter: 'blur(40px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Free strategic decision tools built from MIT & Harvard research
        </p>
        <Link to="/tools/decision-frameworks">
          <button 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium lowercase transition-all hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}
          >
            open full tools
            <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </motion.div>
    </div>
  );
};

// Quiz Content
const QuizContent = () => {
  const [activeTab, setActiveTab] = useState("quiz");
  
  return (
    <div className="space-y-4">
      {/* Tab Selector */}
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => setActiveTab("quiz")}
          className="flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm"
          style={activeTab === "quiz" ? {
            background: 'rgba(255,255,255,0.9)',
            color: '#050505',
          } : {
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span className="lowercase">data quality quiz</span>
        </button>
        <button
          onClick={() => setActiveTab("roi")}
          className="flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm"
          style={activeTab === "roi" ? {
            background: 'rgba(255,255,255,0.9)',
            color: '#050505',
          } : {
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.7)',
          }}
        >
          <Calculator className="w-4 h-4" />
          <span className="lowercase">ROI calculator</span>
        </button>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {activeTab === "quiz" ? <CleanTrackScoreQuiz /> : <ROICalculator />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const UnifiedToolsShowcase = () => {
  const [activeTab, setActiveTab] = useState("core");

  return (
    <AnimatedSection className="py-16 md:py-24" style={{ background: 'transparent' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-3"
        >
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            your complete marketing toolbox
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            six tools. one platform. zero data chaos.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {TOOL_TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium"
                style={isActive ? {
                  background: 'rgba(255,255,255,0.9)',
                  color: '#050505',
                  boxShadow: '0 4px 20px rgba(255,255,255,0.15)'
                } : {
                  background: 'rgba(24, 24, 27, 0.4)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.7)',
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="lowercase">{tab.label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "core" && <CoreToolsContent />}
            {activeTab === "power" && <PowerToolsContent />}
            {activeTab === "strategic" && <StrategicToolsContent />}
            {activeTab === "quiz" && <QuizContent />}
          </motion.div>
        </AnimatePresence>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-10"
        >
          <Link 
            to="/features"
            className="inline-flex items-center gap-2 font-medium transition-colors lowercase hover:opacity-80"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            explore all features
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
