import { motion } from "framer-motion";

interface UseCase {
  title: string;
  scenario: string;
  solution: string;
}

interface UseCasesGridProps {
  useCases: UseCase[];
}

export const UseCasesGrid = ({ useCases }: UseCasesGridProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {useCases.map((useCase, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="bg-card border-2 border-border hover:border-primary/30 rounded-xl p-6 transition-all"
        >
          <h3 className="text-lg font-display font-bold text-foreground lowercase mb-3">
            {useCase.title}
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-destructive uppercase tracking-wide font-semibold mb-1">
                Problem
              </div>
              <p className="text-sm text-muted-foreground">{useCase.scenario}</p>
            </div>
            <div>
              <div className="text-xs text-primary uppercase tracking-wide font-semibold mb-1">
                Solution
              </div>
              <p className="text-sm text-foreground font-medium">{useCase.solution}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
