import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ReportMode = 'employee' | 'employer';

interface ReportModeContextType {
  mode: ReportMode;
  setMode: (mode: ReportMode) => void;
  isEmployeeMode: boolean;
  isEmployerMode: boolean;
}

const ReportModeContext = createContext<ReportModeContextType | undefined>(undefined);

export function ReportModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ReportMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('salary-report-mode');
      return (saved as ReportMode) || 'employee';
    }
    return 'employee';
  });

  const setMode = (newMode: ReportMode) => {
    setModeState(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('salary-report-mode', newMode);
      
      // Track mode switch for analytics
      if (typeof (window as any).gtag === 'function') {
        (window as any).gtag('event', 'mode_switch', {
          event_category: 'report_interaction',
          event_label: newMode,
          value: newMode === 'employer' ? 1 : 0
        });
      }
    }
  };

  return (
    <ReportModeContext.Provider
      value={{
        mode,
        setMode,
        isEmployeeMode: mode === 'employee',
        isEmployerMode: mode === 'employer',
      }}
    >
      {children}
    </ReportModeContext.Provider>
  );
}

export function useReportMode() {
  const context = useContext(ReportModeContext);
  if (context === undefined) {
    throw new Error('useReportMode must be used within a ReportModeProvider');
  }
  return context;
}
