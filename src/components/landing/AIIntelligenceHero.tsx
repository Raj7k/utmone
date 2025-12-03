import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  TrendingUp, 
  GitBranch, 
  Navigation, 
  Shield,
  ArrowRight
} from "lucide-react";

const AI_FEATURES = [
  {
    icon: TrendingUp,
    title: "predictive analytics",
    description: "know which campaigns will perform before you launch",
    href: "/features/predictive-analytics",
  },
  {
    icon: GitBranch,
    title: "attribution graph",
    description: "see the true path from click to conversion",
    href: "/features/attribution-graph",
  },
  {
    icon: Navigation,
    title: "smart routing",
    description: "send visitors to the right destination automatically",
    href: "/features/smart-routing",
  },
  {
    icon: Shield,
    title: "link immunity",
    description: "auto-detect and fix broken links before they hurt you",
    href: "/features/link-immunity",
  },
];

export const AIIntelligenceHero = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Obsidian Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(24,24,27,0.6) 0%, rgba(5,5,5,1) 100%)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)'
            }}
          >
            <Sparkles className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <span className="text-sm font-medium lowercase" style={{ color: 'rgba(255,255,255,0.8)' }}>clean-track intelligence</span>
          </div>
          
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase mb-6"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            four AI layers built into every link
          </h1>
          
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            mathematical models from MIT and Harvard scientists, working behind the scenes to make your data smarter.
          </p>
        </motion.div>

        {/* Feature Cards Grid - 2x2 on mobile, 1x4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-12">
          {AI_FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={feature.href}
                  className="group block h-full p-4 md:p-6 rounded-xl md:rounded-2xl transition-all duration-300"
                  style={{
                    background: 'rgba(24,24,27,0.4)',
                    backdropFilter: 'blur(40px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderTop: '1px solid rgba(255,255,255,0.12)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
                  }}
                >
                  <div 
                    className="w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-3 md:mb-4 transition-colors"
                    style={{ background: 'rgba(255,255,255,0.1)' }}
                  >
                    <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
                  </div>
                  
                  <h3 
                    className="text-sm md:text-lg font-semibold mb-1 md:mb-2 lowercase transition-colors"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-none"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {feature.description}
                  </p>
                  
                  <span 
                    className="hidden md:inline-flex items-center gap-1 text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    learn more
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link to="/early-access">
            <Button 
              size="lg" 
              className="lowercase rounded-full px-8"
              style={{
                background: '#FFFFFF',
                color: '#09090B',
                boxShadow: '0 0 30px rgba(255,255,255,0.3), 0 4px 15px rgba(0,0,0,0.2)',
              }}
            >
              get early access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
