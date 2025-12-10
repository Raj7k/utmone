import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ProductPainStoryProps {
  scenario: string;
  story: string;
  visual?: React.ReactNode;
}

export const ProductPainStory = ({ scenario, story, visual }: ProductPainStoryProps) => {
  return (
    <section className="py-24 md:py-32 bg-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-8 md:p-12 border border-destructive/30 shadow-lg">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">
                  the moment everything broke
                </h3>
                <p className="text-sm font-semibold text-destructive uppercase tracking-wide">
                  {scenario}
                </p>
              </div>
            </div>
            
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              {story}
            </p>

            {visual && (
              <div className="bg-zinc-900/40 rounded-lg p-4 border border-white/10">
                {visual}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
