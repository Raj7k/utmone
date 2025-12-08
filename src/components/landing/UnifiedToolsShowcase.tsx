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
  ArrowRight,
  CheckCircle2,
  Share2,
  Lightbulb,
  PartyPopper,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedSection } from "./AnimatedSection";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";
import { toast } from "sonner";
import confetti from "canvas-confetti";

// Tab definitions
const TOOL_TABS = [
  { id: "core", label: "core tools", icon: Wrench },
  { id: "power", label: "power tools", icon: Zap },
  { id: "strategic", label: "strategic", icon: Target },
  { id: "quiz", label: "data quality", icon: ClipboardCheck },
];

// Core Tools - Bento Grid with clickable links
const CoreToolsContent = () => {
  const tools = [
    { id: "short-links", icon: LinkIcon, label: "short links", description: "Branded, memorable URLs", href: "/features/short-links" },
    { id: "utm-builder", icon: Tags, label: "UTM builder", description: "Consistent campaign tagging", href: "/features/utm-builder" },
    { id: "qr-codes", icon: QrCode, label: "QR codes", description: "Trackable, branded QR codes", href: "/features/qr-generator" },
    { id: "analytics", icon: BarChart3, label: "analytics", description: "Real-time click tracking", href: "/features/analytics" },
    { id: "clean-track", icon: ShieldCheck, label: "clean-track", description: "Data validation layer", href: "/features/clean-track" },
    { id: "governance", icon: Users, label: "governance", description: "Team permissions & approval", href: "/features/enterprise-control" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {tools.map((tool, i) => {
        const Icon = tool.icon;
        return (
          <Link key={tool.id} to={tool.href}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ 
                scale: 1.03, 
                y: -4,
                boxShadow: "0 0 24px rgba(255,255,255,0.08)"
              }}
              whileTap={{ scale: 0.98 }}
              className="group relative p-4 rounded-xl cursor-pointer transition-all obsidian-glass border border-transparent hover:border-white/15"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-foreground/[0.08] group-hover:bg-foreground/[0.15] transition-colors">
                <Icon className="w-5 h-5 text-foreground/80 group-hover:text-foreground transition-colors" />
              </div>
              <h3 className="text-sm font-display font-semibold lowercase mb-1 text-foreground/90 group-hover:text-foreground transition-colors">
                {tool.label}
              </h3>
              <p className="text-xs text-muted-foreground font-sans mb-3">
                {tool.description}
              </p>
              
              {/* Learn more with arrow - reveals on hover */}
              <div className="flex items-center gap-1 text-xs text-white/40 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                <span>learn more</span>
                <ArrowRight className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />
              </div>
              
              {/* Arrow indicator in corner */}
              <div className="absolute top-3 right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-white/50" />
              </div>
            </motion.div>
          </Link>
        );
      })}
    </div>
  );
};

