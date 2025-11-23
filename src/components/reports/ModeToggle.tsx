import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { useReportMode } from '@/contexts/ReportModeContext';

export const ModeToggle = () => {
  const { mode, setMode, isEmployeeMode } = useReportMode();

  return (
    <motion.div 
      className="fixed top-20 right-6 z-30 bg-white/95 backdrop-blur-md rounded-full shadow-lg border-2 border-deepSea/20 p-1"
      initial={{ opacity: 0, scale: 0.95, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="relative flex">
        {/* Animated background pill */}
        <motion.div
          className="absolute inset-y-0 bg-gradient-to-r from-blazeOrange to-deepSea rounded-full"
          animate={{
            x: isEmployeeMode ? 0 : '50%',
            width: '50%',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
        
        {/* Employee button */}
        <button
          onClick={() => setMode('employee')}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            isEmployeeMode
              ? 'text-white'
              : 'text-mirage hover:text-mirage/80'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="hidden md:inline">Employee</span>
        </button>
        
        {/* Employer button */}
        <button
          onClick={() => setMode('employer')}
          className={`relative z-10 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
            !isEmployeeMode
              ? 'text-white'
              : 'text-mirage hover:text-mirage/80'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span className="hidden md:inline">Employer</span>
        </button>
      </div>
    </motion.div>
  );
};
