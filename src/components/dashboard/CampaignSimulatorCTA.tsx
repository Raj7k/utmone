import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, ArrowRight, TrendingUp, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CampaignSimulatorCTA = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="overflow-hidden border-2 border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <h3 className="text-lg font-semibold">
                don't have a link yet?
              </h3>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">simulate your first campaign</span> to predict ROI before spending a dime
              </p>
              
              {/* Mini stats preview */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">predict clicks</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="text-muted-foreground">forecast revenue</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <Button 
              size="lg"
              onClick={() => navigate('/tools/casino')}
              className="gap-2 whitespace-nowrap"
            >
              launch simulator
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
