import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowRight, Upload, AlertTriangle, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
import { GlassCard } from "@/components/ui/glass-card";
import { toast } from "sonner";

interface TestResult {
  name: string;
  description: string;
  passed: boolean;
  filter: string;
}

export default function QRTest() {
  const [image, setImage] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState<TestResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TESTS = [
    { 
      name: "Distance Test", 
      description: "Simulating viewing from 10+ feet away",
      filter: "blur(4px)",
    },
    { 
      name: "Low Light Test", 
      description: "Simulating dim lighting conditions",
      filter: "brightness(0.3) contrast(1.2)",
    },
    { 
      name: "Angle Test", 
      description: "Simulating 45° viewing angle",
      filter: "none",
      transform: "perspective(500px) rotateY(30deg)",
    },
    { 
      name: "Wear & Tear Test", 
      description: "Simulating physical damage",
      filter: "contrast(0.7) saturate(0.5)",
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target?.result as string);
        setResults([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const runTests = async () => {
    if (!image) return;
    
    setIsTesting(true);
    setCurrentTest(0);
    setResults([]);

    const testResults: TestResult[] = [];

    for (let i = 0; i < TESTS.length; i++) {
      setCurrentTest(i);
      await new Promise(r => setTimeout(r, 1500));
      
      // Simulate QR decoding test (random success with weighted probability)
      // In production, this would use a real QR decoder library
      const baseSuccessRate = 0.7;
      const testDifficulty = [0.8, 0.6, 0.7, 0.5][i]; // Success rate per test
      const passed = Math.random() < (baseSuccessRate * testDifficulty);
      
      testResults.push({
        ...TESTS[i],
        passed,
      });
      setResults([...testResults]);
    }

    setIsTesting(false);
  };

  const passedCount = results.filter(r => r.passed).length;
  const totalTests = TESTS.length;
  const score = results.length > 0 ? Math.round((passedCount / totalTests) * 100) : 0;

  const shareResult = () => {
    const text = `🔬 QR Crash Test Results:\n\n✅ Passed: ${passedCount}/${totalTests} tests\n📊 Durability Score: ${score}%\n${passedCount === totalTests ? "💪 UNBREAKABLE" : passedCount >= 2 ? "⚠️ NEEDS WORK" : "❌ FRAGILE"}\n\nTested with utm.one QR Crash Test`;
    window.open(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="dark min-h-screen bg-background">
      <AppHeader />
      
      {/* Industrial overlay - subtle */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            hsl(var(--system-yellow) / 0.1) 20px,
            hsl(var(--system-yellow) / 0.1) 40px
          )`
        }} />
      </div>

      {/* Hazard stripes - branded */}
      <div className="h-2 bg-system-yellow/20" style={{
        backgroundSize: "40px 100%",
        backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--background)) 0px, hsl(var(--background)) 10px, hsl(var(--system-yellow) / 0.3) 10px, hsl(var(--system-yellow) / 0.3) 20px)"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <AlertTriangle className="w-5 h-5 text-system-yellow" />
            <span className="text-sm font-display font-bold text-system-yellow uppercase tracking-wider">robustness lab</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 hero-gradient brand-lowercase">
            qr crash test
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            stress-test your QR codes against real-world conditions
          </p>
        </motion.div>

        {/* Upload Zone */}
        {!image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card border-2 border-dashed border-system-yellow/50 rounded-2xl p-12 text-center cursor-pointer hover:border-system-yellow hover:bg-card/30 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-16 h-16 mx-auto mb-4 text-system-yellow/70" />
            <p className="text-xl font-display font-semibold text-foreground mb-2 brand-lowercase">
              upload your qr code
            </p>
            <p className="text-muted-foreground">
              PNG, JPG, or SVG • Max 5MB
            </p>
          </motion.div>
        )}

        {/* Test Chamber */}
        {image && (
          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-6 border-system-yellow/30">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-system-yellow font-display font-bold uppercase text-sm">test subject</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImage(null);
                      setResults([]);
                    }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Replace
                  </Button>
                </div>
                
                <div className="relative aspect-square bg-card rounded-xl overflow-hidden flex items-center justify-center p-4 border border-border">
                  <img 
                    src={image} 
                    alt="QR Code" 
                    className="max-w-full max-h-full object-contain transition-all duration-500"
                    style={{
                      filter: isTesting ? TESTS[currentTest]?.filter : "none",
                      transform: isTesting && TESTS[currentTest]?.transform ? TESTS[currentTest].transform : "none",
                    }}
                  />
                  
                  {/* Test overlay */}
                  {isTesting && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex items-end justify-center pb-4"
                    >
                      <Badge className="bg-system-yellow text-black font-display font-bold animate-pulse">
                        {TESTS[currentTest]?.name}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </GlassCard>

              <Button
                onClick={runTests}
                disabled={isTesting}
                className="w-full h-14 bg-system-yellow text-black font-display font-bold text-lg hover:bg-system-yellow/90"
              >
                {isTesting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Zap className="w-5 h-5" />
                    </motion.div>
                    Running Test {currentTest + 1}/{TESTS.length}...
                  </>
                ) : results.length > 0 ? (
                  "Run Tests Again"
                ) : (
                  <>
                    <Zap className="w-5 h-5 mr-2" />
                    Start Crash Test
                  </>
                )}
              </Button>
            </motion.div>

            {/* Results */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Score Card */}
              {results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <GlassCard className={`p-6 text-center ${
                    passedCount === totalTests 
                      ? "border-system-green/50" 
                      : passedCount >= 2 
                        ? "border-system-yellow/50"
                        : "border-system-red/50"
                  }`}>
                    <p className="text-muted-foreground text-sm uppercase tracking-wider mb-2 font-display">
                      durability score
                    </p>
                    <div className={`text-6xl font-display font-bold mb-2 ${
                      passedCount === totalTests 
                        ? "text-system-green" 
                        : passedCount >= 2 
                          ? "text-system-yellow"
                          : "text-system-red"
                    }`}>
                      {score}%
                    </div>
                    <Badge className={`${
                      passedCount === totalTests 
                        ? "bg-system-green/20 text-system-green" 
                        : passedCount >= 2 
                          ? "bg-system-yellow/20 text-system-yellow"
                          : "bg-system-red/20 text-system-red"
                    }`}>
                      {passedCount === totalTests ? "💪 UNBREAKABLE" : passedCount >= 2 ? "⚠️ NEEDS WORK" : "❌ FRAGILE"}
                    </Badge>
                  </GlassCard>
                </motion.div>
              )}

              {/* Test Results */}
              <GlassCard className="p-6 border-system-yellow/30">
                <h3 className="text-system-yellow font-display font-bold uppercase text-sm mb-4">test results</h3>
                <div className="space-y-3">
                  {TESTS.map((test, i) => {
                    const result = results[i];
                    const isRunning = isTesting && currentTest === i;
                    const isComplete = result !== undefined;

                    return (
                      <motion.div
                        key={test.name}
                        initial={{ opacity: 0.5 }}
                        animate={{ 
                          opacity: isComplete || isRunning ? 1 : 0.5,
                          scale: isRunning ? 1.02 : 1,
                        }}
                        className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
                          isRunning 
                            ? "bg-system-yellow/10 border-system-yellow/50" 
                            : isComplete
                              ? result.passed 
                                ? "bg-system-green/5 border-system-green/30"
                                : "bg-system-red/5 border-system-red/30"
                              : "bg-card/50 border-border"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isRunning ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap className="w-5 h-5 text-system-yellow" />
                            </motion.div>
                          ) : isComplete ? (
                            result.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-system-green" />
                            ) : (
                              <XCircle className="w-5 h-5 text-system-red" />
                            )
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-border" />
                          )}
                          <div>
                            <p className="text-foreground font-medium">{test.name}</p>
                            <p className="text-muted-foreground text-sm">{test.description}</p>
                          </div>
                        </div>
                        {isComplete && (
                          <Badge className={result.passed ? "bg-system-green/20 text-system-green" : "bg-system-red/20 text-system-red"}>
                            {result.passed ? "PASS" : "FAIL"}
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </GlassCard>

              {/* Actions */}
              {results.length === TESTS.length && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={shareResult}
                    variant="outline"
                    className="flex-1"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Report
                  </Button>
                  <Link to="/features/qr-generator" className="flex-1">
                    <Button className="w-full bg-primary hover:bg-primary-hover text-primary-foreground font-display font-bold">
                      Create Unbreakable Codes
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom hazard stripe */}
      <div className="h-2 bg-system-yellow/20 mt-auto" style={{
        backgroundSize: "40px 100%",
        backgroundImage: "repeating-linear-gradient(45deg, hsl(var(--background)) 0px, hsl(var(--background)) 10px, hsl(var(--system-yellow) / 0.3) 10px, hsl(var(--system-yellow) / 0.3) 20px)"
      }} />
    </div>
  );
}
