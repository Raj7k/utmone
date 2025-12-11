import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CalculatorInput {
  id: string;
  label: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

interface CalculatorResult {
  label: string;
  value: string;
}

interface CalculatorOutput {
  results: CalculatorResult[];
  highlight?: {
    label: string;
    value: string;
  };
}

interface IndustryROICalculatorProps {
  title: string;
  subtitle?: string;
  inputs: CalculatorInput[];
  calculateROI: (inputs: Record<string, number>) => CalculatorOutput;
  industry?: string;
}

export const IndustryROICalculator = ({
  title,
  subtitle,
  inputs,
  calculateROI,
  industry = "ROI",
}: IndustryROICalculatorProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [inputValues, setInputValues] = useState<Record<string, number>>(
    inputs.reduce((acc, input) => ({ ...acc, [input.id]: input.defaultValue }), {})
  );

  const results = useMemo(() => {
    return calculateROI(inputValues);
  }, [inputValues, calculateROI]);

  const handleInputChange = (id: string, value: number) => {
    setInputValues(prev => ({ ...prev, [id]: value }));
  };

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-[980px] mx-auto px-6 md:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Calculator className="w-4 h-4" />
            {industry} calculator
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Inputs */}
          <div className="bg-card p-8 rounded-2xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6 lowercase">your numbers</h3>
            <div className="space-y-8">
              {inputs.map((input, index) => {
                const min = input.min ?? 0;
                const max = input.max ?? input.defaultValue * 10;
                const step = input.step ?? 1;
                
                return (
                  <motion.div 
                    key={input.id}
                    className="space-y-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <Label htmlFor={input.id} className="text-sm text-muted-foreground lowercase">
                        {input.label}
                      </Label>
                      <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                        {input.prefix && <span>{input.prefix}</span>}
                        <Input
                          id={input.id}
                          type="number"
                          value={inputValues[input.id]}
                          onChange={(e) => handleInputChange(input.id, Number(e.target.value))}
                          className="w-24 h-8 text-right font-mono"
                          min={min}
                          max={max}
                        />
                        {input.suffix && <span className="text-sm text-muted-foreground">{input.suffix}</span>}
                      </div>
                    </div>
                    <Slider
                      value={[inputValues[input.id]]}
                      onValueChange={([value]) => handleInputChange(input.id, value)}
                      min={min}
                      max={max}
                      step={step}
                      className="w-full"
                    />
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-muted/50 p-8 rounded-2xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6 lowercase">your potential</h3>
            <div className="space-y-6">
              {results.results.map((result, index) => (
                <motion.div 
                  key={index}
                  className="p-4 rounded-xl bg-card border border-border"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <p className="text-sm text-muted-foreground mb-1 lowercase">{result.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">
                    {result.value}
                  </p>
                </motion.div>
              ))}

              {results.highlight && (
                <motion.div 
                  className="p-4 rounded-xl bg-primary/10 border border-primary/30"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <p className="text-sm text-muted-foreground mb-1 lowercase">{results.highlight.label}</p>
                  <p className="text-2xl md:text-3xl font-bold text-primary">
                    {results.highlight.value}
                  </p>
                </motion.div>
              )}
            </div>

            <motion.p 
              className="text-xs text-muted-foreground mt-6 text-center"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.4, delay: 1 }}
            >
              based on industry averages. your results may vary.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
