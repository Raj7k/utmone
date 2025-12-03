import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Scale, TrendingUp, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const TOOLS = [
  {
    icon: Target,
    name: "first principles calculator",
    description: "break down complex decisions into fundamental truths. strip away assumptions and rebuild from what you know.",
    href: "/tools/decision-frameworks?tab=first-principles",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Scale,
    name: "decision matrix builder",
    description: "weighted scoring for better choices. compare options objectively with customizable criteria.",
    href: "/tools/decision-frameworks?tab=decision-matrix",
    color: "from-blazeOrange/20 to-blazeOrange/5",
  },
  {
    icon: TrendingUp,
    name: "ROI forecaster",
    description: "project campaign ROI with Clean-Track models. see potential returns before you commit budget.",
    href: "/tools/decision-frameworks?tab=roi-forecaster",
    color: "from-green-500/20 to-green-500/5",
  },
];

export const StrategicToolsShowcase = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
            <Sparkles className="w-4 h-4" />
            <span className="lowercase">free strategic tools</span>
          </div>
          <h1 className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase">
            make better decisions
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            built from mathematical models developed by MIT and Harvard scientists — now free to use.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TOOLS.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={tool.href}
                  className="group block h-full p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 lowercase">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-primary font-medium group-hover:gap-3 transition-all lowercase">
                    try free
                    <ArrowRight className="w-4 h-4" />
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
          className="text-center mt-10"
        >
          <Link to="/tools/decision-frameworks">
            <Button variant="outline" size="lg" className="lowercase">
              explore all decision tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
