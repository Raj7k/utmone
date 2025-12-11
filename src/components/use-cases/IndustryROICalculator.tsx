import { motion, useInView } from "framer-motion";
import { useRef, useState, useMemo } from "react";
import { Calculator, TrendingUp, DollarSign, Target } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface CalculatorField {
  id: string;
  label: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
}

interface CalculatorOutput {
  label: string;
  calculate: (inputs: Record<string, number>) => number;
  format: (value: number) => string;
  highlight?: boolean;
}

interface IndustryROICalculatorProps {
  title: string;
  subtitle?: string;
  fields: CalculatorField[];
  outputs: CalculatorOutput[];
  industry: string;
}

export const IndustryROICalculator = ({
  title,
  subtitle,
  fields,
  outputs,
  industry,
}: IndustryROICalculatorProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [inputs, setInputs] = useState<Record<string, number>>(
    fields.reduce((acc, field) => ({ ...acc, [field.id]: field.defaultValue }), {})
  );

  const results = useMemo(() => {
    return outputs.map(output => ({
      ...output,
      value: output.calculate(inputs),
    }));
  }, [inputs, outputs]);

  const handleInputChange = (id: string, value: number) => {
    setInputs(prev => ({ ...prev, [id]: value }));
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
            {industry} ROI calculator
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
              {fields.map((field, index) => (
                <motion.div 
                  key={field.id}
                  className="space-y-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <Label htmlFor={field.id} className="text-sm text-muted-foreground lowercase">
                      {field.label}
                    </Label>
                    <div className="flex items-center gap-1 text-lg font-semibold text-foreground">
                      {field.prefix && <span>{field.prefix}</span>}
                      <Input
                        id={field.id}
                        type="number"
                        value={inputs[field.id]}
                        onChange={(e) => handleInputChange(field.id, Number(e.target.value))}
                        className="w-24 h-8 text-right font-mono"
                        min={field.min}
                        max={field.max}
                      />
                      {field.suffix && <span className="text-sm text-muted-foreground">{field.suffix}</span>}
                    </div>
                  </div>
                  <Slider
                    value={[inputs[field.id]]}
                    onValueChange={([value]) => handleInputChange(field.id, value)}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    className="w-full"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-muted/50 p-8 rounded-2xl border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6 lowercase">your potential</h3>
            <div className="space-y-6">
              {results.map((result, index) => (
                <motion.div 
                  key={index}
                  className={`p-4 rounded-xl ${result.highlight ? 'bg-primary/10 border border-primary/30' : 'bg-card border border-border'}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                >
                  <p className="text-sm text-muted-foreground mb-1 lowercase">{result.label}</p>
                  <p className={`text-2xl md:text-3xl font-bold ${result.highlight ? 'text-primary' : 'text-foreground'}`}>
                    {result.format(result.value)}
                  </p>
                </motion.div>
              ))}
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

// Pre-configured calculators for common use cases

export const InfluencerROICalculator = () => (
  <IndustryROICalculator
    title="calculate your influencer ROI"
    subtitle="see how much hidden revenue you're missing from creator campaigns"
    industry="influencer"
    fields={[
      { id: "creators", label: "number of creators", defaultValue: 10, min: 1, max: 100, step: 1 },
      { id: "avgPayment", label: "average payment per creator", defaultValue: 2000, min: 100, max: 50000, step: 100, prefix: "$" },
      { id: "avgMonthlyClicks", label: "average clicks per creator/month", defaultValue: 5000, min: 100, max: 100000, step: 100 },
    ]}
    outputs={[
      { 
        label: "total campaign spend", 
        calculate: (i) => i.creators * i.avgPayment,
        format: (v) => `$${v.toLocaleString()}`
      },
      { 
        label: "estimated hidden revenue (2.5% CVR)", 
        calculate: (i) => i.creators * i.avgMonthlyClicks * 0.025 * 85,
        format: (v) => `$${v.toLocaleString()}`
      },
      { 
        label: "true ROAS with utm.one", 
        calculate: (i) => (i.creators * i.avgMonthlyClicks * 0.025 * 85) / (i.creators * i.avgPayment),
        format: (v) => `${v.toFixed(1)}x`,
        highlight: true
      },
    ]}
  />
);

export const EcommerceROICalculator = () => (
  <IndustryROICalculator
    title="calculate your attribution gap"
    subtitle="discover how much revenue your ad platforms are hiding from you"
    industry="ecommerce"
    fields={[
      { id: "monthlyAdSpend", label: "monthly ad spend", defaultValue: 50000, min: 1000, max: 500000, step: 1000, prefix: "$" },
      { id: "reportedRoas", label: "reported ROAS", defaultValue: 2.5, min: 0.5, max: 10, step: 0.1, suffix: "x" },
      { id: "avgOrderValue", label: "average order value", defaultValue: 120, min: 10, max: 1000, step: 10, prefix: "$" },
    ]}
    outputs={[
      { 
        label: "platform-reported revenue", 
        calculate: (i) => i.monthlyAdSpend * i.reportedRoas,
        format: (v) => `$${v.toLocaleString()}`
      },
      { 
        label: "estimated true revenue (+34%)", 
        calculate: (i) => i.monthlyAdSpend * i.reportedRoas * 1.34,
        format: (v) => `$${v.toLocaleString()}`
      },
      { 
        label: "hidden revenue discovered", 
        calculate: (i) => i.monthlyAdSpend * i.reportedRoas * 0.34,
        format: (v) => `$${v.toLocaleString()}`,
        highlight: true
      },
    ]}
  />
);

export const SaaSROICalculator = () => (
  <IndustryROICalculator
    title="calculate your pipeline attribution"
    subtitle="see how much pipeline your marketing actually influences"
    industry="SaaS"
    fields={[
      { id: "monthlyLeads", label: "monthly marketing-sourced leads", defaultValue: 500, min: 50, max: 5000, step: 50 },
      { id: "leadToOpp", label: "lead to opportunity rate", defaultValue: 15, min: 1, max: 50, step: 1, suffix: "%" },
      { id: "avgDealSize", label: "average deal size", defaultValue: 25000, min: 1000, max: 500000, step: 1000, prefix: "$" },
    ]}
    outputs={[
      { 
        label: "monthly opportunities created", 
        calculate: (i) => i.monthlyLeads * (i.leadToOpp / 100),
        format: (v) => Math.round(v).toString()
      },
      { 
        label: "pipeline influenced", 
        calculate: (i) => i.monthlyLeads * (i.leadToOpp / 100) * i.avgDealSize,
        format: (v) => `$${v.toLocaleString()}`
      },
      { 
        label: "cost per qualified opportunity", 
        calculate: (i) => 15000 / (i.monthlyLeads * (i.leadToOpp / 100)),
        format: (v) => `$${Math.round(v).toLocaleString()}`,
        highlight: true
      },
    ]}
  />
);

export const AgencyROICalculator = () => (
  <IndustryROICalculator
    title="calculate your time savings"
    subtitle="see how much time you'll save with automated reporting"
    industry="agency"
    fields={[
      { id: "clients", label: "number of clients", defaultValue: 15, min: 1, max: 100, step: 1 },
      { id: "hoursPerReport", label: "hours per monthly report", defaultValue: 4, min: 0.5, max: 20, step: 0.5 },
      { id: "hourlyRate", label: "team hourly rate", defaultValue: 75, min: 25, max: 300, step: 5, prefix: "$" },
    ]}
    outputs={[
      { 
        label: "current hours spent monthly", 
        calculate: (i) => i.clients * i.hoursPerReport,
        format: (v) => `${v} hours`
      },
      { 
        label: "hours with utm.one (80% reduction)", 
        calculate: (i) => i.clients * i.hoursPerReport * 0.2,
        format: (v) => `${v.toFixed(1)} hours`
      },
      { 
        label: "monthly savings", 
        calculate: (i) => i.clients * i.hoursPerReport * 0.8 * i.hourlyRate,
        format: (v) => `$${v.toLocaleString()}`,
        highlight: true
      },
    ]}
  />
);

export const EventROICalculatorWidget = () => (
  <IndustryROICalculator
    title="calculate your event halo impact"
    subtitle="discover the invisible 90% of your event ROI"
    industry="event"
    fields={[
      { id: "badgeScans", label: "badge scans at event", defaultValue: 200, min: 10, max: 2000, step: 10 },
      { id: "avgDealValue", label: "average deal value", defaultValue: 15000, min: 1000, max: 100000, step: 1000, prefix: "$" },
      { id: "conversionRate", label: "lead to customer rate", defaultValue: 8, min: 1, max: 30, step: 1, suffix: "%" },
    ]}
    outputs={[
      { 
        label: "direct pipeline (scans only)", 
        calculate: (i) => i.badgeScans * (i.conversionRate / 100) * i.avgDealValue,
        format: (v) => `$${v.toLocaleString()}`
      },
      { 
        label: "estimated halo visitors (9x scans)", 
        calculate: (i) => i.badgeScans * 9,
        format: (v) => v.toLocaleString()
      },
      { 
        label: "total attributed pipeline", 
        calculate: (i) => (i.badgeScans * 10) * (i.conversionRate / 100) * i.avgDealValue,
        format: (v) => `$${v.toLocaleString()}`,
        highlight: true
      },
    ]}
  />
);
