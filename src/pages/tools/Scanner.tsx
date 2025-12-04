import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, XCircle, Zap, Share2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";

interface ScanResult {
  score: number;
  grade: "S" | "A" | "B" | "C" | "F";
  issues: { type: string; penalty: number; description: string }[];
}

const GRADE_COLORS = {
  S: "from-emerald-500 to-green-400",
  A: "from-green-500 to-emerald-400",
  B: "from-yellow-500 to-amber-400",
  C: "from-orange-500 to-amber-500",
  F: "from-red-600 to-rose-500",
};

const GRADE_BG = {
  S: "bg-emerald-500/20 border-emerald-500/50",
  A: "bg-green-500/20 border-green-500/50",
  B: "bg-yellow-500/20 border-yellow-500/50",
  C: "bg-orange-500/20 border-orange-500/50",
  F: "bg-red-500/20 border-red-500/50",
};

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [scrambledText, setScrambledText] = useState("");

  const scanUrl = async () => {
    if (!url) return;
    
    setIsScanning(true);
    setResult(null);
    setScanPhase(0);

    // Scramble animation
    const chars = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`";
    let iterations = 0;
    const scrambleInterval = setInterval(() => {
      setScrambledText(
        url.split("").map((char, i) => 
          i < iterations ? char : chars[Math.floor(Math.random() * chars.length)]
        ).join("")
      );
      iterations++;
      if (iterations > url.length) {
        clearInterval(scrambleInterval);
        setScrambledText(url);
      }
    }, 30);

    // Simulate scanning phases
    for (let i = 1; i <= 4; i++) {
      await new Promise(r => setTimeout(r, 600));
      setScanPhase(i);
    }

    // Calculate score
    let score = 100;
    const issues: ScanResult["issues"] = [];

    // Check for HTTP
    if (url.startsWith("http://")) {
      score -= 20;
      issues.push({ type: "INSECURE", penalty: 20, description: "Using HTTP instead of HTTPS" });
    }

    // Check length
    if (url.length > 80) {
      score -= 10;
      issues.push({ type: "LENGTH", penalty: 10, description: "URL exceeds 80 characters" });
    }

    // Check for UTM parameters
    if (!url.includes("utm_")) {
      score -= 15;
      issues.push({ type: "NO_UTM", penalty: 15, description: "Missing UTM tracking parameters" });
    }

    // Check for PII patterns
    const piiPatterns = /email=|password=|ssn=|phone=/i;
    if (piiPatterns.test(url)) {
      score -= 50;
      issues.push({ type: "PII_LEAK", penalty: 50, description: "Potential PII exposure detected" });
    }

    // Check for special characters
    if (/[<>'"{}|\\^`]/.test(url)) {
      score -= 15;
      issues.push({ type: "UNSAFE_CHARS", penalty: 15, description: "Contains potentially unsafe characters" });
    }

    // Determine grade
    let grade: ScanResult["grade"];
    if (score >= 95) grade = "S";
    else if (score >= 80) grade = "A";
    else if (score >= 60) grade = "B";
    else if (score >= 40) grade = "C";
    else grade = "F";

    await new Promise(r => setTimeout(r, 500));
    setResult({ score: Math.max(0, score), grade, issues });
    setIsScanning(false);
  };

  const shareResult = () => {
    const text = `🔗 Link Hygiene Score: ${result?.grade} (${result?.score}/100)\n\nScanned with utm.one Link Scanner\n\n`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="dark min-h-screen bg-[#0a0a0a] text-green-400 font-mono">
      <AppHeader />
      
      {/* Scanlines overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]">
        <div className="w-full h-full" style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.1) 2px, rgba(0,255,0,0.1) 4px)"
        }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded border border-green-500/30 bg-green-500/10 mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm uppercase tracking-widest">security clearance scanner</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-green-300 mb-4 tracking-tight">
            LINK_HYGIENE_v2.0
          </h1>
          <p className="text-green-500/70 max-w-xl mx-auto">
            {">"} analyzing url structure for optimization penalties and security vulnerabilities...
          </p>
        </motion.div>

        {/* Input Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-black/80 border border-green-500/30 rounded-lg p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4 text-green-500/50 text-sm">
            <span className="w-3 h-3 rounded-full bg-red-500/80" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <span className="w-3 h-3 rounded-full bg-green-500/80" />
            <span className="ml-2">terminal://link-scanner</span>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">{">"}</span>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="paste_url_here..."
                className="bg-transparent border-green-500/30 text-green-300 pl-8 font-mono placeholder:text-green-500/30 focus:border-green-500"
                onKeyDown={(e) => e.key === "Enter" && scanUrl()}
              />
            </div>
            <Button
              onClick={scanUrl}
              disabled={isScanning || !url}
              className="bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30 font-mono uppercase tracking-wider"
            >
              {isScanning ? "scanning..." : "execute"}
            </Button>
          </div>
        </motion.div>

        {/* Scanning Animation */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/60 border border-green-500/20 rounded-lg p-6 mb-8 overflow-hidden"
            >
              <div className="text-green-400/70 text-sm mb-4 break-all">
                {">"} {scrambledText}
              </div>
              
              <div className="space-y-3">
                {["SSL_VERIFICATION", "LENGTH_ANALYSIS", "UTM_DETECTION", "PII_SCAN"].map((phase, i) => (
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: scanPhase > i ? 1 : 0.3, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    {scanPhase > i ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : scanPhase === i ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Zap className="w-4 h-4 text-yellow-500" />
                      </motion.div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-green-500/30" />
                    )}
                    <span className={scanPhase > i ? "text-green-400" : "text-green-500/40"}>
                      {phase}
                    </span>
                    {scanPhase === i && (
                      <span className="text-yellow-500 animate-pulse">processing...</span>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Grade Card */}
              <div className={`relative overflow-hidden rounded-xl border ${GRADE_BG[result.grade]} p-8`}>
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-20 blur-3xl" />
                
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-green-500/70 text-sm uppercase tracking-wider mb-2">
                      security clearance level
                    </p>
                    <div className="flex items-baseline gap-4">
                      <span className={`text-7xl font-bold bg-gradient-to-r ${GRADE_COLORS[result.grade]} bg-clip-text text-transparent`}>
                        {result.grade}
                      </span>
                      <span className="text-2xl text-green-400/70">
                        {result.score}/100
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge className="bg-black/50 border-green-500/30 text-green-400 mb-2">
                      {result.issues.length === 0 ? "CLEAN" : `${result.issues.length} ISSUES`}
                    </Badge>
                    <p className="text-green-500/50 text-xs">
                      scanned: {new Date().toISOString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Issues */}
              {result.issues.length > 0 && (
                <div className="bg-black/60 border border-red-500/20 rounded-lg p-6">
                  <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    DETECTED VULNERABILITIES
                  </h3>
                  <div className="space-y-3">
                    {result.issues.map((issue, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded"
                      >
                        <div className="flex items-center gap-3">
                          <XCircle className="w-4 h-4 text-red-500" />
                          <div>
                            <span className="text-red-400 font-medium">{issue.type}</span>
                            <p className="text-red-400/60 text-sm">{issue.description}</p>
                          </div>
                        </div>
                        <span className="text-red-500 font-mono">-{issue.penalty}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={shareResult}
                  className="flex-1 bg-green-500/20 border border-green-500/50 text-green-400 hover:bg-green-500/30"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  share clearance card
                </Button>
                <Link to="/early-access" className="flex-1">
                  <Button className="w-full text-white" style={{ background: 'linear-gradient(to right, rgba(59,130,246,1), rgba(255,106,0,1))' }}>
                    fix toxic links
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
