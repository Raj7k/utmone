import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Target, 
  Scale, 
  TrendingUp, 
  ArrowRight, 
  Sparkles,
  CheckCircle2,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";
import { FirstPrinciplesWizard } from "./FirstPrinciplesWizard";

// Decision Matrix Builder
const DecisionMatrixBuilder = () => {
  const [options] = useState(["Option A", "Option B", "Option C"]);
  const [criteria] = useState([
    { name: "Cost", weight: 3 },
    { name: "Time", weight: 2 },
    { name: "Impact", weight: 5 },
    { name: "Risk", weight: 4 }
  ]);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const updateScore = (option: string, criterion: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [option]: { ...(prev[option] || {}), [criterion]: score }
    }));
  };

  const calculateTotal = (option: string) => {
    return criteria.reduce((total, c) => {
      const score = scores[option]?.[c.name] || 0;
      return total + (score * c.weight);
    }, 0);
  };

  const getWinner = () => {
    let maxScore = 0;
    let winner = "";
    options.forEach(opt => {
      const total = calculateTotal(opt);
      if (total > maxScore) {
        maxScore = total;
        winner = opt;
      }
    });
    return winner;
  };

  const handleShare = () => {
    const winner = getWinner();
    const text = `⚖️ Just used the Decision Matrix Builder from utm.one\n\nResult: ${winner} scored highest with ${calculateTotal(winner)} points\n\nMake data-driven decisions:`;
    shareOnLinkedIn(text, "https://utm.one/tools/decision-frameworks?tab=decision-matrix");
  };

  return (
    <div className="rounded-2xl overflow-hidden obsidian-glass">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-blazeOrange" />
          <h3 className="text-lg font-semibold text-white-90">
            weighted decision matrix
          </h3>
        </div>
        <p className="text-sm mb-4 text-white-50">
          Make data-driven decisions with weighted scoring (1-5 scale)
        </p>
        
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/8">
                  <th className="text-left p-2 font-medium text-white-50">Criteria (Weight)</th>
                  {options.map(opt => (
                    <th key={opt} className="text-center p-2 font-medium text-white-90">{opt}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {criteria.map((c) => (
                  <tr key={c.name} className="border-b border-white/5">
                    <td className="p-2">
                      <span className="text-white-90">{c.name}</span>
                      <span className="ml-1 text-white-40">(×{c.weight})</span>
                    </td>
                    {options.map(opt => (
                      <td key={opt} className="p-2 text-center">
                        <Input 
                          type="number"
                          min="1"
                          max="5"
                          className="w-12 mx-auto text-center text-xs h-7 bg-white/5 border-white/10 text-white placeholder:text-white/30"
                          placeholder="1-5"
                          value={scores[opt]?.[c.name] || ""}
                          onChange={(e) => updateScore(opt, c.name, parseInt(e.target.value) || 0)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className="bg-white/3">
                  <td className="p-2 font-semibold text-white-90">Total</td>
                  {options.map(opt => (
                    <td key={opt} className="p-2 text-center">
                      <span 
                        className={`font-bold ${getWinner() === opt ? 'text-blazeOrange' : 'text-white-90'}`}
                      >
                        {calculateTotal(opt)}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {getWinner() && calculateTotal(getWinner()) > 0 && (
            <motion.div 
              className="p-3 rounded-lg flex items-center justify-between bg-blazeOrange/10 border border-blazeOrange/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="flex items-center gap-2 font-semibold text-sm text-blazeOrange">
                <CheckCircle2 className="w-4 h-4" />
                Recommended: {getWinner()}
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-7 border-white/10 bg-white/5 hover:bg-white/10 text-white" 
                onClick={handleShare}
              >
                <Share2 className="w-3 h-3 mr-1" />
                share
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// ROI Forecaster
const ROIForecaster = () => {
  const [investment, setInvestment] = useState(10000);
  const [expectedClicks, setExpectedClicks] = useState(50000);
  const [conversionRate, setConversionRate] = useState(2.5);
  const [avgOrderValue, setAvgOrderValue] = useState(100);

  const conversions = Math.round(expectedClicks * (conversionRate / 100));
  const revenue = conversions * avgOrderValue;
  const roi = investment > 0 ? ((revenue - investment) / investment) * 100 : 0;

  const handleShare = () => {
    const text = `📈 Campaign ROI Forecast from utm.one\n\n💰 Investment: $${investment.toLocaleString()}\n📊 Projected Revenue: $${revenue.toLocaleString()}\n🎯 ROI: ${roi.toFixed(1)}%\n\nForecast your campaign ROI:`;
    shareOnLinkedIn(text, "https://utm.one/tools/decision-frameworks?tab=roi-forecaster");
  };

  return (
    <div className="rounded-2xl overflow-hidden obsidian-glass">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="text-lg font-semibold text-white-90">
            clean-track ROI forecaster
          </h3>
        </div>
        <p className="text-sm mb-4 text-white-50">
          Project campaign ROI using Clean-Track predictive models
        </p>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-white-70">investment ($)</label>
              <Input 
                type="number"
                value={investment}
                onChange={(e) => setInvestment(parseInt(e.target.value) || 0)}
                className="text-sm h-8 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-white-70">expected clicks</label>
              <Input 
                type="number"
                value={expectedClicks}
                onChange={(e) => setExpectedClicks(parseInt(e.target.value) || 0)}
                className="text-sm h-8 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-white-70">conversion rate (%)</label>
              <Input 
                type="number"
                step="0.1"
                value={conversionRate}
                onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
                className="text-sm h-8 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-white-70">avg order value ($)</label>
              <Input 
                type="number"
                value={avgOrderValue}
                onChange={(e) => setAvgOrderValue(parseInt(e.target.value) || 0)}
                className="text-sm h-8 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Conversions", value: conversions.toLocaleString(), color: "text-white-90" },
              { label: "Revenue", value: `$${revenue.toLocaleString()}`, color: "text-blazeOrange" },
              { label: "ROI", value: `${roi.toFixed(1)}%`, color: roi > 0 ? "text-green-500" : "text-red-500" },
            ].map((stat) => (
              <motion.div 
                key={stat.label} 
                className="p-3 rounded-lg text-center bg-white/3"
                whileHover={{ scale: 1.02 }}
              >
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-white-50">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <Button 
            className="w-full bg-white/10 hover:bg-white/20 text-white border-0" 
            size="sm" 
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            share forecast on linkedin
          </Button>
        </div>
      </div>
    </div>
  );
};

export const StrategicToolsShowcase = () => {
  const [activeTab, setActiveTab] = useState("first-principles");

  return (
    <section className="py-16 md:py-24 bg-obsidian">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-blazeOrange/10 border border-blazeOrange/20 text-blazeOrange">
            <Sparkles className="w-4 h-4" />
            <span>free strategic tools</span>
          </div>
          <h1 className="obsidian-platinum-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold">
            make better decisions
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-white-50">
            built from mathematical models developed by MIT and Harvard scientists — now free to use.
          </p>
        </motion.div>

        {/* Embedded Tools with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile: Full-width vertical tabs */}
            <TabsList 
              className="flex md:grid md:grid-cols-3 w-full max-w-lg mx-auto gap-1 md:gap-0 mb-6 md:mb-8 h-auto md:h-10 flex-col md:flex-row p-1 rounded-xl bg-white/5"
            >
              <TabsTrigger 
                value="first-principles" 
                className="text-xs sm:text-sm w-full justify-start md:justify-center px-3 py-2.5 md:py-1.5 text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10"
              >
                <Target className="w-4 h-4 mr-2 md:mr-1" />
                first principles
              </TabsTrigger>
              <TabsTrigger 
                value="decision-matrix" 
                className="text-xs sm:text-sm w-full justify-start md:justify-center px-3 py-2.5 md:py-1.5 text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10"
              >
                <Scale className="w-4 h-4 mr-2 md:mr-1" />
                decision matrix
              </TabsTrigger>
              <TabsTrigger 
                value="roi-forecaster" 
                className="text-xs sm:text-sm w-full justify-start md:justify-center px-3 py-2.5 md:py-1.5 text-white/60 data-[state=active]:text-white data-[state=active]:bg-white/10"
              >
                <TrendingUp className="w-4 h-4 mr-2 md:mr-1" />
                ROI forecaster
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="first-principles" className="mt-0">
              <FirstPrinciplesWizard />
            </TabsContent>
            
            <TabsContent value="decision-matrix" className="mt-0">
              <DecisionMatrixBuilder />
            </TabsContent>
            
            <TabsContent value="roi-forecaster" className="mt-0">
              <ROIForecaster />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link to="/tools/decision-frameworks">
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white/10 bg-white/5 hover:bg-white/10 text-white"
            >
              open full-screen tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
