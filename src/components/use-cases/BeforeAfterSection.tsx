import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X } from "lucide-react";

interface BeforeAfterSectionProps {
  title: string;
  subtitle?: string;
  beforeTitle?: string;
  afterTitle?: string;
  beforeItems: string[];
  afterItems: string[];
  beforeColor?: string;
  afterColor?: string;
}

export const BeforeAfterSection = ({
  title,
  subtitle,
  beforeTitle = "without utm.one",
  afterTitle = "with utm.one",
  beforeItems,
  afterItems,
  beforeColor = "border-destructive/30 bg-destructive/5",
  afterColor = "border-primary/30 bg-primary/5",
}: BeforeAfterSectionProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-muted/30">
      <div className="max-w-[980px] mx-auto px-6 md:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Before Card */}
          <motion.div 
            className={`p-8 rounded-2xl border-2 ${beforeColor} relative overflow-hidden`}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-destructive/20 flex items-center justify-center">
                <X className="w-4 h-4 text-destructive" />
              </div>
              <h3 className="font-semibold text-foreground lowercase">{beforeTitle}</h3>
            </div>
            
            <ul className="space-y-4">
              {beforeItems.map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3 text-muted-foreground"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <span className="text-destructive/60 mt-1">•</span>
                  <span className="text-sm leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* After Card */}
          <motion.div 
            className={`p-8 rounded-2xl border-2 ${afterColor} relative overflow-hidden`}
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground lowercase">{afterTitle}</h3>
            </div>
            
            <ul className="space-y-4">
              {afterItems.map((item, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start gap-3 text-foreground"
                  initial={{ opacity: 0, x: 10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                >
                  <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
