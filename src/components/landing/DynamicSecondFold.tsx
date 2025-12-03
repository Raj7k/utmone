import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./InteractiveHero";
import { 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  MousePointer,
  Smartphone,
  Monitor,
  Mail,
  Search,
  ShoppingCart,
  FileText,
  Link as LinkIcon,
  QrCode,
  Shield,
  Layers,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";

interface DynamicSecondFoldProps {
  selectedUseCase: UseCaseType;
}

// Attribution Content Component
const AttributionContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
    {/* Left: Last-Click vs True Attribution */}
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-destructive uppercase tracking-wider">the problem</p>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground lowercase">
          last-click attribution lies to you
        </h3>
        <p className="text-muted-foreground">
          Google Ads gets 100% credit because it was the last touch. 
          But what about the blog post, the podcast mention, the LinkedIn post that started it all?
        </p>
      </div>
      
      {/* Comparison Bars */}
      <div className="space-y-4 p-6 bg-card rounded-xl border border-border">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Google Ads (Last Click)</span>
            <span className="font-semibold text-destructive">100% credit</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-destructive/60 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.3 }}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t border-border space-y-3">
          <p className="text-sm font-medium text-primary">with utm.one attribution:</p>
          {[
            { channel: "Organic Blog", credit: 35 },
            { channel: "Podcast Mention", credit: 25 },
            { channel: "LinkedIn Post", credit: 20 },
            { channel: "Google Ads", credit: 20 }
          ].map((item, i) => (
            <div key={item.channel} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">{item.channel}</span>
                <span className="font-semibold text-primary">{item.credit}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.credit}%` }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    
    {/* Right: Key Stats */}
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {[
          { stat: "60%", label: "of budget is typically misallocated", icon: TrendingUp },
          { stat: "3.2x", label: "better ROAS with true attribution", icon: BarChart3 },
          { stat: "12", label: "avg touchpoints before conversion", icon: MousePointer },
          { stat: "47%", label: "of conversions happen cross-device", icon: Smartphone }
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="p-4 bg-card rounded-xl border border-border text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            >
              <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl md:text-3xl font-display font-bold text-primary">{item.stat}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </motion.div>
          );
        })}
      </div>
      
      <Link 
        to="/features/attribution-graph"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
      >
        see how attribution works
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

// Journey Content Component
const JourneyContent = () => (
  <div className="space-y-8">
    {/* Journey Timeline Visualization */}
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">real customer journey</p>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground lowercase">
          see every touchpoint, across every device
        </h3>
      </div>
      
      {/* Journey Timeline */}
      <div className="relative py-8">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 hidden md:block" />
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-2 relative">
          {[
            { icon: Search, label: "Google Search", device: "Mobile", day: "Day 1" },
            { icon: FileText, label: "Blog Post", device: "Desktop", day: "Day 3" },
            { icon: Mail, label: "Email Nurture", device: "Mobile", day: "Day 7" },
            { icon: Monitor, label: "Demo Request", device: "Desktop", day: "Day 12" },
            { icon: ShoppingCart, label: "Purchase", device: "Desktop", day: "Day 18", highlight: true }
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.label}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className={`
                  w-12 h-12 rounded-full flex items-center justify-center mb-2
                  ${step.highlight 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                    : "bg-card border border-border text-muted-foreground"
                  }
                `}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-medium text-muted-foreground">{step.day}</div>
                <div className="text-sm font-semibold text-foreground mt-1">{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.device}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
    
    {/* Key Features Grid */}
    <div className="grid sm:grid-cols-3 gap-4">
      {[
        { title: "identity stitching", desc: "Connect anonymous visits to known customers across devices" },
        { title: "cross-device tracking", desc: "See the full journey from mobile browse to desktop purchase" },
        { title: "funnel analysis", desc: "Identify drop-off points and optimize conversion paths" }
      ].map((feature, i) => (
        <motion.div
          key={feature.title}
          className="p-4 bg-card rounded-xl border border-border"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
        >
          <h4 className="font-semibold text-foreground lowercase mb-1">{feature.title}</h4>
          <p className="text-sm text-muted-foreground">{feature.desc}</p>
        </motion.div>
      ))}
    </div>
    
    <div className="text-center">
      <Link 
        to="/features/predictive-analytics"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
      >
        explore journey analytics
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

// Links Content Component  
const LinksContent = () => (
  <div className="space-y-8">
    <div className="space-y-2 text-center">
      <p className="text-sm font-medium text-primary uppercase tracking-wider">one link. five layers.</p>
      <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground lowercase">
        every link tells the same story
      </h3>
    </div>
    
    {/* Link Layers Preview */}
    <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
      {/* Left: Visual Stack */}
      <div className="space-y-3">
        {[
          { icon: LinkIcon, label: "short link", example: "utm.one/demo", color: "bg-primary" },
          { icon: BarChart3, label: "utm parameters", example: "source=linkedin&medium=social", color: "bg-primary/80" },
          { icon: QrCode, label: "qr code", example: "branded, scannable, tracked", color: "bg-primary/60" },
          { icon: Shield, label: "clean-track rules", example: "validated, consistent, governed", color: "bg-primary/40" },
          { icon: Layers, label: "metadata layer", example: "machine-readable, LLM-ready", color: "bg-primary/20" }
        ].map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={layer.label}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className={`w-10 h-10 rounded-lg ${layer.color} flex items-center justify-center text-primary-foreground`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground lowercase">{layer.label}</div>
                <div className="text-xs text-muted-foreground font-mono">{layer.example}</div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {/* Right: Benefits */}
      <div className="space-y-4">
        <div className="p-6 bg-card rounded-xl border border-border space-y-4">
          <h4 className="font-semibold text-foreground lowercase">why this matters:</h4>
          {[
            "No more broken UTMs or inconsistent naming",
            "Every team member creates links the same way",
            "Dashboards that actually make sense",
            "QR codes that track like digital links",
            "Links that work in LLMs and AI search"
          ].map((benefit, i) => (
            <motion.div
              key={benefit}
              className="flex items-start gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            >
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </motion.div>
          ))}
        </div>
        
        <Link 
          to="/how-it-works"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
        >
          see how it works
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  </div>
);

export const DynamicSecondFold = ({ selectedUseCase }: DynamicSecondFoldProps) => {
  return (
    <section className="py-12 md:py-20 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {selectedUseCase === "attribution" && <AttributionContent />}
            {selectedUseCase === "journey" && <JourneyContent />}
            {selectedUseCase === "links" && <LinksContent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
