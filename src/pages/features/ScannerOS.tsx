import { motion } from "framer-motion";
import { 
  Scan, 
  Zap, 
  Wifi, 
  WifiOff, 
  Sparkles, 
  Shield, 
  Check, 
  ArrowRight,
  Smartphone,
  QrCode,
  Camera,
  Brain,
  CloudOff,
  Lock,
  DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppHeader } from "@/components/layout/AppHeader";
import { Footer } from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

const ScannerOSPage = () => {
  const reliabilityStack = [
    {
      level: "level 1",
      name: "native decode",
      description: "instant qr/barcode reading from any badge format",
      reliability: "high speed",
      icon: QrCode
    },
    {
      level: "level 2", 
      name: "ai vision (ocr)",
      description: "when codes are encrypted, read the printed text with ai",
      reliability: "very high accuracy",
      icon: Brain
    },
    {
      level: "level 3",
      name: "human loop",
      description: "low-confidence fields highlighted for quick verification",
      reliability: "100% truth",
      icon: Check
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "battery saver mode",
      description: "camera only opens when you tap. no constant drain."
    },
    {
      icon: CloudOff,
      title: "offline-first sync",
      description: "leads saved locally first, synced when connected."
    },
    {
      icon: Sparkles,
      title: "ai enrichment",
      description: "missing email? one-tap to find it via clay/apollo."
    },
    {
      icon: Shield,
      title: "confidence scoring",
      description: "low-confidence fields flagged for verification."
    },
    {
      icon: Smartphone,
      title: "pwa home widget",
      description: "add to home screen for 1-tap instant access."
    },
    {
      icon: Lock,
      title: "deduplication",
      description: "scan same person twice? we merge, not duplicate."
    }
  ];

  const comparisonItems = [
    { feature: "works at any event", scanner: true, hardware: "only partnered events" },
    { feature: "offline capable", scanner: true, hardware: true },
    { feature: "ai ocr fallback", scanner: true, hardware: false },
    { feature: "lead enrichment", scanner: true, hardware: false },
    { feature: "confidence scoring", scanner: true, hardware: false },
    { feature: "price", scanner: "$79/month", hardware: "$5,000+" },
    { feature: "requires rental", scanner: false, hardware: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      {/* Hero */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="outline" className="mb-4 gap-1">
            <Scan className="h-3 w-3" />
            field marketing intelligence
          </Badge>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6"
          >
            one app. all badges.
            <br />
            <span className="text-primary">zero lost leads.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
          >
            every conference has its own scanner. your leads are scattered across apps and emails. 
            scannerOS reads any badge format and centralizes your pipeline.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <Button size="lg" className="gap-2">
                start scanning free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="outline">
                view pricing
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12 text-foreground">
            the problem with event scanners
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-card border-destructive/20">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold mb-2 text-foreground">encrypted badges</h3>
              <p className="text-muted-foreground text-sm">
                event organizers lock their qr codes to force you to rent their $5k scanners.
              </p>
            </Card>
            
            <Card className="p-6 bg-card border-destructive/20">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="font-semibold mb-2 text-foreground">app overload</h3>
              <p className="text-muted-foreground text-sm">
                every event wants you to download their app. leads scattered across 10 different systems.
              </p>
            </Card>
            
            <Card className="p-6 bg-card border-destructive/20">
              <div className="text-4xl mb-4">📶</div>
              <h3 className="font-semibold mb-2 text-foreground">dead wifi</h3>
              <p className="text-muted-foreground text-sm">
                convention center wifi crashes during keynote. your last 50 scans? lost.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Reliability Stack */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-4 text-foreground">
            the reliability stack
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            three layers of fallback. 99% success rate.
          </p>
          
          <div className="space-y-4">
            {reliabilityStack.map((layer, i) => (
              <motion.div
                key={layer.level}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    i === 0 && "bg-green-500/10 text-green-500",
                    i === 1 && "bg-blue-500/10 text-blue-500",
                    i === 2 && "bg-purple-500/10 text-purple-500"
                  )}>
                    <layer.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {layer.level}
                      </Badge>
                      <span className="font-semibold text-foreground">{layer.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{layer.description}</p>
                  </div>
                  
                  <Badge variant="outline" className="shrink-0">
                    {layer.reliability}
                  </Badge>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-12 text-foreground">
            built for field teams
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <feature.icon className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-3xl font-bold text-center mb-4 text-foreground">
            replace $5,000 hardware scanners
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            your phone is the only scanner you need
          </p>
          
          <Card className="overflow-hidden">
            <div className="grid grid-cols-3 bg-muted/50 p-4 font-semibold text-sm">
              <div className="text-foreground">feature</div>
              <div className="text-center text-foreground">scannerOS</div>
              <div className="text-center text-foreground">hardware scanner</div>
            </div>
            
            {comparisonItems.map((item, i) => (
              <div 
                key={item.feature}
                className={cn(
                  "grid grid-cols-3 p-4 text-sm",
                  i % 2 === 0 ? "bg-background" : "bg-muted/20"
                )}
              >
                <div className="text-foreground">{item.feature}</div>
                <div className="text-center">
                  {typeof item.scanner === 'boolean' ? (
                    item.scanner ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  ) : (
                    <span className="font-semibold text-primary">{item.scanner}</span>
                  )}
                </div>
                <div className="text-center">
                  {typeof item.hardware === 'boolean' ? (
                    item.hardware ? (
                      <Check className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )
                  ) : (
                    <span className="text-muted-foreground">{item.hardware}</span>
                  )}
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            replace 5 apps with 1
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            stop losing leads. start closing deals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" variant="secondary" className="gap-2">
                get scannerOS
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/solutions/field-marketing">
              <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                see field marketing solution
              </Button>
            </Link>
          </div>
          
          <p className="mt-6 text-sm opacity-70">
            $79/month • cancel anytime • includes ai enrichment
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ScannerOSPage;
