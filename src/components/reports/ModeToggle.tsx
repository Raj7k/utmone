import { motion } from 'framer-motion';
import { User, Building2 } from 'lucide-react';
import { useReportMode } from '@/contexts/ReportModeContext';

export const ModeToggle = () => {
  const { mode, setMode, isEmployeeMode } = useReportMode();

  return (
    <div className="sticky top-[72px] z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">View as:</span>
          <div className="relative inline-flex bg-muted/20 rounded-full p-1">
            <motion.div
              className="absolute inset-y-1 bg-primary rounded-full"
              initial={false}
              animate={{
                x: isEmployeeMode ? 0 : '100%',
                width: isEmployeeMode ? '50%' : '50%',
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
            
            <button
              onClick={() => setMode('employee')}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                isEmployeeMode
                  ? 'text-primary-foreground'
                  : 'text-foreground hover:text-foreground/80'
              }`}
            >
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Employee</span>
              </span>
            </button>
            
            <button
              onClick={() => setMode('employer')}
              className={`relative z-10 px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                !isEmployeeMode
                  ? 'text-primary-foreground'
                  : 'text-foreground hover:text-foreground/80'
              }`}
            >
              <span className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span>Employer</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
