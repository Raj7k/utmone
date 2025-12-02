import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Printer, DollarSign, Percent } from "lucide-react";
import { shareOnLinkedIn } from "@/lib/utils/linkedinShare";

export const QRROICalculator = () => {
  const [printVolume, setPrintVolume] = useState(5000);
  const [reprintCost, setReprintCost] = useState(2);
  const [scanRate, setScanRate] = useState(60);

  // Calculations
  const totalPrintCost = printVolume * reprintCost;
  const expectedScans = printVolume * (scanRate / 100);
  const failedQRReprints = printVolume * 0.15; // Assume 15% QR failure rate
  const reprintWaste = failedQRReprints * reprintCost;
  const yearlyWaste = reprintWaste * 4; // Quarterly campaigns

  const handleShare = () => {
    const message = `Broken QR codes are costing me ${new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD', 
      maximumFractionDigits: 0 
    }).format(yearlyWaste)}/year in reprints! utm.one guarantees every code scans. Calculate your waste: https://utm.one/products/qr-studio`;
    shareOnLinkedIn(message);
  };

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground brand-lowercase mb-4">
            how much are broken qr codes costing you?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            calculate your annual waste from qr codes that don't scan
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Inputs */}
          <Card className="p-8 space-y-8">
            {/* Monthly Print Volume */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-label">monthly print volume</label>
                <div className="flex items-center gap-2">
                  <Printer className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-primary">
                    {printVolume.toLocaleString()}
                  </span>
                </div>
              </div>
              <Slider
                value={[printVolume]}
                onValueChange={(value) => setPrintVolume(value[0])}
                min={1000}
                max={50000}
                step={1000}
                className="w-full"
              />
            </div>

            {/* Reprint Cost per Unit */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-label">cost per print</label>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-primary">${reprintCost}</span>
                </div>
              </div>
              <Slider
                value={[reprintCost]}
                onValueChange={(value) => setReprintCost(value[0])}
                min={0.5}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Expected Scan Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-label">expected scan rate</label>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-primary" />
                  <span className="text-lg font-bold text-primary">{scanRate}%</span>
                </div>
              </div>
              <Slider
                value={[scanRate]}
                onValueChange={(value) => setScanRate(value[0])}
                min={10}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </Card>

          {/* Right: Results */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-8 bg-gradient-to-br from-primary/5 via-background to-primary/5 border-primary/20 h-full flex flex-col">
              <div className="flex-1 space-y-6">
                <div className="text-center">
                  <h4 className="text-lg font-display font-semibold text-label mb-2 brand-lowercase">
                    your annual qr waste
                  </h4>
                </div>

                {/* Yearly Waste */}
                <div className="text-center p-6 bg-destructive/10 rounded-xl border border-destructive/20">
                  <div className="text-sm text-secondary-label mb-1">wasted on failed qr reprints</div>
                  <div className="text-4xl font-bold text-destructive">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0
                    }).format(yearlyWaste)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    assuming 15% qr failure rate across 4 campaigns/year
                  </p>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-label">total monthly prints</span>
                    <span className="font-semibold text-label">
                      {printVolume.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-label">failed qr codes</span>
                    <span className="font-semibold text-destructive">
                      {failedQRReprints.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-secondary-label">per campaign waste</span>
                    <span className="font-semibold text-destructive">
                      ${reprintWaste.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Button */}
              <div className="pt-6 border-t border-border space-y-3">
                <Button
                  variant="marketing"
                  className="w-full"
                  onClick={handleShare}
                >
                  share on linkedin
                </Button>
                <p className="text-xs text-center text-secondary-label">
                  show your team the cost of unreliable qr codes
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
