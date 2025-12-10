import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Target, 
  Layers, 
  Calculator, 
  Brain,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Download,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MainLayout } from "@/components/layout/MainLayout";
import { SEO } from "@/components/seo/SEO";

// First Principles Calculator
const FirstPrinciplesCalculator = () => {
  const [problem, setProblem] = useState("");
  const [whys, setWhys] = useState(["", "", "", "", ""]);
  const [fundamentals, setFundamentals] = useState<string[]>([]);

  const updateWhy = (index: number, value: string) => {
    const newWhys = [...whys];
    newWhys[index] = value;
    setWhys(newWhys);
  };

  const generateFundamentals = () => {
    const filled = whys.filter(w => w.trim() !== "");
    if (filled.length >= 3) {
      setFundamentals([
        "Core assumption identified: " + (whys[4] || whys[3] || whys[2]),
        "This can be validated by testing smaller hypotheses",
        "Action: Start with the smallest possible experiment"
      ]);
    }
  };

  return (
    <Card className="border-2 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.9)' }} />
          first principles breakdown
        </CardTitle>
        <CardDescription>
          Break down complex problems to fundamental truths using the 5 Whys technique
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">what problem are you trying to solve?</label>
          <Textarea 
            placeholder="e.g., Our marketing campaigns aren't generating enough leads..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium text-foreground">ask "why" 5 times</label>
          {whys.map((why, index) => (
            <motion.div 
              key={index}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.9)' }}>
                {index + 1}
              </div>
              <div className="flex-1 space-y-1">
                <label className="text-xs text-muted-foreground">
                  {index === 0 ? "Why is this happening?" : `Why? (${index + 1})`}
                </label>
                <Input 
                  placeholder={index === 0 ? "Because..." : "Because of this..."}
                  value={why}
                  onChange={(e) => updateWhy(index, e.target.value)}
                />
              </div>
            </motion.div>
          ))}
        </div>

        <Button onClick={generateFundamentals} className="w-full">
          <Lightbulb className="w-4 h-4 mr-2" />
          reveal fundamental truth
        </Button>

        {fundamentals.length > 0 && (
          <motion.div 
            className="p-4 rounded-lg border border-white/20 space-y-3"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.9)' }} />
              Fundamental Insights
            </h4>
            {fundamentals.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }} />
                <span>{f}</span>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                export
              </Button>
              <Button size="sm" variant="outline">
                <Share2 className="w-3 h-3 mr-1" />
                share on linkedin
              </Button>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

// Decision Matrix Builder
const DecisionMatrixBuilder = () => {
  const [options, setOptions] = useState(["Option A", "Option B", "Option C"]);
  const [criteria, setCriteria] = useState([
    { name: "Cost", weight: 3 },
    { name: "Time to implement", weight: 2 },
    { name: "Impact", weight: 5 },
    { name: "Risk", weight: 4 }
  ]);
  const [scores, setScores] = useState<Record<string, Record<string, number>>>({});

  const updateScore = (option: string, criterion: string, score: number) => {
    setScores(prev => ({
      ...prev,
      [option]: {
        ...(prev[option] || {}),
        [criterion]: score
      }
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

  return (
    <Card className="border-2 border-blazeOrange/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 lowercase">
          <Calculator className="w-5 h-5 text-blazeOrange" />
          weighted decision matrix
        </CardTitle>
        <CardDescription>
          Make data-driven decisions with weighted scoring
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 font-medium text-muted-foreground">Criteria (Weight)</th>
                {options.map(opt => (
                  <th key={opt} className="text-center p-2 font-medium text-foreground">{opt}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {criteria.map((c, i) => (
                <tr key={c.name} className="border-b border-border/50">
                  <td className="p-2">
                    <span className="text-foreground">{c.name}</span>
                    <span className="text-xs text-muted-foreground ml-1">(×{c.weight})</span>
                  </td>
                  {options.map(opt => (
                    <td key={opt} className="p-2 text-center">
                      <Input 
                        type="number"
                        min="1"
                        max="5"
                        className="w-16 mx-auto text-center"
                        placeholder="1-5"
                        value={scores[opt]?.[c.name] || ""}
                        onChange={(e) => updateScore(opt, c.name, parseInt(e.target.value) || 0)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-muted/50">
                <td className="p-2 font-semibold text-foreground">Total Score</td>
                {options.map(opt => (
                  <td key={opt} className="p-2 text-center">
                    <span className={`font-bold ${getWinner() === opt ? "" : "text-foreground"}`} style={getWinner() === opt ? { color: 'rgba(255,255,255,0.9)' } : undefined}>
                      {calculateTotal(opt)}
                    </span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {getWinner() && (
          <motion.div 
            className="p-4 rounded-lg border border-white/20"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>
              <CheckCircle2 className="w-5 h-5" />
              Recommended: {getWinner()} (Score: {calculateTotal(getWinner())})
            </div>
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
  const roi = ((revenue - investment) / investment) * 100;

  return (
    <Card className="border-2 border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 lowercase">
          <Brain className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.9)' }} />
          clean-track ROI forecaster
        </CardTitle>
        <CardDescription>
          Project campaign ROI using Clean-Track predictive models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">campaign investment ($)</label>
            <Input 
              type="number"
              value={investment}
              onChange={(e) => setInvestment(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">expected clicks</label>
            <Input 
              type="number"
              value={expectedClicks}
              onChange={(e) => setExpectedClicks(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">conversion rate (%)</label>
            <Input 
              type="number"
              step="0.1"
              value={conversionRate}
              onChange={(e) => setConversionRate(parseFloat(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">avg order value ($)</label>
            <Input 
              type="number"
              value={avgOrderValue}
              onChange={(e) => setAvgOrderValue(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: "Projected Conversions", value: conversions.toLocaleString(), colorClass: "text-foreground" },
            { label: "Projected Revenue", value: `$${revenue.toLocaleString()}`, colorClass: "text-primary" },
            { label: "Projected ROI", value: `${roi.toFixed(1)}%`, colorClass: roi > 0 ? "text-green-500" : "text-destructive" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="p-4 bg-muted/50 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button className="flex-1 lowercase">
            <Share2 className="w-4 h-4 mr-2" />
            share forecast
          </Button>
          <Button variant="outline" className="lowercase">
            <Download className="w-4 h-4 mr-2" />
            export
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const DecisionFrameworks = () => {
  return (
    <MainLayout>
      <SEO 
        title="Decision Frameworks & Tools | utm.one"
        description="Free interactive decision-making tools: First Principles Calculator, Decision Matrix Builder, and ROI Forecaster — powered by Clean-Track intelligence."
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="hero-gradient text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase mb-4">
              decision frameworks
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Free interactive tools to help you make better decisions — powered by Clean-Track intelligence 
              and mathematical models from MIT and Harvard scientists.
            </p>
          </motion.div>

          <Tabs defaultValue="first-principles" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
              <TabsTrigger value="first-principles" className="lowercase">first principles</TabsTrigger>
              <TabsTrigger value="decision-matrix" className="lowercase">decision matrix</TabsTrigger>
              <TabsTrigger value="roi-forecaster" className="lowercase">ROI forecaster</TabsTrigger>
            </TabsList>

            <TabsContent value="first-principles">
              <FirstPrinciplesCalculator />
            </TabsContent>

            <TabsContent value="decision-matrix">
              <DecisionMatrixBuilder />
            </TabsContent>

            <TabsContent value="roi-forecaster">
              <ROIForecaster />
            </TabsContent>
          </Tabs>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 text-center"
          >
            <p className="text-sm text-muted-foreground mb-4">
              Want more powerful analytics and decision tools?
            </p>
            <Link to="/early-access">
              <Button size="lg" className="lowercase">
                get early access to utm.one
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

export default DecisionFrameworks;
