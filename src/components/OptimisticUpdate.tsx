import { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimisticUpdateProps {
  isLoading: boolean;
  children: ReactNode;
  loadingContent?: ReactNode;
}

export const OptimisticUpdate = ({ isLoading, children, loadingContent }: OptimisticUpdateProps) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {loadingContent || children}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
