import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";

const WaitlistLocked = () => {
  return (
    <ObsidianMarketingLayout showFloatingNav={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4 relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md space-y-8 relative z-10"
        >
          {/* Back to home link */}
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="text-center space-y-4">
            <UtmOneLogo size="xl" className="justify-center mb-2" />
          </div>

          <Card className="border-amber-500/20 shadow-xl rounded-2xl bg-amber-500/5">
            <CardHeader className="space-y-4 pb-4 text-center">
              <div className="w-16 h-16 mx-auto bg-amber-500/10 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-amber-500" />
              </div>
              <CardTitle className="text-2xl font-display font-bold text-foreground">
                You're on the waitlist
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                Your account has been created, but you don't have access yet. We'll notify you as soon as your spot opens up.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 pt-6 space-y-6">
              <div className="space-y-3">
                <Link to="/early-access" className="block">
                  <Button variant="default" size="lg" className="w-full h-14 rounded-xl text-base font-semibold">
                    Join Early Access Waitlist
                  </Button>
                </Link>
                
                <Link to="/" className="block">
                  <Button variant="outline" size="lg" className="w-full h-14 rounded-xl text-base">
                    Return to Homepage
                  </Button>
                </Link>
              </div>

              <div className="text-center pt-4">
                <p className="text-xs text-muted-foreground">
                  We'll email you at the address you signed up with when your access is ready.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </ObsidianMarketingLayout>
  );
};

export default WaitlistLocked;