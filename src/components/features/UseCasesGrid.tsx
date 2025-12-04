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
          className="rounded-xl p-6 transition-all"
          style={{ 
            background: 'rgba(24,24,27,0.4)', 
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}
        >
          <h3 className="text-lg font-display font-bold lowercase mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
            {useCase.title}
          </h3>
          <div className="space-y-3">
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: 'rgba(239,68,68,0.8)' }}>
                Problem
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{useCase.scenario}</p>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Solution
              </div>
              <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{useCase.solution}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
