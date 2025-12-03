import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Link as LinkIcon, 
  BarChart3, 
  QrCode, 
  TrendingUp, 
  CheckCircle2, 
  Shield,
  ArrowRight
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const TOOLS = [
  {
    id: "short-links",
    icon: LinkIcon,
    label: "short links",
    preview: {
      title: "create smart link",
      url: "utm.one/dashboard/links",
      content: (
        <div className="space-y-2">
          <div className="space-y-1">
            <label className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>destination url</label>
            <div 
              className="rounded-lg px-2 py-1.5 text-xs font-mono truncate"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
            >
              https://nike.com/product/air-max
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>short link</label>
            <div 
              className="rounded-lg px-2 py-1.5 text-xs font-mono flex items-center gap-1.5"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}
            >
              <LinkIcon className="w-3 h-3" />
              utm.one/nike-launch
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <CheckCircle2 className="w-3 h-3" style={{ color: 'rgba(255,255,255,0.7)' }} />
            branded, tracked, forever
          </div>
        </div>
      )
    }
  },
  {
    id: "utm-builder",
    icon: BarChart3,
    label: "utm builder",
    preview: {
      title: "utm parameters",
      url: "utm.one/dashboard/utm-builder",
      content: (
        <div className="space-y-1.5">
          {[
            { param: "utm_source", value: "linkedin", opacity: 1 },
            { param: "utm_medium", value: "social", opacity: 0.9 },
            { param: "utm_campaign", value: "tesla_q4_launch", opacity: 0.8 },
            { param: "utm_term", value: "enterprise", opacity: 0.7 },
            { param: "utm_content", value: "elon_post", opacity: 0.6 },
          ].map((item, i) => (
            <motion.div 
              key={item.param}
              className="flex items-center gap-1.5 p-1.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: `rgba(255,255,255,${item.opacity})` }} />
              <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.param}=</span>
              <span className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.value}</span>
            </motion.div>
          ))}
        </div>
      )
    }
  },
  {
    id: "qr-generator",
    icon: QrCode,
    label: "qr codes",
    preview: {
      title: "branded qr code",
      url: "utm.one/dashboard/qr",
      content: (
        <div className="flex items-center gap-4">
          <div 
            className="w-20 h-20 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(255,255,255,0.9)' }}
          >
            <QrCode className="w-14 h-14" style={{ color: '#050505' }} />
          </div>
          <div className="space-y-2">
            <div className="space-y-0.5">
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>brand color</div>
              <div className="flex gap-1.5">
                <div className="w-4 h-4 rounded-full" style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.3)' }} />
                <div className="w-4 h-4 rounded-full" style={{ background: 'rgba(255,255,255,0.2)' }} />
              </div>
            </div>
            <div className="space-y-0.5">
              <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>logo</div>
              <div className="text-xs" style={{ color: 'rgba(255,255,255,0.8)' }}>apple-logo.svg</div>
            </div>
            <div className="flex items-center gap-1 text-[10px]" style={{ color: 'rgba(255,255,255,0.7)' }}>
              <CheckCircle2 className="w-2.5 h-2.5" />
              tracked attribution
            </div>
          </div>
        </div>
      )
    }
  },
  {
    id: "analytics",
    icon: TrendingUp,
    label: "analytics",
    preview: {
      title: "link performance",
      url: "utm.one/dashboard/analytics",
      content: (
        <div className="space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "clicks", value: "24,847" },
              { label: "unique", value: "18,234" },
              { label: "conversion", value: "4.8%" },
            ].map((stat) => (
              <div 
                key={stat.label} 
                className="p-2 rounded text-center"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>{stat.value}</div>
                <div className="text-[10px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
          <div className="h-10 flex items-end gap-0.5">
            {[40, 55, 45, 60, 75, 65, 80, 70, 85, 90, 75, 95].map((h, i) => (
              <motion.div
                key={i}
                className="flex-1 rounded-t"
                style={{ height: `${h}%`, background: 'rgba(255,255,255,0.3)' }}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.03, duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      )
    }
  },
  {
    id: "clean-track",
    icon: CheckCircle2,
    label: "clean-track",
    preview: {
      title: "validation rules",
      url: "utm.one/dashboard/clean-track",
      content: (
        <div className="space-y-1.5">
          {[
            { rule: "utm_source format", status: "pass", desc: "lowercase, no spaces" },
            { rule: "campaign naming", status: "pass", desc: "follows Q4-PRODUCT-REGION" },
            { rule: "required params", status: "pass", desc: "all 5 UTMs present" },
            { rule: "domain whitelist", status: "pass", desc: "tesla.com verified" },
          ].map((item, i) => (
            <motion.div
              key={item.rule}
              className="flex items-center gap-2 p-1.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: 'rgba(255,255,255,0.7)' }} />
              <div className="flex-1 min-w-0">
                <div className="text-xs lowercase truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>{item.rule}</div>
                <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
  },
  {
    id: "governance",
    icon: Shield,
    label: "enterprise control",
    preview: {
      title: "team permissions",
      url: "utm.one/dashboard/settings/team",
      content: (
        <div className="space-y-1.5">
          {[
            { name: "Elon Musk", role: "Admin", access: "Full access" },
            { name: "Tim Cook", role: "Editor", access: "Create & edit" },
            { name: "Jeff Bezos", role: "Viewer", access: "View only" },
          ].map((user, i) => (
            <motion.div
              key={user.name}
              className="flex items-center gap-2 p-1.5 rounded"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
              >
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.8)' }}>{user.name}</div>
                <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{user.role} · {user.access}</div>
              </div>
            </motion.div>
          ))}
          <div className="pt-1" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-[10px] flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              <Shield className="w-2.5 h-2.5" />
              3 pending approvals
            </div>
          </div>
        </div>
      )
    }
  }
];

export const GTMToolsShowcase = () => {
  const [activeTool, setActiveTool] = useState("short-links");
  const active = TOOLS.find(t => t.id === activeTool) || TOOLS[0];

  return (
    <AnimatedSection className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase px-2"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            everything your gtm team needs, in one place
          </h1>
          <p className="text-base sm:text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Six tools. One platform. Zero data chaos.
          </p>
        </div>
        
        {/* Mobile: Vertical Layout */}
        <div className="md:hidden space-y-4">
          {/* Tool Selector Pills - Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full whitespace-nowrap shrink-0 transition-all"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.95)'
                  } : {
                    background: 'rgba(24,24,27,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} />
                  <span className="text-sm font-medium lowercase">{tool.label}</span>
                </button>
              );
            })}
          </div>
          
          {/* Active Tool Preview - Full Width Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTool}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="rounded-xl overflow-hidden"
              style={{
                background: 'rgba(24,24,27,0.4)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    {(() => {
                      const Icon = active.icon;
                      return <Icon className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />;
                    })()}
                  </div>
                  <div>
                    <h4 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>{active.label}</h4>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{active.preview.title}</p>
                  </div>
                </div>
                {active.preview.content}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Desktop: Two Column Layout */}
        <div className="hidden md:grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          {/* Left: Interactive Product Mockup - Compact */}
          <div className="relative h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl overflow-hidden h-full flex flex-col"
                style={{
                  background: 'rgba(24,24,27,0.4)',
                  backdropFilter: 'blur(40px)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderTop: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.5)'
                }}
              >
                {/* Browser Header */}
                <div 
                  className="flex items-center gap-2 px-3 py-2 shrink-0"
                  style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,100,100,0.6)' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(255,200,100,0.6)' }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(100,200,100,0.6)' }} />
                  </div>
                  <div className="flex-1 mx-2">
                    <div 
                      className="rounded px-2 py-1 text-[10px] font-mono"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)' }}
                    >
                      {active.preview.url}
                    </div>
                  </div>
                </div>
                
                {/* Dashboard Content */}
                <div className="p-4 flex-1 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold lowercase text-sm" style={{ color: 'rgba(255,255,255,0.9)' }}>{active.preview.title}</h4>
                  </div>
                  {active.preview.content}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Right: Feature List - Compact */}
          <div className="space-y-2">
            {TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              
              return (
                <motion.button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  onMouseEnter={() => setActiveTool(tool.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-3 rounded-lg transition-all duration-200 group min-h-[60px]"
                  style={isActive ? {
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))',
                    border: '1px solid rgba(255,255,255,0.15)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
                  } : {
                    background: 'rgba(24,24,27,0.4)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.08)' }}
                    >
                      <Icon className="w-4 h-4" style={{ color: isActive ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }} />
                    </div>
                    <div className="flex-1">
                      <div 
                        className="font-semibold lowercase text-sm"
                        style={{ color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)' }}
                      >
                        {tool.label}
                      </div>
                    </div>
                    <ArrowRight 
                      className="w-4 h-4 transition-all"
                      style={{ 
                        color: isActive ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)',
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'translateX(0)' : 'translateX(-8px)'
                      }}
                    />
                  </div>
                </motion.button>
              );
            })}
            
            <div className="pt-3">
              <Link 
                to="/how-it-works"
                className="inline-flex items-center gap-2 font-medium transition-colors lowercase text-sm"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                see how it all works together
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
