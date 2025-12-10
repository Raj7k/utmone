import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, TrendingUp } from "lucide-react";
import { SonarVisualization } from "@/components/events/SonarVisualization";
import { Badge } from "@/components/ui/badge";

export const EventHaloShowcase = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-xs">
            New Feature
          </Badge>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            track the invisible 90% from every event
          </h2>
          <p className="text-lg md:text-xl max-w-[640px] mx-auto text-white/50">
            you scan 100 badges. we find the other 900 who saw your booth but never stopped.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Sonar Visualization */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <SonarVisualization 
              haloVisitors={847}
              liftPercentage={340}
              city="Las Vegas"
              isActive={true}
            />
          </motion.div>

          {/* Stats & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Key Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="obsidian-glass-60 rounded-xl p-5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">847</div>
                <div className="text-sm text-white/50">halo visitors detected</div>
              </div>
              <div className="obsidian-glass-60 rounded-xl p-5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-3">
                  <TrendingUp className="w-5 h-5 text-white/80" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">+340%</div>
                <div className="text-sm text-white/50">lift vs baseline</div>
              </div>
            </div>

            {/* Explanation */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white/90">event halo effect</h3>
              <p className="text-white/50 leading-relaxed">
                Most event ROI is invisible. Event Halo detects the "booth walk-by" effect—people who saw your booth, 
                picked up collateral, or heard your name, then visited your website days later without scanning a badge.
              </p>
              <ul className="space-y-2 text-sm text-white/60">
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Geographic proximity detection during event dates</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Post-event website visit correlation</span>
                </li>
                <li className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span>Lift analysis vs baseline traffic</span>
                </li>
              </ul>
            </div>

            {/* CTA */}
            <Link 
              to="/features/event-halo"
              className="inline-flex items-center gap-2 text-white font-medium hover:opacity-80 transition-opacity"
            >
              explore event halo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EventHaloShowcase;
