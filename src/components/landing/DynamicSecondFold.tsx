import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./SideNavHero";
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
  CheckCircle2,
  Sparkles,
  Brain,
  MessageSquare,
  AlertCircle,
  Zap
} from "lucide-react";
import { Link } from "react-router-dom";
import { ParallaxSection } from "./ParallaxSection";

interface DynamicSecondFoldProps {
  selectedUseCase: UseCaseType;
}

// Glass Card Component for consistent styling
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div 
    className={`rounded-2xl overflow-hidden ${className}`}
    style={{
      background: 'rgba(24,24,27,0.4)',
      backdropFilter: 'blur(40px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderTop: '1px solid rgba(255,255,255,0.15)',
      boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.5)'
    }}
  >
    {children}
  </div>
);

const BrowserHeader = ({ url }: { url: string }) => (
  <div 
    className="flex items-center gap-2 px-4 py-3"
    style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
  >
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,100,100,0.6)' }} />
      <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,200,100,0.6)' }} />
      <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(100,200,100,0.6)' }} />
    </div>
    <div className="flex-1 mx-4">
      <div 
        className="rounded-md px-3 py-1.5 text-xs font-mono"
        style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
      >
        {url}
      </div>
    </div>
  </div>
);

// Attribution Content with Product Mockup
const AttributionContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
    {/* Left: Product Mockup */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Browser Mockup */}
      <GlassCard>
        <BrowserHeader url="utm.one/dashboard/attribution" />
        
        {/* Dashboard Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-foreground lowercase">clean-track attribution</h4>
            <span className="text-xs text-muted-foreground">last 30 days</span>
          </div>
          
          {/* Attribution Bars */}
          <div className="space-y-3">
            {[
              { channel: "Nike Organic Content", credit: 35, color: "bg-primary" },
              { channel: "Tesla Podcast Mentions", credit: 25, color: "bg-primary/80" },
              { channel: "Apple LinkedIn Organic", credit: 20, color: "bg-primary/60" },
              { channel: "Google Ads", credit: 20, color: "bg-primary/40" }
            ].map((item, i) => (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.channel}</span>
                  <span className="font-semibold text-foreground">{item.credit}%</span>
                </div>
                <div className="h-2.5 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.credit}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Comparison Badge */}
          <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">vs Last-Click: Google Ads would get <span className="font-semibold text-destructive">100%</span></span>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Floating Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute -bottom-4 -right-4 bg-card rounded-xl border border-border shadow-lg p-4"
      >
        <div className="text-2xl font-bold text-primary">3.2x</div>
        <div className="text-xs text-muted-foreground">better ROAS</div>
      </motion.div>
    </motion.div>
    
    {/* Right: Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-destructive uppercase tracking-wider">the problem</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          last-click attribution lies to you
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Google Ads gets 100% credit because it was the last touch. 
          But what about the blog post, the podcast mention, the LinkedIn post that started it all?
        </p>
      </div>
      
      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { stat: "60%", label: "of budget typically misallocated", icon: TrendingUp },
          { stat: "12", label: "avg touchpoints before conversion", icon: MousePointer },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              className="p-4 bg-card rounded-xl border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <Icon className="w-5 h-5 text-primary mb-2" />
              <div className="text-2xl font-display font-bold text-primary">{item.stat}</div>
              <div className="text-xs text-muted-foreground mt-1">{item.label}</div>
            </motion.div>
          );
        })}
      </div>
      
      <Link 
        to="/features/attribution-graph"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
      >
        see how clean-track attribution works
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

// Journey Content with Product Mockup
const JourneyContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
    {/* Left: Content */}
    <div className="space-y-6 lg:order-2">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">complete visibility</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          see every touchpoint, across every device
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          From anonymous first visit to enterprise contract — track the complete path your customers take, 
          across devices, channels, and campaigns.
        </p>
      </div>
      
      {/* Features */}
      <div className="space-y-3">
        {[
          { title: "identity stitching", desc: "Connect anonymous visits to known customers" },
          { title: "cross-device tracking", desc: "Mobile browse to desktop purchase" },
          { title: "funnel analysis", desc: "Identify drop-off points and optimize" }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground lowercase text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link 
        to="/features/predictive-analytics"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
      >
        explore clean-track journey analytics
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
    
    {/* Right: Product Mockup */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative lg:order-1"
    >
      {/* Journey Timeline Mockup */}
      <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-amber-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono">
              utm.one/dashboard/journeys
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold text-foreground lowercase">customer journey</h4>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Nike enterprise deal</span>
          </div>
          
          {/* Journey Steps */}
          <div className="relative">
            <div className="absolute top-6 left-6 bottom-6 w-0.5 bg-border" />
            
            <div className="space-y-4">
              {[
                { icon: Search, label: "Google Search", device: "Mobile", day: "Day 1", time: "9:34 AM" },
                { icon: FileText, label: "Blog Post", device: "Desktop", day: "Day 3", time: "2:15 PM" },
                { icon: Mail, label: "Email Nurture", device: "Mobile", day: "Day 7", time: "8:22 AM" },
                { icon: Monitor, label: "Demo Request", device: "Desktop", day: "Day 12", time: "3:45 PM" },
                { icon: ShoppingCart, label: "Closed Won", device: "Desktop", day: "Day 18", time: "11:00 AM", highlight: true }
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.label}
                    className="flex items-center gap-4 relative"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center relative z-10
                      ${step.highlight 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                        : "bg-card border border-border text-muted-foreground"
                      }
                    `}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{step.label}</span>
                        <span className="text-xs text-muted-foreground">{step.device}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{step.day} · {step.time}</div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="absolute -bottom-4 -left-4 bg-card rounded-xl border border-border shadow-lg p-4"
      >
        <div className="text-2xl font-bold text-primary">18</div>
        <div className="text-xs text-muted-foreground">days to close</div>
      </motion.div>
    </motion.div>
  </div>
);

// Links Content with Product Mockup
const LinksContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
    {/* Left: Product Mockup */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Link Builder Mockup */}
      <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-amber-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono">
              utm.one/dashboard/create
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h4 className="font-semibold text-foreground lowercase">create smart link</h4>
          
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">destination url</label>
            <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm font-mono text-foreground border border-border">
              https://tesla.com/product/demo
            </div>
          </div>
          
          {/* Link Layers */}
          <div className="space-y-2">
            {[
              { icon: LinkIcon, label: "short link", value: "utm.one/tesla-demo", color: "bg-primary" },
              { icon: BarChart3, label: "utm params", value: "source=linkedin&medium=social&campaign=elon_launch", color: "bg-primary/80" },
              { icon: QrCode, label: "qr code", value: "branded, tracked", color: "bg-primary/60" },
              { icon: Shield, label: "clean-track", value: "validated ✓", color: "bg-primary/40" },
              { icon: Layers, label: "metadata", value: "LLM-ready", color: "bg-primary/20" }
            ].map((layer, i) => {
              const Icon = layer.icon;
              return (
                <motion.div
                  key={layer.label}
                  className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                >
                  <div className={`w-8 h-8 rounded-md ${layer.color} flex items-center justify-center text-primary-foreground`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground lowercase">{layer.label}</div>
                    <div className="text-xs font-mono text-foreground truncate">{layer.value}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Floating QR Preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute -bottom-6 -right-6 bg-card rounded-xl border border-border shadow-lg p-3"
      >
        <div className="w-16 h-16 bg-foreground rounded-lg flex items-center justify-center">
          <QrCode className="w-12 h-12 text-background" />
        </div>
      </motion.div>
    </motion.div>
    
    {/* Right: Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">one link. five layers.</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          every link tells the same story
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Short links, UTM builder, QR codes, and clean-track governance in one place. 
          Every team member creates links the same way. Every dashboard makes sense.
        </p>
      </div>
      
      {/* Benefits */}
      <div className="space-y-3">
        {[
          "No more broken UTMs or inconsistent naming",
          "Every team member creates links the same way",
          "QR codes that track like digital links",
          "Links that work in LLMs and AI search"
        ].map((benefit, i) => (
          <motion.div
            key={benefit}
            className="flex items-start gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <span className="text-muted-foreground">{benefit}</span>
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
);

// Intelligence Content with AI Chat Mockup
const IntelligenceContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
    {/* Left: AI Chat Mockup */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blazeOrange flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-foreground text-sm lowercase">clean-track AI</div>
            <div className="text-xs text-muted-foreground">MIT & Harvard algorithms</div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 space-y-4">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-primary text-primary-foreground rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]">
              <p className="text-sm">Which Nike campaign performed best this quarter?</p>
            </div>
          </div>
          
          {/* AI Response */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Brain className="w-4 h-4 text-primary" />
            </div>
            <div className="bg-muted/50 rounded-2xl rounded-tl-sm px-4 py-3 space-y-3">
              <p className="text-sm text-foreground">
                <strong>Nike Q4 Launch</strong> drove the most conversions:
              </p>
              <div className="space-y-2">
                {[
                  { label: "Clicks", value: "24,847", change: "+32%" },
                  { label: "Conversion Rate", value: "4.8%", change: "+18%" },
                  { label: "Revenue Attributed", value: "$128,200", change: "+45%" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{stat.value}</span>
                      <span className="text-green-600">{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-primary pt-2 border-t border-border">
                <TrendingUp className="w-3 h-3" />
                Clean-Track confidence: 94%
              </div>
            </div>
          </motion.div>
          
          {/* AI Alert */}
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="bg-amber-500/10 rounded-2xl rounded-tl-sm px-4 py-3 border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <span className="text-xs font-medium">Anomaly detected</span>
              </div>
              <p className="text-xs text-foreground">
                Traffic from <strong>Tesla email campaign</strong> dropped 45% yesterday. Investigating...
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ask anything about your data...</span>
            <div className="ml-auto">
              <Zap className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    
    {/* Right: Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">clean-track intelligence</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          AI that makes your data talk
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Built on mathematical models from MIT and Harvard scientists. 
          Ask questions in plain English, get insights instantly. No data science degree required.
        </p>
      </div>
      
      {/* Features */}
      <div className="space-y-3">
        {[
          { icon: Brain, title: "predictive insights", desc: "Know which campaigns will work before launch" },
          { icon: AlertCircle, title: "anomaly detection", desc: "Catch traffic drops and bot attacks automatically" },
          { icon: TrendingUp, title: "revenue attribution", desc: "See which touchpoints actually drive conversions" },
        ].map((feature, i) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground lowercase text-sm">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <Link 
        to="/features/predictive-analytics"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
      >
        explore clean-track AI
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

// Governance Content with Product Mockup
const GovernanceContent = () => (
  <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
    {/* Left: Content */}
    <div className="space-y-6 lg:order-2">
      <div className="space-y-3">
        <p className="text-sm font-medium text-primary uppercase tracking-wider">enterprise control</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          your team's links, under control
        </h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Role-based access, approval workflows, naming conventions, and audit trails. 
          Scale link management without chaos.
        </p>
      </div>
      
      {/* Features */}
      <div className="space-y-3">
        {[
          { title: "role-based access", desc: "Admins, editors, viewers — everyone has the right permissions" },
          { title: "approval workflows", desc: "Review links before they go live" },
          { title: "audit trails", desc: "See who created what, when, and why" }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            className="flex items-start gap-3 p-3 bg-card rounded-lg border border-border"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-foreground lowercase text-sm">{feature.title}</h4>
              <p className="text-xs text-muted-foreground">{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link 
        to="/solutions/enterprise"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
      >
        explore enterprise features
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
    
    {/* Right: Product Mockup */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative lg:order-1"
    >
      <div className="bg-card rounded-2xl border border-border shadow-2xl shadow-primary/5 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-amber-400/60" />
            <div className="w-3 h-3 rounded-full bg-green-400/60" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-background rounded-md px-3 py-1.5 text-xs text-muted-foreground font-mono">
              utm.one/dashboard/team
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h4 className="font-semibold text-foreground lowercase">team management</h4>
          
          {/* Team Members */}
          <div className="space-y-2">
            {[
              { name: "Elon Musk", email: "elon@tesla.com", role: "Admin", avatar: "EM" },
              { name: "Tim Cook", email: "tim@apple.com", role: "Editor", avatar: "TC" },
              { name: "Jeff Bezos", email: "jeff@amazon.com", role: "Viewer", avatar: "JB" },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold text-primary">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{member.email}</div>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.role === "Admin" ? "bg-primary/10 text-primary" :
                  member.role === "Editor" ? "bg-amber-500/10 text-amber-600" :
                  "bg-muted text-muted-foreground"
                }`}>
                  {member.role}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pending Approvals */}
          <div className="p-3 bg-amber-500/5 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 text-amber-600 text-sm font-medium">
              <Shield className="w-4 h-4" />
              3 links pending approval
            </div>
          </div>
        </div>
      </div>
      
      {/* Floating Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="absolute -bottom-4 -right-4 bg-card rounded-xl border border-border shadow-lg p-4"
      >
        <div className="text-2xl font-bold text-primary">100%</div>
        <div className="text-xs text-muted-foreground">policy compliance</div>
      </motion.div>
    </motion.div>
  </div>
);

const CONTENT_MAP: Record<UseCaseType, React.ReactNode> = {
  attribution: <AttributionContent />,
  journey: <JourneyContent />,
  links: <LinksContent />,
  intelligence: <IntelligenceContent />,
  governance: <GovernanceContent />,
};

export const DynamicSecondFold = ({ selectedUseCase }: DynamicSecondFoldProps) => {
  return (
    <ParallaxSection speed={0.3} className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {CONTENT_MAP[selectedUseCase]}
          </motion.div>
        </AnimatePresence>
      </div>
    </ParallaxSection>
  );
};
