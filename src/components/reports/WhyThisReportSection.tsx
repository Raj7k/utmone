import { motion } from "framer-motion";
import { Database, Globe, TrendingUp, Users, CheckCircle2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const colorStyles: Record<string, { bg: string; border: string; text: string }> = {
  blazeOrange: { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', text: 'rgba(249,115,22,1)' },
  deepSea: { bg: 'rgba(20,184,166,0.1)', border: 'rgba(20,184,166,0.2)', text: 'rgba(20,184,166,1)' },
};

export const WhyThisReportSection = () => {
  const valueProp = [
    {
      icon: Database,
      title: "500K+ Data Points",
      description: "Most comprehensive dataset combining job postings, surveys, and validated sources",
      color: "blazeOrange"
    },
    {
      icon: Globe,
      title: "15+ Countries",
      description: "Global coverage with state/city-level breakdown for accurate regional insights",
      color: "deepSea"
    },
    {
      icon: TrendingUp,
      title: "Real-Time Calculators",
      description: "Interactive tools using live data to show your exact market position",
      color: "blazeOrange"
    }
  ];

  return (
    <section id="why-this-report" className="py-32 bg-gradient-to-br from-wildSand/50 to-white">
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-deepSea text-white text-sm px-4 py-2">
            Why This Report Matters
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 max-w-[900px] mx-auto">
            The Salary Data You've Been Searching For Finally Exists
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
            Most salary data is fragmented, outdated, or hidden behind paywalls. 
            We've aggregated 500K+ data points from verified sources to give you 
            complete transparency into GTM compensation.
          </p>
        </motion.div>

        {/* Problem → Solution Grid */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-10 bg-foreground/5 border-2 border-foreground/20 h-full">
              <h3 className="text-2xl font-display font-bold mb-6 text-foreground">
                The Problem
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="text-foreground mt-1">×</span>
                  <span className="text-muted-foreground">Salary data is scattered across Glassdoor, Levels.fyi, LinkedIn, Payscale with no unified view</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground mt-1">×</span>
                  <span className="text-muted-foreground">Most benchmarks are US-centric and ignore geographic fragmentation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground mt-1">×</span>
                  <span className="text-muted-foreground">Self-reported data is unreliable with inflated numbers</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-foreground mt-1">×</span>
                  <span className="text-muted-foreground">No transparency on how skills, company size, or remote status impact salary</span>
                </li>
              </ul>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-10 bg-deepSea/5 border-2 border-deepSea/20 h-full">
              <h3 className="text-2xl font-display font-bold mb-6 text-deepSea">
                Our Solution
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Unified dataset combining 50K+ job postings, 20K+ survey responses, SHRM benchmarks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">State/city-level breakdowns for 15+ countries including US, India, UK, Germany, Singapore</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Validated data with cross-source verification and outlier removal</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-deepSea mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground">Transparent formula showing exact multipliers for location, skills, company size, industry</span>
                </li>
              </ul>
            </Card>
          </motion.div>
        </div>

        {/* Value Props Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {valueProp.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center border-2 hover:shadow-xl transition-all" style={{ borderColor: colorStyles[prop.color].border }}>
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center" style={{ background: colorStyles[prop.color].bg }}>
                    <Icon className="h-8 w-8" style={{ color: colorStyles[prop.color].text }} />
                  </div>
                  <h3 className="text-xl font-display font-bold mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
