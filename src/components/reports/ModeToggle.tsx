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

  const toggleMode = () => {
    const newMode = isEmployeeMode ? 'employer' : 'employee';
    console.log(`👆 Toggling to ${newMode}`);
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
        className="flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-full shadow-xl border-2 border-mirage/10 px-4 py-3"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Label for Employee */}
        <span className={`text-sm font-medium transition-colors ${isEmployeeMode ? 'text-blazeOrange' : 'text-mirage/40'}`}>
          <User className="w-4 h-4 inline mr-1" />
          Employee
        </span>
        
        {/* iOS Toggle Switch */}
        <button 
          onClick={toggleMode}
          className={`relative w-12 h-6 rounded-full transition-all ${
            isEmployeeMode ? 'bg-blazeOrange' : 'bg-deepSea'
          }`}
          aria-label={`Switch to ${isEmployeeMode ? 'employer' : 'employee'} view`}
        >
          <motion.div
            className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
            animate={{ x: isEmployeeMode ? 2 : 26 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </button>
        
        {/* Label for Employer */}
        <span className={`text-sm font-medium transition-colors ${isEmployerMode ? 'text-deepSea' : 'text-mirage/40'}`}>
          <Building2 className="w-4 h-4 inline mr-1" />
          Employer
        </span>
      </motion.div>
    </div>
  );
};
