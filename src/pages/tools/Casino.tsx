import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Zap, Share2, ArrowRight, DollarSign, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { preserveAcronyms as p } from "@/utils/textFormatter";

const CHANNELS = [
  { id: "google", name: "Google Ads", volatility: 0.25, avgROI: 2.1 },
  { id: "meta", name: "Meta Ads", volatility: 0.35, avgROI: 1.8 },
  { id: "linkedin", name: "LinkedIn Ads", volatility: 0.4, avgROI: 1.5 },
  { id: "tiktok", name: "TikTok Ads", volatility: 0.5, avgROI: 2.5 },
  { id: "email", name: "Email", volatility: 0.15, avgROI: 4.2 },
  { id: "seo", name: "Organic SEO", volatility: 0.1, avgROI: 5.0 },
];

interface SimResult {
  winProbability: number;
  expectedROI: number;
  bestCase: number;
  worstCase: number;
  distribution: number[];
}

export default function Casino() {
  const [budget, setBudget] = useState([10000]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["google", "meta"]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [currentSim, setCurrentSim] = useState(0);

  const runSimulation = async () => {
    if (selectedChannels.length === 0) return;
    
    setIsSimulating(true);
    setResult(null);
    setCurrentSim(0);

    const channels = CHANNELS.filter(c => selectedChannels.includes(c.id));
    const results: number[] = [];
    const SIMS = 1000;

    // Monte Carlo simulation
    for (let i = 0; i < SIMS; i++) {
      let totalROI = 0;
      const budgetPerChannel = budget[0] / channels.length;
      
      for (const channel of channels) {
        // Random walk with volatility
        const noise = (Math.random() - 0.5) * 2 * channel.volatility;
        const roi = channel.avgROI + noise * channel.avgROI;
        totalROI += (budgetPerChannel * roi) / budget[0];
      }
      
      results.push(totalROI);
      
      if (i % 100 === 0) {
        setCurrentSim(i);
        await new Promise(r => setTimeout(r, 50));
      }
    }

    // Calculate statistics
    results.sort((a, b) => a - b);
    const winCount = results.filter(r => r > 2).length;
    const winProbability = (winCount / SIMS) * 100;
    const expectedROI = results.reduce((a, b) => a + b, 0) / SIMS;
    const worstCase = results[Math.floor(SIMS * 0.05)]; // 5th percentile
    const bestCase = results[Math.floor(SIMS * 0.95)]; // 95th percentile

    // Distribution buckets
    const distribution = Array(10).fill(0);
    results.forEach(r => {
      const bucket = Math.min(9, Math.floor((r - 0.5) / 0.5));
      if (bucket >= 0) distribution[bucket]++;
    });

    setResult({ winProbability, expectedROI, bestCase, worstCase, distribution });
    setIsSimulating(false);
  };

  const shareResult = () => {
    const text = `🎰 GTM Casino Results:\n\n💰 Budget: $${budget[0].toLocaleString()}\n📊 Win Probability: ${result?.winProbability.toFixed(1)}%\n📈 Expected ROI: ${result?.expectedROI.toFixed(2)}x\n\nSimulated with utm.one GTM Casino`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="dark min-h-screen bg-background">
      <AppHeader />
      
      {/* Subtle glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-[120px] bg-primary/5" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-[120px] bg-primary/5" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <BarChart3 className="w-4 h-4 text-primary" />
            <span className="text-sm font-display font-medium uppercase tracking-wider text-muted-foreground">monte carlo simulator</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 hero-gradient">
            {p("GTM Casino")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            {p("run 1,000 simulations to see your odds of hitting 2x ROI")}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Budget Slider */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground font-display font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-system-green" />
                  monthly budget
                </h3>
                <span className="text-2xl font-display font-bold text-system-green">
                  ${budget[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={budget}
                onValueChange={setBudget}
                min={1000}
                max={100000}
                step={1000}
                className="[&_[role=slider]]:bg-primary"
              />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>$1K</span>
                <span>$100K</span>
              </div>
            </GlassCard>

            {/* Channel Selection */}
            <GlassCard className="p-6">
              <h3 className="text-foreground font-display font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                select channels
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CHANNELS.map(channel => (
                  <label
                    key={channel.id}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                      selectedChannels.includes(channel.id) 
                        ? "bg-primary/10 border-primary/50" 
                        : "bg-card/50 border-border hover:border-primary/30"
                    }`}
                  >
                    <Checkbox
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedChannels([...selectedChannels, channel.id]);
                        } else {
                          setSelectedChannels(selectedChannels.filter(c => c !== channel.id));
                        }
                      }}
                      className="data-[state=checked]:bg-primary border-primary/50"
                    />
                    <div>
                      <span className="text-foreground text-sm">{channel.name}</span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>~{channel.avgROI}x ROI</span>
                        <span className={channel.volatility > 0.3 ? "text-system-red" : "text-system-green"}>
                          {channel.volatility > 0.3 ? "High Risk" : "Low Risk"}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </GlassCard>

            {/* Run Button */}
            <Button
              onClick={runSimulation}
              disabled={isSimulating || selectedChannels.length === 0}
              className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground text-lg font-display font-semibold"
            >
              {isSimulating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mr-2"
                  >
                    <Zap className="w-5 h-5" />
                  </motion.div>
                  Running {currentSim.toLocaleString()} simulations...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Roll the Dice (1,000 Sims)
                </>
              )}
            </Button>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Win Probability */}
                  <GlassCard variant="elevated" className="p-8 text-center">
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-display">
                      {p("chance of 2x+ ROI")}
                    </p>
                    <div className="text-7xl font-display font-bold hero-gradient mb-2">
                      {result.winProbability.toFixed(1)}%
                    </div>
                    <Badge className={`${result.winProbability > 70 ? "bg-system-green/20 text-system-green" : result.winProbability > 40 ? "bg-system-yellow/20 text-system-yellow" : "bg-system-red/20 text-system-red"}`}>
                      {result.winProbability > 70 ? "FAVORABLE ODDS" : result.winProbability > 40 ? "MODERATE RISK" : "HIGH RISK"}
                    </Badge>
                  </GlassCard>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <GlassCard className="p-4 text-center">
                      <p className="text-muted-foreground text-xs uppercase mb-1 font-display">Expected</p>
                      <p className="text-2xl font-display font-bold text-foreground">{result.expectedROI.toFixed(2)}x</p>
                    </GlassCard>
                    <GlassCard className="p-4 text-center">
                      <p className="text-muted-foreground text-xs uppercase mb-1 font-display">Best Case</p>
                      <p className="text-2xl font-display font-bold text-system-green">{result.bestCase.toFixed(2)}x</p>
                    </GlassCard>
                    <GlassCard className="p-4 text-center">
                      <p className="text-muted-foreground text-xs uppercase mb-1 font-display">Worst Case</p>
                      <p className="text-2xl font-display font-bold text-system-red">{result.worstCase.toFixed(2)}x</p>
                    </GlassCard>
                  </div>

                  {/* Distribution Chart */}
                  <GlassCard className="p-6">
                    <p className="text-muted-foreground text-sm mb-4 font-display">{p("ROI Distribution (1,000 simulations)")}</p>
                    <div className="flex items-end gap-1 h-32">
                      {result.distribution.map((count, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(count / Math.max(...result.distribution)) * 100}%` }}
                          transition={{ delay: i * 0.05 }}
                          className="flex-1 bg-primary rounded-t"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                      <span>0.5x</span>
                      <span>2.5x</span>
                      <span>4.5x+</span>
                    </div>
                  </GlassCard>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={shareResult}
                      variant="outline"
                      className="flex-1"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Betting Slip
                    </Button>
                    <Link to="/early-access" className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground">
                        {p("Don't Gamble. Track ROI.")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex items-center justify-center"
                >
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Select channels and run simulation</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
