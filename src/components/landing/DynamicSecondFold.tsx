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
      <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,100,100,0.5)' }} />
      <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,200,100,0.5)' }} />
      <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(100,200,100,0.5)' }} />
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
            <h4 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>clean-track attribution</h4>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>last 30 days</span>
          </div>
          
          {/* Attribution Bars */}
          <div className="space-y-3">
            {[
              { channel: "Nike Organic Content", credit: 35, opacity: 1 },
              { channel: "Tesla Podcast Mentions", credit: 25, opacity: 0.8 },
              { channel: "Apple LinkedIn Organic", credit: 20, opacity: 0.6 },
              { channel: "Google Ads", credit: 20, opacity: 0.4 }
            ].map((item, i) => (
              <div key={item.channel} className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'rgba(255,255,255,0.5)' }}>{item.channel}</span>
                  <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{item.credit}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <motion.div 
                    className="h-full rounded-full"
                    style={{ background: `rgba(59,130,246,${item.opacity})` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.credit}%` }}
                    transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          {/* Comparison Badge */}
          <div 
            className="mt-4 p-3 rounded-lg"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4" style={{ color: '#3B82F6' }} />
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>vs Last-Click: Google Ads would get <span className="font-semibold" style={{ color: 'rgba(239,68,68,0.8)' }}>100%</span></span>
            </div>
          </div>
        </div>
      </GlassCard>
      
      {/* Floating Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="absolute -bottom-4 -right-4 rounded-xl shadow-lg p-4"
        style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>3.2x</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>better ROAS</div>
      </motion.div>
    </motion.div>
    
    {/* Right: Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(239,68,68,0.8)' }}>the problem</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          last-click attribution lies to you
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
              className="p-4 rounded-xl"
              style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <Icon className="w-5 h-5 mb-2" style={{ color: '#3B82F6' }} />
              <div className="text-2xl font-display font-bold" style={{ color: '#3B82F6' }}>{item.stat}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.label}</div>
            </motion.div>
          );
        })}
      </div>
      
      <Link 
        to="/features/attribution-graph"
        className="inline-flex items-center gap-2 font-medium transition-colors lowercase hover:opacity-80"
        style={{ color: '#3B82F6' }}
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
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: '#3B82F6' }}>complete visibility</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          see every touchpoint, across every device
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />
            <div>
              <h4 className="font-semibold lowercase text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{feature.title}</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link 
        to="/features/predictive-analytics"
        className="inline-flex items-center gap-2 font-medium transition-colors lowercase hover:opacity-80"
        style={{ color: '#3B82F6' }}
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
      <div 
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(59,130,246,0.1)' }}
      >
        <div 
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,100,100,0.5)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,200,100,0.5)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(100,200,100,0.5)' }} />
          </div>
          <div className="flex-1 mx-4">
            <div 
              className="rounded-md px-3 py-1.5 text-xs font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              utm.one/dashboard/journeys
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>customer journey</h4>
            <span 
              className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#3B82F6' }}
            >
              Nike enterprise deal
            </span>
          </div>
          
          {/* Journey Steps */}
          <div className="relative">
            <div 
              className="absolute top-6 left-6 bottom-6 w-0.5"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            />
            
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
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                      style={step.highlight ? {
                        background: '#3B82F6',
                        color: 'white',
                        boxShadow: '0 0 20px rgba(59,130,246,0.4)'
                      } : {
                        background: 'rgba(24,24,27,0.6)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: 'rgba(255,255,255,0.5)'
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{step.label}</span>
                        <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.device}</span>
                      </div>
                      <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{step.day} · {step.time}</div>
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
        className="absolute -bottom-4 -left-4 rounded-xl shadow-lg p-4"
        style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>18</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>days to close</div>
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
      <div 
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(59,130,246,0.1)' }}
      >
        <div 
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,100,100,0.5)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,200,100,0.5)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(100,200,100,0.5)' }} />
          </div>
          <div className="flex-1 mx-4">
            <div 
              className="rounded-md px-3 py-1.5 text-xs font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              utm.one/dashboard/create
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h4 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>create smart link</h4>
          
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>destination url</label>
            <div 
              className="rounded-lg px-3 py-2 text-sm font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
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
                <motion.div
                  key={layer.label}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
                >
                  <div 
                    className="w-8 h-8 rounded-md flex items-center justify-center"
                    style={{ background: `rgba(59,130,246,${layer.opacity})`, color: 'white' }}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs lowercase" style={{ color: 'rgba(255,255,255,0.5)' }}>{layer.label}</div>
                    <div className="text-xs font-mono truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{layer.value}</div>
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
        className="absolute -bottom-6 -right-6 rounded-xl shadow-lg p-3"
        style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div 
          className="w-16 h-16 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.9)' }}
        >
          <QrCode className="w-12 h-12" style={{ color: '#050505' }} />
        </div>
      </motion.div>
    </motion.div>
    
    {/* Right: Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: '#3B82F6' }}>one link. five layers.</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          every link tells the same story
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>{benefit}</span>
          </motion.div>
        ))}
      </div>
      
      <Link 
        to="/how-it-works"
        className="inline-flex items-center gap-2 font-medium transition-colors lowercase hover:opacity-80"
        style={{ color: '#3B82F6' }}
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
      <div 
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(59,130,246,0.1)' }}
      >
        {/* Chat Header */}
        <div 
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #F97316)' }}
          >
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>clean-track AI</div>
            <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>MIT & Harvard algorithms</div>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className="p-4 space-y-4">
          {/* User Message */}
          <div className="flex justify-end">
            <div 
              className="rounded-2xl rounded-tr-sm px-4 py-2 max-w-[80%]"
              style={{ background: '#3B82F6', color: 'white' }}
            >
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
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(59,130,246,0.1)' }}
            >
              <Brain className="w-4 h-4" style={{ color: '#3B82F6' }} />
            </div>
            <div 
              className="rounded-2xl rounded-tl-sm px-4 py-3 space-y-3"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>
                <strong>Nike Q4 Launch</strong> drove the most conversions:
              </p>
              <div className="space-y-2">
                {[
                  { label: "Clicks", value: "24,847", change: "+32%" },
                  { label: "Conversion Rate", value: "4.8%", change: "+18%" },
                  { label: "Revenue Attributed", value: "$128,200", change: "+45%" },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between text-xs">
                    <span style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{stat.value}</span>
                      <span style={{ color: 'rgba(34,197,94,0.8)' }}>{stat.change}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div 
                className="flex items-center gap-2 text-xs pt-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.1)', color: '#3B82F6' }}
              >
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
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(245,158,11,0.1)' }}
            >
              <AlertCircle className="w-4 h-4" style={{ color: 'rgba(245,158,11,0.8)' }} />
            </div>
            <div 
              className="rounded-2xl rounded-tl-sm px-4 py-3"
              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
            >
              <div className="flex items-center gap-2 mb-1" style={{ color: 'rgba(245,158,11,0.8)' }}>
                <span className="text-xs font-medium">Anomaly detected</span>
              </div>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.9)' }}>
                Traffic from <strong>Tesla email campaign</strong> dropped 45% yesterday. Investigating...
              </p>
            </div>
          </motion.div>
        </div>
        
        {/* Chat Input */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div 
            className="flex items-center gap-3 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <MessageSquare className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.5)' }} />
            <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Ask anything about your data...</span>
            <div className="ml-auto">
              <Zap className="w-4 h-4" style={{ color: '#3B82F6' }} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
    
    {/* Right: Content */}
    <div className="space-y-6">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: '#3B82F6' }}>clean-track intelligence</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          AI that makes your data talk
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(59,130,246,0.1)' }}
              >
                <Icon className="w-5 h-5" style={{ color: '#3B82F6' }} />
              </div>
              <div>
                <h4 className="font-semibold lowercase text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{feature.title}</h4>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <Link 
        to="/features/predictive-analytics"
        className="inline-flex items-center gap-2 font-medium transition-colors lowercase hover:opacity-80"
        style={{ color: '#3B82F6' }}
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
        <p className="text-sm font-medium uppercase tracking-wider" style={{ color: '#3B82F6' }}>enterprise control</p>
        <h2 className="hero-gradient text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase">
          your team's links, under control
        </h2>
        <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
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
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#3B82F6' }} />
            <div>
              <h4 className="font-semibold lowercase text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{feature.title}</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{feature.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Link 
        to="/solutions/enterprise"
        className="inline-flex items-center gap-2 font-medium transition-colors lowercase hover:opacity-80"
        style={{ color: '#3B82F6' }}
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
      <div 
        className="rounded-2xl shadow-2xl overflow-hidden"
        style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 0 40px rgba(59,130,246,0.1)' }}
      >
        <div 
          className="flex items-center gap-2 px-4 py-3"
          style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,100,100,0.5)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255,200,100,0.5)' }} />
            <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(100,200,100,0.5)' }} />
          </div>
          <div className="flex-1 mx-4">
            <div 
              className="rounded-md px-3 py-1.5 text-xs font-mono"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
            >
              utm.one/dashboard/team
            </div>
          </div>
        </div>
        
        <div className="p-6 space-y-4">
          <h4 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>team management</h4>
          
          {/* Team Members */}
          <div className="space-y-2">
            {[
              { name: "Elon Musk", email: "elon@tesla.com", role: "Admin", avatar: "EM" },
              { name: "Tim Cook", email: "tim@apple.com", role: "Editor", avatar: "TC" },
              { name: "Jeff Bezos", email: "jeff@amazon.com", role: "Viewer", avatar: "JB" },
            ].map((member, i) => (
              <motion.div
                key={member.name}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: 'rgba(255,255,255,0.03)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
              >
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                  style={{ background: 'rgba(59,130,246,0.2)', color: '#3B82F6' }}
                >
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{member.name}</div>
                  <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{member.email}</div>
                </div>
                <div 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={
                    member.role === "Admin" ? { background: 'rgba(59,130,246,0.1)', color: '#3B82F6' } :
                    member.role === "Editor" ? { background: 'rgba(245,158,11,0.1)', color: 'rgba(245,158,11,0.8)' } :
                    { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }
                  }
                >
                  {member.role}
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* Pending Approvals */}
          <div 
            className="p-3 rounded-lg"
            style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.2)' }}
          >
            <div className="flex items-center gap-2 text-sm font-medium" style={{ color: 'rgba(245,158,11,0.8)' }}>
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
        className="absolute -bottom-4 -right-4 rounded-xl shadow-lg p-4"
        style={{ background: 'rgba(24,24,27,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <div className="text-2xl font-bold" style={{ color: '#3B82F6' }}>100%</div>
        <div className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>policy compliance</div>
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