// Power Tools Content - Enhanced with 2-column layout and full mockups
const PowerToolsContent = () => {
  const [activeTool, setActiveTool] = useState("testing");
  
  const tools = [
    { 
      id: "testing", 
      icon: FlaskConical, 
      label: "A/B testing", 
      description: "Split test your destinations with statistical confidence",
      href: "/dashboard/experiments"
    },
    { 
      id: "guard", 
      icon: ShieldCheck, 
      label: "link guard", 
      description: "Real-time security scanning and malware detection",
      href: "/features/link-immunity"
    },
    { 
      id: "geo", 
      icon: Globe, 
      label: "geo targeting", 
      description: "Route visitors to localized destinations by country",
      href: "/features/smart-routing"
    },
    { 
      id: "bulk", 
      icon: Layers, 
      label: "bulk create", 
      description: "Import hundreds of links from CSV in seconds",
      href: "/dashboard/bulk-create"
    },
  ];

  const active = tools.find(t => t.id === activeTool) || tools[0];

  const renderMockup = () => {
    switch (activeTool) {
      case "testing":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium uppercase tracking-wider text-white-50">
                Experiment: Holiday Campaign
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-status-success/20 text-status-success">
                Running
              </span>
            </div>
            {/* Variant A */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-white/10 text-white-90">A</div>
                  <span className="text-sm text-white-80">tesla.com/model-s</span>
                </div>
                <span className="text-sm font-semibold text-white-90">4.5%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-white/5">
                <motion.div 
                  className="h-full rounded-full bg-white/30"
                  initial={{ width: 0 }}
                  animate={{ width: '45%' }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
              <div className="flex justify-between text-xs text-white-40">
                <span>12,450 visitors</span>
                <span>561 conversions</span>
              </div>
            </div>
            {/* Variant B - Winner */}
            <div className="space-y-2 p-3 rounded-lg bg-status-success/5 border border-status-success/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-status-success/20 text-status-success">B</div>
                  <span className="text-sm text-white-80">tesla.com/model-3</span>
                  <span className="text-xs px-1.5 py-0.5 rounded bg-status-success/20 text-status-success">Winner</span>
                </div>
                <span className="text-sm font-bold text-status-success">7.2%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden bg-white/5">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-status-success/60 to-status-success/90"
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
              <div className="flex justify-between text-xs text-white-40">
                <span>12,780 visitors</span>
                <span>920 conversions</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02]">
              <span className="text-xs text-white-50">Statistical confidence</span>
              <span className="text-sm font-semibold text-status-success">92% confidence • +60% improvement</span>
            </div>
          </div>
        );
      
      case "guard":
        return (
          <div className="space-y-3">
            <div className="text-xs font-medium uppercase tracking-wider mb-3 text-white-50">
              Security Scan Results
            </div>
            {[
              { url: "apple.com/iphone-15", status: "safe", icon: "✓", details: "SSL valid • No malware detected" },
              { url: "tesla.com/cybertruck", status: "safe", icon: "✓", details: "SSL valid • Domain verified" },
              { url: "nike.com/air-jordan", status: "safe", icon: "✓", details: "SSL valid • Clean reputation" },
              { url: "suspicious-offer.xyz", status: "blocked", icon: "✕", details: "Blocked: Phishing detected" },
            ].map((item, i) => (
              <motion.div 
                key={item.url}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  item.status === 'safe' 
                    ? 'bg-status-success/5 border border-status-success/20' 
                    : 'bg-status-error/5 border border-status-error/20'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  item.status === 'safe' 
                    ? 'bg-status-success/20 text-status-success' 
                    : 'bg-status-error/20 text-status-error'
                }`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono truncate text-white-90">{item.url}</div>
                  <div className="text-xs text-white-40">{item.details}</div>
                </div>
              </motion.div>
            ))}
          </div>
        );
      
      case "geo":
        return (
          <div className="space-y-4">
            <div className="text-xs font-medium uppercase tracking-wider mb-3 text-white-50">
              Geographic Routing Rules
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { flag: "🇺🇸", code: "US", url: "store.nike.com/us", visits: "45K" },
                { flag: "🇬🇧", code: "UK", url: "store.nike.co.uk", visits: "28K" },
                { flag: "🇩🇪", code: "DE", url: "store.nike.de", visits: "19K" },
              ].map((region, i) => (
                <motion.div 
                  key={region.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl text-center bg-white/[0.03] border border-white/[0.08]"
                >
                  <div className="text-3xl mb-2">{region.flag}</div>
                  <div className="text-sm font-semibold mb-1 text-white-90">{region.code}</div>
                  <div className="text-xs font-mono truncate mb-2 text-white-50">{region.url}</div>
                  <div className="text-xs px-2 py-1 rounded-full inline-block bg-white/5 text-white-60">
                    {region.visits} visits
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 rounded-lg flex items-center justify-between bg-white/[0.02]">
              <span className="text-xs text-white-50">Default fallback</span>
              <span className="text-sm font-mono text-white-70">nike.com/global</span>
            </div>
          </div>
        );
      
      case "bulk":
        return (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border-2 border-dashed border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/5">
                  <Layers className="w-5 h-5 text-white-60" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-white-90">q4_campaign_links.csv</div>
                  <div className="text-xs text-white-40">247 rows • 12 columns</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-status-success/20 text-status-success">
                  Complete
                </span>
              </div>
              <div className="h-2 rounded-full overflow-hidden mb-2 bg-white/5">
                <motion.div 
                  className="h-full rounded-full bg-gradient-to-r from-status-success/60 to-status-success"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Links created", value: "247", color: "text-status-success" },
                { label: "UTMs applied", value: "247", color: "text-white-90" },
                { label: "QR generated", value: "247", color: "text-white-90" },
              ].map((stat) => (
                <div key={stat.label} className="p-3 rounded-lg text-center bg-white/[0.02]">
                  <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-white-40">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-status-success/80">
              <CheckCircle2 className="w-4 h-4" />
              All links validated and ready to share
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="grid md:grid-cols-5 gap-4 min-h-[400px]">
      {/* Left: Tool Selector with Learn More Links */}
      <div className="md:col-span-2 space-y-2">
        {tools.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <motion.div
              key={tool.id}
              className={`group relative w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all cursor-pointer ${
                isActive 
                  ? 'bg-white/[0.08] border border-white/15' 
                  : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
              }`}
              onClick={() => setActiveTool(tool.id)}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 20px rgba(255,255,255,0.06)"
              }}
              whileTap={{ scale: 0.99 }}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                isActive ? 'bg-white/15' : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white-95' : 'text-white-50 group-hover:text-white-70'}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className={`text-sm font-semibold lowercase transition-colors ${isActive ? 'text-white-95' : 'text-white-70 group-hover:text-white-90'}`}>
                  {tool.label}
                </h3>
                <p className="text-xs mt-0.5 line-clamp-2 text-white-40">
                  {tool.description}
                </p>
                {/* Learn more link - reveals on hover */}
                <Link 
                  to={tool.href}
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs text-white/40 mt-2 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:text-white/70"
                >
                  <span>learn more</span>
                  <ArrowRight className="w-3 h-3 -translate-x-1 group-hover:translate-x-0 transition-transform duration-300" />
                </Link>
              </div>
              {/* Arrow indicator in corner */}
              <div className="absolute top-3 right-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-white/40" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Right: Mockup Preview */}
      <div className="md:col-span-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTool}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full p-6 rounded-2xl obsidian-glass-60"
          >
            {renderMockup()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// ============ STRATEGIC TOOLS ============

// Step Progress Component
const StepProgress = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center">
          <motion.div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
              index <= currentStep 
                ? 'bg-white/90 text-obsidian-bg' 
                : 'bg-white/10 text-white-50'
            }`}
            initial={{ scale: 0.8 }}
            animate={{ scale: index === currentStep ? 1.1 : 1 }}
          >
            {index < currentStep ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
          </motion.div>
          {index < totalSteps - 1 && (
            <div className={`w-8 h-1 mx-1 rounded-full transition-all ${
              index < currentStep ? 'bg-white/60' : 'bg-white/10'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
};

// First Principles Wizard (Inline)
const FirstPrinciplesContent = () => {
  const [step, setStep] = useState(0);
  const [problem, setProblem] = useState("");
  const [whys, setWhys] = useState(["", "", "", "", ""]);
  const [fundamentals, setFundamentals] = useState<string[]>([]);

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const generateFundamentals = () => {
    const filled = whys.filter(w => w.trim() !== "");
    if (filled.length >= 3) {
      setFundamentals([
        "Core assumption identified: " + (whys[4] || whys[3] || whys[2]),
        "This can be validated by testing smaller hypotheses",
        "Action: Start with the smallest possible experiment"
      ]);
      setStep(2);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#FFFFFF', '#A1A1AA'] });
    } else {
      toast.error("please fill at least 3 'why' answers");
    }
  };

  const handleShare = () => {
    const text = `🎯 Just broke down a complex decision using First Principles from utm.one\n\nKey insight: ${fundamentals[0] || "Breaking down complex decisions into fundamental truths"}\n\nTry it free:`;
    shareOnLinkedIn(text, "https://utm.one/tools/decision-frameworks");
  };

  const nextStep = () => {
    if (step === 0 && !problem.trim()) {
      toast.error("please describe your problem first");
      return;
    }
    if (step === 1) {
      generateFundamentals();
      return;
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-[420px]">
      <StepProgress currentStep={step} totalSteps={3} />
      
      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-white/10">
                <Target className="w-7 h-7 text-white-90" />
              </div>
              <h3 className="text-lg font-semibold lowercase text-white-90">define your problem</h3>
              <p className="text-sm mt-1 text-white-50">What decision are you trying to make?</p>
            </div>
            <Textarea 
              placeholder="e.g., Our marketing campaigns aren't generating enough leads..."
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="min-h-[100px] text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30"
            />
            <Button onClick={nextStep} className="w-full lowercase bg-white text-black hover:bg-white/90">
              start breakdown <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
        )}

        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-white/10">
                <Lightbulb className="w-7 h-7 text-white-90" />
              </div>
              <h3 className="text-lg font-semibold lowercase text-white-90">ask "why" 5 times</h3>
            </div>
            <div className="p-3 rounded-lg mb-3 bg-white/5">
              <p className="text-xs text-white-50">your problem:</p>
              <p className="text-sm text-white-90">{problem}</p>
            </div>
            <div className="space-y-2">
              {whys.map((why, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    why.trim() ? 'bg-white/90 text-obsidian-bg' : 'bg-white/10 text-white-50'
                  }`}>
                    {index + 1}
                  </div>
                  <Input 
                    placeholder={index === 0 ? "Why is this happening?" : "Why? (dig deeper)"}
                    value={why}
                    onChange={(e) => updateWhy(index, e.target.value)}
                    className="text-sm bg-white/5 border-white/10 text-white placeholder:text-white/30"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => setStep(0)} variant="outline" className="lowercase border-white/10 bg-white/5 hover:bg-white/10 text-white">
                <ArrowLeft className="w-4 h-4 mr-1" /> back
              </Button>
              <Button onClick={nextStep} className="flex-1 lowercase bg-white text-black hover:bg-white/90">
                <Sparkles className="w-4 h-4 mr-1" /> reveal insights
              </Button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="text-center mb-4">
              <motion.div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 bg-status-success/20"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, -10, 10, 0] }}
              >
                <PartyPopper className="w-7 h-7 text-status-success" />
              </motion.div>
              <h3 className="text-lg font-semibold lowercase text-white-90">insights revealed</h3>
            </div>
            <div className="space-y-2">
              {fundamentals.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-2 p-3 rounded-lg bg-status-success/10 border border-status-success/20"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-status-success" />
                  <span className="text-sm text-white-90">{f}</span>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Button onClick={() => setStep(0)} variant="outline" className="lowercase border-white/10 bg-white/5 hover:bg-white/10 text-white">
                start over
              </Button>
              <Button onClick={handleShare} className="flex-1 lowercase bg-white text-black hover:bg-white/90">
                <Share2 className="w-4 h-4 mr-1" /> share on linkedin
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Decision Matrix Builder (Inline)
const DecisionMatrixContent = () => {
  const [options] = useState(["Option A", "Option B", "Option C"]);
  const [criteria] = useState([
    { name: "Cost", weight: 3 },
    { name: "Time", weight: 2 },
    { name: "Impact", weight: 5 },
    { name: "Risk", weight: 4 }
  ]);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const updateScore = (option: string, criterion: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [option]: { ...(prev[option] || {}), [criterion]: score }
    }));
  };

  const calculateTotal = (option: string) => {
    return criteria.reduce((total, c) => {
      const score = scores[option]?.[c.name] || 0;
      return total + (score * c.weight);
    }, 0);
  };

  const getWinner = () => {
    let maxScore = 0;
    let winner = "";
    options.forEach(opt => {
      const total = calculateTotal(opt);
      if (total > maxScore) {
        maxScore = total;
        winner = opt;
      }
    });
    return winner;
  };

  const handleShare = () => {
    const winner = getWinner();
    const text = `⚖️ Just used the Decision Matrix Builder from utm.one\n\nResult: ${winner} scored highest with ${calculateTotal(winner)} points\n\nMake data-driven decisions:`;
    shareOnLinkedIn(text, "https://utm.one/tools/decision-frameworks");
  };

  return (
    <div className="min-h-[420px]">
      <div className="flex items-center gap-2 mb-4">
        <Scale className="w-5 h-5 text-white-70" />
        <h3 className="text-lg font-semibold lowercase text-white-90">weighted decision matrix</h3>
      </div>
      <p className="text-sm mb-4 text-white-50">Rate each option 1-5 for each criterion</p>
      
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left p-2 font-medium text-white-50">Criteria (Weight)</th>
              {options.map(opt => (
                <th key={opt} className="text-center p-2 font-medium text-white-90">{opt}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {criteria.map((c) => (
              <tr key={c.name} className="border-b border-white/5">
                <td className="p-2">
                  <span className="text-white-90">{c.name}</span>
                  <span className="ml-1 text-white-40">(×{c.weight})</span>
                </td>
                {options.map(opt => (
                  <td key={opt} className="p-2 text-center">
                    <Input 
                      type="number"
                      min="1"
                      max="5"
                      className="w-12 mx-auto text-center text-xs h-7 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                      placeholder="1-5"
                      value={scores[opt]?.[c.name] || ""}
                      onChange={(e) => updateScore(opt, c.name, parseInt(e.target.value) || 0)}
                    />
                  </td>
                ))}
              </tr>
            ))}
            <tr className="bg-white/[0.03]">
              <td className="p-2 font-semibold text-white-90">Total</td>
              {options.map(opt => (
                <td key={opt} className="p-2 text-center">
                  <span className={`font-bold text-sm ${
                    getWinner() === opt && calculateTotal(opt) > 0 ? 'text-status-success' : 'text-white-90'
                  }`}>
                    {calculateTotal(opt)}
                  </span>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {getWinner() && calculateTotal(getWinner()) > 0 && (
        <motion.div 
          className="mt-4 p-3 rounded-lg flex items-center justify-between bg-status-success/10 border border-status-success/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-status-success">
            <CheckCircle2 className="w-4 h-4" />
            Recommended: {getWinner()}
          </div>
          <Button size="sm" variant="outline" className="lowercase text-xs h-7 border-white/10 bg-white/5 hover:bg-white/10 text-white" onClick={handleShare}>
            <Share2 className="w-3 h-3 mr-1" /> share
          </Button>
        </motion.div>
      )}
    </div>
  );
};

// ROI Forecaster (Inline)
const ROIForecasterContent = () => {
  const [investment, setInvestment] = useState(10000);
  const [expectedClicks, setExpectedClicks] = useState(50000);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [avgOrderValue, setAvgOrderValue] = useState(100);

  const conversions = Math.round(expectedClicks * (conversionRate / 100));
  const revenue = conversions * avgOrderValue;
  const roi = investment > 0 ? ((revenue - investment) / investment) * 100 : 0;

  const handleShare = () => {
    const text = `📈 Campaign ROI Forecast from utm.one\n\n💰 Investment: $${investment.toLocaleString()}\n📊 Projected Revenue: $${revenue.toLocaleString()}\n🎯 ROI: ${roi.toFixed(1)}%\n\nForecast your campaign ROI:`;
    shareOnLinkedIn(text, "https://utm.one/tools/decision-frameworks");
  };

  return (
    <div className="min-h-[420px]">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-status-success" />
        <h3 className="text-lg font-semibold lowercase text-white-90">ROI forecaster</h3>
      </div>
      <p className="text-sm mb-4 text-white-50">Project your campaign returns</p>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-white-70">investment ($)</label>
            <Input type="number" value={investment} onChange={(e) => setInvestment(parseInt(e.target.value) || 0)} className="text-sm h-9 bg-white/5 border-white/10 text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white-70">expected clicks</label>
            <Input type="number" value={expectedClicks} onChange={(e) => setExpectedClicks(parseInt(e.target.value) || 0)} className="text-sm h-9 bg-white/5 border-white/10 text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white-70">conversion rate (%)</label>
            <Input type="number" step="0.1" value={conversionRate} onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)} className="text-sm h-9 bg-white/5 border-white/10 text-white" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-white-70">avg order value ($)</label>
            <Input type="number" value={avgOrderValue} onChange={(e) => setAvgOrderValue(parseInt(e.target.value) || 0)} className="text-sm h-9 bg-white/5 border-white/10 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Conversions", value: conversions.toLocaleString(), color: "text-white-90" },
            { label: "Revenue", value: `$${revenue.toLocaleString()}`, color: "text-white-90" },
            { label: "ROI", value: `${roi.toFixed(1)}%`, color: roi > 0 ? "text-status-success" : "text-status-error" },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              className="p-4 rounded-xl text-center bg-white/[0.03]"
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs mt-1 text-white-50">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full lowercase bg-white text-black hover:bg-white/90" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" /> share forecast on linkedin
        </Button>
      </div>
    </div>
  );
};

// Strategic Tools Content - With embedded interactive tools
const StrategicToolsContent = () => {
  const [activeTool, setActiveTool] = useState("principles");
  
  const tools = [
    { id: "principles", icon: Target, label: "first principles" },
    { id: "matrix", icon: Scale, label: "decision matrix" },
    { id: "roi", icon: TrendingUp, label: "ROI forecaster" },
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
              className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
                isActive 
                  ? 'bg-white/90 text-obsidian-bg shadow-glow-sm' 
                  : 'bg-white/5 text-white-70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="lowercase">{tool.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tool Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTool}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25 }}
          className="p-6 rounded-2xl obsidian-glass-60"
        >
          {activeTool === "principles" && <FirstPrinciplesContent />}
          {activeTool === "matrix" && <DecisionMatrixContent />}
          {activeTool === "roi" && <ROIForecasterContent />}
        </motion.div>
      </AnimatePresence>
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
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
            activeTab === "quiz" 
              ? 'bg-white/90 text-obsidian-bg' 
              : 'bg-white/5 text-white-70'
          }`}
        >
          <ClipboardCheck className="w-4 h-4" />
          <span className="lowercase">data quality quiz</span>
        </button>
        <button
          onClick={() => setActiveTab("roi")}
          className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all text-sm ${
            activeTab === "roi" 
              ? 'bg-white/90 text-obsidian-bg' 
              : 'bg-white/5 text-white-70'
          }`}
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
    <AnimatedSection className="py-16 md:py-24 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-3"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase obsidian-platinum-text">
            your complete marketing toolbox
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-muted-foreground font-sans">
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
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full transition-all text-sm font-medium font-sans ${
                  isActive 
                    ? 'bg-primary text-primary-foreground shadow-glow-sm'
                    : 'obsidian-glass text-foreground/70 hover:text-foreground'
                }`}
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
            className="inline-flex items-center gap-2 font-medium font-sans transition-colors lowercase text-muted-foreground hover:text-foreground"
          >
            explore all features
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </AnimatedSection>
  );
};
