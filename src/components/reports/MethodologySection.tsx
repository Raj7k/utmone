import { motion } from "framer-motion";
import { Database, FileText, CheckCircle, BarChart3, Globe2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const MethodologySection = () => {
  const dataProcess = [
    {
      step: "01",
      title: "Job Posting Scraping",
      description: "Analyzed 50K+ job postings from LinkedIn, Indeed, Glassdoor, Naukri.com across 15+ countries",
      icon: FileText,
      count: "50,000+",
      color: "blazeOrange"
    },
    {
      step: "02",
      title: "Survey Distribution",
      description: "Collected 20K+ responses from GTM professionals via LinkedIn, email campaigns, and community partnerships",
      icon: Database,
      count: "20,000+",
      color: "deepSea"
    },
    {
      step: "03",
      title: "Validation & Cross-Check",
      description: "Cross-referenced with SHRM benchmarks, Payscale data, and company reports to remove outliers",
      icon: CheckCircle,
      count: "500K+",
      color: "blazeOrange"
    },
    {
      step: "04",
      title: "Normalization",
      description: "Applied geographic multipliers, COL adjustments, and experience-level normalization formulas",
      icon: BarChart3,
      count: "100%",
      color: "deepSea"
    }
  ];

  const dataSources = [
    { name: "LinkedIn", logo: "🔗", dataPoints: "25K+" },
    { name: "Glassdoor", logo: "🏢", dataPoints: "15K+" },
    { name: "Indeed", logo: "📊", dataPoints: "18K+" },
    { name: "Naukri.com", logo: "🇮🇳", dataPoints: "8K+" },
    { name: "SHRM", logo: "📚", dataPoints: "500K+" },
    { name: "Payscale", logo: "💰", dataPoints: "10K+" }
  ];

  const qualityControls = [
    "Removed salary outliers beyond 3 standard deviations",
    "Excluded self-reported data without verification",
    "Normalized job titles across sources",
    "Applied geographic cost-of-living adjustments",
    "Validated company sizes via LinkedIn/Crunchbase",
    "Cross-referenced equity data with public filings"
  ];

  return (
    <section id="methodology" className="py-32 bg-white">
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <Badge className="mb-6 bg-mirage text-white text-sm px-4 py-2">
            Our Methodology
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-8 max-w-[900px] mx-auto">
            How We Built the Most Comprehensive Salary Dataset
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto leading-relaxed">
            Our 4-step process combines automated data collection with rigorous validation 
            to ensure accuracy across 15+ countries and 100+ cities.
          </p>
        </motion.div>

        {/* 4-Step Process */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {dataProcess.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`p-6 border-2 border-${item.color}/20 hover:shadow-xl transition-apple hover:scale-101 relative overflow-hidden group`}>
                  <div className="absolute top-4 right-4 text-6xl font-display font-extrabold opacity-5 group-hover:opacity-10 transition-opacity">
                    {item.step}
                  </div>
                  <div className={`w-12 h-12 mb-4 rounded-xl bg-${item.color}/10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6`} style={{ color: `hsl(var(--${item.color}))` }} />
                  </div>
                  <div className={`text-3xl font-display font-bold mb-2`} style={{ color: `hsl(var(--${item.color}))` }}>
                    {item.count}
                  </div>
                  <h3 className="text-lg font-display font-bold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Data Sources Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-display font-bold text-center mb-12">
            Trusted Data Sources
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {dataSources.map((source, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="p-6 text-center border-2 border-deepSea/10 hover:border-deepSea/30 hover:shadow-lg transition-apple hover:scale-101">
                  <div className="text-4xl mb-3">{source.logo}</div>
                  <h4 className="font-semibold mb-1">{source.name}</h4>
                  <p className="text-sm text-deepSea font-bold">{source.dataPoints}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quality Controls */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="p-10 bg-wildSand/50 border-2 border-deepSea/10">
            <h3 className="text-2xl font-display font-bold mb-8 text-center">
              Quality Control Standards
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {qualityControls.map((control, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-deepSea mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{control}</span>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
