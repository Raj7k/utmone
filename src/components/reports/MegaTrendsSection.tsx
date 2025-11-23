import { motion } from "framer-motion";
import { TrendingUp, Bot, DollarSign, MapPin, Users, Target, Building2, Activity, Briefcase, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MegaTrendsTimeline } from "./visualizations/MegaTrendsTimeline";
import { RegionalFragmentationChart } from "./visualizations/RegionalFragmentationChart";
import { CareerSatisfactionScatter } from "./visualizations/CareerSatisfactionScatter";

const trends = [
  {
    id: 1,
    title: "Compensation Is Fragmenting",
    icon: MapPin,
    stat: "4.8×",
    description: "PMM in California earns 4.8× a PMM in Mexico, 3.2× one in India — despite identical responsibilities. Geographic fragmentation increases every year.",
    color: "blazeOrange"
  },
  {
    id: 2,
    title: "AI Reshaping Pay Fastest",
    icon: Bot,
    stat: "22-41%",
    description: "Roles leveraging AI earn 22-41% more, get promoted 1.7× faster, and experience lower burnout. AI = threat for execution roles, multiplier for strategic operators.",
    color: "deepSea"
  },
  {
    id: 3,
    title: "The Manager → Senior Manager Jump",
    icon: TrendingUp,
    stat: "28-43%",
    description: "The largest compensation leap globally happens at Manager → Senior Manager transition (28-43% increase). This is the shift from executor → owner where accountability begins.",
    color: "blazeOrange"
  },
  {
    id: 4,
    title: "Remote Work Discount",
    icon: MapPin,
    stat: "-6-18%",
    description: "Remote-first roles pay 6-18% lower globally, except in US West Coast and Singapore where talent wars create premiums. Hybrid pays highest overall.",
    color: "mirage"
  },
  {
    id: 5,
    title: "Skills > Experience",
    icon: Award,
    stat: "3×",
    description: "People with same title can have salary differences up to 3× depending on skills. Companies care more about AI proficiency, revenue impact, and automation ability than years worked.",
    color: "deepSea"
  },
  {
    id: 6,
    title: "Career Dissatisfaction Peaking",
    icon: Activity,
    stat: "71%",
    description: "57% feel unfulfilled, 68% say career progression unclear, 71% of MarkOps/RevOps feel undervalued. Attrition drivers: unclear growth, poor compensation transparency, lack of AI upskilling.",
    color: "mirage"
  },
  {
    id: 7,
    title: "Small Companies Pay More",
    icon: Building2,
    stat: "51-500",
    description: "Companies sized 51-500 employees offer highest increases for Product Marketers, Demand Gen, RevOps, and MarkOps because these roles directly influence pipeline quality and efficiency.",
    color: "blazeOrange"
  },
  {
    id: 8,
    title: "Sales Volatility at Peak",
    icon: DollarSign,
    stat: "±40%",
    description: "Sales pay ranges widest in history. SDRs: -10% to +15% variation, AEs: -15% to +22%, Enterprise AEs: -20% to +40%. Companies downsizing SDR teams, shifting to AI-assisted pipeline gen.",
    color: "mirage"
  },
  {
    id: 9,
    title: "RevOps Salary Explosion",
    icon: Target,
    stat: "+32%",
    description: "RevOps salaries grew: US +22% YoY, Europe +18%, India +32%, LATAM +27%. Essential for GTM alignment, heavily understaffed globally. Demand > supply = salary inflation.",
    color: "blazeOrange"
  },
  {
    id: 10,
    title: "Skills Determine Pay",
    icon: Briefcase,
    stat: "Top 10",
    description: "Advanced analytics, AI execution, forecasting, value-based messaging, attribution, CRM automation, GTM strategy, SQL/Python — these skills create 3× salary differences for same title.",
    color: "deepSea"
  }
];

export const MegaTrendsSection = () => {
  const getColorClass = (color: string) => {
    switch (color) {
      case "blazeOrange":
        return "text-[hsl(18,100%,51%)]";
      case "deepSea":
        return "text-[hsl(184,92%,18%)]";
      case "mirage":
        return "text-[hsl(210,29%,12%)]";
      default:
        return "text-primary";
    }
  };

  const getBgColorClass = (color: string) => {
    switch (color) {
      case "blazeOrange":
        return "bg-[hsl(18,100%,51%)]/10";
      case "deepSea":
        return "bg-[hsl(184,92%,18%)]/10";
      case "mirage":
        return "bg-[hsl(210,29%,12%)]/10";
      default:
        return "bg-primary/10";
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            10 Global Mega-Trends Reshaping Compensation
          </h2>
          <p className="text-xl text-muted-foreground max-w-[800px] mx-auto">
            These forces define the entire salary landscape across Marketing, Sales, RevOps, and MarkOps in 2025-2026.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {trends.map((trend, index) => {
            const Icon = trend.icon;
            return (
              <motion.div
                key={trend.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${getBgColorClass(trend.color)} flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${getColorClass(trend.color)}`} />
                      </div>
                      <Badge className={`${getColorClass(trend.color)} font-bold text-lg`}>
                        {trend.stat}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-3">
                      {trend.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {trend.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 p-8 bg-muted/20 rounded-2xl border border-border/50">
          <p className="text-center text-muted-foreground">
            <strong className="text-foreground">Critical Insight:</strong> These 10 trends form the core narrative for compensation across all regions and functions. Every salary table, skill premium, and negotiation strategy in this report connects back to these foundational forces.
          </p>
        </div>

        {/* Visualizations */}
        <div className="mt-16 space-y-12">
          <MegaTrendsTimeline />
          <RegionalFragmentationChart />
          <CareerSatisfactionScatter />
        </div>
      </div>
    </section>
  );
};
