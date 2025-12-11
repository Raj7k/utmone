import { motion, AnimatePresence } from 'framer-motion';
import { architects, ArchitectCategory } from '@/data/b2bArchitects';
import { ArchitectCard } from './ArchitectCard';

interface ArchitectsGridProps {
  filter: ArchitectCategory | 'all';
}

export function ArchitectsGrid({ filter }: ArchitectsGridProps) {
  const filteredArchitects = filter === 'all' 
    ? architects 
    : architects.filter(a => a.category === filter);

  return (
    <motion.div 
      layout
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6"
    >
      <AnimatePresence mode="popLayout">
        {filteredArchitects.map((architect, index) => (
          <motion.div
            key={architect.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ArchitectCard architect={architect} index={index} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
