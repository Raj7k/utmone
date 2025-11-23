import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { useReportMode } from '@/contexts/ReportModeContext';
import { toast } from 'sonner';

export const ModeToggle = () => {
  const { mode, setMode, isEmployeeMode, isEmployerMode } = useReportMode();

  // Debug logging
  useEffect(() => {
    console.log('🔄 Mode Toggle State:', {
      mode,
      isEmployeeMode,
      isEmployerMode,
      localStorage: localStorage.getItem('salary-report-mode')
    });
  }, [mode, isEmployeeMode, isEmployerMode]);

  const handleModeChange = (newMode: 'employee' | 'employer') => {
    console.log(`👆 Clicked ${newMode} button`);
    setMode(newMode);
    console.log(`✅ Set mode to ${newMode}`);
    
    toast.success(`Switched to ${newMode === 'employee' ? 'Employee' : 'Employer'} View`, {
      description: newMode === 'employee' 
        ? 'Showing tools for salary negotiation and career growth'
        : 'Showing tools for hiring, budgets, and team management'
    });
  };

  return (
    <div className="fixed top-20 right-6 z-30 hidden lg:block">
      <motion.div 
        className="bg-white/95 backdrop-blur-md rounded-full shadow-xl border-2 border-mirage/10 p-1.5 min-w-[280px]"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="relative flex">
          {/* Animated background pill */}
          <motion.div
            className={`absolute inset-y-0 rounded-full transition-all duration-300 ${
              isEmployeeMode 
                ? 'bg-gradient-to-r from-blazeOrange to-blazeOrange/80' 
                : 'bg-gradient-to-r from-deepSea to-deepSea/80'
            }`}
            animate={{
              x: isEmployeeMode ? '2px' : 'calc(50% - 2px)',
              width: 'calc(50% - 2px)',
            }}
          />
          
          {/* Employee button */}
          <button
            onClick={() => handleModeChange('employee')}
            className={`relative z-10 flex-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              isEmployeeMode
                ? 'text-white scale-105'
                : 'text-mirage/60 hover:text-mirage'
            }`}
          >
            <User className="w-4 h-4" />
            Employee
          </button>
          
          {/* Employer button */}
          <button
            onClick={() => handleModeChange('employer')}
            className={`relative z-10 flex-1 px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              !isEmployeeMode
                ? 'text-white scale-105'
                : 'text-mirage/60 hover:text-mirage'
            }`}
          >
            <Building2 className="w-4 h-4" />
            Employer
          </button>
        </div>
      </motion.div>
      
      {/* Mode indicator badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-2 text-xs text-mirage/70 font-medium"
      >
        Viewing as {isEmployeeMode ? 'Individual' : 'Organization'}
      </motion.div>
    </div>
  );
};
