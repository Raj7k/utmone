import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TrendingUp, Zap, Share2, ArrowRight, DollarSign, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";

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
    <div className="dark min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e]">
      <AppHeader />
      
      {/* Neon glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 mb-6">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            <span className="text-sm font-medium text-purple-300 uppercase tracking-wider">monte carlo simulator</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              GTM Casino
            </span>
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-lg">
            run 1,000 simulations to see your odds of hitting 2x ROI
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
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-400" />
                  Monthly Budget
                </h3>
                <span className="text-2xl font-bold text-green-400">
                  ${budget[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={budget}
                onValueChange={setBudget}
                min={1000}
                max={100000}
                step={1000}
                className="[&_[role=slider]]:bg-gradient-to-r [&_[role=slider]]:from-purple-500 [&_[role=slider]]:to-cyan-500"
              />
              <div className="flex justify-between mt-2 text-sm text-white/40">
                <span>$1K</span>
                <span>$100K</span>
              </div>
            </div>

            {/* Channel Selection */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                Select Channels
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {CHANNELS.map(channel => (
                  <label
                    key={channel.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                      ${selectedChannels.includes(channel.id)
                        ? "bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/50"
                        : "bg-white/5 border border-white/10 hover:border-white/20"
                      }
                    `}
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
                      className="border-purple-500/50 data-[state=checked]:bg-purple-500"
                    />
                    <div>
                      <span className="text-white text-sm">{channel.name}</span>
                      <div className="flex items-center gap-2 text-xs text-white/40">
                        <span>~{channel.avgROI}x ROI</span>
                        <span className={channel.volatility > 0.3 ? "text-red-400" : "text-green-400"}>
                          {channel.volatility > 0.3 ? "High Risk" : "Low Risk"}
                        </span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <Button
              onClick={runSimulation}
              disabled={isSimulating || selectedChannels.length === 0}
              className="w-full h-14 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-lg font-semibold"
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
                  <div className="bg-gradient-to-br from-purple-500/20 to-cyan-500/20 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 text-center">
                    <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                      chance of 2x+ ROI
                    </p>
                    <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                      {result.winProbability.toFixed(1)}%
                    </div>
                    <Badge className={`${result.winProbability > 70 ? "bg-green-500/20 text-green-400" : result.winProbability > 40 ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                      {result.winProbability > 70 ? "FAVORABLE ODDS" : result.winProbability > 40 ? "MODERATE RISK" : "HIGH RISK"}
                    </Badge>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-white/40 text-xs uppercase mb-1">Expected</p>
                      <p className="text-2xl font-bold text-white">{result.expectedROI.toFixed(2)}x</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-white/40 text-xs uppercase mb-1">Best Case</p>
                      <p className="text-2xl font-bold text-green-400">{result.bestCase.toFixed(2)}x</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center">
                      <p className="text-white/40 text-xs uppercase mb-1">Worst Case</p>
                      <p className="text-2xl font-bold text-red-400">{result.worstCase.toFixed(2)}x</p>
                    </div>
                  </div>

                  {/* Distribution Chart */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <p className="text-white/60 text-sm mb-4">ROI Distribution (1,000 simulations)</p>
                    <div className="flex items-end gap-1 h-32">
                      {result.distribution.map((count, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${(count / Math.max(...result.distribution)) * 100}%` }}
                          transition={{ delay: i * 0.05 }}
                          className="flex-1 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-white/40">
                      <span>0.5x</span>
                      <span>2.5x</span>
                      <span>4.5x+</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button
                      onClick={shareResult}
                      variant="outline"
                      className="flex-1 border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Betting Slip
                    </Button>
                    <Link to="/early-access" className="flex-1">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600">
                        Don't Gamble. Track ROI.
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
                  <div className="text-center text-white/30">
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
