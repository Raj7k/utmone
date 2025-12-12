import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { LazyConfetti } from "@/components/lazy/LazyConfetti";
import { Gift, Sparkles, ArrowRight, Users, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Surprise = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [discoveryCount, setDiscoveryCount] = useState<number | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    
    // Track discovery and get count
    const trackDiscovery = async () => {
      try {
        // Get referrer to know source
        const source = document.referrer.includes('utm.one') 
          ? (document.referrer.includes('/features') ? 'feature_page' : 'homepage')
          : 'direct_qr_scan';
        
        // Insert discovery record
        await supabase.from('easter_egg_discoveries').insert({
          source,
          device_type: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        });
        
        // Get total count
        const { count } = await supabase
          .from('easter_egg_discoveries')
          .select('*', { count: 'exact', head: true });
        
        setDiscoveryCount(count || 1);
      } catch (error) {
        console.error('Error tracking discovery:', error);
        setDiscoveryCount(1);
      }
    };
    
    trackDiscovery();
    
    // Stop confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    
    // Reveal content after delay
    const revealTimer = setTimeout(() => setRevealed(true), 800);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(revealTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      <LazyConfetti
        show={showConfetti}
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={200}
        gravity={0.1}
        colors={['#FFD700', '#FFA500', '#FF6B6B', '#4ECDC4', '#A855F7', '#FFFFFF']}
      />
      
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
        <AnimatePresence>
          {revealed && (
            <>
              {/* Trophy icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="mb-8"
              >
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/30">
                  <Gift className="w-12 h-12 text-white" />
                </div>
              </motion.div>
              
              {/* Main headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl md:text-6xl font-display font-bold mb-4"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FF6B6B 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                You found it!
              </motion.h1>
              
              {/* Subheadline */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="text-xl md:text-2xl text-muted-foreground mb-8"
              >
                You're one of the curious ones who actually scans QR codes.
                <br />
                <span className="text-foreground font-medium">We like that.</span>
              </motion.p>
              
              {/* Discovery count */}
              {discoveryCount !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                >
                  <Users className="w-4 h-4 text-amber-500" />
                  <span className="text-sm text-muted-foreground">
                    You're explorer <span className="text-foreground font-semibold">#{discoveryCount}</span>
                  </span>
                </motion.div>
              )}
              
              {/* Exclusive offer card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="bg-card border border-border rounded-2xl p-8 mb-8 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-bl-full" />
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-medium text-amber-500 uppercase tracking-wider">Explorer's Reward</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-3 text-foreground">
                  30 days of Pro—free
                </h2>
                
                <p className="text-muted-foreground mb-6">
                  Use code <span className="font-mono bg-white/10 px-2 py-1 rounded text-foreground">CURIOUS30</span> at checkout
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold">
                    <Link to="/signup">
                      Claim Your Reward
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
              
              {/* Fun fact */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="text-sm text-muted-foreground flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 text-red-500" />
                <span>Those AI stamps you scanned? Made with utm.one.</span>
              </motion.p>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Surprise;
