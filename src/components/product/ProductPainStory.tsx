import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ProductPainStoryProps {
  scenario: string;
  story: string;
  visual?: React.ReactNode;
}

export const ProductPainStory = ({ scenario, story, visual }: ProductPainStoryProps) => {
  return (
    <section className="py-24 md:py-32 bg-muted/20">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Card className="p-8 md:p-12 bg-gradient-to-br from-destructive/5 to-background border-destructive/20">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground brand-lowercase mb-3">
                  the moment everything broke
                </h3>
                <p className="text-sm font-semibold text-destructive uppercase tracking-wide">
                  {scenario}
                </p>
              </div>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              {story}
            </p>

            {visual && (
              <div className="bg-card rounded-lg p-4 border border-border">
                {visual}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
