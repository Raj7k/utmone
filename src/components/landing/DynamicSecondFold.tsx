import { useState, useEffect, useRef } from "react";
import { UseCaseType } from "./useCaseConfig";
import { 
  TrendingUp, 
  BarChart3, 
  ArrowRight,
  MousePointer,
  Monitor,
  Mail,
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
import { LinkedInIcon, GoogleIcon } from "@/components/icons/SocialIcons";
import { ParallaxSection } from "./ParallaxSection";

interface DynamicSecondFoldProps {
  selectedUseCase: UseCaseType;
}

// Hook for staggered animations
const useStaggeredAnimation = (itemCount: number, baseDelay: number = 0.3, stagger: number = 0.1) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const getDelay = (index: number) => `${(baseDelay + index * stagger) * 1000}ms`;
  
  return { ref, visible, getDelay };
};

// Glass Card Component for consistent styling
const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div 
    className={`rounded-2xl overflow-hidden bg-card backdrop-blur-xl border border-border shadow-2xl ${className}`}
    style={{
      borderTop: '1px solid hsl(var(--border) / 0.3)',
    }}
  >
    {children}
  </div>
);

const BrowserHeader = ({ url }: { url: string }) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
    <div className="flex gap-1.5">
      <div className="w-3 h-3 rounded-full bg-destructive/50" />
      <div className="w-3 h-3 rounded-full bg-warning/50" />
      <div className="w-3 h-3 rounded-full bg-success/50" />
    </div>
    <div className="flex-1 mx-4">
      <div className="rounded-md px-3 py-1.5 text-xs font-mono bg-muted/50 text-muted-foreground">
        {url}
      </div>
    </div>
  </div>
);

// Animated item wrapper
const AnimatedItem = ({ 
  children, 
  visible, 
  delay, 
  className = "",
  direction = "up"
}: { 
  children: React.ReactNode; 
  visible: boolean; 
  delay: string;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}) => {
  const transforms = {
    up: visible ? 'translateY(0)' : 'translateY(20px)',
    down: visible ? 'translateY(0)' : 'translateY(-20px)',
    left: visible ? 'translateX(0)' : 'translateX(20px)',
    right: visible ? 'translateX(0)' : 'translateX(-20px)',
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: transforms[direction],
        transitionDelay: visible ? delay : '0ms',
      }}
    >
      {children}
    </div>
  );
};

