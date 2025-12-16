import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calculator, Lightbulb, ArrowRight } from "lucide-react";

interface RevenueValueCalculatorProps {
  onValueCalculated: (value: number) => void;
  initialValue?: number;
}

export function RevenueValueCalculator({ onValueCalculated, initialValue }: RevenueValueCalculatorProps) {
  const [conversionRate, setConversionRate] = useState<string>("10");
  const [averageSale, setAverageSale] = useState<string>("5000");
  const [calculatedValue, setCalculatedValue] = useState<number>(0);

  useEffect(() => {
    const rate = parseFloat(conversionRate) || 0;
    const sale = parseFloat(averageSale) || 0;
    const value = Math.round((rate / 100) * sale);
    setCalculatedValue(value);
  }, [conversionRate, averageSale]);

  return (
    <Card className="p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-primary" />
        <h4 className="font-medium text-foreground">lead value calculator</h4>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="conversion-rate" className="text-sm text-muted-foreground mb-1.5 block">
            how many leads become customers?
          </Label>
          <div className="relative">
            <Input
              id="conversion-rate"
              type="number"
              value={conversionRate}
              onChange={(e) => setConversionRate(e.target.value)}
              className="pr-8"
              placeholder="10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            typical: 5-20% for B2B, 1-5% for B2C
          </p>
        </div>

        <div>
          <Label htmlFor="average-sale" className="text-sm text-muted-foreground mb-1.5 block">
            what's your average sale value?
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              id="average-sale"
              type="number"
              value={averageSale}
              onChange={(e) => setAverageSale(e.target.value)}
              className="pl-7"
              placeholder="5000"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">estimated lead value:</span>
            <span className="text-2xl font-bold text-primary">${calculatedValue.toLocaleString()}</span>
          </div>
          
          <div className="p-3 bg-background/50 rounded-lg mb-3">
            <div className="flex items-start gap-2">
              <Lightbulb className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                track each form submission as <strong className="text-foreground">${calculatedValue}</strong> to see accurate ROI
              </p>
            </div>
          </div>

          <Button 
            className="w-full"
            onClick={() => onValueCalculated(calculatedValue)}
          >
            use ${calculatedValue} as lead value
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
