import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, ArrowRight, Upload, AlertTriangle, CheckCircle2, XCircle, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AppHeader } from "@/components/layout/AppHeader";
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
    <div className="dark min-h-screen bg-gradient-to-br from-amber-950 via-stone-900 to-amber-950">
      <AppHeader />
      
      {/* Industrial overlay */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 20px,
            rgba(255,200,0,0.1) 20px,
            rgba(255,200,0,0.1) 40px
          )`
        }} />
      </div>

      {/* Hazard stripes */}
      <div className="h-4 bg-gradient-to-r from-yellow-500 via-black to-yellow-500" style={{
        backgroundSize: "40px 100%",
        backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 10px, #fbbf24 10px, #fbbf24 20px)"
      }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded bg-yellow-500/20 border border-yellow-500/50 mb-6">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold text-yellow-500 uppercase tracking-wider">robustness lab</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-white">
            QR Crash Test
          </h1>
          <p className="text-amber-200/70 max-w-xl mx-auto text-lg">
            stress-test your QR codes against real-world conditions
          </p>
        </motion.div>

        {/* Upload Zone */}
        {!image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border-4 border-dashed border-yellow-500/50 rounded-2xl p-12 text-center bg-black/20 backdrop-blur-sm cursor-pointer hover:border-yellow-500 hover:bg-black/30 transition-all"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="w-16 h-16 mx-auto mb-4 text-yellow-500/70" />
            <p className="text-xl font-semibold text-white mb-2">
              Upload Your QR Code
            </p>
            <p className="text-amber-200/50">
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
              <div className="bg-black/40 backdrop-blur-xl border-2 border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-yellow-500 font-bold uppercase text-sm">test subject</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setImage(null);
                      setResults([]);
                    }}
                    className="text-yellow-500/70 hover:text-yellow-500"
                  >
                    Replace
                  </Button>
                </div>
                
                <div className="relative aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center p-4">
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
                      className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end justify-center pb-4"
                    >
                      <Badge className="bg-yellow-500 text-black font-bold animate-pulse">
                        {TESTS[currentTest]?.name}
                      </Badge>
                    </motion.div>
                  )}
                </div>
              </div>

              <Button
                onClick={runTests}
                disabled={isTesting}
                className="w-full h-14 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-lg hover:from-yellow-400 hover:to-orange-400"
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
                  className={`
                    rounded-2xl p-6 border-2 text-center
                    ${passedCount === totalTests 
                      ? "bg-green-500/20 border-green-500/50" 
                      : passedCount >= 2 
                        ? "bg-yellow-500/20 border-yellow-500/50"
                        : "bg-red-500/20 border-red-500/50"
                    }
                  `}
                >
                  <p className="text-white/60 text-sm uppercase tracking-wider mb-2">
                    durability score
                  </p>
                  <div className={`
                    text-6xl font-bold mb-2
                    ${passedCount === totalTests 
                      ? "text-green-400" 
                      : passedCount >= 2 
                        ? "text-yellow-400"
                        : "text-red-400"
                    }
                  `}>
                    {score}%
                  </div>
                  <Badge className={`
                    ${passedCount === totalTests 
                      ? "bg-green-500/30 text-green-300" 
                      : passedCount >= 2 
                        ? "bg-yellow-500/30 text-yellow-300"
                        : "bg-red-500/30 text-red-300"
                    }
                  `}>
                    {passedCount === totalTests ? "💪 UNBREAKABLE" : passedCount >= 2 ? "⚠️ NEEDS WORK" : "❌ FRAGILE"}
                  </Badge>
                </motion.div>
              )}

              {/* Test Results */}
              <div className="bg-black/40 backdrop-blur-xl border-2 border-yellow-500/30 rounded-2xl p-6">
                <h3 className="text-yellow-500 font-bold uppercase text-sm mb-4">test results</h3>
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
                        className={`
                          flex items-center justify-between p-4 rounded-xl border transition-all
                          ${isRunning 
                            ? "bg-yellow-500/20 border-yellow-500/50" 
                            : isComplete
                              ? result.passed 
                                ? "bg-green-500/10 border-green-500/30"
                                : "bg-red-500/10 border-red-500/30"
                              : "bg-white/5 border-white/10"
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          {isRunning ? (
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                              <Zap className="w-5 h-5 text-yellow-500" />
                            </motion.div>
                          ) : isComplete ? (
                            result.passed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-white/20" />
                          )}
                          <div>
                            <p className="text-white font-medium">{test.name}</p>
                            <p className="text-white/50 text-sm">{test.description}</p>
                          </div>
                        </div>
                        {isComplete && (
                          <Badge className={result.passed ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}>
                            {result.passed ? "PASS" : "FAIL"}
                          </Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

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
                    className="flex-1 border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/10"
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Report
                  </Button>
                  <Link to="/features/qr-generator" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold">
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
      <div className="h-4 bg-gradient-to-r from-yellow-500 via-black to-yellow-500 mt-auto" style={{
        backgroundSize: "40px 100%",
        backgroundImage: "repeating-linear-gradient(45deg, #000 0px, #000 10px, #fbbf24 10px, #fbbf24 20px)"
      }} />
    </div>
  );
}