// Attribution Content with Product Mockup
const AttributionContent = () => {
  const { ref, visible, getDelay } = useStaggeredAnimation(4, 0.2, 0.1);
  const [progressWidths, setProgressWidths] = useState([0, 0, 0, 0]);

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setProgressWidths([35, 25, 20, 20]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left: Product Mockup */}
      <AnimatedItem visible={visible} delay={getDelay(0)} direction="right" className="relative">
        <GlassCard>
          <BrowserHeader url="utm.one/dashboard/attribution" />
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">clean-track attribution</h4>
              <span className="text-xs text-muted-foreground">last 30 days</span>
            </div>
            
            {/* Attribution Bars */}
            <div className="space-y-3">
              {[
                { channel: "Nike Organic Content", credit: 35, opacity: 1, icon: null },
                { channel: "Tesla Podcast Mentions", credit: 25, opacity: 0.8, icon: null },
                { channel: "Organic", credit: 20, opacity: 0.6, icon: LinkedInIcon, iconColor: "#0A66C2" },
                { channel: "Ads", credit: 20, opacity: 0.4, icon: GoogleIcon, iconColor: null }
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={item.channel} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground inline-flex items-center gap-1.5">
                        {Icon && <Icon className="w-4 h-4" style={item.iconColor ? { color: item.iconColor } : undefined} />}
                        {item.channel}
                      </span>
                      <span className="font-semibold text-foreground">{item.credit}%</span>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden bg-muted/30">
                      <div 
                        className="h-full rounded-full bg-primary transition-all duration-800 ease-out"
                        style={{ 
                          opacity: item.opacity,
                          width: `${progressWidths[i]}%`,
                          transitionDelay: `${400 + i * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Comparison Badge */}
            <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">vs Last-Click: Google Ads would get <span className="font-semibold text-destructive">100%</span></span>
              </div>
            </div>
          </div>
        </GlassCard>
        
        {/* Floating Stats */}
        <AnimatedItem 
          visible={visible} 
          delay={getDelay(3)}
          className="absolute -bottom-4 -right-4 rounded-xl shadow-lg p-4 bg-card backdrop-blur-xl border border-border"
        >
          <div className="text-2xl font-bold text-primary">3.2x</div>
          <div className="text-xs text-muted-foreground">better ROAS</div>
        </AnimatedItem>
      </AnimatedItem>
      
      {/* Right: Content */}
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-destructive/80">the problem</p>
          <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold">
            last-click attribution lies to you
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
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
              <AnimatedItem
                key={item.label}
                visible={visible}
                delay={getDelay(i + 1)}
                className="p-4 rounded-xl bg-card backdrop-blur-xl border border-border"
              >
                <Icon className="w-5 h-5 mb-2 text-primary" />
                <div className="text-2xl font-display font-bold text-primary">{item.stat}</div>
                <div className="text-xs mt-1 text-muted-foreground">{item.label}</div>
              </AnimatedItem>
            );
          })}
        </div>
        
        <Link 
          to="/features/attribution-graph"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80 text-primary"
        >
          see how clean-track attribution works
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

// Journey Content with Product Mockup
const JourneyContent = () => {
  const { ref, visible, getDelay } = useStaggeredAnimation(5, 0.3, 0.1);

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left: Content */}
      <div className="space-y-6 lg:order-2">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">complete visibility</p>
          <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold">
            see every touchpoint, across every device
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
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
            <AnimatedItem
              key={feature.title}
              visible={visible}
              delay={getDelay(i)}
              direction="left"
              className="flex items-start gap-3 p-3 rounded-lg bg-card backdrop-blur-xl border border-border"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-primary" />
              <div>
                <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
            </AnimatedItem>
          ))}
        </div>
        
        <Link 
          to="/features/predictive-analytics"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80 text-primary"
        >
          explore clean-track journey analytics
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Right: Product Mockup */}
      <AnimatedItem visible={visible} delay={getDelay(0)} direction="right" className="relative lg:order-1">
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-card backdrop-blur-xl border border-border" style={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.1)' }}>
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-warning/50" />
              <div className="w-3 h-3 rounded-full bg-success/50" />
            </div>
            <div className="flex-1 mx-4">
              <div className="rounded-md px-3 py-1.5 text-xs font-mono bg-muted/50 text-muted-foreground">
                utm.one/dashboard/journeys
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-semibold text-foreground">customer journey</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                Nike enterprise deal
              </span>
            </div>
            
            {/* Journey Steps */}
            <div className="relative">
              <div className="absolute top-6 left-6 bottom-6 w-0.5 bg-border" />
              
              <div className="space-y-4">
                {[
                  { icon: GoogleIcon, label: "Google Search", device: "Mobile", day: "Day 1", time: "9:34 AM", iconColor: "#4285F4" },
                  { icon: FileText, label: "Blog Post", device: "Desktop", day: "Day 3", time: "2:15 PM" },
                  { icon: Mail, label: "Email Nurture", device: "Mobile", day: "Day 7", time: "8:22 AM" },
                  { icon: Monitor, label: "Demo Request", device: "Desktop", day: "Day 12", time: "3:45 PM" },
                  { icon: ShoppingCart, label: "Closed Won", device: "Desktop", day: "Day 18", time: "11:00 AM", highlight: true }
                ].map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <AnimatedItem
                      key={step.label}
                      visible={visible}
                      delay={getDelay(i)}
                      direction="right"
                      className="flex items-center gap-4 relative"
                    >
                      <div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center relative z-10 ${
                          step.highlight 
                            ? 'bg-primary text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)]' 
                            : 'bg-muted border border-border text-muted-foreground'
                        }`}
                      >
                        <Icon className="w-5 h-5" style={(step as any).iconColor ? { color: (step as any).iconColor } : undefined} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-foreground">{step.label}</span>
                          <span className="text-xs text-muted-foreground">{step.device}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">{step.day} · {step.time}</div>
                      </div>
                    </AnimatedItem>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating Badge */}
        <AnimatedItem
          visible={visible}
          delay={getDelay(4)}
          className="absolute -bottom-4 -left-4 rounded-xl shadow-lg p-4 bg-card backdrop-blur-xl border border-border"
        >
          <div className="text-2xl font-bold text-primary">18</div>
          <div className="text-xs text-muted-foreground">days to close</div>
        </AnimatedItem>
      </AnimatedItem>
    </div>
  );
};

// Links Content with Product Mockup
const LinksContent = () => {
  const { ref, visible, getDelay } = useStaggeredAnimation(5, 0.3, 0.08);

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left: Product Mockup */}
      <AnimatedItem visible={visible} delay={getDelay(0)} direction="right" className="relative">
        <div className="rounded-2xl shadow-2xl overflow-hidden bg-card backdrop-blur-xl border border-border" style={{ boxShadow: '0 0 40px hsl(var(--primary) / 0.1)' }}>
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b border-border">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-destructive/50" />
              <div className="w-3 h-3 rounded-full bg-warning/50" />
              <div className="w-3 h-3 rounded-full bg-success/50" />
            </div>
            <div className="flex-1 mx-4">
              <div className="rounded-md px-3 py-1.5 text-xs font-mono bg-muted/50 text-muted-foreground">
                utm.one/dashboard/create
              </div>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <h4 className="font-semibold text-foreground">create smart link</h4>
            
            {/* URL Input */}
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">destination url</label>
              <div className="rounded-lg px-3 py-2 text-sm font-mono bg-muted/50 text-foreground/70 border border-border">
                https://tesla.com/product/demo
              </div>
            </div>
            
            {/* Link Layers */}
            <div className="space-y-2">
              {[
                { icon: LinkIcon, label: "short link", value: "utm.one/tesla-demo", opacity: 1 },
                { icon: BarChart3, label: "utm params", value: "source=linkedin&medium=social&campaign=elon_launch", opacity: 0.8 },
                { icon: QrCode, label: "qr code", value: "branded, tracked", opacity: 0.6 },
                { icon: Shield, label: "clean-track", value: "validated ✓", opacity: 0.4 },
                { icon: Layers, label: "metadata", value: "LLM-ready", opacity: 0.2 }
              ].map((layer, i) => {
                const Icon = layer.icon;
                return (
                  <AnimatedItem
                    key={layer.label}
                    visible={visible}
                    delay={getDelay(i)}
                    direction="right"
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                      <Icon className="w-4 h-4 text-primary" style={{ opacity: layer.opacity }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground">{layer.label}</p>
                      <p className="text-xs truncate text-foreground/70 font-mono">{layer.value}</p>
                    </div>
                  </AnimatedItem>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Floating Badge */}
        <AnimatedItem
          visible={visible}
          delay={getDelay(4)}
          className="absolute -bottom-4 -right-4 rounded-xl shadow-lg p-4 bg-card backdrop-blur-xl border border-border"
        >
          <div className="text-2xl font-bold text-primary">&lt;5s</div>
          <div className="text-xs text-muted-foreground">to create</div>
        </AnimatedItem>
      </AnimatedItem>
      
      {/* Right: Content */}
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">unified link layer</p>
          <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold">
            one link. five layers. infinite intelligence.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Every utm.one link isn't just short — it's a data pipeline. Short URL, UTM parameters, 
            branded QR, validation rules, and rich metadata — all in one.
          </p>
        </div>
        
        {/* Features */}
        <div className="grid grid-cols-2 gap-3">
          {[
            "Auto-generated slugs",
            "Team UTM templates",
            "Branded QR codes",
            "LLM-ready metadata"
          ].map((feature, i) => (
            <AnimatedItem
              key={feature}
              visible={visible}
              delay={getDelay(i + 1)}
              className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border"
            >
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
              <span className="text-sm text-foreground">{feature}</span>
            </AnimatedItem>
          ))}
        </div>
        
        <Link 
          to="/features/short-links"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80 text-primary"
        >
          see the link builder
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

// Intelligence Content with AI Features
const IntelligenceContent = () => {
  const { ref, visible, getDelay } = useStaggeredAnimation(3, 0.3, 0.1);

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left: Content */}
      <div className="space-y-6 lg:order-2">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">clean-track intelligence</p>
          <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold">
            AI that actually understands marketing
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Not just dashboards — predictive models that tell you what to do next. 
            Budget allocation, channel optimization, and anomaly detection, powered by Clean-Track algorithms.
          </p>
        </div>
        
        {/* AI Features */}
        <div className="space-y-3">
          {[
            { icon: Brain, title: "Predictive forecasting", desc: "What will traffic look like next week?" },
            { icon: Sparkles, title: "Smart recommendations", desc: "Which channels deserve more budget?" },
            { icon: AlertCircle, title: "Anomaly detection", desc: "Get alerted when metrics spike or drop" }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedItem
                key={feature.title}
                visible={visible}
                delay={getDelay(i)}
                direction="left"
                className="flex items-start gap-3 p-3 rounded-lg bg-card backdrop-blur-xl border border-border"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              </AnimatedItem>
            );
          })}
        </div>
        
        <Link 
          to="/features/predictive-analytics"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80 text-primary"
        >
          explore clean-track intelligence
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      
      {/* Right: AI Dashboard Mockup */}
      <AnimatedItem visible={visible} delay={getDelay(0)} direction="right" className="relative lg:order-1">
        <GlassCard>
          <BrowserHeader url="utm.one/dashboard/intelligence" />
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">clean-track insights</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">live</span>
            </div>
            
            {/* AI Insights */}
            <div className="space-y-3">
              {[
                { type: "recommendation", message: "Increase LinkedIn budget by 15% based on 3-week trend", priority: "high" },
                { type: "prediction", message: "Traffic expected to spike 40% next Tuesday (product launch)", priority: "medium" },
                { type: "anomaly", message: "Google Ads CTR dropped 25% yesterday — investigating", priority: "high" }
              ].map((insight, i) => (
                <AnimatedItem
                  key={insight.message}
                  visible={visible}
                  delay={getDelay(i + 1)}
                  className={`p-3 rounded-lg border ${
                    insight.priority === 'high' 
                      ? 'border-primary/30 bg-primary/5' 
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {insight.type === 'recommendation' && <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                    {insight.type === 'prediction' && <Brain className="w-4 h-4 text-primary shrink-0 mt-0.5" />}
                    {insight.type === 'anomaly' && <AlertCircle className="w-4 h-4 text-warning shrink-0 mt-0.5" />}
                    <p className="text-sm text-foreground/80">{insight.message}</p>
                  </div>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </GlassCard>
        
        {/* Floating Chat */}
        <AnimatedItem
          visible={visible}
          delay={getDelay(3)}
          className="absolute -bottom-4 -right-4 rounded-xl shadow-lg p-4 bg-card backdrop-blur-xl border border-border"
        >
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">Ask AI</span>
          </div>
        </AnimatedItem>
      </AnimatedItem>
    </div>
  );
};

// Governance Content with Enterprise Features
const GovernanceContent = () => {
  const { ref, visible, getDelay } = useStaggeredAnimation(4, 0.3, 0.1);

  return (
    <div ref={ref} className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
      {/* Left: Product Mockup */}
      <AnimatedItem visible={visible} delay={getDelay(0)} direction="right" className="relative">
        <GlassCard>
          <BrowserHeader url="utm.one/dashboard/governance" />
          
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">workspace governance</h4>
              <span className="text-xs px-2 py-1 rounded-full bg-success/10 text-success">compliant</span>
            </div>
            
            {/* Governance Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "team members", value: "24" },
                { label: "active links", value: "1.2K" },
                { label: "UTM compliance", value: "98%" }
              ].map((stat, i) => (
                <AnimatedItem
                  key={stat.label}
                  visible={visible}
                  delay={getDelay(i)}
                  className="p-3 rounded-lg bg-muted/30 text-center"
                >
                  <div className="text-xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </AnimatedItem>
              ))}
            </div>
            
            {/* Audit Log Preview */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">recent activity</p>
              {[
                { user: "Sarah", action: "created link", time: "2m ago" },
                { user: "Mike", action: "approved bulk upload", time: "15m ago" },
                { user: "Lisa", action: "updated UTM template", time: "1h ago" }
              ].map((log, i) => (
                <AnimatedItem
                  key={log.action + i}
                  visible={visible}
                  delay={getDelay(i + 2)}
                  direction="right"
                  className="flex items-center justify-between p-2 rounded-lg bg-muted/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium text-primary">
                      {log.user[0]}
                    </div>
                    <span className="text-sm text-foreground/80">{log.user} {log.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{log.time}</span>
                </AnimatedItem>
              ))}
            </div>
          </div>
        </GlassCard>
        
        {/* Floating Badge */}
        <AnimatedItem
          visible={visible}
          delay={getDelay(4)}
          className="absolute -bottom-4 -left-4 rounded-xl shadow-lg p-4 bg-card backdrop-blur-xl border border-border"
        >
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">SOC 2</span>
          </div>
        </AnimatedItem>
      </AnimatedItem>
      
      {/* Right: Content */}
      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium uppercase tracking-wider text-primary">enterprise control</p>
          <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold">
            governance that doesn't slow you down
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Role-based access, approval workflows, naming conventions, and complete audit trails — 
            without the bureaucracy. Structure meets speed.
          </p>
        </div>
        
        {/* Enterprise Features */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: Shield, label: "SSO & SCIM" },
            { icon: Layers, label: "Role-based access" },
            { icon: CheckCircle2, label: "Approval workflows" },
            { icon: Zap, label: "API & webhooks" }
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <AnimatedItem
                key={feature.label}
                visible={visible}
                delay={getDelay(i + 1)}
                className="flex items-center gap-2 p-3 rounded-lg bg-card border border-border"
              >
                <Icon className="w-4 h-4 text-primary shrink-0" />
                <span className="text-sm text-foreground">{feature.label}</span>
              </AnimatedItem>
            );
          })}
        </div>
        
        <Link 
          to="/enterprise"
          className="inline-flex items-center gap-2 font-medium transition-colors hover:opacity-80 text-primary"
        >
          explore enterprise features
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export const DynamicSecondFold = ({ selectedUseCase }: DynamicSecondFoldProps) => {
  const [currentContent, setCurrentContent] = useState<UseCaseType>(selectedUseCase);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (selectedUseCase !== currentContent) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setCurrentContent(selectedUseCase);
        setIsTransitioning(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [selectedUseCase, currentContent]);

  const renderContent = () => {
    switch (currentContent) {
      case "attribution":
        return <AttributionContent />;
      case "journey":
        return <JourneyContent />;
      case "links":
        return <LinksContent />;
      case "intelligence":
        return <IntelligenceContent />;
      case "governance":
        return <GovernanceContent />;
      default:
        return <AttributionContent />;
    }
  };

  return (
    <ParallaxSection speed={0.05}>
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div
            className={`transition-all duration-400 ease-out ${
              isTransitioning ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
            }`}
          >
            {renderContent()}
          </div>
        </div>
      </section>
    </ParallaxSection>
  );
};
