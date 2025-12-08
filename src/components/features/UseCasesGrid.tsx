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
          className="obsidian-glass rounded-xl p-6 transition-all"
        >
          <h3 className="text-lg font-display font-bold lowercase mb-3 text-foreground">
            {useCase.title}
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1 text-destructive">
                Problem
              </div>
              <p className="text-sm text-muted-foreground font-sans">{useCase.scenario}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1 text-foreground/70">
                Solution
              </div>
              <p className="text-sm font-medium text-foreground font-sans">{useCase.solution}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
