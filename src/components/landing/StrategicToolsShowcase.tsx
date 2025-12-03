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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 lowercase text-lg">
          <Scale className="w-5 h-5 text-blazeOrange" />
          weighted decision matrix
        </CardTitle>
        <CardDescription className="text-sm">
          Make data-driven decisions with weighted scoring (1-5 scale)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 font-medium text-muted-foreground">Criteria (Weight)</th>
                {options.map(opt => (
                  <th key={opt} className="text-center p-2 font-medium text-foreground">{opt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.name} className="border-b border-border/50">
                  <td className="p-2">
                    <span className="text-foreground">{c.name}</span>
                    <span className="text-muted-foreground ml-1">(×{c.weight})</span>
                  </td>
                  {options.map(opt => (
                    <td key={opt} className="p-2 text-center">
                      <Input 
                        type="number"
                        min="1"
                        max="5"
                        className="w-12 mx-auto text-center text-xs h-7"
                        placeholder="1-5"
                        value={scores[opt]?.[c.name] || ""}
                        onChange={(e) => updateScore(opt, c.name, parseInt(e.target.value) || 0)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-muted/50">
                <td className="p-2 font-semibold text-foreground">Total</td>
                {options.map(opt => (
                  <td key={opt} className="p-2 text-center">
                    <span className={`font-bold ${getWinner() === opt ? "text-primary" : "text-foreground"}`}>
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
            className="p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              Recommended: {getWinner()}
            </div>
            <Button size="sm" variant="outline" className="lowercase text-xs h-7" onClick={handleShare}>
              <Share2 className="w-3 h-3 mr-1" />
              share
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
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
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 lowercase text-lg">
          <TrendingUp className="w-5 h-5 text-green-600" />
          clean-track ROI forecaster
        </CardTitle>
        <CardDescription className="text-sm">
          Project campaign ROI using Clean-Track predictive models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">investment ($)</label>
            <Input 
              type="number"
              value={investment}
              onChange={(e) => setInvestment(parseInt(e.target.value) || 0)}
              className="text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">expected clicks</label>
            <Input 
              type="number"
              value={expectedClicks}
              onChange={(e) => setExpectedClicks(parseInt(e.target.value) || 0)}
              className="text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">conversion rate (%)</label>
            <Input 
              type="number"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
              className="text-sm h-8"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">avg order value ($)</label>
            <Input 
              type="number"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(parseInt(e.target.value) || 0)}
              className="text-sm h-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Conversions", value: conversions.toLocaleString(), color: "text-foreground" },
            { label: "Revenue", value: `$${revenue.toLocaleString()}`, color: "text-primary" },
            { label: "ROI", value: `${roi.toFixed(1)}%`, color: roi > 0 ? "text-green-600" : "text-destructive" },
          ].map((stat) => (
            <motion.div 
              key={stat.label} 
              className="p-3 bg-muted/50 rounded-lg text-center"
              whileHover={{ scale: 1.02 }}
            >
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <Button className="w-full lowercase" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-2" />
          share forecast on linkedin
        </Button>
      </CardContent>
    </Card>
  );
};

export const StrategicToolsShowcase = () => {
  const [activeTab, setActiveTab] = useState("first-principles");

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 space-y-4"
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

        {/* Embedded Tools with Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Mobile: Full-width vertical tabs */}
            <TabsList className="flex md:grid md:grid-cols-3 w-full max-w-lg mx-auto gap-1 md:gap-0 mb-6 md:mb-8 h-auto md:h-10 flex-col md:flex-row bg-muted/50 p-1 rounded-xl">
              <TabsTrigger 
                value="first-principles" 
                className="lowercase text-xs sm:text-sm w-full justify-start md:justify-center px-3 py-2.5 md:py-1.5 data-[state=active]:bg-background"
              >
                <Target className="w-4 h-4 mr-2 md:mr-1" />
                first principles
              </TabsTrigger>
              <TabsTrigger 
                value="decision-matrix" 
                className="lowercase text-xs sm:text-sm w-full justify-start md:justify-center px-3 py-2.5 md:py-1.5 data-[state=active]:bg-background"
              >
                <Scale className="w-4 h-4 mr-2 md:mr-1" />
                decision matrix
              </TabsTrigger>
              <TabsTrigger 
                value="roi-forecaster" 
                className="lowercase text-xs sm:text-sm w-full justify-start md:justify-center px-3 py-2.5 md:py-1.5 data-[state=active]:bg-background"
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
            <Button variant="outline" size="lg" className="lowercase">
              open full-screen tools
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
